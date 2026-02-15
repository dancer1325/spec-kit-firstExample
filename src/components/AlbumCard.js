/**
 * AlbumCard Component - Individual album display card
 *
 * Displays album name, date, and photo count
 */

import { formatDateToHuman } from '../utils/dateFormatter.js';

export class AlbumCard {
  /**
   * Create an AlbumCard
   * @param {Object} album - Album data { id, name, date, photoCount, ... }
   */
  constructor(album) {
    this.album = album;
  }

  /**
   * Render the album card element
   * @returns {HTMLElement} Album card element
   */
  render() {
    const card = document.createElement('div');
    card.className = 'album-card';
    card.setAttribute('data-album-id', this.album.id);
    card.setAttribute('data-date', this.album.date);

    // Album name
    const nameElement = document.createElement('h3');
    nameElement.className = 'album-name';
    nameElement.textContent = this.album.name;

    // Album date
    const dateElement = document.createElement('div');
    dateElement.className = 'album-date';
    dateElement.textContent = formatDateToHuman(this.album.date);

    // Photo count
    const countElement = document.createElement('div');
    countElement.className = 'album-photo-count';
    const photoText = this.album.photoCount === 1 ? 'photo' : 'photos';
    countElement.textContent = `${this.album.photoCount} ${photoText}`;

    // Assemble card
    card.appendChild(nameElement);
    card.appendChild(dateElement);
    card.appendChild(countElement);

    return card;
  }
}
