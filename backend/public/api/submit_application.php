<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('POST, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$user = requireLogin(array('non_members'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/PrivateFiles.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Database connection failed."));
    exit();
}

if (!isset($_POST['full_name']) || !isset($_POST['license_number'])) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Incomplete data."));
    exit();
}

try {
    // Always the logged-in user, so nobody can submit an application for someone else
    $non_member_id = $user['id'];
    $full_name = $_POST['full_name'];
    $license_number = $_POST['license_number'];
    $age = $_POST['age'];
    $address = $_POST['address'];

    // Check if user already submitted an application
    $checkQuery = "SELECT id FROM non_member_applications WHERE non_member_id = :id LIMIT 1";
    $stmt = $db->prepare($checkQuery);
    $stmt->bindParam(':id', $non_member_id);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "An application has already been submitted for this user."));
        exit();
    }

    // Saved outside the web root: admins view proofs through api/proof.php only
    $upload = savePrivateUpload($_FILES['proof_of_payment'] ?? null, 'proofs');
    if (isset($upload['error'])) {
        http_response_code($upload['status']);
        echo json_encode(array("status" => "error", "message" => $upload['error']));
        exit();
    }
    $proof_of_payment_path = $upload['path'];

    $query = "INSERT INTO non_member_applications (non_member_id, full_name, age, license_number, address, proof_of_payment_path, status) 
              VALUES (:user_id, :name, :age, :license, :address, :proof_path, 'Pending')";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $non_member_id);
    $stmt->bindParam(":name", $full_name);
    $stmt->bindParam(":age", $age);
    $stmt->bindParam(":license", $license_number);
    $stmt->bindParam(":address", $address);
    $stmt->bindParam(":proof_path", $proof_of_payment_path);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("status" => "success", "message" => "Application submitted successfully."));
    } else {
        http_response_code(503);
        echo json_encode(array("status" => "error", "message" => "Unable to submit application."));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?>
