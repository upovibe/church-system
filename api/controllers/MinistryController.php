<?php
// api/controllers/MinistryController.php - Controller for ministries management

require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../middlewares/RoleMiddleware.php';
require_once __DIR__ . '/../models/MinistryModel.php';
require_once __DIR__ . '/../models/UserLogModel.php';

class MinistryController {
    private $pdo;
    private $ministryModel;
    private $userLogModel;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->ministryModel = new MinistryModel($pdo);
        $this->userLogModel = new UserLogModel($pdo);
    }

    /**
     * Get all ministries (public)
     */
    public function index() {
        try {
            $ministries = $this->ministryModel->getAllMinistries();
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $ministries,
                'message' => 'Ministries retrieved successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error retrieving ministries: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get ministries as simple array (public)
     */
    public function getArray() {
        try {
            $ministries = $this->ministryModel->getMinistriesArray();
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $ministries,
                'message' => 'Ministries array retrieved successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error retrieving ministries array: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Create a new ministry (admin only)
     */
    public function store() {
        try {
            // Require admin authentication
            RoleMiddleware::requireAdmin($this->pdo);
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['name']) || empty(trim($data['name']))) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Ministry name is required'
                ]);
                return;
            }
            
            $ministryData = [
                'name' => trim($data['name'])
            ];
            
            $ministryId = $this->ministryModel->create($ministryData);
            
            if ($ministryId) {
                // Get the created ministry data
                $createdMinistry = $this->ministryModel->findById($ministryId);
                
                // Log the action
                $this->logAction('ministry_created', "Created ministry: {$ministryData['name']}", [
                    'ministry_id' => $ministryId,
                    'name' => $ministryData['name']
                ]);
                
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'data' => $createdMinistry,
                    'message' => 'Ministry created successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to create ministry'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error creating ministry: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get a specific ministry (public)
     */
    public function show($id) {
        try {
            $ministry = $this->ministryModel->findById($id);
            
            if (!$ministry) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Ministry not found'
                ]);
                return;
            }
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $ministry,
                'message' => 'Ministry retrieved successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error retrieving ministry: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Update a ministry (admin only)
     */
    public function update($id) {
        try {
            // Require admin authentication
            RoleMiddleware::requireAdmin($this->pdo);
            
            // Check if ministry exists
            $existingMinistry = $this->ministryModel->findById($id);
            if (!$existingMinistry) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Ministry not found'
                ]);
                return;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['name']) || empty(trim($data['name']))) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Ministry name is required'
                ]);
                return;
            }
            
            $ministryData = [
                'name' => trim($data['name'])
            ];
            
            $result = $this->ministryModel->update($id, $ministryData);
            
            if ($result) {
                // Get the updated ministry data
                $updatedMinistry = $this->ministryModel->findById($id);
                
                // Log the action
                $this->logAction('ministry_updated', "Updated ministry: {$existingMinistry['name']}", [
                    'ministry_id' => $id,
                    'old_name' => $existingMinistry['name'],
                    'new_name' => $ministryData['name']
                ]);
                
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'data' => $updatedMinistry,
                    'message' => 'Ministry updated successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to update ministry'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error updating ministry: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Delete a ministry (admin only)
     */
    public function destroy($id) {
        try {
            // Require admin authentication
            RoleMiddleware::requireAdmin($this->pdo);
            
            // Check if ministry exists
            $existingMinistry = $this->ministryModel->findById($id);
            if (!$existingMinistry) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Ministry not found'
                ]);
                return;
            }
            
            $success = $this->ministryModel->delete($id);
            
            if ($success) {
                // Log the action
                $this->logAction('ministry_deleted', "Deleted ministry: {$existingMinistry['name']}", [
                    'ministry_id' => $id,
                    'name' => $existingMinistry['name']
                ]);
                
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Ministry deleted successfully'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'message' => 'Failed to delete ministry'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error deleting ministry: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Search ministries (public)
     */
    public function search() {
        try {
            $query = $_GET['q'] ?? '';
            
            if (empty($query)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Search query is required'
                ]);
                return;
            }
            
            $ministries = $this->ministryModel->searchMinistries($query);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $ministries,
                'message' => 'Search results retrieved successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error searching ministries: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get ministry count (public)
     */
    public function count() {
        try {
            $count = $this->ministryModel->getCount();
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => ['count' => $count],
                'message' => 'Ministry count retrieved successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error retrieving ministry count: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Log user action
     */
    private function logAction($action, $description = null, $metadata = null) {
        try {
            $token = $this->getAuthToken();
            if ($token) {
                $this->userLogModel->logAction($token, $action, $description, $metadata);
            }
        } catch (Exception $e) {
            // Log error silently to avoid breaking the main operation
            error_log('Error logging action: ' . $e->getMessage());
        }
    }

    /**
     * Get authentication token from request
     */
    private function getAuthToken() {
        $headers = getallheaders();
        
        // Check Authorization header
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
            if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
                return $matches[1];
            }
        }
        
        // Check for token in query parameters
        if (isset($_GET['token'])) {
            return $_GET['token'];
        }
        
        // Check for token in POST data
        if (isset($_POST['token'])) {
            return $_POST['token'];
        }
        
        return null;
    }
}
?>
