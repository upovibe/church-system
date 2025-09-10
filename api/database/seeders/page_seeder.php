<?php
// api/database/seeders/page_seeder.php - Seeder for default pages

class PageSeeder
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function run()
    {
        echo "🌱 Seeding default pages...\n";

        $this->seedDefaultPages();

        echo "✅ Default pages seeded successfully!\n";
    }

    private function seedDefaultPages()
    {
        echo "📝 Seeding default pages...\n";

        $defaultPages = [
            // ===== GENERAL PAGES =====
            [
                'slug' => 'home',
                'name' => 'Home',
                'subtitle' => 'Welcome to our church community',
                'title' => 'A Place to Belong, Believe, and Become',
                'content' => '<h2>Welcome to Our Church</h2><p>We are a vibrant community of believers dedicated to worship, fellowship, and service. Our mission is to share God\'s love, grow in faith, and make a positive impact in the world through compassionate outreach and meaningful connections.</p><p>Join us as we journey together in faith, discovering God\'s purpose for our lives and building lasting relationships within our church family.</p>',
                'meta_description' => 'Welcome to our church - where faith comes alive. Join our community for worship, fellowship, and spiritual growth.',
                'category' => 'general',
                'is_active' => 1,
                'sort_order' => 1,
                'banner_image' => json_encode(['uploads/pages/82097_1_1753218234_687ffcbaa29d5.png', 'uploads/pages/BethelSongsnew_1_1753218235_687ffcbb73576.png', 'uploads/pages/sing2_1_1753218236_687ffcbca54d6.png'])
            ],
            [
                'slug' => 'contact',
                'name' => 'Contact',
                'subtitle' => 'How to reach us',
                'title' => 'Contact Us',
                'content' => '<h2>Get in Touch</h2><p>We welcome your questions, prayer requests, and inquiries. Our church staff is here to assist you with any information about our services, programs, or general church matters.</p><h3>Office Hours</h3><p>Monday - Friday: 9:00 AM - 5:00 PM<br>Saturday: 9:00 AM - 2:00 PM<br>Sunday: 8:00 AM - 1:00 PM</p><h3>Emergency Contact</h3><p>For urgent pastoral care needs outside office hours, please contact our emergency prayer line.</p>',
                'meta_description' => 'Contact our church for inquiries, prayer requests, or general information. Find our location, phone numbers, and office hours.',
                'category' => 'general',
                'is_active' => 1,
                'sort_order' => 2,
                'banner_image' => json_encode(['uploads/pages/5_1752713285_687848450g'])
            ],
            [
                'slug' => 'give',
                'name' => 'Give',
                'subtitle' => 'Supporting our ministry',
                'title' => 'Give to Our Church',
                'content' => '<h2>Supporting Our Ministry</h2><p>Your generous contributions help us continue our mission of spreading God\'s love and serving our community. Every gift, no matter the size, makes a difference in our ability to minister effectively and reach more people with the Gospel.</p><h3>Ways to Give</h3><ul><li><strong>Sunday Offering:</strong> During our worship services - place your offering in the collection baskets</li><li><strong>Online Giving:</strong> Secure online donations through our website</li><li><strong>Bank Transfer:</strong> Direct bank transfers to our church account</li><li><strong>Mobile Money:</strong> Convenient mobile money transfers</li><li><strong>Mail:</strong> Send checks to our church office</li><li><strong>Automatic Giving:</strong> Set up recurring donations for consistent support</li></ul><h3>Where Your Gifts Go</h3><p>Your donations support our various ministries, community outreach programs, facility maintenance, staff support, and mission work both locally and globally. We are committed to using every gift wisely and transparently.</p><h3>Giving Principles</h3><p>We believe in cheerful giving as an act of worship and obedience to God. Give as the Lord leads your heart, knowing that your contribution helps advance God\'s kingdom and blesses others in our community.</p><h3>Contact Us</h3><p>For questions about giving or to learn more about our financial stewardship, please contact our church office or speak with one of our pastors.</p>',
                'meta_description' => 'Support our church ministry through generous giving. Learn about different ways to contribute to our mission and make a difference in our community.',
                'category' => 'general',
                'is_active' => 1,
                'sort_order' => 3,
                'banner_image' => json_encode(['uploads/pages/5_1752713285_687848450g'])           
            ],
            // ===== ABOUT PAGES =====
            [
                'slug' => 'about-us',
                'name' => 'About Us',
                'subtitle' => 'Our story and heritage',
                'title' => 'Grow your faith with us',
                'content' => '<h2>Our Story</h2><p>Founded with a vision to share the Gospel and build a community of believers, our church has been serving and ministering to our community for many years. We have grown from a small congregation to a vibrant church family that impacts lives through God\'s love.</p><h3>Our Heritage</h3><p>With a rich history of faithful service and community involvement, we continue to build on our strong foundation while embracing God\'s call to reach new generations with the message of hope and salvation.</p><h3>Our Community</h3><p>We are proud of our diverse and inclusive community where people from various backgrounds come together to worship, grow in faith, and serve one another in love.</p>',
                'meta_description' => 'We are a vibrant community of believers dedicated to worship, fellowship, and service. Our mission is to share God\'s love, grow in faith, and make a positive impact in the world through compassionate outreach and meaningful connections.',
                'category' => 'about',
                'is_active' => 1,
                'sort_order' => 4,
                'banner_image' => json_encode(['uploads/pages/1c1dad70d491dc7f004638d8bb190765d313cd68_1753223192_68801018c39f1.jpg'])
            ],
            [
                'slug' => 'mission-vision',
                'name' => 'Mission & Vision',
                'subtitle' => 'Our mission and vision',
                'title' => 'Mission & Vision',
                'content' => '<h2>Our Mission</h2><p>To share the love of Christ, make disciples, and serve our community with compassion and grace. We strive to create an environment where people can encounter God, grow in their faith, and be equipped to live out their calling.</p><h2>Our Vision</h2><p>To be a beacon of hope and transformation in our community, leading people to Christ and helping them become fully devoted followers who impact the world for God\'s glory.</p><h3>Core Values</h3><ul><li>Biblical teaching and spiritual growth</li><li>Authentic worship and prayer</li><li>Community and fellowship</li><li>Service and outreach</li><li>Generosity and stewardship</li></ul>',
                'meta_description' => 'Discover our church\'s mission, vision, and core values that guide our ministry and commitment to serving God and our community.',
                'category' => 'about',
                'is_active' => 1,
                'sort_order' => 5,
                'banner_image' => json_encode(['uploads/pages/Values_1752713298_6878485214266g'])
            ],
            [
                'slug' => 'connect',
                'name' => 'Connect',
                'subtitle' => 'Connect with us',
                'title' => 'Connect With Us',
                'content' => '<h2>Get in Touch</h2><p>We welcome your questions, prayer requests, and inquiries. Our church staff is here to assist you with any information about our services, programs, or general church matters.</p><h3>Office Hours</h3><p>Monday - Friday: 9:00 AM - 5:00 PM<br>Saturday: 9:00 AM - 2:00 PM<br>Sunday: 8:00 AM - 1:00 PM</p><h3>Emergency Contact</h3><p>For urgent pastoral care needs outside office hours, please contact our emergency prayer line.</p>',
                'meta_description' => 'Connect with our church for inquiries, prayer requests, or general information. Find our location, phone numbers, and office hours.',
                'category' => 'about',
                'is_active' => 1,
                'sort_order' => 6,
                'banner_image' => json_encode(['uploads/pages/Values_1752713314_6878486264g'])
            ],
            [
                'slug' => 'our-leaders',
                'name' => 'Leaders',
                'subtitle' => 'Meet our pastors and leaders',
                'title' => 'Our Leaders',
                'content' => '<h2>Leadership Team</h2><p>Our experienced pastoral team provides spiritual leadership and guidance, ensuring that our church remains faithful to God\'s Word and mission.</p><h3>Pastoral Staff</h3><p>Our dedicated pastors and ministry leaders work tirelessly to shepherd our congregation and provide excellent spiritual care and teaching.</p><h3>Ministry Leaders</h3><p>Our qualified and experienced ministry leaders are passionate about serving God and committed to helping each member grow in their faith. They bring diverse gifts and expertise to create meaningful ministry experiences.</p><h3>Support Staff</h3><p>Our support staff plays a crucial role in maintaining a welcoming, organized, and nurturing environment for our church family.</p>',
                'meta_description' => 'Meet our dedicated team of pastors, ministry leaders, and support staff who work together to serve our church community.',
                'category' => 'about',
                'is_active' => 1,
                'sort_order' => 7,
                'banner_image' => json_encode(['uploads/pages/Values_1752713324_68784868g'])
            ],
            [
                'slug' => 'tenants-beliefs',
                'name' => 'Tenants & Beliefs',
                'subtitle' => 'Our core beliefs and values',
                'title' => 'Tenants & Beliefs',
                'content' => '<h2>Our Vision & Beliefs</h2><p>A church where people encounter God, grow in faith, and impact the world. Our vision is to become a vibrant, Christ-centered community that passionately pursues God\'s presence and reflects His love to the world around us.</p><h3>Our Vision</h3><p>We envision a church that is not just a place to gather, but a movement of people living out their faith with boldness and joy. We see a church where worship is passionate, prayer is powerful, and the Word of God is taught with clarity and conviction.</p><h3>Core Beliefs</h3><ul><li><strong>Biblical Authority:</strong> We believe in the authority and sufficiency of God\'s Word</li><li><strong>Salvation by Grace:</strong> We believe salvation comes through faith in Jesus Christ alone</li><li><strong>Holy Spirit:</strong> We believe in the presence and power of the Holy Spirit</li><li><strong>Community:</strong> We believe in the importance of Christian fellowship and community</li><li><strong>Mission:</strong> We believe in sharing God\'s love with the world</li></ul><h3>Our Values</h3><p>We are committed to authentic worship, biblical teaching, prayer, fellowship, and service. We strive to create an environment where people can grow spiritually and develop meaningful relationships with God and others.</p>',
                'meta_description' => 'Discover our church\'s core beliefs, values, and vision for creating a vibrant Christ-centered community.',
                'category' => 'about',
                'is_active' => 1,
                'sort_order' => 8,
                'banner_image' => json_encode(['uploads/pages/Values_1752713298_6878485214266g'])
            ],
            [
                'slug' => 'ministries',
                'name' => 'Ministries',
                'subtitle' => 'Serving God and community',
                'title' => 'Our Ministries',
                'content' => '<h2>Ministry Opportunities</h2><p>Discover the various ways you can get involved and serve in our church community. We believe everyone has gifts and talents to contribute to God\'s work.</p><h3>Children\'s Ministry</h3><p>Nurturing the faith of our youngest members through age-appropriate teaching, activities, and care.</p><h3>Youth Ministry</h3><p>Engaging teenagers in faith development, fellowship, and service opportunities.</p><h3>Adult Ministries</h3><p>Bible studies, small groups, and fellowship opportunities for adults at every stage of life.</p><h3>Outreach & Missions</h3><p>Local and global mission opportunities to share God\'s love and serve those in need.</p><h3>Worship Ministry</h3><p>Music, technical support, and creative arts that enhance our worship experience.</p>',
                'meta_description' => 'Explore our various ministries and find opportunities to serve, grow, and connect within our church community.',
                'category' => 'community',
                'is_active' => 1,
                'sort_order' => 9,
                'banner_image' => json_encode(['uploads/pages/About_1752713342_6878487ef2458.jpg'])
            ],
            [
                'slug' => 'life-group',
                'name' => 'Life Group',
                'subtitle' => 'Life group',
                'title' => 'Life Group',
                'content' => '<h2>Life Group</h2><p>Life group</p>',
                'meta_description' => 'Life group',
                'category' => 'community',
                'is_active' => 1,
                'sort_order' => 10,
                'banner_image' => json_encode(['uploads/pages/5_1752713285_687848450g'])
            ],

            // ===== GALLERY PAGES =====
            [
                'slug' => 'gallery',
                'name' => 'Gallery',
                'subtitle' => 'Photos and videos',
                'title' => 'Gallery',
                'content' => '<h2>Church Gallery</h2><p>Explore our visual journey through photos and videos that capture the spirit, activities, and fellowship of our church community.</p><h3>What You\'ll Find</h3><p>Our gallery showcases various aspects of church life including worship services, ministry events, community gatherings, and special celebrations.</p><h3>Photo Collections</h3><p>Browse through our photo collections organized by events, ministries, and church activities.</p><h3>Video Highlights</h3><p>Watch video highlights from special services, ministry events, and church activities.</p>',
                'meta_description' => 'Explore our church gallery featuring photos and videos of events, services, and community activities.',
                'category' => 'gallery',
                'is_active' => 1,
                'sort_order' => 11,
                'banner_image' => json_encode(['uploads/pages/5_1752713285_687848450g'])
            ],
            // ===== HIGHLIGHTS PAGES =====
            [
                'slug' => 'events',
                'name' => 'Events',
                'subtitle' => 'Church events and activities',
                'title' => 'Events',
                'content' => '<h2>Church Events & Activities</h2><p>Throughout the year, we host various events that bring our church family together and celebrate our faith journey.</p><h3>Regular Events</h3><ul><li><strong>Sunday Services:</strong> Weekly worship and teaching</li><li><strong>Bible Study:</strong> In-depth study of God\'s Word</li><li><strong>Prayer Meetings:</strong> Corporate prayer and intercession</li><li><li><strong>Fellowship Events:</strong> Building relationships and community</li><li><strong>Ministry Training:</strong> Equipping believers for service</li></ul><h3>Special Events</h3><p>We organize special events including revival services, conferences, mission trips, and community outreach programs.</p><h3>Seasonal Celebrations</h3><p>Join us for meaningful celebrations during Christmas, Easter, and other important seasons of the church calendar.</p>',
                'meta_description' => 'Stay updated with all the exciting events and activities happening at our church throughout the year.',
                'category' => 'community',
                'is_active' => 1,
                'sort_order' => 12,
                'banner_image' => json_encode(['uploads/pages/1_1752790102_68797456e2b8c.jpg'])
            ],
            [
                'slug' => 'sermons',
                'name' => 'Sermons',
                'subtitle' => 'Messages and teachings',
                'title' => 'Sermons',
                'content' => '<h2>Sermons</h2><p>Explore our collection of sermons and messages delivered by our pastors and guest speakers. Be encouraged and challenged by biblical teaching and practical insights for daily living.</p><h3>Recent Messages</h3><p>Listen to our latest sermons and teachings from Sunday services and special events.</p><h3>Sermon Series</h3><p>Follow along with our current sermon series and dive deeper into specific topics and biblical themes.</p><h3>Archived Messages</h3><p>Access our library of past sermons and teachings for continued spiritual growth and study.</p>',
                'meta_description' => 'Browse sermons and messages from our church, featuring biblical teaching and encouragement.',
                'category' => 'highlights',
                'is_active' => 1,
                'sort_order' => 13,
                'banner_image' => json_encode(['uploads/pages/sermons_default.jpg'])
            ],
            [
                'slug' => 'testimonials',
                'name' => 'Testimonials',
                'subtitle' => 'Stories of faith and transformation',
                'title' => 'Testimonials',
                'content' => '<h2>Testimonials</h2><p>Read inspiring stories and testimonies from members of our church family. Discover how faith, ministry, and fellowship have impacted lives and brought about transformation.</p><h3>Faith Stories</h3><p>Personal testimonies of how God has worked in the lives of our church members.</p><h3>Ministry Impact</h3><p>Stories of how our various ministries have touched lives and made a difference.</p><h3>Community Transformation</h3><p>Testimonies of how our church community has supported and encouraged individuals and families.</p>',
                'meta_description' => 'Inspiring testimonials and stories of faith from our church community.',
                'category' => 'highlights',
                'is_active' => 1,
                'sort_order' => 14,
                'banner_image' => json_encode(['uploads/pages/testimonials_default.jpg'])
            ],
            [
                'slug' => 'photos',
                'name' => 'Photos',
                'subtitle' => 'Photo gallery',
                'title' => 'Photos',
                'content' => '<h2>Photo Gallery</h2><p>Browse through our collection of photographs that capture the vibrant life and activities of our church community.</p><h3>Worship Services</h3><p>Photos from our Sunday services, special worship events, and prayer meetings.</p><h3>Ministry Activities</h3><p>Images from our various ministries, Bible studies, and fellowship gatherings.</p><h3>Community Events</h3><p>Photos from church picnics, outreach events, and community service activities.</p><h3>Church Life</h3><p>Scenes from daily church life, fellowship moments, and special celebrations.</p>',
                'meta_description' => 'Browse our photo gallery featuring church events, services, and community activities.',
                'category' => 'gallery',
                'is_active' => 1,
                'sort_order' => 15,
                'banner_image' => json_encode(['uploads/pages/About_1752713342_6878487ef2458.jpg'])
            ],
            [
                'slug' => 'videos',
                'name' => 'Videos',
                'subtitle' => 'Video gallery',
                'title' => 'Videos',
                'content' => '<h2>Video Gallery</h2><p>Watch videos showcasing our church services, ministry events, and community activities.</p><h3>Worship Services</h3><p>Video recordings of our Sunday services, special worship events, and prayer meetings.</p><h3>Ministry Highlights</h3><p>Highlights from our various ministries, Bible studies, and fellowship events.</p><h3>Teaching Content</h3><p>Educational videos, Bible study materials, and spiritual teaching resources.</h3><h3>Community Outreach</h3><p>Videos featuring our community involvement, mission work, and outreach programs.</p>',
                'meta_description' => 'Watch videos from church services, ministry events, and community activities.',
                'category' => 'gallery',
                'is_active' => 1,
                'sort_order' => 16,
                'banner_image' => json_encode(['uploads/pages/About_1752713456_687848f08022c.jpg'])
            ],
        ];

        foreach ($defaultPages as $page) {
            $this->seedPage($page);
        }
    }

    private function seedPage($pageData)
    {
        try {
            // Check if page already exists
            $stmt = $this->pdo->prepare('SELECT id FROM pages WHERE slug = ?');
            $stmt->execute([$pageData['slug']]);

            if ($stmt->fetch()) {
                echo "⚠️  Page '{$pageData['slug']}' already exists\n";
                return;
            }

            $stmt = $this->pdo->prepare('
                INSERT INTO pages (slug, name, subtitle, title, content, meta_description, category, is_active, sort_order, banner_image, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ');

            $stmt->execute([
                $pageData['slug'],
                $pageData['name'],
                $pageData['subtitle'] ?? '',
                $pageData['title'],
                $pageData['content'],
                $pageData['meta_description'],
                $pageData['category'],
                $pageData['is_active'],
                $pageData['sort_order'],
                $pageData['banner_image']
            ]);

            echo "✅ Seeded page: {$pageData['slug']}\n";
        } catch (Exception $e) {
            echo "❌ Error seeding page {$pageData['slug']}: " . $e->getMessage() . "\n";
        }
    }
} 