<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/Database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Database connection failed."));
    exit();
}

if (!isset($_POST['non_member_id']) || !isset($_POST['full_name']) || !isset($_POST['license_number'])) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Incomplete data."));
    exit();
}

try {
    $non_member_id = $_POST['non_member_id'];
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

    $proof_of_payment_path = "";

    // Handle file upload
    if (isset($_FILES['proof_of_payment']) && $_FILES['proof_of_payment']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileTmpPath = $_FILES['proof_of_payment']['tmp_name'];
        $fileName = $_FILES['proof_of_payment']['name'];
        $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        $allowedExtensions = array('jpg', 'jpeg', 'png', 'gif', 'pdf');

        if (in_array($fileExtension, $allowedExtensions)) {
            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
            $destPath = $uploadDir . $newFileName;

            if (move_uploaded_file($fileTmpPath, $destPath)) {
                $proof_of_payment_path = 'uploads/' . $newFileName;
            } else {
                http_response_code(500);
                echo json_encode(array("status" => "error", "message" => "Error moving the uploaded file."));
                exit();
            }
        } else {
            http_response_code(400);
            echo json_encode(array("status" => "error", "message" => "Upload failed. Allowed file types: jpg, jpeg, png, gif, pdf."));
            exit();
        }
    } else {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "No valid payment proof file uploaded."));
        exit();
    }

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
