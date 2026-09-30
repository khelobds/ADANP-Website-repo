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
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    $tables = ['admin_user', 'members', 'non_members'];
    $user_found = false;
    $password_hash = '';
    $user_data = [];

    foreach ($tables as $table) {
        $query = "SELECT id, email, password FROM $table WHERE email = :email LIMIT 1";
        
        try {
            $stmt = $db->prepare($query);
            if (!$stmt) continue; // If prepare fails silently due to missing table

            $stmt->bindParam(':email', $data->email);
            $stmt->execute();
            $num = $stmt->rowCount();

            if($num > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $password_hash = $row['password'];
                $user_found = true;
                $user_data = array(
                    "id" => $row['id'],
                    "email" => $row['email'],
                    "role" => $table
                );
                break; // Stop searching once user is found
            }
        } catch(\Throwable $e) {
            // Catch ANY error/exception (missing table syntax error, etc.) and continue to next table 
            continue;
        }
    }

    if($user_found) {
        if($data->password === $password_hash || password_verify($data->password, $password_hash)) {
            http_response_code(200);
            echo json_encode(array(
                "status" => "success",
                "message" => "Login successful.",
                "user" => $user_data
            ));
        } else {
            http_response_code(401);
            echo json_encode(array("status" => "error", "message" => "Invalid credentials."));
        }
    } else {
        http_response_code(404);
        echo json_encode(array("status" => "error", "message" => "User not found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Unable to login. Data missing."));
}
?>