<?php
// api/database/seeders/gallery_seeder.php - Gallery seeder

require_once __DIR__ . '/../connection.php';
require_once __DIR__ . '/../../models/GalleryModel.php';
require_once __DIR__ . '/../../helpers/SlugHelper.php';

class GallerySeeder {
    private $pdo;
    private $galleryModel;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->galleryModel = new GalleryModel($pdo);
    }

    public function run() {
        echo "Seeding galleries...\n";
        
        $galleries = [
            [
                'name' => 'Sunday Worship Services',
                'description' => 'A collection of memorable moments from our weekly worship services, featuring praise, prayer, and biblical teaching.',
                'images' => [],
                'is_active' => true
            ],
            [
                'name' => 'Baptism Ceremonies',
                'description' => 'Photos from our baptism services, capturing the joyful moments of new believers taking their public stand for Christ.',
                'images' => [],
                'is_active' => true
            ],
            [
                'name' => 'Church Events',
                'description' => 'Highlights from our various church events including conferences, retreats, and special celebrations.',
                'images' => [],
                'is_active' => true
            ],
            [
                'name' => 'Ministry Activities',
                'description' => 'Images from our various ministries including children\'s ministry, youth group, and adult Bible studies.',
                'images' => [],
                'is_active' => true
            ],
            [
                'name' => 'Community Outreach',
                'description' => 'Photos from our community service activities and outreach programs where we share God\'s love with others.',
                'images' => [],
                'is_active' => true
            ],
            [
                'name' => 'Church Life',
                'description' => 'Daily life at our church, including fellowship gatherings, prayer meetings, and community building activities.',
                'images' => [],
                'is_active' => true
            ],
            [
                'name' => 'Mission Trips',
                'description' => 'Photos from our mission trips and outreach activities, both local and international.',
                'images' => [],
                'is_active' => true
            ],
            [
                'name' => 'Pastor Appreciation',
                'description' => 'Special moments celebrating our dedicated pastors and their faithful service to our church community.',
                'images' => [],
                'is_active' => true
            ],
            [
                'name' => 'Church Celebrations',
                'description' => 'Photos from special church celebrations including anniversaries, dedications, and holiday services.',
                'images' => [],
                'is_active' => true
            ],
            [
                'name' => 'Fellowship Events',
                'description' => 'Photos from various fellowship activities and community building events that strengthen our church family.',
                'images' => [],
                'is_active' => true
            ]
        ];

        $insertedCount = 0;
        foreach ($galleries as $galleryData) {
            try {
                // Generate slug from name
                $galleryData['slug'] = generateSlug($galleryData['name']);
                $galleryData['slug'] = ensureUniqueSlug($this->pdo, $galleryData['slug'], 'galleries', 'slug');
                
                // Set default values
                if (!isset($galleryData['is_active'])) {
                    $galleryData['is_active'] = true;
                }
                
                // Create gallery
                $galleryId = $this->galleryModel->create($galleryData);
                $insertedCount++;
                
                echo "Created gallery: {$galleryData['name']} (ID: {$galleryId})\n";
                
            } catch (Exception $e) {
                echo "Error creating gallery '{$galleryData['name']}': " . $e->getMessage() . "\n";
            }
        }
        
        echo "Successfully seeded {$insertedCount} galleries.\n";
    }

    public function clear() {
        echo "Clearing galleries table...\n";
        try {
            $this->pdo->exec("DELETE FROM galleries");
            $this->pdo->exec("ALTER TABLE galleries AUTO_INCREMENT = 1");
            echo "Galleries table cleared successfully.\n";
        } catch (Exception $e) {
            echo "Error clearing galleries table: " . $e->getMessage() . "\n";
        }
    }
}

// Run seeder if called directly
if (php_sapi_name() === 'cli') {
    global $pdo;
    $seeder = new GallerySeeder($pdo);
    
    if (isset($argv[1]) && $argv[1] === 'clear') {
        $seeder->clear();
    } else {
        $seeder->run();
    }
}
?> 