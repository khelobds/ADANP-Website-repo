<?php

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit();
}

require_once __DIR__ . '/../config/Database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    die("Database connection failed.");
}

$sql_file = __DIR__ . '/../database/schema.sql';

if (!file_exists($sql_file)) {
    die("SQL file not found at: " . realpath($sql_file));
}

$sql = file_get_contents($sql_file);
if ($sql === false) {
    fwrite(STDERR, "Unable to read schema file: {$sql_file}\n");
    exit(1);
}

$queries = explode(";", $sql);

echo "Starting migration...\n";

try {
    foreach ($queries as $query) {
        $query = trim($query);
        if ($query === '') {
            continue;
        }

        $db->exec($query);
        echo "Executed: " . substr($query, 0, 50) . "...\n";
    }
} catch (PDOException $exception) {
    fwrite(STDERR, "Migration failed: " . $exception->getMessage() . "\n");
    exit(1);
}

echo "Migration complete.\n";
?>
