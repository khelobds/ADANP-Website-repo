<?php
// Login rate limiting backed by the login_attempts table.
// Within the window, an IP may fail LOGIN_MAX_ATTEMPTS times for one email and LOGIN_MAX_IP_ATTEMPTS
// times across all emails; after that login.php answers 429 until the oldest failure ages out.
//
//   LOGIN_MAX_ATTEMPTS     failures per email + IP (default 5)
//   LOGIN_MAX_IP_ATTEMPTS  failures per IP, any email (default 20)
//   LOGIN_WINDOW_SECONDS   how far back failures count (default 900 = 15 minutes)
//
// The IP is REMOTE_ADDR. Behind a reverse proxy that is the proxy's address, so configure the
// web server to pass the real client IP (e.g. Apache mod_remoteip, Nginx real_ip) before going live.

function loginLimits() {
    return array(
        'per_email' => (int)(getenv('LOGIN_MAX_ATTEMPTS') ?: 5),
        'per_ip' => (int)(getenv('LOGIN_MAX_IP_ATTEMPTS') ?: 20),
        'window' => (int)(getenv('LOGIN_WINDOW_SECONDS') ?: 900),
    );
}

function loginClientIp() {
    return isset($_SERVER['REMOTE_ADDR']) ? substr($_SERVER['REMOTE_ADDR'], 0, 45) : 'unknown';
}

function normalizeLoginEmail($email) {
    return substr(strtolower(trim((string)$email)), 0, 150);
}

// Seconds the client must wait before trying again, or 0 if it may try now.
// If the table is missing (database not migrated) logins are allowed and the error is logged.
function loginRetryAfter(PDO $db, $email) {
    $limits = loginLimits();
    $checks = array(
        array("email = :email AND ip_address = :ip", array(':email' => normalizeLoginEmail($email), ':ip' => loginClientIp()), $limits['per_email']),
        array("ip_address = :ip", array(':ip' => loginClientIp()), $limits['per_ip']),
    );

    try {
        $wait = 0;
        foreach ($checks as $check) {
            list($where, $params, $max) = $check;
            $stmt = $db->prepare(
                "SELECT COUNT(*) AS failures, TIMESTAMPDIFF(SECOND, MIN(attempted_at), NOW()) AS age
                 FROM login_attempts
                 WHERE $where AND attempted_at > NOW() - INTERVAL :window SECOND"
            );
            $stmt->bindValue(':window', $limits['window'], PDO::PARAM_INT);
            foreach ($params as $name => $value) {
                $stmt->bindValue($name, $value);
            }
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ((int)$row['failures'] >= $max) {
                $wait = max($wait, $limits['window'] - (int)$row['age'], 1);
            }
        }
        return $wait;
    } catch (\Throwable $e) {
        error_log('Login rate limit check failed: ' . $e->getMessage());
        return 0;
    }
}

function recordFailedLogin(PDO $db, $email) {
    try {
        $stmt = $db->prepare("INSERT INTO login_attempts (email, ip_address) VALUES (:email, :ip)");
        $stmt->execute(array(':email' => normalizeLoginEmail($email), ':ip' => loginClientIp()));

        // Keep the table small: drop failures that no longer count
        $cleanup = $db->prepare("DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL :window SECOND");
        $cleanup->bindValue(':window', loginLimits()['window'], PDO::PARAM_INT);
        $cleanup->execute();
    } catch (\Throwable $e) {
        error_log('Recording failed login failed: ' . $e->getMessage());
    }
}

// After a successful login, forget this IP's failures for that email.
function clearFailedLogins(PDO $db, $email) {
    try {
        $stmt = $db->prepare("DELETE FROM login_attempts WHERE email = :email AND ip_address = :ip");
        $stmt->execute(array(':email' => normalizeLoginEmail($email), ':ip' => loginClientIp()));
    } catch (\Throwable $e) {
        error_log('Clearing failed logins failed: ' . $e->getMessage());
    }
}
