<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('POST, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$user = requireLogin(array('members'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Logbook.php';

// A member adds a logbook entry; it waits as Pending until an admin verifies it.
// JSON body: { procedure_date, procedure_type, treatment_area?, patient_code, duration_minutes?, outcome }

$data = json_decode(file_get_contents("php://input"));
if (!is_object($data)) jsonError(400, "Send the entry as JSON.");

$procedureDate = validDate($data->procedure_date ?? '');
$procedureType = $data->procedure_type ?? '';
$outcome = $data->outcome ?? '';
$patientCode = validPatientCode($data->patient_code ?? '');
$duration = validDuration($data->duration_minutes ?? null);
$area = optionalText($data->treatment_area ?? '', LOGBOOK_MAX_AREA_LENGTH);

if (!$procedureDate) jsonError(400, "Enter a valid procedure date.");
if ($procedureDate > date('Y-m-d')) jsonError(400, "The procedure date cannot be in the future.");
if (!in_array($procedureType, LOGBOOK_PROCEDURES, true)) jsonError(400, "Choose a procedure from the list.");
if (!$patientCode) jsonError(400, "The patient code may only use letters, digits and dashes (up to 20) and must include a digit, e.g. P-0042. Do not enter patient names.");
if ($duration === false) jsonError(400, "Duration must be a whole number of minutes from 1 to " . LOGBOOK_MAX_DURATION_MINUTES . ".");
if (!in_array($outcome, LOGBOOK_OUTCOMES, true)) jsonError(400, "Choose an outcome from the list.");

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

try {
    $stmt = $db->prepare(
        "INSERT INTO logbook_entries (member_id, procedure_date, procedure_type, treatment_area, patient_code, duration_minutes, outcome)
         VALUES (:member, :date, :type, :area, :code, :duration, :outcome)"
    );
    $stmt->execute(array(
        ':member' => $user['id'],
        ':date' => $procedureDate,
        ':type' => $procedureType,
        ':area' => $area,
        ':code' => $patientCode,
        ':duration' => $duration,
        ':outcome' => $outcome,
    ));

    http_response_code(201);
    echo json_encode(array("status" => "success", "message" => "Entry added. It will show as verified once an admin signs it off.", "id" => (int)$db->lastInsertId()));
} catch (Exception $e) {
    error_log('submit_logbook failed: ' . $e->getMessage());
    jsonError(500, "Unable to save the entry.");
}
