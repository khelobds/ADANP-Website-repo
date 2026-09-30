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
    echo json_encode(array("status" => "error", "message" => "Database connection failed."));
    exit();
}

// Allowed file types
$allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
$allowedVideoTypes = ['video/mp4', 'video/webm'];
$allowedTypes = array_merge($allowedImageTypes, $allowedVideoTypes);

// Max file size (50MB)
$maxFileSize = 50 * 1024 * 1024;

// Upload directory
$uploadDir = __DIR__ . '/uploads/';

// Create uploads directory if it doesn't exist
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Check if files were uploaded
if (empty($_FILES['files'])) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "No files uploaded."));
    exit();
}

$files = $_FILES['files'];
$uploadedFiles = [];
$errors = [];

// Reorganize files array for easier looping
$fileCount = count($files['name']);
for ($i = 0; $i < $fileCount; $i++) {
    $fileName = $files['name'][$i];
    $fileTmpName = $files['tmp_name'][$i];
    $fileSize = $files['size'][$i];
    $fileType = $files['type'][$i];
    $fileError = $files['error'][$i];
    
    // Check for upload errors
    if ($fileError !== UPLOAD_ERR_OK) {
        $errors[] = "Error uploading $fileName";
        continue;
    }
    
    // Check file size
    if ($fileSize > $maxFileSize) {
        $errors[] = "$fileName is too large (max 50MB)";
        continue;
    }
    
    // Check file type
    if (!in_array($fileType, $allowedTypes)) {
        $errors[] = "$fileName has an unsupported file type";
        continue;
    }
    
    // Determine file type (image or video)
    $fileCategory = in_array($fileType, $allowedImageTypes) ? 'image' : 'video';
    
    // Generate unique filename
    $extension = pathinfo($fileName, PATHINFO_EXTENSION);
    $newFileName = uniqid() . '_' . time() . '.' . $extension;
    $filePath = $uploadDir . $newFileName;
    
    // Move uploaded file
    if (move_uploaded_file($fileTmpName, $filePath)) {
        // Save to database
        $relativePath = 'uploads/' . $newFileName;
        
        $query = "INSERT INTO gallery (file_name, file_path, file_type, file_size) VALUES (:file_name, :file_path, :file_type, :file_size)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':file_name', $fileName);
        $stmt->bindParam(':file_path', $relativePath);
        $stmt->bindParam(':file_type', $fileCategory);
        $stmt->bindParam(':file_size', $fileSize);
        
        if ($stmt->execute()) {
            $uploadedFiles[] = array(
                'id' => $db->lastInsertId(),
                'file_name' => $fileName,
                'file_path' => $relativePath,
                'file_type' => $fileCategory
            );
        } else {
            $errors[] = "Failed to save $fileName to database";
            // Delete the file if database insert failed
            unlink($filePath);
        }
    } else {
        $errors[] = "Failed to move $fileName to upload directory";
    }
}

// Return response
if (count($uploadedFiles) > 0) {
    http_response_code(200);
    echo json_encode(array(
        "status" => "success",
        "message" => count($uploadedFiles) . " file(s) uploaded successfully.",
        "files" => $uploadedFiles,
        "errors" => $errors
    ));
} else {
    http_response_code(400);
    echo json_encode(array(
        "status" => "error",
        "message" => "No files were uploaded.",
        "errors" => $errors
    ));
}
?>
