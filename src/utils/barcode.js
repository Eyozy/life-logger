/**
 * Barcode utility helpers.
 * Generates a deterministic barcode-like pattern from data.
 */

/**
 * Generate a simple hash from a data object.
 * @param {Object} data - Receipt data
 * @returns {number} Hash value
 */
export const generateHashFromData = (data) => {
  return JSON.stringify(data)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

/**
 * Generate a barcode-like pattern.
 * @param {Object} data - Receipt data
 * @param {number} count - Number of segments (default: 32)
 * @returns {Array} Segment configuration array [{ width, key }]
 */
export const generateDynamicBarcode = (data, count = 32) => {
  const hash = generateHashFromData(data);
  
  return Array.from({ length: count }, (_, index) => {
    // Compute a deterministic segment width (2-4px) from hash + index
    const width = ((hash * (index + 1)) % 3) + 2;
    return { width, key: index };
  });
};

/**
 * Get the last 8 digits of the current timestamp.
 * @returns {string} 8-digit numeric string
 */
export const getTimestamp = () => {
  return Date.now().toString().slice(-8);
};
