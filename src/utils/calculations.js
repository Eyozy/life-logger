/**
 * 计算相关工具函数
 */

import { 
  MINUTES_PER_HOUR, 
  MINUTES_PER_DAY, 
  SLEEP_SCORE_WEIGHTS,
  SLEEP_SCORE_THRESHOLDS,
  CAFFEINE_THRESHOLDS
} from './constants';

/**
 * 计算睡眠时长
 * 自动处理跨天情况
 * 
 * @param {string} bedtime - 入睡时间 (格式："HH:MM")
 * @param {string} wakeTime - 起床时间 (格式："HH:MM")
 * @returns {string} 睡眠时长 (格式："Xh Ym")
 * 
 * @example
 * calculateSleepDuration("23:30", "07:15") // "7h 45m"
 * calculateSleepDuration("01:00", "09:00") // "8h 0m"
 */
export const calculateSleepDuration = (bedtime, wakeTime) => {
  if (!bedtime || !wakeTime) return "0h 0m";
  
  // 解析时间字符串
  const [bedHour, bedMinute] = bedtime.split(':').map(Number);
  const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
  
  // 转换为分钟数
  let bedMinutes = bedHour * MINUTES_PER_HOUR + bedMinute;
  let wakeMinutes = wakeHour * MINUTES_PER_HOUR + wakeMinute;
  
  // 处理跨天情况（起床时间早于入睡时间）
  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += MINUTES_PER_DAY;
  }
  
  // 计算时长
  const diffMinutes = wakeMinutes - bedMinutes;
  const hours = Math.floor(diffMinutes / MINUTES_PER_HOUR);
  const minutes = diffMinutes % MINUTES_PER_HOUR;
  
  return `${hours}h ${minutes}m`;
};

/**
 * 计算睡眠综合评分
 * 基于睡眠质量、深度睡眠和起床精神度的加权平均
 * 
 * @param {Object} metrics - 睡眠指标对象
 * @param {number} metrics.quality - 睡眠质量 (0-100)
 * @param {number} metrics.deepSleep - 深度睡眠感 (0-100)
 * @param {number} metrics.wakeFreshness - 起床精神度 (0-100)
 * @returns {number} 综合评分 (0-100)
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
 * 获取睡眠评分等级
 * 
 * @param {number} score - 睡眠评分 (0-100)
 * @param {Object} labels - 等级标签对象
 * @returns {string} 评分等级
 * 
 * @example
 * getSleepScoreLabel(85, { excellent: "优秀", good: "良好", fair: "一般", poor: "较差" }) // "优秀"
 */
export const getSleepScoreLabel = (score, labels) => {
  if (score >= SLEEP_SCORE_THRESHOLDS.excellent) return labels.excellent;
  if (score >= SLEEP_SCORE_THRESHOLDS.good) return labels.good;
  if (score >= SLEEP_SCORE_THRESHOLDS.fair) return labels.fair;
  return labels.poor;
};

/**
 * 获取咖啡因摄入状态
 * 
 * @param {number} totalCaffeine - 总咖啡因摄入量 (mg)
 * @param {Object} statusLabels - 状态标签对象
 * @returns {Object} { status: string, icon: string }
 * 
 * @example
 * getCaffeineStatus(280, {...}) // { status: "适量摄入", icon: "○" }
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
 * 计算购物清单总额
 * 过滤掉无效价格并求和
 * 
 * @param {Array} items - 商品列表
 * @returns {Object} { total: number, hasTotal: boolean }
 * 
 * @example
 * calculateShoppingTotal([
 *   { name: "外套", price: 599 },
 *   { name: "T恤", price: null },
 *   { name: "袜子", price: 79 }
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
