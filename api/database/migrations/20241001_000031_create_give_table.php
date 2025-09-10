<?php

class Migration_20241001000031creategivetable {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function up() {
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS give (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                text LONGTEXT,
                image VARCHAR(255) DEFAULT NULL,
                links JSON DEFAULT NULL,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_active (is_active)
            )
        ");
    }

    public function down() {
        $this->pdo->exec("DROP TABLE IF EXISTS give");
    }
}
?>
