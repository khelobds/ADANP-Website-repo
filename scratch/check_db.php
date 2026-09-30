<?php
include_once 'backend/config/Database.php';
$database = new Database();
$db = $database->getConnection();
if ($db) {
    echo "Connected successfully\n";
    $query = $db->query("SHOW TABLES");
    while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
    }
} else {
    echo "Connection failed\n";
}
?>
