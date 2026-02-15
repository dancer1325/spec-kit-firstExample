/**
 * Photo Service - Frontend service for photo operations
 *
 * Provides methods to interact with photo-related Tauri commands
 */

// Lazy access to Tauri API for testability
const getInvoke = () => window.__TAURI__.tauri.invoke;

/**
 * Get all photos in an album
 * @param {number} albumId - Album ID
 * @returns {Promise<Array>} Array of photo objects
 * @throws {Error} If query fails or album not found
 */
export async function getPhotos(albumId) {
  try {
    const photos = await getInvoke()('get_photos', { albumId });
    return photos;
  } catch (error) {
    console.error(`Failed to get photos for album ${albumId}:`, error);
    throw error;
  }
}

/**
 * Generate thumbnail for a photo
 * @param {string} filePath - Absolute path to photo file
 * @param {number} maxWidth - Maximum thumbnail width (default: 256)
 * @param {number} maxHeight - Maximum thumbnail height (default: 256)
 * @returns {Promise<{dataUrl: string, width: number, height: number}>}
 * @throws {Error} If thumbnail generation fails
 */
export async function generateThumbnail(filePath, maxWidth = 256, maxHeight = 256) {
  try {
    const result = await getInvoke()('generate_thumbnail', {
      filePath,
      maxWidth,
      maxHeight,
    });
    return result;
  } catch (error) {
    console.error(`Failed to generate thumbnail for ${filePath}:`, error);
    throw error;
  }
}

/**
 * Add photos to an album
 * @param {number} albumId - Album ID
 * @param {Array<string>} filePaths - Array of absolute file paths
 * @returns {Promise<{success: boolean, added: Array, failed: Array}>}
 * @throws {Error} If operation fails
 */
export async function addPhotos(albumId, filePaths) {
  try {
    const result = await getInvoke()('add_photos', { albumId, filePaths });
    return result;
  } catch (error) {
    console.error(`Failed to add photos to album ${albumId}:`, error);
    throw error;
  }
}

/**
 * Remove a photo from an album
 * @param {number} photoId - Photo ID
 * @returns {Promise<{success: boolean}>}
 * @throws {Error} If removal fails
 */
export async function removePhoto(photoId) {
  try {
    const result = await getInvoke()('remove_photo', { id: photoId });
    return result;
  } catch (error) {
    console.error(`Failed to remove photo ${photoId}:`, error);
    throw error;
  }
}

/**
 * Open file picker to select photos
 * @param {boolean} multiple - Allow multiple selection (default: true)
 * @param {string} title - Dialog title (default: "Select Photos")
 * @returns {Promise<Array<string>|null>} Array of file paths or null if cancelled
 * @throws {Error} If file picker fails
 */
export async function openFilePicker(multiple = true, title = 'Select Photos') {
  try {
    const files = await getInvoke()('open_file_picker', { multiple, title });
    return files;
  } catch (error) {
    console.error('Failed to open file picker:', error);
    throw error;
  }
}

/**
 * Validate an image file
 * @param {string} filePath - Absolute path to file
 * @returns {Promise<{valid: boolean, format?: string, fileSize?: number, error?: string}>}
 * @throws {Error} If validation check fails
 */
export async function validateImageFile(filePath) {
  try {
    const result = await getInvoke()('validate_image_file', { filePath });
    return result;
  } catch (error) {
    console.error(`Failed to validate file ${filePath}:`, error);
    throw error;
  }
}
