<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('GET, POST, DELETE, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$user = requireLogin(array('members', 'admin_user'));

require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/Profile.php';
require_once __DIR__ . '/../../config/PrivateFiles.php';

// A member's photo, stored privately in storage/photos/. A new photo shows right away (no review).
// GET                      the logged-in member's photo; admins pass ?member_id=<id>
// POST (multipart: photo)  replace the logged-in member's photo (JPG or PNG, max 2 MB)
// DELETE                   remove the logged-in member's photo

$method = $_SERVER['REQUEST_METHOD'];
$isAdmin = $user['role'] === 'admin_user';

$db = (new Database())->getConnection();
if (!$db) jsonError(500, "Database connection failed.");

if ($method === 'GET') {
    $memberId = $isAdmin ? filter_input(INPUT_GET, 'member_id', FILTER_VALIDATE_INT) : $user['id'];
    if (!$memberId) jsonError(400, "Member ID is required.");

    $path = memberPhotoPath($db, $memberId);
    if (!$path) jsonError(404, "No photo uploaded.");
    sendPrivateFile($path, 'member-photo-' . $memberId);
}

if ($isAdmin) jsonError(403, "Only the member can change their photo.");

if ($method === 'POST') {
    $upload = savePrivateUpload($_FILES['photo'] ?? null, 'photos', PROFILE_PHOTO_MAX_BYTES, PROFILE_PHOTO_TYPES);
    if (isset($upload['error'])) jsonError($upload['status'], $upload['error']);

    try {
        $oldPath = memberPhotoPath($db, $user['id']);
        $stmt = $db->prepare(
            "INSERT INTO member_profiles (member_id, photo_path) VALUES (:member, :path)
             ON DUPLICATE KEY UPDATE photo_path = VALUES(photo_path)"
        );
        $stmt->execute(array(':member' => $user['id'], ':path' => $upload['path']));
    } catch (Exception $e) {
        deletePrivateFile($upload['path']);
        error_log('profile photo save failed: ' . $e->getMessage());
        jsonError(500, "Unable to save your photo.");
    }

    if ($oldPath) deletePrivateFile($oldPath);
    echo json_encode(array("status" => "success", "message" => "Photo updated."));
    exit();
}

if ($method === 'DELETE') {
    $path = memberPhotoPath($db, $user['id']);
    if ($path) {
        $db->prepare("UPDATE member_profiles SET photo_path = NULL WHERE member_id = :member")->execute(array(':member' => $user['id']));
        deletePrivateFile($path);
    }
    echo json_encode(array("status" => "success", "message" => "Photo removed."));
    exit();
}

jsonError(405, "Method not allowed.");
