<?php
// Private uploads (proof-of-payment files, CPD certificates) are stored outside the web root in
// backend/storage/<folder>/ and only served through endpoints that check who is asking.
// Stored paths look like '<folder>/<32 hex chars>.<ext>'.

const PRIVATE_FILE_TYPES = array(
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/gif' => 'gif',
    'application/pdf' => 'pdf',
);

const PRIVATE_FOLDERS = array('proofs', 'cpd');

function privateStorageDir($folder) {
    return __DIR__ . '/../storage/' . $folder . '/';
}

// Saves an entry of $_FILES into storage/<folder>/.
// Returns array('path' => '<folder>/<name>') or array('error' => message, 'status' => HTTP code).
function savePrivateUpload($file, $folder, $maxBytes = 5242880) {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        $tooBig = isset($file) && in_array($file['error'], array(UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE), true);
        return array('error' => $tooBig ? 'The file is too large.' : 'No valid file uploaded.', 'status' => 400);
    }
    if ($file['size'] > $maxBytes) {
        return array('error' => 'The file is too large. Maximum size is ' . round($maxBytes / 1048576) . ' MB.', 'status' => 400);
    }

    // Detect the type from the file contents and pick the extension from it,
    // ignoring the uploaded name and the browser-supplied type
    $type = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    if (!isset(PRIVATE_FILE_TYPES[$type])) {
        return array('error' => 'Upload failed. Allowed file types: jpg, jpeg, png, gif, pdf.', 'status' => 400);
    }

    $dir = privateStorageDir($folder);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $name = bin2hex(random_bytes(16)) . '.' . PRIVATE_FILE_TYPES[$type];
    if (!move_uploaded_file($file['tmp_name'], $dir . $name)) {
        return array('error' => 'Error moving the uploaded file.', 'status' => 500);
    }
    return array('path' => $folder . '/' . $name);
}

// Maps a stored path to a file on disk, or null if it is not a valid private file path.
// 'uploads/<name>' is the old public proof folder (bin/move_proofs.php empties it).
function privateFilePath($storedPath) {
    if (!preg_match('#^(proofs|cpd|uploads)/([a-f0-9]{32}\.(?:jpg|png|gif|pdf))$#', (string)$storedPath, $m)) {
        return null;
    }
    return $m[1] === 'uploads'
        ? __DIR__ . '/../public/uploads/' . $m[2]
        : privateStorageDir($m[1]) . $m[2];
}

function deletePrivateFile($storedPath) {
    $file = privateFilePath($storedPath);
    if ($file && is_file($file)) {
        unlink($file);
    }
}

// Streams a stored private file and exits; answers 404 if it is missing or not an allowed type.
function sendPrivateFile($storedPath, $downloadName) {
    $file = privateFilePath($storedPath);
    $type = ($file && is_file($file)) ? (new finfo(FILEINFO_MIME_TYPE))->file($file) : null;

    if (!$type || !isset(PRIVATE_FILE_TYPES[$type])) {
        http_response_code(404);
        echo json_encode(array("status" => "error", "message" => "File not found."));
        exit();
    }

    header('Content-Type: ' . $type);
    header('Content-Length: ' . filesize($file));
    header('Content-Disposition: inline; filename="' . $downloadName . '.' . PRIVATE_FILE_TYPES[$type] . '"');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: private, no-store');
    readfile($file);
    exit();
}
