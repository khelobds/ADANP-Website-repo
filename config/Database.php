<?php
class Database {
    private $host = "localhost";
    private $db_name = "adanp_portal";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("SET NAMES 'utf8'");
        } catch(PDOException $exception) {
            // Don't echo - just leave conn as null so caller can handle it
            error_log("Connection error: " . $exception->getMessage());
        }
        return $this->conn;
    }
}
?>
