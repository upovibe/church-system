<?php
// api/models/MinistryModel.php - Model for ministries

require_once __DIR__ . '/../core/BaseModel.php';

class MinistryModel extends BaseModel {
    protected $table = 'ministries';
    
    public function __construct($pdo) {
        parent::__construct($pdo);
    }
    
    /**
     * Get all ministries ordered by name
     */
    public function getAllMinistries() {
        $sql = "SELECT * FROM {$this->table} ORDER BY name ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * Get ministries as simple array of names
     */
    public function getMinistriesArray() {
        $sql = "SELECT name FROM {$this->table} ORDER BY name ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_COLUMN);
        return $results;
    }
    
    /**
     * Search ministries by name
     */
    public function searchMinistries($query) {
        $sql = "SELECT * FROM {$this->table} WHERE name LIKE ? ORDER BY name ASC";
        $stmt = $this->pdo->prepare($sql);
        $searchTerm = "%{$query}%";
        $stmt->execute([$searchTerm]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /**
     * Get ministry count
     */
    public function getCount() {
        $sql = "SELECT COUNT(*) as count FROM {$this->table}";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['count'];
    }
}
?>