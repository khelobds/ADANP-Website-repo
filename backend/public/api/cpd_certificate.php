<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('GET, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$user = requireLogin(array('members', 'admin_user'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Cpd.php';
require_once __DIR__ . '/../../config/PrivateFiles.php';

// Streams the certificate of one CPD record: GET cpd_certificate.php?id=<record id>
// Members can only open their own records; admins can open any.

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id) jsonError(400, "Record ID is required.");

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

$stmt = $db->prepare("SELECT member_id, certificate_path FROM cpd_records WHERE id = :id");
$stmt->execute(array(':id' => $id));
$record = $stmt->fetch(PDO::FETCH_ASSOC);

// Another member's record answers the same as a missing one, so IDs can't be probed
if (!$record || ($user['role'] === 'members' && (int)$record['member_id'] !== (int)$user['id'])) {
    jsonError(404, "File not found.");
}

sendPrivateFile($record['certificate_path'], 'cpd-certificate-' . $id);
