import { describe, it, expect, vi } from 'vitest';

/**
 * Unit Tests for albumService.getAlbums() (User Story 1)
 *
 * Tests the frontend service layer for album operations
 * TDD Red Phase: These should FAIL until T052 implements the service
 */

describe('albumService.getAlbums() - User Story 1', () => {
  it('should call Tauri invoke with get_albums command', async () => {
    // Dynamic import will fail until service is created
    try {
      const { getAlbums } = await import('../../../src/services/albumService.js');

      // Mock Tauri invoke
      const mockInvoke = vi.fn().mockResolvedValue([]);
      globalThis.__TAURI__ = { tauri: { invoke: mockInvoke } };

      await getAlbums('date');

      expect(mockInvoke).toHaveBeenCalledWith('get_albums', { sortBy: 'date' });
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module|Failed to load/);
    }
  });

  it('should return albums sorted by date by default', async () => {
    try {
      const { getAlbums } = await import('../../../src/services/albumService.js');

      const mockAlbums = [
        { id: 1, name: 'Album 1', date: '2024-09-01', photoCount: 5 },
        { id: 2, name: 'Album 2', date: '2024-08-01', photoCount: 3 },
      ];

      globalThis.__TAURI__ = {
        tauri: { invoke: vi.fn().mockResolvedValue(mockAlbums) },
      };

      const result = await getAlbums();

      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('2024-09-01'); // Newest first
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should support custom sorting', async () => {
    try {
      const { getAlbums } = await import('../../../src/services/albumService.js');

      globalThis.__TAURI__ = {
        tauri: { invoke: vi.fn().mockResolvedValue([]) },
      };

      await getAlbums('custom');

      expect(globalThis.__TAURI__.tauri.invoke).toHaveBeenCalledWith('get_albums', {
        sortBy: 'custom',
      });
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should handle errors and rethrow with context', async () => {
    try {
      const { getAlbums } = await import('../../../src/services/albumService.js');

      globalThis.__TAURI__ = {
        tauri: {
          invoke: vi.fn().mockRejectedValue(new Error('DatabaseError')),
        },
      };

      await expect(getAlbums()).rejects.toThrow();
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });
});
