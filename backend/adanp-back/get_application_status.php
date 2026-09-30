<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

$non_member_id = isset($_GET['user_id']) ? $_GET['user_id'] : die(json_encode(array("status" => "error", "message" => "Missing user ID")));

try {
    $query = "SELECT status FROM non_member_applications WHERE non_member_id = :id ORDER BY submitted_at DESC LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $non_member_id);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(array(
            "status" => "success",
            "application_status" => $row['status'] // Pending, Approved, Rejected
        ));
    } else {
        echo json_encode(array(
            "status" => "success",
            "application_status" => "Not Submitted"
        ));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?>
