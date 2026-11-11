<?php
// Member profile rules shared by profile.php and profile_photo.php.
// The name and email come from the members table and members cannot change them here.
// Workplace, bio, photo and privacy settings live in member_profiles (one row per member, created on first save).

require_once __DIR__ . '/Validation.php';

const PROFILE_MAX_WORKPLACE_LENGTH = 255;
const PROFILE_MAX_BIO_LENGTH = 2000;
const PROFILE_PHOTO_MAX_BYTES = 2097152; // 2 MB
const PROFILE_PHOTO_TYPES = array('image/jpeg' => 'jpg', 'image/png' => 'png');

// Privacy settings and their defaults for a member who has not saved any yet.
// They are stored for the member directory, which does not exist yet.
const PROFILE_PRIVACY_DEFAULTS = array(
    'privacy_visibility' => true,
    'privacy_show_bio' => true,
    'privacy_show_workplace' => true,
    'privacy_show_email' => false,
);

// Membership ID shown on the card, e.g. ADANP-2026-0007: the year the members row was created
// (when the application was approved) and the member's row ID. Both never change, so neither does the ID.
function memberNumber($memberId, $createdAt) {
    return sprintf('ADANP-%s-%04d', substr((string)$createdAt, 0, 4), (int)$memberId);
}

// The member's profile as the page expects it, or null if the member does not exist
function loadProfile(PDO $db, $memberId) {
    $stmt = $db->prepare(
        "SELECT m.id, m.full_name, m.email, m.created_at,
                p.current_workplace, p.professional_bio, p.photo_path,
                p.privacy_visibility, p.privacy_show_bio, p.privacy_show_workplace, p.privacy_show_email
         FROM members m LEFT JOIN member_profiles p ON p.member_id = m.id
         WHERE m.id = :id"
    );
    $stmt->execute(array(':id' => $memberId));
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) return null;

    $privacy = array();
    foreach (PROFILE_PRIVACY_DEFAULTS as $key => $default) {
        $privacy[$key] = $row[$key] === null ? $default : (bool)$row[$key];
    }

    return array(
        'full_name' => $row['full_name'],
        'email' => $row['email'],
        'member_number' => memberNumber($row['id'], $row['created_at']),
        'member_since' => substr((string)$row['created_at'], 0, 4),
        'current_workplace' => $row['current_workplace'] ?? '',
        'professional_bio' => $row['professional_bio'] ?? '',
        'has_photo' => $row['photo_path'] !== null,
        'privacy' => $privacy,
    );
}

function memberPhotoPath(PDO $db, $memberId) {
    $stmt = $db->prepare("SELECT photo_path FROM member_profiles WHERE member_id = :id");
    $stmt->execute(array(':id' => $memberId));
    $path = $stmt->fetchColumn();
    return $path ?: null;
}
