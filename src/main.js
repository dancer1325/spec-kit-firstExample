/**
 * Photo Album Organizer - Main Entry Point
 *
 * Initializes the application and sets up the main view
 */

import { initializeDatabase } from './services/dbService.js';
import { AlbumGrid } from './components/AlbumGrid.js';
import { getPhotos } from './services/photoService.js';
import { PhotoTile } from './components/PhotoTile.js';
import { PhotoModal } from './components/PhotoModal.js';

// Global state
let albumGrid = null;
let currentView = 'albums'; // 'albums' or 'photos'
let currentAlbum = null;

/**
 * Initialize application
 */
async function init() {
  try {
    console.log('Photo Album Organizer starting...');

    // Initialize database
    await initializeDatabase();
    console.log('Database initialized');

    // Setup album grid
    const albumGridContainer = document.getElementById('album-grid');
    albumGrid = new AlbumGrid(albumGridContainer);
    await albumGrid.render();
    console.log('Album grid rendered');

    // Setup navigation handlers
    setupNavigationHandlers();

    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    document.getElementById('app').innerHTML = `
      <div class="error">
        <h1>Error</h1>
        <p>Failed to start the application. Please try again.</p>
        <pre>${error.message}</pre>
      </div>
    `;
  }
}

/**
 * Setup navigation event handlers
 */
function setupNavigationHandlers() {
  // Handle album selection
  document.addEventListener('album-selected', async event => {
    const { album } = event.detail;
    await showPhotoView(album);
  });
}

/**
 * Show photo view for selected album
 * @param {Object} album - Album data
 */
async function showPhotoView(album) {
  currentView = 'photos';
  currentAlbum = album;

  // Hide album grid
  document.getElementById('album-grid').style.display = 'none';

  // Show photo view
  const photoView = document.getElementById('photo-view');
  photoView.style.display = 'block';
  photoView.innerHTML = '';

  // Create back button
  const backButton = document.createElement('button');
  backButton.className = 'back-button';
  backButton.textContent = '← Back to Albums';
  backButton.addEventListener('click', showAlbumView);
  photoView.appendChild(backButton);

  // Create album header
  const header = document.createElement('div');
  header.className = 'photo-view-header';
  header.innerHTML = `
    <h2>${album.name}</h2>
    <p class="album-date">${album.date}</p>
  `;
  photoView.appendChild(header);

  // Load photos
  try {
    const photos = await getPhotos(album.id);

    if (photos.length === 0) {
      photoView.innerHTML += '<div class="empty-state"><p>No photos in this album yet.</p></div>';
      return;
    }

    // Create photo grid
    const photoGrid = document.createElement('div');
    photoGrid.className = 'photo-grid-container';

    // Render photo tiles
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const tile = new PhotoTile(photo);
      const tileElement = await tile.render();

      // Add click handler for full-size view
      tileElement.addEventListener('click', () => {
        const modal = new PhotoModal(photos);
        modal.open(i, photoView);
      });

      photoGrid.appendChild(tileElement);
    }

    photoView.appendChild(photoGrid);
  } catch (error) {
    console.error('Failed to load photos:', error);
    photoView.innerHTML += `<div class="error">Failed to load photos: ${error.message}</div>`;
  }
}

/**
 * Show album grid view
 */
function showAlbumView() {
  currentView = 'albums';
  currentAlbum = null;

  // Show album grid
  document.getElementById('album-grid').style.display = 'block';

  // Hide photo view
  document.getElementById('photo-view').style.display = 'none';

  // Refresh album grid
  if (albumGrid) {
    albumGrid.refresh();
  }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
