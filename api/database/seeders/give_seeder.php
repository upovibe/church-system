<?php
// api/database/seeders/give_seeder.php - Seeder for give table

class GiveSeeder
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function run()
    {
        echo "🌱 Seeding give entries...\n";
        $this->seedGiveEntries();
        echo "✅ Give entries seeded successfully!\n";
    }

    private function seedGiveEntries()
    {
        echo "💰 Seeding give payment methods...\n";

        $giveEntries = [
            [
                'title' => 'Paystack',
                'text' => 'Make secure online donations using Paystack. Accepts all major credit cards, bank transfers, and mobile money.',
                'image' => 'uploads/give/paystack_qr.png',
                'links' => json_encode([
                    [
                        'name' => 'Pay with Paystack',
                        'url' => 'https://paystack.com/pay/church-donations',
                        'type' => 'payment'
                    ]
                ])
            ],
            [
                'title' => 'Stripe',
                'text' => 'Donate securely using Stripe payment gateway. Supports credit cards, debit cards, and digital wallets.',
                'image' => 'uploads/give/stripe_qr.png',
                'links' => json_encode([
                    [
                        'name' => 'Pay with Stripe',
                        'url' => 'https://buy.stripe.com/church-donations',
                        'type' => 'payment'
                    ]
                ])
            ],
            [
                'title' => 'Mobile Money',
                'text' => 'Send donations via mobile money. Scan the QR code or use the payment link to give instantly.',
                'image' => 'uploads/give/mobile_money_qr.png',
                'links' => json_encode([
                    [
                        'name' => 'MTN Mobile Money',
                        'url' => 'https://payments.mtn.com/church-donations',
                        'type' => 'mobile_money'
                    ],
                    [
                        'name' => 'Vodafone Cash',
                        'url' => 'https://payments.vodafone.com/church-donations',
                        'type' => 'mobile_money'
                    ]
                ])
            ],
            [
                'title' => 'Bank Transfer',
                'text' => 'Transfer donations directly to our bank account. Use the QR code to get bank details or click the link.',
                'image' => 'uploads/give/bank_transfer_qr.png',
                'links' => json_encode([
                    [
                        'name' => 'Bank Details',
                        'url' => 'https://church.com/bank-details',
                        'type' => 'bank_transfer'
                    ]
                ])
            ],
            [
                'title' => 'PayPal',
                'text' => 'Donate using your PayPal account. Quick and secure payments from anywhere in the world.',
                'image' => 'uploads/give/paypal_qr.png',
                'links' => json_encode([
                    [
                        'name' => 'Pay with PayPal',
                        'url' => 'https://paypal.me/churchdonations',
                        'type' => 'payment'
                    ]
                ])
            ]
        ];

        foreach ($giveEntries as $giveEntry) {
            $this->seedGiveEntry($giveEntry);
        }
    }

    private function seedGiveEntry($data)
    {
        try {
            // Check if give entry already exists
            $stmt = $this->pdo->prepare('SELECT id FROM give WHERE title = ?');
            $stmt->execute([$data['title']]);

            if ($stmt->fetch()) {
                echo "⚠️  Give entry '{$data['title']}' already exists\n";
                return;
            }

            $stmt = $this->pdo->prepare('
                INSERT INTO give (title, text, image, links, is_active, created_at, updated_at) 
                VALUES (?, ?, ?, ?, 1, NOW(), NOW())
            ');

            $stmt->execute([
                $data['title'],
                $data['text'],
                $data['image'],
                $data['links']
            ]);

            echo "✅ Seeded give entry: {$data['title']}\n";
        } catch (Exception $e) {
            echo "❌ Error seeding give entry {$data['title']}: " . $e->getMessage() . "\n";
        }
    }
}
?>
