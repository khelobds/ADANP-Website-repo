<?php
header("Content-Type: text/plain");

include_once 'config/Database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    die("Database connection failed.");
}

$sql_file = __DIR__ . "/../frontend/database_schema.sql";

if (!file_exists($sql_file)) {
    die("SQL file not found at: " . realpath($sql_file));
}

$sql = file_get_contents($sql_file);

// Remove comments and split by semicolon
$queries = explode(";", $sql);

echo "Starting migration...\n";

foreach ($queries as $query) {
    $query = trim($query);
    if (empty($query)) {
        continue;
    }
    
    try {
        $db->exec($query);
        echo "Executed: " . substr($query, 0, 50) . "...\n";
    } catch (PDOException $e) {
        echo "Error executing query: " . $e->getMessage() . "\n";
    }
}

echo "Migration complete.\n";
?>
