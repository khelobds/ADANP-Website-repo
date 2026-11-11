<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('GET, POST, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$user = requireLogin(array('members'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Profile.php';

// The logged-in member's profile.
// GET: name, email, membership ID, member-since year, workplace, bio, whether a photo exists, privacy settings.
// POST (JSON): { current_workplace, professional_bio, privacy_visibility, privacy_show_bio,
//                privacy_show_workplace, privacy_show_email }. Name and email are not editable here and are ignored.
// The PRC license is saved separately with license.php; the photo with profile_photo.php.

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!is_array($data)) jsonError(400, "Send the profile as JSON.");

    $workplace = trim((string)($data['current_workplace'] ?? ''));
    $bio = trim((string)($data['professional_bio'] ?? ''));
    if (mb_strlen($workplace) > PROFILE_MAX_WORKPLACE_LENGTH) jsonError(400, "Workplace can be at most " . PROFILE_MAX_WORKPLACE_LENGTH . " characters.");
    if (mb_strlen($bio) > PROFILE_MAX_BIO_LENGTH) jsonError(400, "Professional background can be at most " . PROFILE_MAX_BIO_LENGTH . " characters.");

    $params = array(
        ':member' => $user['id'],
        ':workplace' => $workplace === '' ? null : $workplace,
        ':bio' => $bio === '' ? null : $bio,
    );
    foreach (array_keys(PROFILE_PRIVACY_DEFAULTS) as $key) {
        $value = array_key_exists($key, $data) && is_bool($data[$key]) ? $data[$key] : null;
        if ($value === null) jsonError(400, "Privacy settings must be true or false.");
        $params[':' . $key] = $value ? 1 : 0;
    }

    try {
        $stmt = $db->prepare(
            "INSERT INTO member_profiles (member_id, current_workplace, professional_bio,
                 privacy_visibility, privacy_show_bio, privacy_show_workplace, privacy_show_email)
             VALUES (:member, :workplace, :bio, :privacy_visibility, :privacy_show_bio, :privacy_show_workplace, :privacy_show_email)
             ON DUPLICATE KEY UPDATE current_workplace = VALUES(current_workplace), professional_bio = VALUES(professional_bio),
                 privacy_visibility = VALUES(privacy_visibility), privacy_show_bio = VALUES(privacy_show_bio),
                 privacy_show_workplace = VALUES(privacy_show_workplace), privacy_show_email = VALUES(privacy_show_email)"
        );
        $stmt->execute($params);
    } catch (Exception $e) {
        error_log('profile save failed: ' . $e->getMessage());
        jsonError(500, "Unable to save your profile.");
    }
}

try {
    $profile = loadProfile($db, $user['id']);
} catch (Exception $e) {
    error_log('profile load failed: ' . $e->getMessage());
    jsonError(500, "Unable to load your profile.");
}
if (!$profile) jsonError(404, "Member not found.");

echo json_encode(array(
    "status" => "success",
    "message" => $_SERVER['REQUEST_METHOD'] === 'POST' ? "Profile saved." : null,
    "profile" => $profile,
));
