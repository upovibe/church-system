<?php
// api/database/seeders/life_group_seeder.php - Seeder for life_groups table

class LifeGroupSeeder
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function run()
    {
        echo "🌱 Seeding life groups...\n";
        $this->seedLifeGroups();
        echo "✅ Life groups seeded successfully!\n";
    }

    private function seedLifeGroups()
    {
        echo "📝 Seeding sample life groups...\n";

        $lifeGroups = [
            [
                'title' => 'Young Adults Fellowship',
                'slug' => 'young-adults-fellowship',
                'description' => 'A vibrant community for young adults aged 18-35. We meet weekly to study God\'s Word, build meaningful relationships, and support each other in our faith journey.',
                'banner' => 'uploads/life-groups/young-adults-banner.jpg',
                'link' => 'https://meet.google.com/abc-defg-hij'
            ],
            [
                'title' => 'Women\'s Bible Study',
                'slug' => 'womens-bible-study',
                'description' => 'Join our women\'s group for in-depth Bible study, prayer, and fellowship. We explore God\'s Word together and encourage one another in our daily walk with Christ.',
                'banner' => 'uploads/life-groups/womens-study-banner.jpg',
                'link' => 'https://meet.google.com/xyz-uvw-123'
            ],
            [
                'title' => 'Men\'s Accountability Group',
                'slug' => 'mens-accountability-group',
                'description' => 'A supportive environment for men to grow spiritually, build authentic relationships, and hold each other accountable in our faith and daily lives.',
                'banner' => 'uploads/life-groups/mens-group-banner.jpg',
                'link' => 'https://meet.google.com/men-group-456'
            ],
            [
                'title' => 'Family Life Group',
                'slug' => 'family-life-group',
                'description' => 'Perfect for families with children. We focus on strengthening family bonds through faith, sharing parenting experiences, and creating lasting friendships.',
                'banner' => 'uploads/life-groups/family-group-banner.jpg',
                'link' => 'https://meet.google.com/family-789'
            ]
        ];

        foreach ($lifeGroups as $lifeGroup) {
            $this->seedLifeGroup($lifeGroup);
        }
    }

    private function seedLifeGroup($data)
    {
        try {
            // Check if life group already exists
            $stmt = $this->pdo->prepare('SELECT id FROM life_groups WHERE slug = ?');
            $stmt->execute([$data['slug']]);

            if ($stmt->fetch()) {
                echo "⚠️  Life group '{$data['slug']}' already exists\n";
                return;
            }

            $stmt = $this->pdo->prepare('
                INSERT INTO life_groups (title, slug, description, banner, link, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())
            ');

            $stmt->execute([
                $data['title'],
                $data['slug'],
                $data['description'],
                $data['banner'],
                $data['link']
            ]);

            echo "✅ Seeded life group: {$data['slug']}\n";
        } catch (Exception $e) {
            echo "❌ Error seeding life group {$data['slug']}: " . $e->getMessage() . "\n";
        }
    }
} 