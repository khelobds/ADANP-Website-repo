<?php
// Hashes any password stored in plain text in admin_user, members and non_members.
// login.php only accepts hashed passwords, so plain-text accounts cannot log in until this runs.
// The password itself does not change: each plain-text value is replaced by its bcrypt hash.
//
//   php backend/bin/rehash_passwords.php           # dry run: list affected accounts
//   php backend/bin/rehash_passwords.php --apply   # hash them

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit();
}

require_once __DIR__ . '/../config/Database.php';

$apply = in_array('--apply', $argv, true);

$db = (new Database())->getConnection();
if (!$db) {
    fwrite(STDERR, "Database connection failed.\n");
    exit(1);
}

$total = 0;
foreach (array('admin_user', 'members', 'non_members') as $table) {
    $rows = $db->query("SELECT id, email, password FROM $table")->fetchAll(PDO::FETCH_ASSOC);
    $update = $db->prepare("UPDATE $table SET password = :password WHERE id = :id");

    foreach ($rows as $row) {
        // password_get_info reports algo null (PHP 8) or 0 (PHP 7) for values that are not a hash
        if (!empty(password_get_info($row['password'])['algo'])) continue;

        $total++;
        echo ($apply ? 'Hashed' : 'Plain text') . ": $table #{$row['id']} {$row['email']}\n";
        if ($apply) {
            $update->execute(array(':password' => password_hash($row['password'], PASSWORD_BCRYPT), ':id' => $row['id']));
        }
    }
}

if ($total === 0) {
    echo "No plain-text passwords found.\n";
} elseif (!$apply) {
    echo "$total account(s) need hashing. Run again with --apply to hash them.\n";
}
