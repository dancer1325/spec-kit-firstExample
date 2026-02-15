/**
 * PhotoModal Component - Full-size photo viewer
 *
 * Displays photos in full size with prev/next navigation
 */

export class PhotoModal {
  /**
   * Create a PhotoModal
   * @param {Array} photos - Array of photo objects
   */
  constructor(photos) {
    this.photos = photos;
    this.currentIndex = 0;
    this.isOpen = false;
    this.modalElement = null;
  }

  /**
   * Open modal at specific photo index
   * @param {number} index - Photo index to display
   * @param {HTMLElement} container - Container element
   */
  async open(index, container) {
    this.currentIndex = index;
    this.isOpen = true;

    // Create modal structure
    this.modalElement = document.createElement('div');
    this.modalElement.className = 'photo-modal';

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.addEventListener('click', () => this.close());

    const content = document.createElement('div');
    content.className = 'modal-content';
    content.addEventListener('click', e => e.stopPropagation());

    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => this.close());

    const imageContainer = document.createElement('div');
    imageContainer.className = 'modal-image-container';

    const prevButton = document.createElement('button');
    prevButton.className = 'modal-nav modal-prev';
    prevButton.innerHTML = '&#8249;';
    prevButton.addEventListener('click', () => this.previous());

    const nextButton = document.createElement('button');
    nextButton.className = 'modal-nav modal-next';
    nextButton.innerHTML = '&#8250;';
    nextButton.addEventListener('click', () => this.next());

    content.appendChild(closeButton);
    content.appendChild(prevButton);
    content.appendChild(imageContainer);
    content.appendChild(nextButton);

    this.modalElement.appendChild(overlay);
    this.modalElement.appendChild(content);

    container.appendChild(this.modalElement);

    // Load current photo
    await this.loadPhoto(imageContainer);

    // Setup keyboard navigation
    this.setupKeyboardNav();
  }

  /**
   * Load photo into image container
   * @param {HTMLElement} container - Image container element
   */
  async loadPhoto(container) {
    const photo = this.photos[this.currentIndex];

    container.innerHTML = '<div class="spinner"></div>';

    try {
      const img = document.createElement('img');
      img.className = 'modal-image';
      img.src = `file://${photo.filePath}`;
      img.alt = photo.filename;

      img.onload = () => {
        container.innerHTML = '';
        container.appendChild(img);
      };

      img.onerror = () => {
        container.innerHTML = '<div class="error">Failed to load image</div>';
      };
    } catch (error) {
      console.error('Failed to load photo:', error);
      container.innerHTML = '<div class="error">Failed to load image</div>';
    }
  }

  /**
   * Navigate to next photo
   */
  async next() {
    if (this.currentIndex < this.photos.length - 1) {
      this.currentIndex++;
      const container = this.modalElement.querySelector('.modal-image-container');
      await this.loadPhoto(container);
    }
  }

  /**
   * Navigate to previous photo
   */
  async previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const container = this.modalElement.querySelector('.modal-image-container');
      await this.loadPhoto(container);
    }
  }

  /**
   * Close the modal
   */
  close() {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
    this.isOpen = false;
    this.removeKeyboardNav();
  }

  /**
   * Setup keyboard navigation handlers
   */
  setupKeyboardNav() {
    this.keyHandler = e => {
      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowLeft') {
        this.previous();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    };

    document.addEventListener('keydown', this.keyHandler);
  }

  /**
   * Remove keyboard navigation handlers
   */
  removeKeyboardNav() {
    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }
}
