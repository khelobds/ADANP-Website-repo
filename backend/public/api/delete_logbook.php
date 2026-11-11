<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('POST, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$user = requireLogin(array('members'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Logbook.php';

// A member deletes one of their own entries while it is Pending or Rejected (Verified entries are locked).
// JSON body: { id }

$data = json_decode(file_get_contents("php://input"));
$id = isset($data->id) ? filter_var($data->id, FILTER_VALIDATE_INT) : false;
if (!$id) jsonError(400, "Entry ID is required.");

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

$stmt = $db->prepare("SELECT status FROM logbook_entries WHERE id = :id AND member_id = :member");
$stmt->execute(array(':id' => $id, ':member' => $user['id']));
$status = $stmt->fetchColumn();

if ($status === false) jsonError(404, "Entry not found.");
if ($status === 'Verified') jsonError(400, "Verified entries cannot be deleted.");

// The status check is repeated so an entry verified in the meantime is not deleted
$stmt = $db->prepare("DELETE FROM logbook_entries WHERE id = :id AND member_id = :member AND status <> 'Verified'");
$stmt->execute(array(':id' => $id, ':member' => $user['id']));
if ($stmt->rowCount() === 0) jsonError(409, "This entry was just verified and can no longer be deleted.");

echo json_encode(array("status" => "success", "message" => "Entry deleted."));
