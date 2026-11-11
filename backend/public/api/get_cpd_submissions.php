<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('GET, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
requireLogin(array('admin_user'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Cpd.php';

// Member CPD submissions for admins: GET get_cpd_submissions.php?status=Pending|Approved|Rejected
// (default Pending). ADANP seminar credits are not listed; they never need review.

$status = $_GET['status'] ?? 'Pending';
if (!in_array($status, array('Pending', 'Approved', 'Rejected'), true)) jsonError(400, "Unknown status.");

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

try {
    $stmt = $db->prepare(
        "SELECT r.id, r.title, r.provider, r.activity_date, r.units, r.status, r.review_note, r.submitted_at, r.reviewed_at,
                r.certificate_path IS NOT NULL AS has_certificate, m.id AS member_id, m.full_name, m.email
         FROM cpd_records r JOIN members m ON m.id = r.member_id
         WHERE r.source = 'external' AND r.status = :status
         ORDER BY r.submitted_at " . ($status === 'Pending' ? 'ASC' : 'DESC') . "
         LIMIT 200"
    );
    $stmt->execute(array(':status' => $status));
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($records as &$record) {
        $record['units'] = (float)$record['units'];
        $record['has_certificate'] = (bool)$record['has_certificate'];
    }
    unset($record);

    echo json_encode(array("status" => "success", "records" => $records));
} catch (Exception $e) {
    error_log('get_cpd_submissions failed: ' . $e->getMessage());
    jsonError(500, "Unable to load CPD submissions.");
}
