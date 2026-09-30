<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

// Get optional type filter
$type = isset($_GET['type']) ? $_GET['type'] : null;

// Build query
if ($type && in_array($type, ['image', 'video'])) {
    $query = "SELECT id, file_name, file_path, file_type, file_size, created_at FROM gallery WHERE file_type = :type ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':type', $type);
} else {
    $query = "SELECT id, file_name, file_path, file_type, file_size, created_at FROM gallery ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
}

try {
    $stmt->execute();
    $gallery = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    http_response_code(200);
    echo json_encode(array(
        "status" => "success",
        "count" => count($gallery),
        "data" => $gallery
    ));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Failed to fetch gallery: " . $e->getMessage()));
}
?>
