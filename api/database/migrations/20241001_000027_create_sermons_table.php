<?php

class Migration_20241001000027createsermonstable {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function up() {
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS sermons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                content LONGTEXT,
                speaker VARCHAR(255),
                date_preached DATE,
                video_links JSON,
                audio_links JSON,
                images JSON,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_slug (slug),
                INDEX idx_speaker (speaker),
                INDEX idx_date_preached (date_preached),
                INDEX idx_active (is_active),
                INDEX idx_created_at (created_at)
            )
        ");
    }

    public function down() {
        $this->pdo->exec("DROP TABLE IF EXISTS sermons");
    }
}
?> 