/**
 * PhotoTile Component - Photo thumbnail in grid layout
 *
 * Renders photo thumbnail with on-the-fly generation
 */

import { generateThumbnail } from '../services/photoService.js';

export class PhotoTile {
  /**
   * Create a PhotoTile
   * @param {Object} photo - Photo data { id, filePath, filename, ... }
   */
  constructor(photo) {
    this.photo = photo;
  }

  /**
   * Render the photo tile with thumbnail
   * @returns {Promise<HTMLElement>} Photo tile element
   */
  async render() {
    const tile = document.createElement('div');
    tile.className = 'photo-tile';
    tile.setAttribute('data-photo-id', this.photo.id);

    // Show loading state
    tile.innerHTML = '<div class="spinner"></div>';

    try {
      // Generate thumbnail on-the-fly
      const thumbnail = await generateThumbnail(this.photo.filePath);

      // Clear loading state
      tile.innerHTML = '';

      // Create image element
      const img = document.createElement('img');
      img.src = thumbnail.dataUrl;
      img.alt = this.photo.filename;
      img.width = thumbnail.width;
      img.height = thumbnail.height;
      img.className = 'photo-thumbnail';

      tile.appendChild(img);
    } catch (error) {
      console.error(`Failed to load thumbnail for ${this.photo.filename}:`, error);
      tile.innerHTML = '<div class="photo-error">Failed to load</div>';
    }

    return tile;
  }

  /**
   * Render placeholder before thumbnail loads
   * @returns {HTMLElement} Placeholder element
   */
  renderPlaceholder() {
    const tile = document.createElement('div');
    tile.className = 'photo-tile photo-tile-placeholder';
    tile.innerHTML = '<div class="spinner"></div>';
    return tile;
  }
}
