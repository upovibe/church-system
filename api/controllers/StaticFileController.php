<?php
// api/controllers/StaticFileController.php - Controller for serving static files

class StaticFileController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Serve static files from uploads directory
     */
    public function serve() {
        try {
            // Get the requested file path
            $requestUri = $_SERVER['REQUEST_URI'];
            $path = parse_url($requestUri, PHP_URL_PATH);
            
            // Remove /api from the path
            $filePath = str_replace('/api', '', $path);
            
            // Construct the full file path
            $fullPath = __DIR__ . '/../' . $filePath;
            
            // Security check - ensure the file is within the uploads directory
            $uploadsDir = realpath(__DIR__ . '/../uploads');
            $realFilePath = realpath($fullPath);
            
            if (!$realFilePath || strpos($realFilePath, $uploadsDir) !== 0) {
                http_response_code(404);
                echo 'File not found';
                return;
            }
            
            // Check if file exists
            if (!file_exists($realFilePath) || !is_file($realFilePath)) {
                http_response_code(404);
                echo 'File not found';
                return;
            }
            
            // Get file info
            $fileInfo = pathinfo($realFilePath);
            $extension = strtolower($fileInfo['extension']);
            
            // Set appropriate content type
            $contentTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'svg' => 'image/svg+xml',
                'pdf' => 'application/pdf',
                'doc' => 'application/msword',
                'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'txt' => 'text/plain'
            ];
            
            if (isset($contentTypes[$extension])) {
                header('Content-Type: ' . $contentTypes[$extension]);
            } else {
                header('Content-Type: application/octet-stream');
            }
            
            // Set cache headers for better performance
            header('Cache-Control: public, max-age=31536000');
            header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
            header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($realFilePath)) . ' GMT');
            
            // Set file size
            header('Content-Length: ' . filesize($realFilePath));
            
            // Output the file
            readfile($realFilePath);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo 'Error serving file: ' . $e->getMessage();
        }
    }
}
?>
