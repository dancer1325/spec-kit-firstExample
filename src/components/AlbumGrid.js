/**
 * AlbumGrid Component - Main album grid view
 *
 * Renders all albums in a grid layout with sorting
 */

import { getAlbums } from '../services/albumService.js';
import { AlbumCard } from './AlbumCard.js';

export class AlbumGrid {
  /**
   * Create an AlbumGrid
   * @param {HTMLElement} container - Container element for the grid
   */
  constructor(container) {
    this.container = container;
    this.albums = [];
    this.sortBy = 'date';
  }

  /**
   * Render the album grid
   * @param {string} sortBy - 'date' or 'custom' (default: 'date')
   */
  async render(sortBy = 'date') {
    this.sortBy = sortBy;

    try {
      // Fetch albums
      this.albums = await getAlbums(sortBy);

      // Clear container
      this.container.innerHTML = '';

      // Check if empty
      if (this.albums.length === 0) {
        this.renderEmptyState();
        return;
      }

      // Create grid wrapper
      const grid = document.createElement('div');
      grid.className = 'album-grid-container';

      // Render each album card
      this.albums.forEach(album => {
        const card = new AlbumCard(album);
        const cardElement = card.render();

        // Add click handler to navigate to album
        cardElement.addEventListener('click', () => {
          this.onAlbumClick(album);
        });

        grid.appendChild(cardElement);
      });

      this.container.appendChild(grid);
    } catch (error) {
      console.error('Failed to render album grid:', error);
      this.renderError(error);
    }
  }

  /**
   * Render empty state when no albums exist
   */
  renderEmptyState() {
    this.container.innerHTML = `
      <div class="empty-state">
        <h2>No Albums Yet</h2>
        <p>Create your first album to get started organizing your photos.</p>
      </div>
    `;
  }

  /**
   * Render error state
   * @param {Error} error - Error object
   */
  renderError(error) {
    this.container.innerHTML = `
      <div class="error-state">
        <h2>Error Loading Albums</h2>
        <p>${error.message}</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
  }

  /**
   * Handle album click event
   * @param {Object} album - Album data
   */
  onAlbumClick(album) {
    // Dispatch custom event for navigation
    const event = new CustomEvent('album-selected', { detail: { album } });
    document.dispatchEvent(event);
  }

  /**
   * Refresh the grid
   */
  async refresh() {
    await this.render(this.sortBy);
  }
}
