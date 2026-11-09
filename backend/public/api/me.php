<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('GET, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';

// Who is logged in according to the server: { id, email, role }, or 401 if nobody
$user = requireLogin();

http_response_code(200);
echo json_encode(array("status" => "success", "user" => $user));
?>
