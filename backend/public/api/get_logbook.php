<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('GET, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$user = requireLogin(array('members'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Logbook.php';

// The logged-in member's logbook entries, their totals, and the procedure and outcome choices for the form

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

try {
    $stmt = $db->prepare(
        "SELECT id, procedure_date, procedure_type, treatment_area, patient_code, duration_minutes, outcome,
                status, review_note, submitted_at
         FROM logbook_entries WHERE member_id = :id
         ORDER BY procedure_date DESC, id DESC"
    );
    $stmt->execute(array(':id' => $user['id']));
    $entries = array_map('logbookEntry', $stmt->fetchAll(PDO::FETCH_ASSOC));

    $thisMonth = date('Y-m');
    $totals = array('total' => 0, 'verified' => 0, 'pending' => 0, 'rejected' => 0, 'this_month' => 0, 'verified_minutes' => 0);
    $byProcedure = array();
    foreach ($entries as $entry) {
        $totals['total']++;
        $totals[strtolower($entry['status'])]++;
        if ($entry['status'] === 'Rejected') continue;

        if (substr($entry['procedure_date'], 0, 7) === $thisMonth) $totals['this_month']++;
        if ($entry['status'] === 'Verified') $totals['verified_minutes'] += (int)$entry['duration_minutes'];
        $byProcedure[$entry['procedure_type']] = ($byProcedure[$entry['procedure_type']] ?? 0) + 1;
    }

    // Rejected entries are left out of this_month and by_procedure
    $counts = array();
    foreach ($byProcedure as $procedure => $count) $counts[] = array('procedure' => $procedure, 'count' => $count);
    usort($counts, function ($a, $b) { return $b['count'] - $a['count']; });

    echo json_encode(array(
        "status" => "success",
        "entries" => $entries,
        "totals" => $totals,
        "by_procedure" => $counts,
        "procedures" => LOGBOOK_PROCEDURES,
        "outcomes" => LOGBOOK_OUTCOMES,
    ));
} catch (Exception $e) {
    error_log('get_logbook failed: ' . $e->getMessage());
    jsonError(500, "Unable to load the logbook.");
}
