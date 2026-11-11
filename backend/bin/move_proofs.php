<?php
// Moves proof-of-payment files saved before proofs were made private from the public
// public/uploads/ folder into storage/proofs/, and updates non_member_applications to match.
//
//   php backend/bin/move_proofs.php           # dry run: list what would move
//   php backend/bin/move_proofs.php --apply   # move the files and update the rows

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit();
}

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/PrivateFiles.php';

$apply = in_array('--apply', $argv, true);

$db = (new Database())->getConnection();
if (!$db) {
    fwrite(STDERR, "Database connection failed.\n");
    exit(1);
}

$rows = $db->query("SELECT id, proof_of_payment_path FROM non_member_applications WHERE proof_of_payment_path LIKE 'uploads/%'")
    ->fetchAll(PDO::FETCH_ASSOC);
$update = $db->prepare("UPDATE non_member_applications SET proof_of_payment_path = :path WHERE id = :id");

if ($apply && !is_dir(privateStorageDir('proofs'))) {
    mkdir(privateStorageDir('proofs'), 0755, true);
}

$pending = 0;
foreach ($rows as $row) {
    $from = privateFilePath($row['proof_of_payment_path']);
    if (!$from || !is_file($from)) {
        echo "Skipped: application #{$row['id']} ({$row['proof_of_payment_path']}): file missing or unexpected name\n";
        continue;
    }

    $name = basename($from);
    $pending++;
    if (!$apply) {
        echo "Would move: application #{$row['id']} uploads/$name -> proofs/$name\n";
        continue;
    }

    if (!rename($from, privateStorageDir('proofs') . $name)) {
        fwrite(STDERR, "Failed to move uploads/$name\n");
        exit(1);
    }
    $update->execute(array(':path' => 'proofs/' . $name, ':id' => $row['id']));
    echo "Moved: application #{$row['id']} -> proofs/$name\n";
}

if ($pending === 0) {
    echo "No proofs left in the public uploads folder.\n";
} elseif (!$apply) {
    echo "$pending file(s) to move. Run again with --apply to move them.\n";
}
