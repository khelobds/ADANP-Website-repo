<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('GET, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
requireLogin(array('admin_user'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Logbook.php';

// Member logbook entries for admins: GET get_logbook_submissions.php?status=Pending|Verified|Rejected (default Pending)

$status = $_GET['status'] ?? 'Pending';
if (!in_array($status, LOGBOOK_STATUSES, true)) jsonError(400, "Unknown status.");

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

try {
    $stmt = $db->prepare(
        "SELECT e.id, e.procedure_date, e.procedure_type, e.treatment_area, e.patient_code, e.duration_minutes, e.outcome,
                e.status, e.review_note, e.submitted_at, e.reviewed_at, m.id AS member_id, m.full_name, m.email
         FROM logbook_entries e JOIN members m ON m.id = e.member_id
         WHERE e.status = :status
         ORDER BY e.submitted_at " . ($status === 'Pending' ? 'ASC' : 'DESC') . ", e.id
         LIMIT 200"
    );
    $stmt->execute(array(':status' => $status));
    $entries = array_map('logbookEntry', $stmt->fetchAll(PDO::FETCH_ASSOC));

    echo json_encode(array("status" => "success", "entries" => $entries));
} catch (Exception $e) {
    error_log('get_logbook_submissions failed: ' . $e->getMessage());
    jsonError(500, "Unable to load logbook entries.");
}
