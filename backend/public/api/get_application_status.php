<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('GET, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
$user = requireLogin(array('non_members'));

require_once __DIR__ . '/../../config/Database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Database connection failed."));
    exit();
}

// Always the logged-in user, so nobody can look up someone else's application
$non_member_id = $user['id'];

try {
    $query = "SELECT status FROM non_member_applications WHERE non_member_id = :id ORDER BY submitted_at DESC LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $non_member_id);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $response = array(
            "status" => "success",
            "application_status" => $row['status'] // Pending, Approved, Rejected
        );

        // Once approved, the user has a row in members (created by update_application.php).
        // Switch the session over to that account so member-only endpoints accept them.
        if ($row['status'] === 'Approved') {
            $memberStmt = $db->prepare("SELECT id, email, full_name FROM members WHERE email = :email LIMIT 1");
            $memberStmt->bindParam(':email', $user['email']);
            $memberStmt->execute();
            $member = $memberStmt->fetch(PDO::FETCH_ASSOC);

            if ($member) {
                $memberUser = array("id" => $member['id'], "email" => $member['email'], "role" => "members");
                loginUser($memberUser);
                $response["user"] = $memberUser + array("full_name" => $member['full_name']);
            }
        }

        echo json_encode($response);
    } else {
        echo json_encode(array(
            "status" => "success",
            "application_status" => "Not Submitted"
        ));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?>
