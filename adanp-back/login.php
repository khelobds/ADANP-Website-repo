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

include_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(array("message" => "Database connection failed."));
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    $query = "SELECT id, email, password FROM admin_user WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $data->email);

    try {
        $stmt->execute();
        $num = $stmt->rowCount();

        if($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $password_hash = $row['password'];

            if($data->password === $password_hash || password_verify($data->password, $password_hash)) {
                http_response_code(200);
                echo json_encode(array(
                    "status" => "success",
                    "message" => "Login successful.",
                    "user" => array(
                        "id" => $row['id'],
                        "email" => $row['email']
                    )
                ));
            } else {
                http_response_code(401);
                echo json_encode(array("status" => "error", "message" => "Invalid credentials."));
            }
        } else {
            http_response_code(404);
            echo json_encode(array("status" => "error", "message" => "User not found."));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Query Error: Make sure 'admin_user' table exists."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Unable to login. Data missing."));
}
?>