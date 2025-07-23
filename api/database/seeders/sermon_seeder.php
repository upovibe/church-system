<?php
// api/database/seeders/sermon_seeder.php - Sermon seeder

require_once __DIR__ . '/../connection.php';
require_once __DIR__ . '/../../models/SermonModel.php';
require_once __DIR__ . '/../../helpers/SlugHelper.php';

class SermonSeeder {
    private $pdo;
    private $sermonModel;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->sermonModel = new SermonModel($pdo);
    }

    public function run() {
        echo "Seeding sermons...\n";
        $sermons = [
            [
                'title' => 'The Power of Faith',
                'description' => 'A sermon on the importance and impact of faith in our lives.',
                'content' => 'Faith can move mountains. In this sermon, we explore biblical examples and practical steps to strengthen our faith.',
                'speaker' => 'Rev. John Doe',
                'date_preached' => '2024-07-21',
                'video_links' => ['https://www.youtube.com/watch?v=example1'],
                'audio_links' => ['https://www.example.com/audio/faith.mp3'],
                'images' => ['sermons/faith1.jpg', 'sermons/faith2.jpg'],
                'is_active' => 1
            ],
            [
                'title' => 'Hope in Times of Trouble',
                'description' => 'Finding hope and encouragement during difficult seasons.',
                'content' => 'No matter the storm, God is our anchor. This sermon provides encouragement and scriptural references for hope.',
                'speaker' => 'Pastor Jane Smith',
                'date_preached' => '2024-07-14',
                'video_links' => ['https://www.youtube.com/watch?v=example2'],
                'audio_links' => ['https://www.example.com/audio/hope.mp3'],
                'images' => ['sermons/hope1.jpg'],
                'is_active' => 1
            ],
            [
                'title' => 'Love One Another',
                'description' => 'A message on the commandment to love and its practical application.',
                'content' => 'Love is the greatest commandment. This sermon discusses how to love others as Christ loves us.',
                'speaker' => 'Bishop Mark Lee',
                'date_preached' => '2024-07-07',
                'video_links' => ['https://www.youtube.com/watch?v=example3'],
                'audio_links' => ['https://www.example.com/audio/love.mp3'],
                'images' => ['sermons/love1.jpg', 'sermons/love2.jpg'],
                'is_active' => 1
            ],
            [
                'title' => 'Walking in Obedience',
                'description' => 'A sermon about the blessings and challenges of obeying God’s word.',
                'content' => 'Obedience is better than sacrifice. This message explores stories of obedience in the Bible and how we can apply them today.',
                'speaker' => 'Pastor Grace Okafor',
                'date_preached' => '2024-06-30',
                'video_links' => ['https://www.youtube.com/watch?v=example4'],
                'audio_links' => ['https://www.example.com/audio/obedience.mp3'],
                'images' => ['sermons/obedience1.jpg'],
                'is_active' => 1
            ],
            [
                'title' => 'The Joy of Giving',
                'description' => 'Exploring the biblical principle of generosity and its rewards.',
                'content' => 'Giving is an act of worship. This sermon highlights the joy and blessings that come from a generous heart.',
                'speaker' => 'Rev. Samuel Mensah',
                'date_preached' => '2024-06-23',
                'video_links' => ['https://www.youtube.com/watch?v=example5'],
                'audio_links' => ['https://www.example.com/audio/giving.mp3'],
                'images' => ['sermons/giving1.jpg', 'sermons/giving2.jpg'],
                'is_active' => 1
            ],
            [
                'title' => 'Peace in the Storm',
                'description' => 'How to find God’s peace in the midst of life’s storms.',
                'content' => 'Jesus calmed the storm, and He can calm the storms in our lives. This sermon encourages trust in God during difficult times.',
                'speaker' => 'Evangelist Linda Chukwu',
                'date_preached' => '2024-06-16',
                'video_links' => ['https://www.youtube.com/watch?v=example6'],
                'audio_links' => ['https://www.example.com/audio/peace.mp3'],
                'images' => ['sermons/peace1.jpg'],
                'is_active' => 1
            ]
        ];

        $insertedCount = 0;
        foreach ($sermons as $sermonData) {
            try {
                // Generate slug from title
                $sermonData['slug'] = generateSlug($sermonData['title']);
                $sermonData['slug'] = ensureUniqueSlug($this->pdo, $sermonData['slug'], 'sermons', 'slug');

                // Encode JSON fields
                $sermonData['video_links'] = json_encode($sermonData['video_links']);
                $sermonData['audio_links'] = json_encode($sermonData['audio_links']);
                $sermonData['images'] = json_encode($sermonData['images']);

                // Set default values
                if (!isset($sermonData['is_active'])) {
                    $sermonData['is_active'] = true;
                }

                // Create sermon
                $sermonId = $this->sermonModel->create($sermonData);
                $insertedCount++;
                echo "Created sermon: {$sermonData['title']} (ID: {$sermonId})\n";
            } catch (Exception $e) {
                echo "Error creating sermon '{$sermonData['title']}': " . $e->getMessage() . "\n";
            }
        }
        echo "Successfully seeded {$insertedCount} sermons.\n";
    }

    public function clear() {
        echo "Clearing sermons table...\n";
        try {
            $this->pdo->exec("DELETE FROM sermons");
            $this->pdo->exec("ALTER TABLE sermons AUTO_INCREMENT = 1");
            echo "Sermons table cleared successfully.\n";
        } catch (Exception $e) {
            echo "Error clearing sermons table: " . $e->getMessage() . "\n";
        }
    }
}

// Run seeder if called directly
if (php_sapi_name() === 'cli') {
    global $pdo;
    $seeder = new SermonSeeder($pdo);
    if (isset($argv[1]) && $argv[1] === 'clear') {
        $seeder->clear();
    } else {
        $seeder->run();
    }
}
?> 