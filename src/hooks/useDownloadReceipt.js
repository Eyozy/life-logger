import { useState } from 'react';
import { toPng } from 'html-to-image';
import {
  EXPORT_IMAGE_QUALITY,
  EXPORT_IMAGE_PIXEL_RATIO,
  EXPORT_IMAGE_DELAY,
  RECEIPT_WIDTH
} from '../utils/constants';

/**
 * Custom hook for downloading receipt as PNG image
 * @param {string} receiptType - Receipt type for filename
 * @returns {Object} { isDownloading, handleDownload, error }
 */
export const useDownloadReceipt = (receiptType = 'RECEIPT') => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async (receiptRef) => {
    if (!receiptRef.current) {
      setError('Receipt element not found');
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      // Wait for fonts to load
      if (document.fonts) {
        await document.fonts.ready;
      } else {
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      await new Promise(resolve => setTimeout(resolve, EXPORT_IMAGE_DELAY));

      // Verify element visibility
      const element = receiptRef.current;
      if (element.offsetWidth === 0 || element.offsetHeight === 0) {
        throw new Error('Receipt element is not visible');
      }

      // Generate PNG image
      const dataUrl = await toPng(element, {
        quality: EXPORT_IMAGE_QUALITY,
        pixelRatio: EXPORT_IMAGE_PIXEL_RATIO,
        backgroundColor: null,
        width: RECEIPT_WIDTH,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `${receiptType}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      console.log('Download successful:', link.download);
    } catch (err) {
      console.error('Download failed:', err);

      let errorMessage = 'Download failed: ';
      if (err.message.includes('Canvas')) {
        errorMessage += 'Image rendering failed, please refresh and retry';
      } else if (err.message.includes('Memory') || err.message.includes('memory')) {
        errorMessage += 'Insufficient memory, please close other tabs and retry';
      } else if (err.message.includes('not visible')) {
        errorMessage += err.message;
      } else {
        errorMessage += err.message || 'Unknown error';
      }
      errorMessage += '\n\nPlease ensure browser has download permission';

      setError(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, handleDownload, error };
};
