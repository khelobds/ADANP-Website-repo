<?php
include_once 'config/Database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if($db) {
        echo "Successfully connected to the database 'adanp_portal'.\n";
        
        // Check if tables exist
        $tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        echo "Tables found:\n";
        foreach($tables as $table) {
            echo "- $table\n";
        }
        
        if (empty($tables)) {
            echo "Warning: No tables found in the database. Did you run the schema?\n";
        }
    } else {
        echo "Database object returned null. Check your config/Database.php.\n";
    }
} catch (Exception $e) {
    echo "Caught exception: " . $e->getMessage() . "\n";
}
?>
