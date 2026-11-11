<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('POST, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../config/RateLimit.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password)) {
    // Too many recent failures from this IP: refuse before checking the password
    $retryAfter = loginRetryAfter($db, $data->email);
    if ($retryAfter > 0) {
        http_response_code(429);
        header('Retry-After: ' . $retryAfter);
        $minutes = (int)ceil($retryAfter / 60);
        echo json_encode(array("status" => "error", "message" => "Too many failed login attempts. Try again in $minutes minute" . ($minutes === 1 ? '' : 's') . "."));
        exit();
    }

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

            if ($num > 0) {
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
        } catch (\Throwable $e) {
            // Catch ANY error/exception (missing table syntax error, etc.) and continue to next table 
            continue;
        }
    }

    if ($user_found) {
        // Only hashed passwords are accepted; plain-text rows must be converted with bin/rehash_passwords.php
        if (password_verify($data->password, $password_hash)) {
            // Remember the user on the server; later requests are identified by the session cookie
            loginUser($user_data);
            clearFailedLogins($db, $data->email);

            http_response_code(200);
            echo json_encode(array(
                "status" => "success",
                "message" => "Login successful.",
                "user" => $user_data
            ));
        } else {
            recordFailedLogin($db, $data->email);
            http_response_code(401);
            echo json_encode(array("status" => "error", "message" => "Invalid credentials."));
        }
    } else {
        recordFailedLogin($db, $data->email);
        http_response_code(404);
        echo json_encode(array("status" => "error", "message" => "User not found."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Unable to login. Data missing."));
}
