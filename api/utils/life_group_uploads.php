<?php
// api/utils/life_group_uploads.php - Life Group upload utilities

/**
 * Upload life group banner image
 * 
 * @param array $file The uploaded file array from $_FILES or a manually parsed request
 * @return array The uploaded file path(s)
 */
function uploadLifeGroupBanner($file) {
    $uploadDir = __DIR__ . '/../uploads/life-groups/';
    $thumbnailsDir = $uploadDir . 'thumbnails/';
    
    // Create directories if they don't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    if (!is_dir($thumbnailsDir)) {
        mkdir($thumbnailsDir, 0755, true);
    }
    
    // Validate file
    if (!isValidImageFile($file)) {
        throw new Exception('Invalid file. Only JPEG, PNG, GIF, and WebP images are allowed (max 5MB).');
    }
    
    // Generate unique filename
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    // Move uploaded file.
    // move_uploaded_file() is for POST requests. For PUT requests where we parse the body manually,
    // the file is already in a temporary location, so we can use rename() to move it.
    if (!rename($file['tmp_name'], $filepath)) {
        throw new Exception('Failed to upload file.');
    }
    
    // Generate thumbnails
    $thumbnails = generateLifeGroupThumbnails($filepath, $filename, $thumbnailsDir);
    
    return [
        'original' => 'uploads/life-groups/' . $filename,
        'thumbnails' => $thumbnails
    ];
}

/**
 * Upload multiple life group banner images
 * 
 * @param array $files The uploaded files array from $_FILES
 * @return array Array of uploaded file paths
 */
function uploadLifeGroupBanners($files) {
    $uploadedFiles = [];
    
    // Handle single file
    if (!is_array($files['name'])) {
        return uploadLifeGroupBanner($files);
    }
    
    // Handle multiple files
    $fileCount = count($files['name']);
    for ($i = 0; $i < $fileCount; $i++) {
        if ($files['error'][$i] === UPLOAD_ERR_OK) {
            $file = [
                'name' => $files['name'][$i],
                'type' => $files['type'][$i],
                'tmp_name' => $files['tmp_name'][$i],
                'error' => $files['error'][$i],
                'size' => $files['size'][$i]
            ];
            
            try {
                $uploadedFiles[] = uploadLifeGroupBanner($file);
            } catch (Exception $e) {
                // Log error but continue with other files
                error_log('Error uploading life group banner: ' . $e->getMessage());
            }
        }
    }
    
    return $uploadedFiles;
}

/**
 * Validate image file
 * 
 * @param array $file The uploaded file array
 * @return bool True if valid, false otherwise
 */
function isValidImageFile($file) {
    // Check file size (max 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        return false;
    }
    
    // Check file type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowedTypes)) {
        return false;
    }
    
    // Check if file is actually an image
    $imageInfo = getimagesize($file['tmp_name']);
    if ($imageInfo === false) {
        return false;
    }
    
    return true;
}

/**
 * Generate thumbnails for life group banner
 * 
 * @param string $originalPath Path to original image
 * @param string $filename Original filename
 * @param string $thumbnailsDir Directory for thumbnails
 * @return array Array of thumbnail paths
 */
function generateLifeGroupThumbnails($originalPath, $filename, $thumbnailsDir) {
    $thumbnails = [];
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $nameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);
    
    // Thumbnail sizes for life groups
    $sizes = [
        'small' => [300, 200],
        'medium' => [600, 400],
        'large' => [1200, 800]
    ];
    
    foreach ($sizes as $size => $dimensions) {
        $thumbnailFilename = $nameWithoutExt . '_' . $size . '.' . $extension;
        $thumbnailPath = $thumbnailsDir . $thumbnailFilename;
        
        if (createThumbnail($originalPath, $thumbnailPath, $dimensions[0], $dimensions[1])) {
            $thumbnails[$size] = 'uploads/life-groups/thumbnails/' . $thumbnailFilename;
        }
    }
    
    return $thumbnails;
}

/**
 * Create thumbnail from image
 * 
 * @param string $sourcePath Path to source image
 * @param string $destPath Path to save thumbnail
 * @param int $width Desired width
 * @param int $height Desired height
 * @return bool True if successful, false otherwise
 */
function createThumbnail($sourcePath, $destPath, $width, $height) {
    try {
        $imageInfo = getimagesize($sourcePath);
        if ($imageInfo === false) {
            return false;
        }
        
        $originalWidth = $imageInfo[0];
        $originalHeight = $imageInfo[1];
        $mimeType = $imageInfo['mime'];
        
        // Calculate aspect ratio
        $aspectRatio = $originalWidth / $originalHeight;
        $targetAspectRatio = $width / $height;
        
        if ($aspectRatio > $targetAspectRatio) {
            // Image is wider than target
            $cropWidth = round($originalHeight * $targetAspectRatio);
            $cropHeight = $originalHeight;
            $cropX = round(($originalWidth - $cropWidth) / 2);
            $cropY = 0;
        } else {
            // Image is taller than target
            $cropWidth = $originalWidth;
            $cropHeight = round($originalWidth / $targetAspectRatio);
            $cropX = 0;
            $cropY = round(($originalHeight - $cropHeight) / 2);
        }
        
        // Create image resource
        $sourceImage = createImageResource($sourcePath, $mimeType);
        if (!$sourceImage) {
            return false;
        }
        
        // Create thumbnail image
        $thumbnailImage = imagecreatetruecolor($width, $height);
        
        // Preserve transparency for PNG and GIF
        if (in_array($mimeType, ['image/png', 'image/gif'])) {
            imagealphablending($thumbnailImage, false);
            imagesavealpha($thumbnailImage, true);
            $transparent = imagecolorallocatealpha($thumbnailImage, 255, 255, 255, 127);
            imagefill($thumbnailImage, 0, 0, $transparent);
        }
        
        // Resize and crop
        imagecopyresampled(
            $thumbnailImage, $sourceImage,
            0, 0, $cropX, $cropY,
            $width, $height, $cropWidth, $cropHeight
        );
        
        // Save thumbnail
        $result = saveImage($thumbnailImage, $destPath, $mimeType);
        
        // Clean up
        imagedestroy($sourceImage);
        imagedestroy($thumbnailImage);
        
        return $result;
    } catch (Exception $e) {
        error_log('Error creating thumbnail: ' . $e->getMessage());
        return false;
    }
}

/**
 * Create image resource from file
 * 
 * @param string $path Path to image file
 * @param string $mimeType MIME type of image
 * @return resource|false Image resource or false on failure
 */
function createImageResource($path, $mimeType) {
    switch ($mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            return imagecreatefromjpeg($path);
        case 'image/png':
            return imagecreatefrompng($path);
        case 'image/gif':
            return imagecreatefromgif($path);
        case 'image/webp':
            return imagecreatefromwebp($path);
        default:
            return false;
    }
}

/**
 * Save image to file
 * 
 * @param resource $image Image resource
 * @param string $path Path to save image
 * @param string $mimeType MIME type of image
 * @return bool True if successful, false otherwise
 */
function saveImage($image, $path, $mimeType) {
    switch ($mimeType) {
        case 'image/jpeg':
        case 'image/jpg':
            return imagejpeg($image, $path, 90);
        case 'image/png':
            return imagepng($image, $path, 9);
        case 'image/gif':
            return imagegif($image, $path);
        case 'image/webp':
            return imagewebp($image, $path, 90);
        default:
            return false;
    }
}

/**
 * Get life group banner information
 * 
 * @param string $bannerPath Path to banner image
 * @return array|false Banner information or false on failure
 */
function getLifeGroupBannerInfo($bannerPath) {
    $fullPath = __DIR__ . '/../' . $bannerPath;
    
    if (!file_exists($fullPath)) {
        return false;
    }
    
    $imageInfo = getimagesize($fullPath);
    if ($imageInfo === false) {
        return false;
    }
    
    return [
        'path' => $bannerPath,
        'width' => $imageInfo[0],
        'height' => $imageInfo[1],
        'mime_type' => $imageInfo['mime'],
        'size' => filesize($fullPath),
        'filename' => basename($bannerPath)
    ];
}

/**
 * Delete life group banner and thumbnails
 * 
 * @param string $bannerPath Path to banner image
 * @return bool True if successful, false otherwise
 */
function deleteLifeGroupBanner($bannerPath) {
    try {
        $fullPath = __DIR__ . '/../' . $bannerPath;
        
        // Delete original file
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
        
        // Delete thumbnails
        $filename = basename($bannerPath);
        $nameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $thumbnailsDir = __DIR__ . '/../uploads/life-groups/thumbnails/';
        
        $sizes = ['small', 'medium', 'large'];
        foreach ($sizes as $size) {
            $thumbnailPath = $thumbnailsDir . $nameWithoutExt . '_' . $size . '.' . $extension;
            if (file_exists($thumbnailPath)) {
                unlink($thumbnailPath);
            }
        }
        
        return true;
    } catch (Exception $e) {
        error_log('Error deleting life group banner: ' . $e->getMessage());
        return false;
    }
}
?> 