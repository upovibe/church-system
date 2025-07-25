<?php
// api/database/seeders/news_seeder.php - News seeder

require_once __DIR__ . '/../connection.php';
require_once __DIR__ . '/../../models/NewsModel.php';
require_once __DIR__ . '/../../helpers/SlugHelper.php';

class NewsSeeder {
    private $pdo;
    private $newsModel;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->newsModel = new NewsModel($pdo);
    }

    public function run() {
        echo "Seeding news...\n";
        
        $news = [
            [
                'title' => 'Youth Ministry',
                'content' => '<p>Pi Youth is a place for Middle and High Schoolers to experience authentic community and step into the purpose God has for them!</p>',
                'is_active' => true
            ],
            [
                'title' => 'Children',
                'content' => '<p>Our children\'s ministry, Pi Kids, is dedicated to providing a safe, fun, and Christ-centered environment for all children to grow and thrive in their relationships with Jesus.</p>',
                'is_active' => true
            ],
            [
                'title' => 'Women',
                'content' => '<p>PIWC Franklin City Women\'s Ministry, Women Who Surpass Them All (WOSTTA!), is committed to the spiritual, physical, and emotional growth of every woman and dedicated to embracing the beauty of our many diversities.</p>',
                'is_active' => true
            ],
            [
                'title' => 'Men',
                'content' => '<p>PIWC\'s Men\'s Ministry, exists to activate, challenge, and train men for the journey of restoring authentic manhood.</p>',
                'is_active' => true
            ],
            [
                'title' => 'Outreach (Evangelism Ministry)',
                'content' => '<p>PIWC\'s Outreach Ministry, is dedicated to seeing our Cities and every campus reached with the gospel.</p>',
                'is_active' => true
            ]            
        ];

        $insertedCount = 0;
        foreach ($news as $newsData) {
            try {
                // Generate slug from title
                $newsData['slug'] = generateSlug($newsData['title']);
                $newsData['slug'] = ensureUniqueSlug($this->pdo, $newsData['slug'], 'news', 'slug');
                
                // Set default values
                if (!isset($newsData['is_active'])) {
                    $newsData['is_active'] = true;
                }
                
                // Create news
                $newsId = $this->newsModel->create($newsData);
                $insertedCount++;
                
                echo "Created news: {$newsData['title']} (ID: {$newsId})\n";
                
            } catch (Exception $e) {
                echo "Error creating news '{$newsData['title']}': " . $e->getMessage() . "\n";
            }
        }
        
        echo "Successfully seeded {$insertedCount} news articles.\n";
    }

    public function clear() {
        echo "Clearing news table...\n";
        try {
            $this->pdo->exec("DELETE FROM news");
            $this->pdo->exec("ALTER TABLE news AUTO_INCREMENT = 1");
            echo "News table cleared successfully.\n";
        } catch (Exception $e) {
            echo "Error clearing news table: " . $e->getMessage() . "\n";
        }
    }
}

// Run seeder if called directly
if (php_sapi_name() === 'cli') {
    global $pdo;
    $seeder = new NewsSeeder($pdo);
    
    if (isset($argv[1]) && $argv[1] === 'clear') {
        $seeder->clear();
    } else {
        $seeder->run();
    }
}
?> 