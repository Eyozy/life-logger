// Global constants configuration

// ==================== Receipt Style ====================
export const RECEIPT_WIDTH = 380;
export const RECEIPT_SCALE_MOBILE = 0.9;
export const RECEIPT_SCALE_DESKTOP = 1.0;

// ==================== Barcode Configuration ====================
export const BARCODE_BARS_COUNT = 32;
export const BARCODE_WIDTH_RANGE = 3;
export const BARCODE_MIN_WIDTH = 2;
export const BARCODE_HEIGHT = 48;

// ==================== Form Configuration ====================
export const INPUT_SECTION_MAX_HEIGHT = 800;
export const TEXTAREA_MIN_HEIGHT = 96;
export const TEXTAREA_MAX_HEIGHT = 300;

// ==================== Rating Range ====================
export const RATING_MIN = 0;
export const RATING_MAX_PERCENT = 100;
export const RATING_MAX_STAR = 5;
export const RATING_MAX_SCORE = 10;

// ==================== Image Export Configuration ====================
export const getOptimalPixelRatio = () => {
  if (typeof window === 'undefined') return 2;

  const isMobile = window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

  if (isMobile && isLowEnd) return 2;
  if (isMobile) return 2;
  return 2.5;
};

export const EXPORT_IMAGE_QUALITY = 0.92;
export const EXPORT_IMAGE_PIXEL_RATIO = getOptimalPixelRatio();
export const EXPORT_IMAGE_DELAY = 100;

// ==================== Time Format ====================
export const TIME_FORMAT_24H = 'HH:MM';
export const MINUTES_PER_HOUR = 60;
export const MINUTES_PER_DAY = 1440;

// ==================== Sleep Score Weights ====================
export const SLEEP_SCORE_WEIGHTS = {
  quality: 0.4,
  deepSleep: 0.3,
  wakeFreshness: 0.3,
};

// ==================== Sleep Score Thresholds ====================
export const SLEEP_SCORE_THRESHOLDS = {
  excellent: 80,
  good: 60,
  fair: 40,
};

// ==================== Caffeine Thresholds (mg) ====================
export const CAFFEINE_THRESHOLDS = {
  safe: 200,
  moderate: 300,
  high: 400,
};

// ==================== Responsive Breakpoints ====================
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

// ==================== Z-Index Layers ====================
export const Z_INDEX = {
  editor: 10,
  preview: 0,
  mobileTab: 50,
  downloadButton: 20,
};

// ==================== Animation Duration (ms) ====================
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};
