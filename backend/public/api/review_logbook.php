<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('POST, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$admin = requireLogin(array('admin_user'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Logbook.php';

// An admin verifies or rejects a Pending logbook entry.
// JSON body: { id, action: 'Verify' | 'Reject', note } (note is required when rejecting)

$data = json_decode(file_get_contents("php://input"));
$id = isset($data->id) ? filter_var($data->id, FILTER_VALIDATE_INT) : false;
$action = $data->action ?? '';
$note = trim((string)($data->note ?? ''));

if (!$id) jsonError(400, "Entry ID is required.");
if ($action !== 'Verify' && $action !== 'Reject') jsonError(400, "Action must be Verify or Reject.");
if ($action === 'Reject' && $note === '') jsonError(400, "Give a reason for rejecting.");

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

// Only a Pending entry changes, so an entry can't be reviewed twice
$stmt = $db->prepare(
    "UPDATE logbook_entries SET status = :status, review_note = :note, reviewed_by = :admin, reviewed_at = NOW()
     WHERE id = :id AND status = 'Pending'"
);
$stmt->execute(array(
    ':status' => $action === 'Verify' ? 'Verified' : 'Rejected',
    ':note' => $note === '' ? null : mb_substr($note, 0, 1000),
    ':admin' => $admin['id'],
    ':id' => $id,
));

if ($stmt->rowCount() === 0) jsonError(409, "This entry was not found or has already been reviewed.");

echo json_encode(array("status" => "success", "message" => $action === 'Verify' ? "Entry verified." : "Entry rejected."));
