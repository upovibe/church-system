<?php
// api/database/seeders/event_seeder.php - Church Event Seeder

require_once __DIR__ . '/../connection.php';
require_once __DIR__ . '/../../models/EventModel.php';
require_once __DIR__ . '/../../helpers/SlugHelper.php';

class EventSeeder {
    private $pdo;
    private $eventModel;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->eventModel = new EventModel($pdo);
    }

    public function run() {
        echo "Seeding church events...\n";
        
        $events = [
            [
                'title' => 'Sunday Worship Service',
                'description' => 'Join us for our weekly worship service featuring prayer, praise, and biblical teaching. All are welcome!',
                'start_date' => date('Y-m-d 09:00:00', strtotime('next Sunday')),
                'end_date' => date('Y-m-d 11:00:00', strtotime('next Sunday')),
                'category' => 'service',
                'status' => 'upcoming',
                'location' => 'Main Sanctuary'
            ],
            [
                'title' => 'Bible Study Fellowship',
                'description' => 'Mid-week Bible study for adults exploring the book of Romans. Come grow in your faith and fellowship.',
                'start_date' => date('Y-m-d 19:00:00', strtotime('next Wednesday')),
                'end_date' => date('Y-m-d 20:30:00', strtotime('next Wednesday')),
                'category' => 'bible_study',
                'status' => 'upcoming',
                'location' => 'Fellowship Hall'
            ],
            [
                'title' => 'Youth Group Meeting',
                'description' => 'Teens join us for games, worship, and relevant Bible teaching just for you!',
                'start_date' => date('Y-m-d 18:00:00', strtotime('next Friday')),
                'end_date' => date('Y-m-d 20:00:00', strtotime('next Friday')),
                'category' => 'youth',
                'status' => 'upcoming',
                'location' => 'Youth Center'
            ],
            [
                'title' => 'Men\'s Prayer Breakfast',
                'description' => 'Fellowship and prayer time for men of all ages. Breakfast provided.',
                'start_date' => date('Y-m-d 08:00:00', strtotime('next Saturday')),
                'end_date' => date('Y-m-d 09:30:00', strtotime('next Saturday')),
                'category' => 'fellowship',
                'status' => 'upcoming',
                'location' => 'Church Cafeteria'
            ],
            [
                'title' => 'Women\'s Ministry Gathering',
                'description' => 'Monthly meeting for women featuring guest speaker on "Finding Peace in Busy Seasons".',
                'start_date' => date('Y-m-d 10:00:00', strtotime('+2 weeks Saturday')),
                'end_date' => date('Y-m-d 12:00:00', strtotime('+2 weeks Saturday')),
                'category' => 'fellowship',
                'status' => 'upcoming',
                'location' => 'Fellowship Hall'
            ]
        ];

        $insertedCount = 0;
        foreach ($events as $eventData) {
            try {
                // Generate slug from title
                $eventData['slug'] = generateSlug($eventData['title']);
                $eventData['slug'] = ensureUniqueSlug($this->pdo, $eventData['slug'], 'events', 'slug');
                
                // Set default values
                $eventData['is_active'] = true;
                
                // Create event
                $eventId = $this->eventModel->create($eventData);
                $insertedCount++;
                
                echo "Created event: {$eventData['title']} (ID: {$eventId})\n";
                
            } catch (Exception $e) {
                echo "Error creating event '{$eventData['title']}': " . $e->getMessage() . "\n";
            }
        }
        
        echo "Successfully seeded {$insertedCount} church events.\n";
    }

    public function clear() {
        echo "Clearing events table...\n";
        try {
            $this->pdo->exec("DELETE FROM events");
            $this->pdo->exec("ALTER TABLE events AUTO_INCREMENT = 1");
            echo "Events table cleared successfully.\n";
        } catch (Exception $e) {
            echo "Error clearing events table: " . $e->getMessage() . "\n";
        }
    }
}

// Run seeder if called directly
if (php_sapi_name() === 'cli') {
    global $pdo;
    $seeder = new EventSeeder($pdo);
    
    if (isset($argv[1]) && $argv[1] === 'clear') {
        $seeder->clear();
    } else {
        $seeder->run();
    }
}
?>