<?php
// Proof-of-payment files are private: they are stored outside the web root and only served
// to admins through api/proof.php.

const PROOF_TYPES = array(
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/gif' => 'gif',
    'application/pdf' => 'pdf',
);

function proofStorageDir() {
    return __DIR__ . '/../storage/proofs/';
}

// Maps a stored proof_of_payment_path to a file on disk, or null if it is not a valid proof path.
// 'proofs/<name>' is the current location; 'uploads/<name>' is the old public folder
// (rows saved before proofs were made private; bin/move_proofs.php moves them).
function proofFilePath($storedPath) {
    if (!preg_match('#^(proofs|uploads)/([a-f0-9]{32}\.(?:jpg|png|gif|pdf))$#', (string)$storedPath, $m)) {
        return null;
    }
    return $m[1] === 'proofs'
        ? proofStorageDir() . $m[2]
        : __DIR__ . '/../public/uploads/' . $m[2];
}
