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

if(
    !empty($data->full_name) &&
    !empty($data->age) &&
    !empty($data->gender) &&
    !empty($data->email) &&
    !empty($data->password)
) {
    // Check if email already exists
    $check_query = "SELECT id FROM non_members WHERE email = :email LIMIT 1";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(':email', $data->email);
    $check_stmt->execute();
    
    if($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Email already exists in the system."));
        exit();
    }

    $query = "INSERT INTO non_members (full_name, age, gender, email, password) VALUES (:full_name, :age, :gender, :email, :password)";
    $stmt = $db->prepare($query);

    // Sanitize and bind
    $full_name = htmlspecialchars(strip_tags($data->full_name));
    $age = htmlspecialchars(strip_tags($data->age));
    $gender = htmlspecialchars(strip_tags($data->gender));
    $email = htmlspecialchars(strip_tags($data->email));
    
    // Hash the password
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    $stmt->bindParam(':full_name', $full_name);
    $stmt->bindParam(':age', $age);
    $stmt->bindParam(':gender', $gender);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password_hash);

    try {
        if($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array(
                "status" => "success",
                "message" => "Registration successful. You can now login.",
            ));
        } else {
            http_response_code(503);
            echo json_encode(array("status" => "error", "message" => "Unable to register user."));
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(array("status" => "error", "message" => "Query Error: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Unable to register user. Data is incomplete."));
}
?>
