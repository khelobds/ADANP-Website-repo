<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/Database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => "Database connection failed."));
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->application_id) || !isset($data->action)) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Incomplete data."));
    exit();
}

try {
    $app_id = $data->application_id;
    $action = $data->action; // 'Approve' or 'Reject'
    
    $new_status = ($action === 'Approve') ? 'Approved' : 'Rejected';

    // Begin Transaction to safely update status and optionally move user
    $db->beginTransaction();

    $updateQuery = "UPDATE non_member_applications SET status = :status WHERE id = :id";
    $stmt = $db->prepare($updateQuery);
    $stmt->bindParam(":status", $new_status);
    $stmt->bindParam(":id", $app_id);
    $stmt->execute();

    if ($action === 'Approve') {
        // Fetch the user's details from non_members to insert into members
        $fetchQuery = "SELECT nma.non_member_id, nm.full_name, nm.age, nm.gender, nm.email, nm.password 
                       FROM non_member_applications nma
                       JOIN non_members nm ON nma.non_member_id = nm.id
                       WHERE nma.id = :id LIMIT 1";
        $fetchStmt = $db->prepare($fetchQuery);
        $fetchStmt->bindParam(':id', $app_id);
        $fetchStmt->execute();
        
        $row = $fetchStmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // Check if user is already in members (prevent duplicate if approved multiple times)
            $checkMember = "SELECT id FROM members WHERE email = :email LIMIT 1";
            $checkStmt = $db->prepare($checkMember);
            $checkStmt->bindParam(':email', $row['email']);
            $checkStmt->execute();
            
            if ($checkStmt->rowCount() == 0) {
                // Insert into members table
                $insertQuery = "INSERT INTO members (full_name, age, gender, email, password) 
                                VALUES (:full_name, :age, :gender, :email, :password)";
                $insertStmt = $db->prepare($insertQuery);
                $insertStmt->bindParam(':full_name', $row['full_name']);
                $insertStmt->bindParam(':age', $row['age']);
                $insertStmt->bindParam(':gender', $row['gender']);
                $insertStmt->bindParam(':email', $row['email']);
                $insertStmt->bindParam(':password', $row['password']);
                $insertStmt->execute();
                
                // Optionally delete them from non_members
                // For now, let's keep them in non_members so they don't lose the application history
            }
        }
    }

    $db->commit();
    http_response_code(200);
    echo json_encode(array("status" => "success", "message" => "Application has been " . strtolower($new_status)));

} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode(array("status" => "error", "message" => $e->getMessage()));
}
?>
