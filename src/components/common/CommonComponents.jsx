import React, { useId, memo } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Standardized Input Section with Accordion behavior
 * Uses memo to prevent unnecessary re-renders when data changes elsewhere
 */
export const InputSection = memo(
  ({ title, desc, children, isOpen, onToggle }) => {
    const contentId = useId();

    return (
      <div
        className={`border border-gray-200 rounded-lg bg-white overflow-hidden transition-all duration-300 mb-3 ${
          isOpen ? "shadow-md ring-1 ring-black/5" : "hover:border-gray-300"
        }`}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
          aria-expanded={isOpen}
          aria-controls={contentId}
        >
          <div>
            <h2
              className={`text-sm font-bold uppercase tracking-wider ${
                isOpen ? "text-black" : "text-gray-700"
              }`}
            >
              {title}
            </h2>
            {desc && (
              <p className="text-[10px] text-gray-600 mt-0.5 font-medium leading-tight">
                {desc}
              </p>
            )}
          </div>
          <div
            className={`text-gray-400 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-black" : ""
            }`}
          >
            <ChevronDown size={18} />
          </div>
        </button>
        <div
          id={contentId}
          className={`transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 pt-0 border-t border-gray-50">
            <div className="pt-4 space-y-4">{children}</div>
          </div>
        </div>
      </div>
    );
  }
);

InputSection.displayName = "InputSection";

/**
 * Standardized Input Group for Text and TextArea
 */
export const InputGroup = memo(
  ({
    label,
    value,
    onChange,
    placeholder,
    isTextArea = false,
    className = "",
  }) => {
    const inputId = useId();

    const baseStyles =
      "w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm transition-all block";

    return (
      <div className={className}>
        <label
          htmlFor={inputId}
          className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wide"
        >
          {label}
        </label>
        {isTextArea ? (
          <textarea
            id={inputId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${baseStyles} resize-none h-24`}
          />
        ) : (
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={baseStyles}
          />
        )}
      </div>
    );
  }
);

InputGroup.displayName = "InputGroup";

/**
 * Standardized Slider for metrics
 */
export const SliderItem = memo(({ label, value, onChange }) => (
  <div className="flex items-center gap-3">
    <span className="w-24 text-[10px] font-bold uppercase text-gray-700 truncate">
      {label}
    </span>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      style={{
        background: `linear-gradient(to right, black ${value}%, #e5e7eb ${value}%)`,
      }}
      className="flex-1 h-1 rounded-lg appearance-none cursor-pointer accent-black"
    />
    <span className="w-8 font-mono text-xs font-bold text-right text-gray-900">
      {value}
    </span>
  </div>
));

SliderItem.displayName = "SliderItem";
