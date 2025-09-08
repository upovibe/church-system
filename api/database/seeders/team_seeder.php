<?php
// api/database/seeders/team_seeder.php

require_once __DIR__ . '/../connection.php';
require_once __DIR__ . '/../../models/TeamModel.php';

class TeamSeeder {
    private $pdo;
    private $teamModel;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->teamModel = new TeamModel($pdo);
    }

    public function run() {
        $teams = [
            [
                'name' => 'Pastor Daniel & Mrs. Faustina',
                'profile_image' => null,
                'position' => 'District Pastor',
                'department' => 'District Pastor',
                'is_active' => 1
            ],
            [
                'name' => 'Dr. John & Dr.(Mrs.) Christiana Ntumy',
                'profile_image' => null,
                'position' => 'Presiding Elder',
                'department' => 'Presiding Elder',
                'is_active' => 1
            ]
        ];

        foreach ($teams as $team) {
            try {
                $this->teamModel->create($team);
                echo "Created team member: {$team['name']} - {$team['position']}\n";
            } catch (Exception $e) {
                echo "Error creating team member {$team['name']}: " . $e->getMessage() . "\n";
            }
        }

        echo "Team seeding completed!\n";
    }
}

// Run seeder if called directly
if (basename(__FILE__) == basename($_SERVER['SCRIPT_NAME'])) {
    require_once __DIR__ . '/../connection.php';
    global $pdo;
    $seeder = new TeamSeeder($pdo);
    $seeder->run();
}
?> 