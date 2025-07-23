<?php
// api/database/seeders/testimonial_seeder.php - Seeder for testimonials table

class TestimonialSeeder
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function run()
    {
        echo "🌱 Seeding testimonials...\n";
        $this->seedTestimonials();
        echo "✅ Testimonials seeded successfully!\n";
    }

    private function seedTestimonials()
    {
        echo "📝 Seeding sample testimonials...\n";

        $testimonials = [
            [
                'title' => 'A Life Transformed',
                'slug' => 'a-life-transformed',
                'description' => 'I came to this community at a low point in my life. Through the support and encouragement here, I found hope and purpose again.'
            ],
            [
                'title' => 'Faith Restored',
                'slug' => 'faith-restored',
                'description' => 'After years of searching, I finally found a place where my faith could grow. The sermons and fellowship have been a blessing.'
            ],
            [
                'title' => 'Answered Prayers',
                'slug' => 'answered-prayers',
                'description' => 'I witnessed a miracle in my family after the church prayed for us. I am forever grateful for this loving community.'
            ],
            [
                'title' => 'A Welcoming Family',
                'slug' => 'a-welcoming-family',
                'description' => 'From my first visit, I felt welcomed and accepted. This church truly feels like home.'
            ]
        ];

        foreach ($testimonials as $testimonial) {
            $this->seedTestimonial($testimonial);
        }
    }

    private function seedTestimonial($data)
    {
        try {
            // Check if testimonial already exists
            $stmt = $this->pdo->prepare('SELECT id FROM testimonials WHERE slug = ?');
            $stmt->execute([$data['slug']]);

            if ($stmt->fetch()) {
                echo "⚠️  Testimonial '{$data['slug']}' already exists\n";
                return;
            }

            $stmt = $this->pdo->prepare('
                INSERT INTO testimonials (title, slug, description, created_at, updated_at)
                VALUES (?, ?, ?, NOW(), NOW())
            ');

            $stmt->execute([
                $data['title'],
                $data['slug'],
                $data['description']
            ]);

            echo "✅ Seeded testimonial: {$data['slug']}\n";
        } catch (Exception $e) {
            echo "❌ Error seeding testimonial {$data['slug']}: " . $e->getMessage() . "\n";
        }
    }
} 