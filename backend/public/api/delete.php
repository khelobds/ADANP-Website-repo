<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('POST, DELETE, OPTIONS');

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

// Get JSON input for DELETE method
$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id) || empty($data->id)) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "File ID is required."));
    exit();
}

$id = (int)$data->id;

// Get file info before deleting
$query = "SELECT file_path FROM gallery WHERE id = :id LIMIT 1";
$stmt = $db->prepare($query);
$stmt->bindParam(':id', $id);
$stmt->execute();

if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(array("status" => "error", "message" => "File not found."));
    exit();
}

$row = $stmt->fetch(PDO::FETCH_ASSOC);
$filePath = __DIR__ . '/' . $row['file_path'];

// Delete from database
$deleteQuery = "DELETE FROM gallery WHERE id = :id";
$deleteStmt = $db->prepare($deleteQuery);
$deleteStmt->bindParam(':id', $id);

if ($deleteStmt->execute()) {
    // Delete file from disk
    if (file_exists($filePath)) {
        unlink($filePath);
    }
    
    http_response_code(200);
    echo json_encode(array("status" => "success", "message" => "File deleted successfully."));
} else {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Failed to delete file from database."));
}
?>
