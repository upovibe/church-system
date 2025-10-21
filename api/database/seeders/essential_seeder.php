<?php
// api/database/seeders/essential_seeder.php - Essential church system seeder

class EssentialSeeder
{
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function run() {
        echo "⛪ Seeding church essential system components...\n";
        
        // Run existing seeders in order
        $this->runSeeder('role_seeder.php');
        $this->runSeeder('user_seeder.php');
        $this->runSeeder('page_seeder.php');
        $this->runSeeder('settings_seeder.php');
        
        echo "✅ Church essential system components seeded successfully!\n";
    }
    
    private function runSeeder($seederFile) {
        $seederPath = __DIR__ . '/' . $seederFile;
        
        if (file_exists($seederPath)) {
            echo "📦 Running $seederFile...\n";
            require_once $seederPath;
            
            // Extract class name from filename
            $className = str_replace('_seeder.php', '', $seederFile);
            $className = str_replace('_', ' ', $className);
            $className = ucwords($className);
            $className = str_replace(' ', '', $className) . 'Seeder';
            
            if (class_exists($className)) {
                $seeder = new $className($this->pdo);
                $seeder->run();
                echo "✅ $seederFile completed\n";
            } else {
                echo "⚠️  Class $className not found in $seederFile\n";
            }
        } else {
            echo "❌ Seeder file not found: $seederFile\n";
        }
    }
}
