<?php
class Database {
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $host = getenv('DB_HOST') ?: 'localhost';
            $dbName = getenv('DB_NAME') ?: 'adanp_portal';
            $username = getenv('DB_USER');
            $password = getenv('DB_PASSWORD');
            $charset = getenv('DB_CHARSET') ?: 'utf8mb4';

            $this->conn = new PDO(
                "mysql:host={$host};dbname={$dbName};charset={$charset}",
                $username === false ? 'root' : $username,
                $password === false ? '' : $password,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );
        } catch(PDOException $exception) {
            error_log("Connection error: " . $exception->getMessage());
        }
        return $this->conn;
    }
}
?>
