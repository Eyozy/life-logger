/**
 * Calculation helpers.
 */

import { 
  MINUTES_PER_HOUR, 
  MINUTES_PER_DAY, 
  SLEEP_SCORE_WEIGHTS,
  SLEEP_SCORE_THRESHOLDS,
  CAFFEINE_THRESHOLDS
} from './constants';

/**
 * Calculate sleep duration.
 * Automatically handles crossing midnight.
 *
 * @param {string} bedtime - Bedtime time string ("HH:MM")
 * @param {string} wakeTime - Wake time string ("HH:MM")
 * @returns {string} Sleep duration ("Xh Ym")
 *
 * @example
 * calculateSleepDuration("23:30", "07:15") // "7h 45m"
 * calculateSleepDuration("01:00", "09:00") // "8h 0m"
 */
export const calculateSleepDuration = (bedtime, wakeTime) => {
  if (!bedtime || !wakeTime) return "0h 0m";
  
  // Parse "HH:MM"
  const [bedHour, bedMinute] = bedtime.split(':').map(Number);
  const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
  
  // Convert to minutes
  let bedMinutes = bedHour * MINUTES_PER_HOUR + bedMinute;
  let wakeMinutes = wakeHour * MINUTES_PER_HOUR + wakeMinute;
  
  // Handle crossing midnight (wake time earlier than bedtime)
  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += MINUTES_PER_DAY;
  }
  
  // Calculate duration
  const diffMinutes = wakeMinutes - bedMinutes;
  const hours = Math.floor(diffMinutes / MINUTES_PER_HOUR);
  const minutes = diffMinutes % MINUTES_PER_HOUR;
  
  return `${hours}h ${minutes}m`;
};

/**
 * Calculate an overall sleep score.
 * Weighted average of quality, deep sleep, and wake freshness.
 *
 * @param {Object} metrics - Sleep metrics object
 * @param {number} metrics.quality - Sleep quality (0-100)
 * @param {number} metrics.deepSleep - Deep sleep (0-100)
 * @param {number} metrics.wakeFreshness - Wake freshness (0-100)
 * @returns {number} Overall score (0-100)
 *
 * @example
 * calculateSleepScore({ quality: 80, deepSleep: 75, wakeFreshness: 70 }) // 76
 */
export const calculateSleepScore = (metrics) => {
  const { quality = 0, deepSleep = 0, wakeFreshness = 0 } = metrics;
  
  const score = 
    quality * SLEEP_SCORE_WEIGHTS.quality +
    deepSleep * SLEEP_SCORE_WEIGHTS.deepSleep +
    wakeFreshness * SLEEP_SCORE_WEIGHTS.wakeFreshness;
  
  return Math.round(score);
};

/**
 * Get a sleep score label based on thresholds.
 *
 * @param {number} score - Sleep score (0-100)
 * @param {Object} labels - Label map
 * @returns {string} Label
 *
 * @example
 * getSleepScoreLabel(85, { excellent: "Excellent", good: "Good", fair: "Fair", poor: "Poor" }) // "Excellent"
 */
export const getSleepScoreLabel = (score, labels) => {
  if (score >= SLEEP_SCORE_THRESHOLDS.excellent) return labels.excellent;
  if (score >= SLEEP_SCORE_THRESHOLDS.good) return labels.good;
  if (score >= SLEEP_SCORE_THRESHOLDS.fair) return labels.fair;
  return labels.poor;
};

/**
 * Get caffeine intake status.
 *
 * @param {number} totalCaffeine - Total caffeine intake (mg)
 * @param {Object} statusLabels - Status label map
 * @returns {Object} { status: string, icon: string }
 *
 * @example
 * getCaffeineStatus(280, {...}) // { status: "Moderate", icon: "○" }
 */
export const getCaffeineStatus = (totalCaffeine, statusLabels) => {
  if (totalCaffeine < CAFFEINE_THRESHOLDS.safe) {
    return { status: statusLabels.low, icon: "✓" };
  }
  if (totalCaffeine < CAFFEINE_THRESHOLDS.moderate) {
    return { status: statusLabels.medium, icon: "○" };
  }
  if (totalCaffeine < CAFFEINE_THRESHOLDS.high) {
    return { status: statusLabels.high, icon: "!" };
  }
  return { status: statusLabels.danger, icon: "!!" };
};

/**
 * Calculate the total cost for a shopping list.
 * Filters invalid prices and sums the rest.
 *
 * @param {Array} items - Item list
 * @returns {Object} { total: number, hasTotal: boolean }
 *
 * @example
 * calculateShoppingTotal([
 *   { name: "Coat", price: 599 },
 *   { name: "T-Shirt", price: null },
 *   { name: "Socks", price: 79 }
 * ]) // { total: 678, hasTotal: true }
 */
export const calculateShoppingTotal = (items) => {
  const validItems = items.filter(
    item => item.price !== null && 
            item.price !== undefined && 
            !isNaN(item.price)
  );
  
  const total = validItems.reduce((sum, item) => sum + item.price, 0);
  
  return {
    total,
    hasTotal: validItems.length > 0
  };
};
