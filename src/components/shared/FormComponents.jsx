import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Collapsible form section component.
 * Used to group related inputs with an expand/collapse UI.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {React.ReactNode} props.children - Section content
 * @param {boolean} props.isOpen - Whether the section is expanded
 * @param {Function} props.onToggle - Toggle expand/collapse callback
 */
export const InputSection = ({ title, children, isOpen, onToggle }) => {
  const contentId = useId();

  return (
  <div className={`border border-gray-200 rounded-lg bg-white overflow-hidden transition-all duration-300 mb-3 ${isOpen ? 'shadow-md ring-1 ring-black/5' : 'hover:border-gray-300'}`}>
    {/* Header: click to toggle expanded state */}
    <button 
      onClick={onToggle} 
      className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
      aria-expanded={isOpen}
      aria-controls={contentId}
    >
      <h2 className={`text-sm font-bold uppercase tracking-wider ${isOpen ? 'text-black' : 'text-gray-700'}`}>
        {title}
      </h2>
      <div className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-black' : ''}`}>
        <ChevronDown size={18} />
      </div>
    </button>
    
    {/* Content: shown when expanded */}
    <div id={contentId} className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}> 
      <div className="p-4 pt-0 border-t border-gray-50">
        <div className="pt-4 space-y-4">{children}</div>
      </div>
    </div>
  </div>
  );
};

/**
 * Input field component.
 * Supports both single-line input and auto-resizing textarea.
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label text
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change callback
 * @param {string} [props.placeholder=''] - Placeholder text
 * @param {boolean} [props.isTextArea=false] - Render as textarea
 * @param {string} [props.type='text'] - Input type
 */
export const InputGroup = ({ label, value, onChange, placeholder = '', isTextArea = false, type = 'text' }) => {
  const inputId = useId();

  // Auto-resize multiline textarea
  const handleTextareaChange = (e) => {
    onChange(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
  };

  return (
    <div>
      <label htmlFor={inputId} className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={inputId}
          value={value}
          onChange={handleTextareaChange}
          onInput={handleTextareaChange}
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm resize-none h-auto min-h-[6rem] block transition-all font-mono"
          style={{ overflow: 'hidden' }}
        />
      ) : (
        <input 
          id={inputId}
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
 * Slider rating component.
 * Used to input a numeric rating from 0..max.
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label text
 * @param {number} props.value - Current value
 * @param {Function} props.onChange - Change callback
 * @param {number} [props.max=100] - Max value
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
 * Metric bar component.
 * Used to display a metric value in receipt previews.
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Metric label
 * @param {number} props.value - Metric value
 * @param {number} [props.max=100] - Max value
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
