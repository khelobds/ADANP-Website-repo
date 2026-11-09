<?php
// Shared CORS headers for every endpoint. The session cookie is only sent cross-origin when the
// response names the exact frontend origin (never "*") and allows credentials, so the origin is
// echoed back only if it is on the CORS_ALLOWED_ORIGINS allowlist (comma-separated).
function applyCors($methods) {
    $allowedOrigins = getenv('CORS_ALLOWED_ORIGINS') ?: 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173';
    $allowedOrigins = array_map('trim', explode(',', $allowedOrigins));
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    header("Vary: Origin");
    if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
    }
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: $methods");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
?>
