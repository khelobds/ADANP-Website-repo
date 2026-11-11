<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('POST, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$user = requireLogin(array('members'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Cpd.php';
require_once __DIR__ . '/../../config/PrivateFiles.php';

// A member submits an external training for review (multipart form):
// title, provider, activity_date (YYYY-MM-DD), units, certificate (PDF/JPG/PNG/GIF, max 5 MB)

$title = requiredText($_POST['title'] ?? '');
$provider = requiredText($_POST['provider'] ?? '');
$activityDate = validDate($_POST['activity_date'] ?? '');
$units = validUnits($_POST['units'] ?? '');

if (!$title || !$provider) jsonError(400, "Title and provider are required.");
if (!$activityDate) jsonError(400, "Enter a valid activity date.");
if ($activityDate > date('Y-m-d')) jsonError(400, "The activity date cannot be in the future.");
if ($units === null) jsonError(400, "Units must be more than 0 and at most " . CPD_MAX_UNITS_PER_RECORD . ", with up to 2 decimals.");

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

$upload = savePrivateUpload($_FILES['certificate'] ?? null, 'cpd');
if (isset($upload['error'])) jsonError($upload['status'], $upload['error']);

try {
    $stmt = $db->prepare(
        "INSERT INTO cpd_records (member_id, title, provider, activity_date, units, certificate_path, source, status)
         VALUES (:member, :title, :provider, :date, :units, :path, 'external', 'Pending')"
    );
    $stmt->execute(array(
        ':member' => $user['id'], ':title' => $title, ':provider' => $provider,
        ':date' => $activityDate, ':units' => $units, ':path' => $upload['path'],
    ));

    http_response_code(201);
    echo json_encode(array("status" => "success", "message" => "Submitted for review.", "id" => (int)$db->lastInsertId()));
} catch (Exception $e) {
    deletePrivateFile($upload['path']);
    error_log('submit_cpd failed: ' . $e->getMessage());
    jsonError(500, "Unable to submit the CPD record.");
}
