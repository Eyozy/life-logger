import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * 可折叠的输入区块组件
 * 用于组织表单的不同部分，支持展开/折叠
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.title - 区块标题
 * @param {React.ReactNode} props.children - 子组件内容
 * @param {boolean} props.isOpen - 是否展开
 * @param {Function} props.onToggle - 切换展开/折叠的回调函数
 */
export const InputSection = ({ title, children, isOpen, onToggle }) => (
  <div className={`border border-gray-200 rounded-lg bg-white overflow-hidden transition-all duration-300 mb-3 ${isOpen ? 'shadow-md ring-1 ring-black/5' : 'hover:border-gray-300'}`}>
    {/* 标题栏 - 可点击切换展开状态 */}
    <button 
      onClick={onToggle} 
      className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
    >
      <h3 className={`text-sm font-bold uppercase tracking-wider ${isOpen ? 'text-black' : 'text-gray-600'}`}>
        {title}
      </h3>
      <div className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-black' : ''}`}>
        <ChevronDown size={18} />
      </div>
    </button>
    
    {/* 内容区 - 展开时显示 */}
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}> 
      <div className="p-4 pt-0 border-t border-gray-50">
        <div className="pt-4 space-y-4">{children}</div>
      </div>
    </div>
  </div>
);

/**
 * 输入框组件
 * 支持文本输入和多行文本输入，多行文本会自动调整高度
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.label - 标签文本
 * @param {string} props.value - 输入值
 * @param {Function} props.onChange - 值变化回调
 * @param {string} [props.placeholder=''] - 占位符文本
 * @param {boolean} [props.isTextArea=false] - 是否为多行文本
 * @param {string} [props.type='text'] - 输入类型
 */
export const InputGroup = ({ label, value, onChange, placeholder = '', isTextArea = false, type = 'text' }) => {
  // 多行文本自动调整高度
  const handleTextareaChange = (e) => {
    onChange(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
  };

  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          value={value}
          onChange={handleTextareaChange}
          onInput={handleTextareaChange}
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm resize-none h-auto min-h-[6rem] block transition-all font-mono"
          style={{ overflow: 'hidden' }}
        />
      ) : (
        <input 
          type={type} 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          placeholder={placeholder} 
          className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm block transition-all" 
        />
      )}
    </div>
  );
};

/**
 * 滑动条评分组件
 * 用于输入 0-max 的数值评分
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.label - 标签文本
 * @param {number} props.value - 当前值
 * @param {Function} props.onChange - 值变化回调
 * @param {number} [props.max=100] - 最大值
 */
export const RatingSlider = ({ label, value, onChange, max = 100 }) => (
  <div className="flex items-center gap-3 min-w-0">
    <span className="flex-shrink-0 min-w-0 max-w-[6rem] text-[10px] font-bold uppercase text-gray-500 truncate">
      {label}
    </span>
    <div className="flex-1 min-w-0 h-2 border border-gray-300 bg-gray-50 rounded-sm overflow-hidden relative">
      <div className="h-full bg-black" style={{ width: `${(value / max) * 100}%` }}></div>
      <input 
        type="range" 
        min="0" 
        max={max} 
        value={value} 
        onChange={e => onChange(parseInt(e.target.value))} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        aria-label={label}
      />
    </div>
    <span className="flex-shrink-0 w-12 text-right text-xs font-mono font-bold text-gray-900 tabular-nums">
      {max === 100 ? `${value}%` : `${value}/${max}`}
    </span>
  </div>
);

/**
 * 指标条形图组件
 * 用于在收据预览中显示评分指标
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.label - 指标名称
 * @param {number} props.value - 指标值
 * @param {number} [props.max=10] - 最大值
 */
export const MetricBar = ({ label, value, max = 100 }) => (
  <div className="flex items-center gap-1.5 min-w-0 w-full">
    <span className="flex-shrink-0 w-16 text-[8px] font-bold text-right truncate leading-tight">
      {label}
    </span>
    <div className="flex-1 min-w-0 h-3 border border-black bg-white relative">
      <div
        className="h-full bg-black relative z-10 transition-all duration-300"
        style={{ width: `${Math.min(value, max)}%` }}
      ></div>
    </div>
    <span className="flex-shrink-0 w-12 text-right text-[10px] font-bold tabular-nums leading-tight">
      {max === 100 ? `${value}%` : `${value}/${max}`}
    </span>
  </div>
);
