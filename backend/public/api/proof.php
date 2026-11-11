<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('GET, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
requireLogin(array('admin_user'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Proofs.php';

// Streams the proof-of-payment file of one application: GET proof.php?id=<application id>

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Application ID is required."));
    exit();
}

$db = (new Database())->getConnection();
if (!$db) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Database connection failed."));
    exit();
}

$stmt = $db->prepare("SELECT proof_of_payment_path FROM non_member_applications WHERE id = :id LIMIT 1");
$stmt->bindParam(':id', $id, PDO::PARAM_INT);
$stmt->execute();
$row = $stmt->fetch(PDO::FETCH_ASSOC);

$file = $row ? proofFilePath($row['proof_of_payment_path']) : null;
if (!$file || !is_file($file)) {
    http_response_code(404);
    echo json_encode(array("status" => "error", "message" => "Proof of payment not found."));
    exit();
}

// Type comes from the file contents and must be one we accept for proofs
$type = (new finfo(FILEINFO_MIME_TYPE))->file($file);
if (!isset(PROOF_TYPES[$type])) {
    http_response_code(404);
    echo json_encode(array("status" => "error", "message" => "Proof of payment not found."));
    exit();
}

header('Content-Type: ' . $type);
header('Content-Length: ' . filesize($file));
header('Content-Disposition: inline; filename="proof-' . $id . '.' . PROOF_TYPES[$type] . '"');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, no-store');
readfile($file);
