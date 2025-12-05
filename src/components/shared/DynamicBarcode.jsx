import React, { useMemo } from 'react';
import { generateDynamicBarcode, getTimestamp } from '../../utils/barcode';

/**
 * 动态条码组件
 * 根据数据内容生成唯一的条码图案，内容变化时条码也会相应变化
 * 
 * @param {Object} props - 组件属性
 * @param {Object} props.data - 收据数据对象（用于生成条码）
 * @param {string} props.tagline - 条码上方显示的标语文本
 * @returns {JSX.Element} 条码组件
 */
export const DynamicBarcode = ({ data, tagline }) => {
  // 使用 useMemo 避免每次渲染都重新计算条码图案
  const barcodePattern = useMemo(() => {
    return generateDynamicBarcode(data, 32);
  }, [data]);

  const timestamp = getTimestamp();

  return (
    <div className="mt-auto pt-4 flex flex-col items-center">
      {/* 分割线 */}
      <div className="w-full border-t border-dashed border-gray-400 mb-3"></div>
      
      {/* 标语 */}
      <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-center">
        {tagline}
      </div>
      
      {/* 条码图案 */}
      <div className="w-full h-12 overflow-hidden flex items-center justify-between">
        {barcodePattern.map(({ width, key }) => (
          <div
            key={key}
            className="bg-black h-full"
            style={{ width: `${width}px`, marginLeft: '1px' }}
          />
        ))}
      </div>
      
      {/* 时间戳 */}
      <div className="text-[10px] mt-1 font-mono">{timestamp}</div>
    </div>
  );
};
