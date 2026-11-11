<?php
// Request helpers shared by the endpoints (CPD, logbook, ...).

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

// Required text field trimmed to $max characters, or null if empty
function requiredText($value, $max = 255) {
    $text = trim((string)$value);
    return $text === '' ? null : mb_substr($text, 0, $max);
}
