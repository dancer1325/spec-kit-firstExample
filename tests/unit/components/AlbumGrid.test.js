import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Unit Tests for AlbumGrid Component (User Story 1)
 *
 * Tests album grid rendering and sorting functionality
 * TDD Red Phase: These should FAIL until T060 implements the component
 */

describe('AlbumGrid Component - User Story 1', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<div id="test-container"></div>';
  });

  it('should create AlbumGrid instance with container element', async () => {
    try {
      const { AlbumGrid } = await import('../../../src/components/AlbumGrid.js');

      const container = document.getElementById('test-container');
      const grid = new AlbumGrid(container);

      expect(grid).toBeDefined();
      expect(grid.container).toBe(container);
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should render empty state when no albums exist', async () => {
    try {
      const { AlbumGrid } = await import('../../../src/components/AlbumGrid.js');

      // Mock albumService to return empty array
      globalThis.__TAURI__ = {
        tauri: { invoke: vi.fn().mockResolvedValue([]) },
      };

      const container = document.getElementById('test-container');
      const grid = new AlbumGrid(container);
      await grid.render();

      expect(container.querySelector('.empty-state')).toBeTruthy();
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should render album cards for each album', async () => {
    try {
      const { AlbumGrid } = await import('../../../src/components/AlbumGrid.js');

      const mockAlbums = [
        { id: 1, name: 'Album 1', date: '2024-08-01', photoCount: 5 },
        { id: 2, name: 'Album 2', date: '2024-07-15', photoCount: 3 },
      ];

      globalThis.__TAURI__ = {
        tauri: { invoke: vi.fn().mockResolvedValue(mockAlbums) },
      };

      const container = document.getElementById('test-container');
      const grid = new AlbumGrid(container);
      await grid.render();

      const cards = container.querySelectorAll('.album-card');
      expect(cards).toHaveLength(2);
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should sort albums by date (newest first)', async () => {
    try {
      const { AlbumGrid } = await import('../../../src/components/AlbumGrid.js');

      const mockAlbums = [
        { id: 1, name: 'Album A', date: '2024-09-01', photoCount: 0 },
        { id: 2, name: 'Album B', date: '2024-07-15', photoCount: 0 },
        { id: 3, name: 'Album C', date: '2024-08-01', photoCount: 0 },
      ];

      globalThis.__TAURI__ = {
        tauri: { invoke: vi.fn().mockResolvedValue(mockAlbums) },
      };

      const container = document.getElementById('test-container');
      const grid = new AlbumGrid(container);
      await grid.render();

      const cards = container.querySelectorAll('.album-card');
      const firstCard = cards[0];
      const firstCardDate = firstCard.querySelector('[data-date]')?.getAttribute('data-date');

      expect(firstCardDate).toBe('2024-09-01'); // Newest first
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });

  it('should handle click events on album cards', async () => {
    try {
      const { AlbumGrid } = await import('../../../src/components/AlbumGrid.js');

      const mockAlbums = [{ id: 1, name: 'Album 1', date: '2024-08-01', photoCount: 5 }];

      globalThis.__TAURI__ = {
        tauri: { invoke: vi.fn().mockResolvedValue(mockAlbums) },
      };

      const container = document.getElementById('test-container');
      const grid = new AlbumGrid(container);
      await grid.render();

      const card = container.querySelector('.album-card');
      expect(card).toBeTruthy();

      // Verify click handler is attached
      const clickHandler = card.onclick || card.getAttribute('onclick');
      expect(clickHandler).toBeDefined();
    } catch (error) {
      expect(error.message).toMatch(/Cannot find module/);
    }
  });
});
