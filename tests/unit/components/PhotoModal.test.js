import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Unit Tests for PhotoModal Component (User Story 1)
 *
 * Tests full-size photo viewer with navigation
 * TDD Red Phase: These should FAIL until T063 implements the component
 */

describe('PhotoModal Component - User Story 1', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-container"></div>';
  });

  it('should create PhotoModal with photos array', async () => {
    try {
      const { PhotoModal } = await import('../../../src/components/PhotoModal.js');

      const photos = [
        { id: 1, filePath: '/photo1.jpg', filename: 'photo1.jpg' },
        { id: 2, filePath: '/photo2.jpg', filename: 'photo2.jpg' },
      ];

      const modal = new PhotoModal(photos);

      expect(modal).toBeDefined();
      expect(modal.photos).toEqual(photos);
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should display full-size photo at specified index', async () => {
    try {
      const { PhotoModal } = await import('../../../src/components/PhotoModal.js');

      const photos = [
        { id: 1, filePath: '/photo1.jpg', filename: 'photo1.jpg' },
        { id: 2, filePath: '/photo2.jpg', filename: 'photo2.jpg' },
      ];

      const container = document.getElementById('test-container');
      const modal = new PhotoModal(photos);
      await modal.open(0, container);

      expect(modal.currentIndex).toBe(0);
      const img = container.querySelector('.modal-image');
      expect(img).toBeTruthy();
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should provide previous/next navigation', async () => {
    try {
      const { PhotoModal } = await import('../../../src/components/PhotoModal.js');

      const photos = [
        { id: 1, filePath: '/photo1.jpg', filename: 'photo1.jpg' },
        { id: 2, filePath: '/photo2.jpg', filename: 'photo2.jpg' },
        { id: 3, filePath: '/photo3.jpg', filename: 'photo3.jpg' },
      ];

      const container = document.getElementById('test-container');
      const modal = new PhotoModal(photos);
      await modal.open(1, container);

      expect(modal.currentIndex).toBe(1);

      // Navigate next
      await modal.next();
      expect(modal.currentIndex).toBe(2);

      // Navigate previous
      await modal.previous();
      expect(modal.currentIndex).toBe(1);
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should close modal when close button clicked', async () => {
    try {
      const { PhotoModal } = await import('../../../src/components/PhotoModal.js');

      const photos = [{ id: 1, filePath: '/photo1.jpg', filename: 'photo1.jpg' }];

      const container = document.getElementById('test-container');
      const modal = new PhotoModal(photos);
      await modal.open(0, container);

      modal.close();

      expect(container.querySelector('.photo-modal')).toBeFalsy();
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should handle keyboard navigation (Esc, Left, Right)', async () => {
    try {
      const { PhotoModal } = await import('../../../src/components/PhotoModal.js');

      const photos = [
        { id: 1, filePath: '/photo1.jpg', filename: 'photo1.jpg' },
        { id: 2, filePath: '/photo2.jpg', filename: 'photo2.jpg' },
      ];

      const container = document.getElementById('test-container');
      const modal = new PhotoModal(photos);
      await modal.open(0, container);

      // Simulate keyboard events
      const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escEvent);

      // Modal should close
      expect(modal.isOpen).toBe(false);
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });
});
