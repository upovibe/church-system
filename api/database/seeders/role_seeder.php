<?php
// api/database/seeders/role_seeder.php - Seeder for default roles

class RoleSeeder
{
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function run() {
        echo "🌱 Seeding default roles...\n";
        $roles = [
            ['admin', 'System administrator with full access'],
            ['pastor', 'Pastor with spiritual and administrative oversight'],
            ['elder', 'Elder with leadership and decision-making responsibilities'],
            ['deacon', 'Deacon responsible for service and support roles'],
            ['member', 'Registered church member with access to member resources'],
            ['guest', 'Guest with limited access to public resources']
        ];
        foreach ($roles as $role) {
            $stmt = $this->pdo->prepare('SELECT id FROM roles WHERE name = ?');
            $stmt->execute([$role[0]]);
            if ($stmt->fetch()) {
                echo "⚠️  Role '{$role[0]}' already exists\n";
                continue;
            }
            $stmt = $this->pdo->prepare('INSERT INTO roles (name, description, created_at, updated_at) VALUES (?, ?, NOW(), NOW())');
            $stmt->execute([$role[0], $role[1]]);
            echo "✅ Seeded role: {$role[0]}\n";
        }
        echo "✅ Default roles seeded successfully!\n";
    }
} 