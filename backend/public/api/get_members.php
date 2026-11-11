<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('GET, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
requireLogin(array('admin_user'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Cpd.php';

// All members (id, name, email), for admins picking ADANP seminar attendees

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

$members = $db->query("SELECT id, full_name, email FROM members ORDER BY full_name, email")->fetchAll(PDO::FETCH_ASSOC);
foreach ($members as &$member) {
    $member['id'] = (int)$member['id'];
}
unset($member);

echo json_encode(array("status" => "success", "members" => $members));
