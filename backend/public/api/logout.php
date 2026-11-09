<?php
require_once __DIR__ . '/../../config/Cors.php';
applyCors('POST, OPTIONS');

require_once __DIR__ . '/../../config/Auth.php';

// Succeeds even when the session has already expired, so the frontend can always clear its copy
logoutUser();

http_response_code(200);
echo json_encode(array("status" => "success", "message" => "Logged out."));
?>
