/**
 * Database Service - Wrapper for database initialization
 *
 * Provides a simple interface to initialize the SQLite database
 * through Tauri commands
 */

// Lazy access to Tauri API for testability
const getInvoke = () => window.__TAURI__.tauri.invoke;

/**
 * Initialize the database schema
 * @returns {Promise<{success: boolean, version: number, created: boolean}>}
 * @throws {Error} If database initialization fails
 */
export async function initializeDatabase() {
  try {
    const result = await getInvoke()('initialize_database', {});
    console.log('Database initialized:', result);
    return result;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw new Error(`Database initialization failed: ${error}`);
  }
}

/**
 * Check if database is initialized
 * @returns {Promise<boolean>}
 */
export async function isDatabaseReady() {
  try {
    await getInvoke()('get_albums', { sortBy: 'date' });
    return true;
  } catch (error) {
    return false;
  }
}
