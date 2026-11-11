<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('POST, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$admin = requireLogin(array('admin_user'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Cpd.php';

// An admin records an ADANP-run seminar and credits its attendees with Approved CPD records.
// JSON body: { title, event_date (YYYY-MM-DD), units, member_ids: [ ... ] }

$data = json_decode(file_get_contents("php://input"));
$title = requiredText($data->title ?? '');
$eventDate = validDate($data->event_date ?? '');
$units = validUnits($data->units ?? '');
$memberIds = array_values(array_unique(array_filter(
    array_map('intval', is_array($data->member_ids ?? null) ? $data->member_ids : array()),
    function ($id) { return $id > 0; }
)));

if (!$title) jsonError(400, "Title is required.");
if (!$eventDate) jsonError(400, "Enter a valid seminar date.");
if ($eventDate > date('Y-m-d')) jsonError(400, "Credit a seminar after it has taken place.");
if ($units === null) jsonError(400, "Units must be more than 0 and at most " . CPD_MAX_UNITS_PER_RECORD . ", with up to 2 decimals.");
if (empty($memberIds)) jsonError(400, "Select at least one attendee.");

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

// Every selected ID must be a real member
$placeholders = implode(',', array_fill(0, count($memberIds), '?'));
$check = $db->prepare("SELECT COUNT(*) FROM members WHERE id IN ($placeholders)");
$check->execute($memberIds);
if ((int)$check->fetchColumn() !== count($memberIds)) jsonError(400, "One or more selected members do not exist.");

try {
    $db->beginTransaction();

    $event = $db->prepare("INSERT INTO cpd_events (title, event_date, units, created_by) VALUES (:title, :date, :units, :admin)");
    $event->execute(array(':title' => $title, ':date' => $eventDate, ':units' => $units, ':admin' => $admin['id']));
    $eventId = (int)$db->lastInsertId();

    $record = $db->prepare(
        "INSERT INTO cpd_records (member_id, event_id, title, provider, activity_date, units, source, status, reviewed_by, reviewed_at)
         VALUES (:member, :event, :title, 'ADANP', :date, :units, 'adanp', 'Approved', :admin, NOW())"
    );
    foreach ($memberIds as $memberId) {
        $record->execute(array(
            ':member' => $memberId, ':event' => $eventId, ':title' => $title,
            ':date' => $eventDate, ':units' => $units, ':admin' => $admin['id'],
        ));
    }

    $db->commit();
    http_response_code(201);
    echo json_encode(array(
        "status" => "success",
        "message" => "Seminar recorded and " . count($memberIds) . " member(s) credited.",
        "event_id" => $eventId,
    ));
} catch (Exception $e) {
    $db->rollBack();
    error_log('create_cpd_event failed: ' . $e->getMessage());
    jsonError(500, "Unable to record the seminar.");
}
