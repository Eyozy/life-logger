import { useState } from 'react';
import { toPng } from 'html-to-image';
import '../styles/receipt-font.css';
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
      // Ensure the receipt pixel font is actually loaded before rendering to canvas.
      // This avoids fallback fonts in the exported PNG (especially for CJK glyphs).
      if (document.fonts?.load) {
        try {
          // Attempt to load primary pixel fonts with essential glyphs for faster check
          await Promise.all([
            document.fonts.load('400 16px "Fusion Pixel 12px Monospaced SC"', "LIFE_LOGGER"),
            document.fonts.load('400 16px "Zpix"', "测试"),
          ]);
          // Wait for all fonts to be ready
          await document.fonts.ready;
        } catch (fontErr) {
          console.warn('Font loading check timed out or failed, proceeding with fallback delay', fontErr);
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } else {
        // Fallback for browsers without document.fonts API
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // Additional stability delay
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
