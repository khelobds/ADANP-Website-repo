<?php
// CPD rules shared by the CPD endpoints.
// A member's cycle is the CPD_CYCLE_YEARS before their PRC license expiry date (both ends included).
// Only Approved records with an activity date inside the cycle count toward CPD_REQUIRED_UNITS.

const CPD_REQUIRED_UNITS = 45;
const CPD_CYCLE_YEARS = 3;
const CPD_MAX_UNITS_PER_RECORD = 50;

function jsonError($status, $message) {
    http_response_code($status);
    echo json_encode(array("status" => "error", "message" => $message));
    exit();
}

// 'YYYY-MM-DD' that is a real calendar date, or null
function validDate($value) {
    $date = DateTime::createFromFormat('!Y-m-d', (string)$value);
    return ($date && $date->format('Y-m-d') === $value) ? $value : null;
}

// Positive number of units with at most 2 decimals, up to CPD_MAX_UNITS_PER_RECORD, or null
function validUnits($value) {
    if (!is_numeric($value) || !preg_match('/^\d+(\.\d{1,2})?$/', trim((string)$value))) return null;
    $units = (float)$value;
    return ($units > 0 && $units <= CPD_MAX_UNITS_PER_RECORD) ? $units : null;
}

// Required text field trimmed to $max characters, or null if empty
function requiredText($value, $max = 255) {
    $text = trim((string)$value);
    return $text === '' ? null : mb_substr($text, 0, $max);
}

// array('start' => 'Y-m-d', 'end' => 'Y-m-d') for a license expiry date, or null without one
function cpdCycle($expiryDate) {
    if (!$expiryDate) return null;
    $end = new DateTime($expiryDate);
    $start = (clone $end)->modify('-' . CPD_CYCLE_YEARS . ' years');
    return array('start' => $start->format('Y-m-d'), 'end' => $end->format('Y-m-d'));
}

function memberLicense(PDO $db, $memberId) {
    $stmt = $db->prepare("SELECT license_number, expiry_date FROM member_licenses WHERE member_id = :id");
    $stmt->execute(array(':id' => $memberId));
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ?: array('license_number' => null, 'expiry_date' => null);
}

// Progress toward the requirement for the member's current cycle
function cpdSummary(PDO $db, $memberId) {
    $license = memberLicense($db, $memberId);
    $cycle = cpdCycle($license['expiry_date']);
    $approved = 0.0;
    $pending = 0.0;

    if ($cycle) {
        $stmt = $db->prepare(
            "SELECT status, COALESCE(SUM(units), 0) AS units FROM cpd_records
             WHERE member_id = :id AND activity_date BETWEEN :start AND :end AND status IN ('Approved', 'Pending')
             GROUP BY status"
        );
        $stmt->execute(array(':id' => $memberId, ':start' => $cycle['start'], ':end' => $cycle['end']));
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            if ($row['status'] === 'Approved') $approved = (float)$row['units'];
            else $pending = (float)$row['units'];
        }
    }

    return array(
        'license' => $license,
        'cycle' => $cycle,
        'license_expired' => $cycle !== null && $cycle['end'] < date('Y-m-d'),
        'required_units' => CPD_REQUIRED_UNITS,
        'approved_units' => $approved,
        'pending_units' => $pending,
        'remaining_units' => max(0, CPD_REQUIRED_UNITS - $approved),
        'compliant' => $approved >= CPD_REQUIRED_UNITS,
    );
}
