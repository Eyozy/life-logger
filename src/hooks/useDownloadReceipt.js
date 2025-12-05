import { useState } from 'react';
import { 
  HTML_TO_IMAGE_CDN, 
  EXPORT_IMAGE_QUALITY, 
  EXPORT_IMAGE_PIXEL_RATIO, 
  EXPORT_IMAGE_DELAY,
  RECEIPT_WIDTH 
} from '../utils/constants';

/**
 * 自定义 Hook：下载收据为 PNG 图片
 * 
 * @param {string} receiptType - 收据类型，用于生成文件名
 * @returns {Object} { isDownloading, handleDownload, error }
 */
export const useDownloadReceipt = (receiptType = 'RECEIPT') => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 动态加载 html-to-image 库
   * @returns {Promise<void>}
   */
  const loadHtmlToImage = async () => {
    if (window.htmlToImage) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = HTML_TO_IMAGE_CDN;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load html-to-image library'));
      document.head.appendChild(script);
    });
  };

  /**
   * 处理下载逻辑
   * @param {React.RefObject} receiptRef - 收据元素的引用
   */
  const handleDownload = async (receiptRef) => {
    if (!receiptRef.current) {
      setError('收据元素未找到');
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      // 加载 html-to-image 库
      await loadHtmlToImage();

      // 等待一小段时间确保渲染完成
      await new Promise(resolve => setTimeout(resolve, EXPORT_IMAGE_DELAY));

      // 生成 PNG 图片
      const dataUrl = await window.htmlToImage.toPng(receiptRef.current, {
        quality: EXPORT_IMAGE_QUALITY,
        pixelRatio: EXPORT_IMAGE_PIXEL_RATIO,
        backgroundColor: null,
        width: RECEIPT_WIDTH,
      });

      // 创建下载链接
      const link = document.createElement('a');
      link.download = `${receiptType}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      console.log('Download successful:', link.download);
    } catch (err) {
      console.error('Download failed:', err);
      setError(`下载失败：${err.message || '未知错误'}\n请检查浏览器权限设置`);
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, handleDownload, error };
};
