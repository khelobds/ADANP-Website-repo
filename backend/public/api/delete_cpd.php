<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('POST, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$user = requireLogin(array('members'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Cpd.php';
require_once __DIR__ . '/../../config/PrivateFiles.php';

// A member withdraws one of their own submissions while it is still Pending. JSON body: { id }

$data = json_decode(file_get_contents("php://input"));
$id = isset($data->id) ? filter_var($data->id, FILTER_VALIDATE_INT) : false;
if (!$id) jsonError(400, "Record ID is required.");

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

$stmt = $db->prepare("SELECT certificate_path, status FROM cpd_records WHERE id = :id AND member_id = :member");
$stmt->execute(array(':id' => $id, ':member' => $user['id']));
$record = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$record) jsonError(404, "Record not found.");
if ($record['status'] !== 'Pending') jsonError(400, "Only submissions waiting for review can be deleted.");

$db->prepare("DELETE FROM cpd_records WHERE id = :id")->execute(array(':id' => $id));
deletePrivateFile($record['certificate_path']);

echo json_encode(array("status" => "success", "message" => "Submission deleted."));
