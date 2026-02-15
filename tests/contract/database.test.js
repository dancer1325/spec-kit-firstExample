import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Contract tests for initialize_database Tauri command
 * Tests the interface defined in contracts/tauri-commands.md
 *
 * TDD Red Phase: These tests will FAIL until T030 implements the command
 */

// Mock Tauri invoke for testing
const mockInvoke = async (cmd, args) => {
  // This will be replaced with actual Tauri invoke in integration tests
  throw new Error(`Command '${cmd}' not implemented yet`);
};

describe('initialize_database command contract', () => {
  it('should return success with version and created flag', async () => {
    const result = await mockInvoke('initialize_database', {});

    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('version');
    expect(result).toHaveProperty('created');
    expect(typeof result.success).toBe('boolean');
    expect(typeof result.version).toBe('number');
    expect(typeof result.created).toBe('boolean');
  });

  it('should be idempotent (safe to call multiple times)', async () => {
    const firstCall = await mockInvoke('initialize_database', {});
    const secondCall = await mockInvoke('initialize_database', {});

    expect(secondCall.success).toBe(true);
    expect(secondCall.created).toBe(false); // Already existed
  });

  it('should return DatabaseError on failure', async () => {
    // Simulate corrupted database scenario
    await expect(mockInvoke('initialize_database', {})).rejects.toMatchObject({
      type: 'DatabaseError',
      message: expect.any(String),
    });
  });
});
