<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('GET, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
requireLogin(array('admin_user'));

require_once __DIR__ . '/../../config/Database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Database connection failed."));
    exit();
}

try {
    $query = "SELECT id, non_member_id, full_name, age, license_number, address, proof_of_payment_path, status, submitted_at FROM non_member_applications ORDER BY submitted_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $applications = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($applications, $row);
    }

    echo json_encode(array("status" => "success", "data" => $applications));

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?>
