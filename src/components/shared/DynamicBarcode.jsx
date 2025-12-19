import React, { useMemo } from 'react';
import { generateDynamicBarcode, getTimestamp } from '../../utils/barcode';

/**
 * Dynamic barcode component.
 * Generates a unique barcode-like pattern based on receipt data.
 *
 * @param {Object} props - Component props
 * @param {Object} props.data - Receipt data object (used for pattern generation)
 * @param {string} props.tagline - Tagline text shown above the barcode
 * @returns {JSX.Element} Barcode component
 */
export const DynamicBarcode = ({ data, tagline }) => {
  // Use useMemo to avoid regenerating the pattern on every render
  const barcodePattern = useMemo(() => {
    return generateDynamicBarcode(data, 32);
  }, [data]);

  const timestamp = getTimestamp();

  return (
    <div className="mt-auto pt-4 flex flex-col items-center">
      {/* Divider */}
      <div className="w-full border-t border-dashed border-gray-400 mb-3"></div>
      
      {/* Tagline */}
      <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-center">
        {tagline}
      </div>
      
      {/* Barcode pattern */}
      <div className="w-full h-12 overflow-hidden flex items-center justify-between">
        {barcodePattern.map(({ width, key }) => (
          <div
            key={key}
            className="bg-black h-full"
            style={{ width: `${width}px`, marginLeft: '1px' }}
          />
        ))}
      </div>
      
      {/* Timestamp */}
      <div className="text-[10px] mt-1 font-receipt">{timestamp}</div>
    </div>
  );
};
