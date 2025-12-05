/**
 * 全局常量配置
 * 集中管理所有魔法数字和固定值，便于维护和修改
 */

// ==================== 收据样式常量 ====================
export const RECEIPT_WIDTH = 380; // 收据宽度（px）
export const RECEIPT_SCALE_MOBILE = 0.9; // 移动端缩放比例
export const RECEIPT_SCALE_DESKTOP = 1.0; // 桌面端缩放比例

// ==================== 条码配置 ====================
export const BARCODE_BARS_COUNT = 32; // 条码数量
export const BARCODE_WIDTH_RANGE = 3; // 条码宽度变化范围（0-2）
export const BARCODE_MIN_WIDTH = 2; // 条码最小宽度（px）
export const BARCODE_HEIGHT = 48; // 条码高度（px，对应 h-12）

// ==================== 表单配置 ====================
export const INPUT_SECTION_MAX_HEIGHT = 800; // 折叠区块最大高度（px）
export const TEXTAREA_MIN_HEIGHT = 96; // 多行文本最小高度（px，对应 6rem）
export const TEXTAREA_MAX_HEIGHT = 300; // 多行文本最大高度（px）

// ==================== 评分范围 ====================
export const RATING_MIN = 0; // 最小评分
export const RATING_MAX_PERCENT = 100; // 百分比最大值
export const RATING_MAX_STAR = 5; // 星级最大值
export const RATING_MAX_SCORE = 10; // 10 分制最大值

// ==================== 图片导出配置 ====================
export const EXPORT_IMAGE_QUALITY = 1.0; // 导出图片质量
export const EXPORT_IMAGE_PIXEL_RATIO = 3; // 导出图片像素比
export const EXPORT_IMAGE_DELAY = 100; // 导出前延迟（ms）

// ==================== CDN 链接 ====================
export const HTML_TO_IMAGE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js';

// ==================== 时间格式 ====================
export const TIME_FORMAT_24H = 'HH:MM'; // 24 小时制时间格式
export const MINUTES_PER_HOUR = 60; // 每小时分钟数
export const MINUTES_PER_DAY = 1440; // 每天分钟数

// ==================== 睡眠评分权重 ====================
export const SLEEP_SCORE_WEIGHTS = {
  quality: 0.4, // 睡眠质量权重 40%
  deepSleep: 0.3, // 深度睡眠权重 30%
  wakeFreshness: 0.3, // 起床精神度权重 30%
};

// ==================== 睡眠评分等级 ====================
export const SLEEP_SCORE_THRESHOLDS = {
  excellent: 80, // 优秀
  good: 60, // 良好
  fair: 40, // 一般
  // poor: < 40 // 较差
};

// ==================== 咖啡因摄入量分级（mg）====================
export const CAFFEINE_THRESHOLDS = {
  safe: 200, // 安全范围
  moderate: 300, // 适量
  high: 400, // 接近上限
  // danger: > 400 // 超标
};

// ==================== 响应式断点 ====================
export const BREAKPOINTS = {
  mobile: 768, // 移动端最大宽度
  tablet: 1024, // 平板最大宽度
  desktop: 1280, // 桌面最小宽度
};

// ==================== Z-Index 层级 ====================
export const Z_INDEX = {
  editor: 10,
  preview: 0,
  mobileTab: 50,
  downloadButton: 20,
};

// ==================== 动画时长 ====================
export const ANIMATION_DURATION = {
  fast: 150, // 快速动画（ms）
  normal: 300, // 正常动画（ms）
  slow: 500, // 慢速动画（ms）
};
