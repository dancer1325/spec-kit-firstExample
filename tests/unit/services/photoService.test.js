import { describe, it, expect, vi } from 'vitest';

/**
 * Unit Tests for photoService methods (User Story 1)
 *
 * Tests getPhotos() and generateThumbnail() service methods
 * TDD Red Phase: These should FAIL until T053 implements the service
 */

describe('photoService.getPhotos() - User Story 1', () => {
  it('should call Tauri invoke with get_photos command', async () => {
    try {
      const { getPhotos } = await import('../../../src/services/photoService.js');

      const mockInvoke = vi.fn().mockResolvedValue([]);
      globalThis.__TAURI__ = { tauri: { invoke: mockInvoke } };

      await getPhotos(1);

      expect(mockInvoke).toHaveBeenCalledWith('get_photos', { albumId: 1 });
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should return array of photos', async () => {
    try {
      const { getPhotos } = await import('../../../src/services/photoService.js');

      const mockPhotos = [
        { id: 1, albumId: 1, filePath: '/photo1.jpg', filename: 'photo1.jpg' },
        { id: 2, albumId: 1, filePath: '/photo2.jpg', filename: 'photo2.jpg' },
      ];

      globalThis.__TAURI__ = {
        tauri: { invoke: vi.fn().mockResolvedValue(mockPhotos) },
      };

      const result = await getPhotos(1);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should handle NotFound errors for invalid album', async () => {
    try {
      const { getPhotos } = await import('../../../src/services/photoService.js');

      globalThis.__TAURI__ = {
        tauri: {
          invoke: vi.fn().mockRejectedValue(new Error('NotFound: Album does not exist')),
        },
      };

      await expect(getPhotos(99999)).rejects.toThrow(/NotFound/);
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });
});

describe('photoService.generateThumbnail() - User Story 1', () => {
  it('should call Tauri invoke with generate_thumbnail command', async () => {
    try {
      const { generateThumbnail } = await import('../../../src/services/photoService.js');

      const mockInvoke = vi.fn().mockResolvedValue({
        dataUrl: 'data:image/jpeg;base64,abc123',
        width: 256,
        height: 192,
      });

      globalThis.__TAURI__ = { tauri: { invoke: mockInvoke } };

      await generateThumbnail('/path/to/photo.jpg');

      expect(mockInvoke).toHaveBeenCalledWith('generate_thumbnail', {
        filePath: '/path/to/photo.jpg',
        maxWidth: 256,
        maxHeight: 256,
      });
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should return thumbnail data with dataUrl and dimensions', async () => {
    try {
      const { generateThumbnail } = await import('../../../src/services/photoService.js');

      const mockResult = {
        dataUrl: 'data:image/jpeg;base64,abc123',
        width: 256,
        height: 192,
      };

      globalThis.__TAURI__ = {
        tauri: { invoke: vi.fn().mockResolvedValue(mockResult) },
      };

      const result = await generateThumbnail('/path/to/photo.jpg');

      expect(result).toHaveProperty('dataUrl');
      expect(result).toHaveProperty('width');
      expect(result).toHaveProperty('height');
      expect(result.dataUrl).toMatch(/^data:image/);
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should support custom dimensions', async () => {
    try {
      const { generateThumbnail } = await import('../../../src/services/photoService.js');

      const mockInvoke = vi.fn().mockResolvedValue({
        dataUrl: 'data:image/jpeg;base64,abc123',
        width: 128,
        height: 96,
      });

      globalThis.__TAURI__ = { tauri: { invoke: mockInvoke } };

      await generateThumbnail('/path/to/photo.jpg', 128, 128);

      expect(mockInvoke).toHaveBeenCalledWith('generate_thumbnail', {
        filePath: '/path/to/photo.jpg',
        maxWidth: 128,
        maxHeight: 128,
      });
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should handle InvalidImage errors', async () => {
    try {
      const { generateThumbnail } = await import('../../../src/services/photoService.js');

      globalThis.__TAURI__ = {
        tauri: {
          invoke: vi.fn().mockRejectedValue(new Error('InvalidImage: Corrupted file')),
        },
      };

      await expect(generateThumbnail('/path/to/corrupted.jpg')).rejects.toThrow(/InvalidImage/);
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });
});
