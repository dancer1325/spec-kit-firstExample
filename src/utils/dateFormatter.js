/**
 * Date Formatting Utilities
 *
 * Handles ISO 8601 date formatting for album dates
 */

/**
 * Format a Date object to ISO 8601 YYYY-MM-DD format
 * @param {Date} date - The date to format
 * @returns {string} ISO 8601 formatted date (YYYY-MM-DD)
 */
export function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse ISO 8601 YYYY-MM-DD string to Date object
 * @param {string} isoDate - ISO 8601 date string
 * @returns {Date} Parsed date object
 * @throws {Error} If date string is invalid
 */
export function parseISODate(isoDate) {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid ISO 8601 date: ${isoDate}`);
  }
  return date;
}

/**
 * Format ISO 8601 date to human-readable format
 * @param {string} isoDate - ISO 8601 date string (YYYY-MM-DD)
 * @returns {string} Human-readable date (e.g., "Aug 15, 2024")
 */
export function formatDateToHuman(isoDate) {
  try {
    const date = parseISODate(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return isoDate; // Fallback to original string
  }
}

/**
 * Get today's date in ISO 8601 format
 * @returns {string} Today's date (YYYY-MM-DD)
 */
export function getTodayISO() {
  return formatDateToISO(new Date());
}

/**
 * Validate ISO 8601 date string format
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid ISO 8601 YYYY-MM-DD format
 */
export function isValidISODate(dateString) {
  if (typeof dateString !== 'string') return false;

  const iso8601Pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!iso8601Pattern.test(dateString)) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Compare two ISO 8601 dates
 * @param {string} date1 - First ISO date
 * @param {string} date2 - Second ISO date
 * @returns {number} Negative if date1 < date2, 0 if equal, positive if date1 > date2
 */
export function compareDates(date1, date2) {
  return date1.localeCompare(date2);
}
