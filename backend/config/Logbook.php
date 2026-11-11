<?php
// Electronic logbook rules shared by the logbook endpoints.
// A member records procedures they performed. Entries start Pending and an admin marks them
// Verified or Rejected. The logbook is a plain record: it does not count toward CPD.
// No patient details are stored: only a code the member makes up (e.g. P-0042), and no free-text notes.

require_once __DIR__ . '/Validation.php';

// Edit these lists to change the choices on the logbook page (the page loads them from get_logbook.php).
// Renaming an item does not change existing entries, which keep the old name.
const LOGBOOK_PROCEDURES = array(
    'Botulinum toxin injection',
    'Dermal filler',
    'Chemical peel',
    'Laser treatment',
    'IPL / light therapy',
    'Microneedling',
    'Skin booster / mesotherapy',
    'PRP',
    'Thread lift',
    'Sclerotherapy',
    'Facial treatment',
);
const LOGBOOK_OUTCOMES = array('As expected', 'Minor reaction', 'Complication');
const LOGBOOK_STATUSES = array('Pending', 'Verified', 'Rejected');
const LOGBOOK_MAX_DURATION_MINUTES = 1440;
const LOGBOOK_MAX_AREA_LENGTH = 100;

// Patient code in upper case: 1-20 letters, digits or dashes with at least one digit
// (so a plain name like "Maria" is refused), or null
function validPatientCode($value) {
    $code = strtoupper(trim((string)$value));
    return preg_match('/^(?=.*\d)[A-Z0-9-]{1,20}$/', $code) ? $code : null;
}

// Optional duration: null when left empty, false when invalid, otherwise whole minutes (1 to the maximum)
function validDuration($value) {
    if ($value === null || trim((string)$value) === '') return null;
    $minutes = filter_var($value, FILTER_VALIDATE_INT, array('options' => array('min_range' => 1, 'max_range' => LOGBOOK_MAX_DURATION_MINUTES)));
    return $minutes === false ? false : $minutes;
}

// Optional text: null when empty, otherwise trimmed to $max characters
function optionalText($value, $max) {
    $text = trim((string)$value);
    return $text === '' ? null : mb_substr($text, 0, $max);
}

// Casts a logbook_entries row from PDO strings to the JSON types the page expects
function logbookEntry(array $row) {
    $row['id'] = (int)$row['id'];
    $row['duration_minutes'] = $row['duration_minutes'] === null ? null : (int)$row['duration_minutes'];
    if (isset($row['member_id'])) $row['member_id'] = (int)$row['member_id'];
    return $row;
}
