<?php
// Server-side login state. Endpoints take the logged-in user from the PHP session,
// never from user IDs or roles sent in the request.
//
// Session cookie settings come from env vars:
//   SESSION_SAMESITE      Lax (default), Strict, or None (None is needed when the frontend and API
//                         are on different sites, and requires HTTPS with SESSION_SECURE=true)
//   SESSION_SECURE        true/false; defaults to true when the request came over HTTPS
//   SESSION_IDLE_TIMEOUT  seconds of inactivity before the user is logged out (default 7200)

function sessionIdleTimeout() {
    return (int)(getenv('SESSION_IDLE_TIMEOUT') ?: 7200);
}

function startSession() {
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $secureSetting = getenv('SESSION_SECURE');
    $secure = $secureSetting !== false
        ? $secureSetting === 'true'
        : (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');

    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.gc_maxlifetime', (string)sessionIdleTimeout());
    session_name('ADANPSESSID');
    session_set_cookie_params(array(
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => getenv('SESSION_SAMESITE') ?: 'Lax'
    ));
    session_start();
}

// Returns ['id' => ..., 'email' => ..., 'role' => table name] or null when nobody is logged in.
function currentUser() {
    startSession();

    if (empty($_SESSION['user'])) {
        return null;
    }

    if (time() - ($_SESSION['last_activity'] ?? 0) > sessionIdleTimeout()) {
        logoutUser();
        return null;
    }

    $_SESSION['last_activity'] = time();
    return $_SESSION['user'];
}

function loginUser($user) {
    startSession();
    // New session ID on every login so a session ID planted before login can't be reused
    session_regenerate_id(true);
    $_SESSION['user'] = $user;
    $_SESSION['last_activity'] = time();
}

function logoutUser() {
    startSession();
    $_SESSION = array();

    $params = session_get_cookie_params();
    setcookie(session_name(), '', array(
        'expires' => time() - 3600,
        'path' => $params['path'],
        'domain' => $params['domain'],
        'secure' => $params['secure'],
        'httponly' => $params['httponly'],
        'samesite' => $params['samesite']
    ));

    session_destroy();
}

// Stops the request with 401/403 unless a user is logged in (with one of $roles, if given).
// Returns the logged-in user.
function requireLogin($roles = array()) {
    // Requests that change data must carry the X-Requested-With header that backendFetch() adds.
    // Other sites can't add it without a CORS preflight, which the origin allowlist rejects,
    // so a forged form post from another site can't ride on the user's session cookie.
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method !== 'GET' && $method !== 'HEAD' && ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'XMLHttpRequest') {
        http_response_code(403);
        echo json_encode(array("status" => "error", "message" => "Invalid request."));
        exit();
    }

    $user = currentUser();

    if (!$user) {
        http_response_code(401);
        echo json_encode(array("status" => "error", "message" => "Please log in to continue."));
        exit();
    }

    if (!empty($roles) && !in_array($user['role'], $roles, true)) {
        http_response_code(403);
        echo json_encode(array("status" => "error", "message" => "You do not have permission to do this."));
        exit();
    }

    return $user;
}
?>
