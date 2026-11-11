<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('GET, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$user = requireLogin(array('members'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Cpd.php';

// The logged-in member's CPD progress for the current cycle and all of their CPD records

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

try {
    $stmt = $db->prepare(
        "SELECT id, title, provider, activity_date, units, source, status, review_note, submitted_at,
                certificate_path IS NOT NULL AS has_certificate
         FROM cpd_records WHERE member_id = :id
         ORDER BY activity_date DESC, id DESC"
    );
    $stmt->execute(array(':id' => $user['id']));
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $summary = cpdSummary($db, $user['id']);
    foreach ($records as &$record) {
        $record['units'] = (float)$record['units'];
        $record['has_certificate'] = (bool)$record['has_certificate'];
        $record['in_cycle'] = $summary['cycle'] !== null
            && $record['activity_date'] >= $summary['cycle']['start']
            && $record['activity_date'] <= $summary['cycle']['end'];
    }
    unset($record);

    echo json_encode(array("status" => "success", "summary" => $summary, "records" => $records));
} catch (Exception $e) {
    error_log('get_cpd failed: ' . $e->getMessage());
    jsonError(500, "Unable to load CPD records.");
}
