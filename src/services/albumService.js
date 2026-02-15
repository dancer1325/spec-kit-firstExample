/**
 * Album Service - Frontend service for album operations
 *
 * Provides methods to interact with album-related Tauri commands
 */

// Lazy access to Tauri API for testability
const getInvoke = () => window.__TAURI__.tauri.invoke;

/**
 * Get all albums with optional sorting
 * @param {string} sortBy - 'date' or 'custom' (default: 'date')
 * @returns {Promise<Array>} Array of album objects with photo counts
 * @throws {Error} If query fails
 */
export async function getAlbums(sortBy = 'date') {
  try {
    const albums = await getInvoke()('get_albums', { sortBy });
    return albums;
  } catch (error) {
    console.error('Failed to get albums:', error);
    throw error;
  }
}

/**
 * Create a new album
 * @param {string} name - Album name (1-255 characters)
 * @param {string} date - ISO 8601 date (YYYY-MM-DD)
 * @returns {Promise<Object>} Created album object
 * @throws {Error} If creation fails or validation error
 */
export async function createAlbum(name, date) {
  try {
    const album = await getInvoke()('create_album', { name, date });
    return album;
  } catch (error) {
    console.error('Failed to create album:', error);
    throw error;
  }
}

/**
 * Update album details
 * @param {number} id - Album ID
 * @param {Object} updates - { name?: string, date?: string }
 * @returns {Promise<Object>} Updated album object
 * @throws {Error} If update fails
 */
export async function updateAlbum(id, updates) {
  try {
    const album = await getInvoke()('update_album', {
      id,
      name: updates.name,
      date: updates.date,
    });
    return album;
  } catch (error) {
    console.error('Failed to update album:', error);
    throw error;
  }
}

/**
 * Update album display order after drag-and-drop
 * @param {Array<{id: number, displayOrder: number}>} albumOrders - New ordering
 * @returns {Promise<{success: boolean, updatedCount: number}>}
 * @throws {Error} If update fails
 */
export async function updateAlbumOrder(albumOrders) {
  try {
    const result = await getInvoke()('update_album_order', { albumOrders });
    return result;
  } catch (error) {
    console.error('Failed to update album order:', error);
    throw error;
  }
}

/**
 * Delete an album and all its photo references
 * @param {number} id - Album ID
 * @returns {Promise<{success: boolean, deletedPhotoCount: number}>}
 * @throws {Error} If deletion fails
 */
export async function deleteAlbum(id) {
  try {
    const result = await getInvoke()('delete_album', { id });
    return result;
  } catch (error) {
    console.error('Failed to delete album:', error);
    throw error;
  }
}
