/**
 * 条码工具函数
 * 用于生成基于数据内容的动态条码图案
 */

/**
 * 根据数据生成哈希值
 * @param {Object} data - 收据数据对象
 * @returns {number} 哈希值
 */
export const generateHashFromData = (data) => {
  return JSON.stringify(data)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

/**
 * 生成动态条码图案
 * @param {Object} data - 收据数据对象
 * @param {number} count - 条码数量，默认 32
 * @returns {Array} 条码配置数组 [{width, key}]
 */
export const generateDynamicBarcode = (data, count = 32) => {
  const hash = generateHashFromData(data);
  
  return Array.from({ length: count }, (_, index) => {
    // 基于哈希值和索引计算条码宽度 (2-4px)
    const width = ((hash * (index + 1)) % 3) + 2;
    return { width, key: index };
  });
};

/**
 * 获取当前时间戳后 8 位
 * @returns {string} 8 位数字字符串
 */
export const getTimestamp = () => {
  return Date.now().toString().slice(-8);
};
