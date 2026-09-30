<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=UTF-8");

echo "<h1>Database Connection Test</h1>";

// Check PDO drivers
echo "<h2>PDO Drivers Available:</h2>";
$drivers = PDO::getAvailableDrivers();
if (empty($drivers)) {
    echo "<p style='color: red;'>No PDO drivers found! Enable pdo_mysql in php.ini</p>";
} else {
    echo "<ul>";
    foreach ($drivers as $driver) {
        $color = ($driver === 'mysql') ? 'green' : 'black';
        echo "<li style='color: $color;'>" . $driver . "</li>";
    }
    echo "</ul>";
    if (!in_array('mysql', $drivers)) {
        echo "<p style='color: red;'>MySQL driver missing! Uncomment <code>extension=pdo_mysql</code> in php.ini and restart Apache.</p>";
    }
}

include_once './config/Database.php';

$database = new Database();

try {
    $db = $database->getConnection();
    
    if ($db) {
        echo "<h2 style='color: green;'>✅ Connected Successfully!</h2>";
        echo "<p>Connected to database: <strong>adanp_portal</strong></p>";
        
        // Let's also check if admin_user table exists
        try {
            $stmt = $db->query("SELECT 1 FROM admin_user LIMIT 1");
            if ($stmt !== false) {
                echo "<p style='color: green;'>✅ Table 'admin_user' exists!</p>";
            } else {
                 echo "<p style='color: red;'>❌ Table 'admin_user' does NOT exist or cannot be queried.</p>";
            }
        } catch (PDOException $e) {
            echo "<p style='color: red;'>❌ Error querying 'admin_user' table: " . $e->getMessage() . "</p>";
        }

    } else {
        echo "<h2 style='color: red;'>❌ Connection Failed</h2>";
        echo "<p>Check your settings in <code>backend/config/Database.php</code></p>";
    }
} catch (Exception $e) {
    echo "<h2 style='color: red;'>❌ Connection Error</h2>";
    echo "<p>Details: " . htmlspecialchars($e->getMessage()) . "</p>";
}
?>
