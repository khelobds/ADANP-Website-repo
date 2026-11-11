<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('GET, POST, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$user = requireLogin(array('members'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Cpd.php';

// The logged-in member's PRC license.
//   GET                                            -> { license: { license_number, expiry_date } }
//   POST { license_number, expiry_date (YYYY-MM-DD or empty) }  -> saves it
// The expiry date sets the member's CPD cycle.

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $number = trim((string)($data->license_number ?? ''));
    $expiryInput = trim((string)($data->expiry_date ?? ''));
    $expiry = $expiryInput === '' ? null : validDate($expiryInput);

    if (mb_strlen($number) > 100) jsonError(400, "The license number is too long.");
    if ($expiryInput !== '' && !$expiry) jsonError(400, "Enter a valid expiration date.");

    $stmt = $db->prepare(
        "INSERT INTO member_licenses (member_id, license_number, expiry_date) VALUES (:id, :number, :expiry)
         ON DUPLICATE KEY UPDATE license_number = VALUES(license_number), expiry_date = VALUES(expiry_date)"
    );
    $stmt->execute(array(':id' => $user['id'], ':number' => $number === '' ? null : $number, ':expiry' => $expiry));
}

echo json_encode(array("status" => "success", "license" => memberLicense($db, $user['id'])));
