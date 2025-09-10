<?php
// api/controllers/GiveController.php - Controller for give management

require_once __DIR__ . '/../middlewares/AuthMiddleware.php';
require_once __DIR__ . '/../middlewares/RoleMiddleware.php';
require_once __DIR__ . '/../models/GiveModel.php';
require_once __DIR__ . '/../models/UserLogModel.php';
require_once __DIR__ . '/../utils/give_uploads.php';

class GiveController {
    private $pdo;
    private $giveModel;
    private $userLogModel;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->giveModel = new GiveModel($pdo);
        $this->userLogModel = new UserLogModel($pdo);
    }

    /**
     * Get all give entries (admin only)
     */
    public function index() {
        try {
            RoleMiddleware::requireAdmin($this->pdo);
            $giveEntries = $this->giveModel->findAll();
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $giveEntries, 'message' => 'Give entries retrieved successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error retrieving give entries: ' . $e->getMessage()]);
        }
    }

    /**
     * Create a new give entry (admin only)
     */
    public function store() {
        try {
            RoleMiddleware::requireAdmin($this->pdo);
            
            // Handle both JSON and multipart form data
            $data = [];
            if ($_SERVER['CONTENT_TYPE'] && strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
                // Handle multipart form data
                $data = $_POST;
                
                // Handle file upload if present
                if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
                    $uploadResult = $this->handleFileUpload($_FILES['image']);
                    if ($uploadResult['success']) {
                        $data['image'] = $uploadResult['filepath'];
                    } else {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'message' => $uploadResult['message']]);
                        return;
                    }
                }
            } else {
                // Handle JSON data
                $data = json_decode(file_get_contents('php://input'), true);
            }
            
            if (empty($data['title'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Title is required']);
                return;
            }
            
            if (empty($data['text'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Text is required']);
                return;
            }
            
            // Handle links JSON encoding
            if (isset($data['links']) && is_array($data['links'])) {
                $data['links'] = json_encode($data['links']);
            }
            
            $giveId = $this->giveModel->create($data);
            if ($giveId) {
                $createdGive = $this->giveModel->findById($giveId);
                $this->logAction('give_created', "Created give entry: {$data['title']}", [
                    'give_id' => $giveId,
                    'title' => $data['title']
                ]);
                http_response_code(201);
                echo json_encode(['success' => true, 'data' => $createdGive, 'message' => 'Give entry created successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to create give entry']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error creating give entry: ' . $e->getMessage()]);
        }
    }

    /**
     * Get a specific give entry by ID (public)
     */
    public function show($id) {
        try {
            $giveEntry = $this->giveModel->findById($id);
            if (!$giveEntry) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Give entry not found']);
                return;
            }
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $giveEntry, 'message' => 'Give entry retrieved successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error retrieving give entry: ' . $e->getMessage()]);
        }
    }

    /**
     * Update a give entry (admin only)
     */
    public function update($id) {
        try {
            RoleMiddleware::requireAdmin($this->pdo);
            $existingGive = $this->giveModel->findById($id);
            if (!$existingGive) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Give entry not found']);
                return;
            }
            
            // Handle both JSON and multipart form data
            $data = [];
            if ($_SERVER['CONTENT_TYPE'] && strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
                // Handle multipart form data
                $data = $_POST;
                
                // Handle file upload if present
                if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
                    $uploadResult = $this->handleFileUpload($_FILES['image']);
                    if ($uploadResult['success']) {
                        $data['image'] = $uploadResult['filepath'];
                        
                        // Delete old image if new one is uploaded
                        if ($existingGive['image']) {
                            deleteGiveFile($existingGive['image']);
                        }
                    } else {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'message' => $uploadResult['message']]);
                        return;
                    }
                }
            } else {
                // Handle JSON data
                $data = json_decode(file_get_contents('php://input'), true) ?: [];
            }
            
            // Handle links JSON encoding
            if (isset($data['links']) && is_array($data['links'])) {
                $data['links'] = json_encode($data['links']);
            }
            
            $success = $this->giveModel->update($id, $data);
            if ($success) {
                $updatedGive = $this->giveModel->findById($id);
                $this->logAction('give_updated', "Updated give entry: {$updatedGive['title']}", [
                    'give_id' => $id,
                    'updated_fields' => array_keys($data)
                ]);
                http_response_code(200);
                echo json_encode(['success' => true, 'data' => $updatedGive, 'message' => 'Give entry updated successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to update give entry']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error updating give entry: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete a give entry (admin only)
     */
    public function destroy($id) {
        try {
            RoleMiddleware::requireAdmin($this->pdo);
            $existingGive = $this->giveModel->findById($id);
            if (!$existingGive) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Give entry not found']);
                return;
            }
            
            // Delete associated image file
            if ($existingGive['image']) {
                deleteGiveFile($existingGive['image']);
            }
            
            $success = $this->giveModel->delete($id);
            if ($success) {
                $this->logAction('give_deleted', "Deleted give entry: {$existingGive['title']}", [
                    'give_id' => $id,
                    'title' => $existingGive['title']
                ]);
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Give entry deleted successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Failed to delete give entry']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error deleting give entry: ' . $e->getMessage()]);
        }
    }

    /**
     * Get active give entries (public endpoint)
     */
    public function getActive() {
        try {
            $giveEntries = $this->giveModel->getActiveGive();
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $giveEntries, 'message' => 'Active give entries retrieved successfully']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error retrieving active give entries: ' . $e->getMessage()]);
        }
    }


    /**
     * Handle file upload for give entries
     */
    private function handleFileUpload($file) {
        try {
            $uploadResult = uploadGiveFile($file);
            
            if ($uploadResult['success']) {
                return [
                    'success' => true,
                    'filepath' => $uploadResult['filepath'],
                    'url' => $uploadResult['url'],
                    'thumbnails' => $uploadResult['thumbnails'] ?? null
                ];
            } else {
                return [
                    'success' => false,
                    'message' => $uploadResult['message']
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error uploading file: ' . $e->getMessage()
            ];
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
            error_log('Error logging action: ' . $e->getMessage());
        }
    }

    /**
     * Get authentication token from request
     */
    private function getAuthToken() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
?>
