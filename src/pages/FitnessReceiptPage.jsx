import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Download,
  Loader2,
  ChevronDown,
  Globe,
  Activity,
  Dumbbell,
  Flame,
  Eye,
} from "lucide-react";
import { useDownloadReceipt } from "../hooks/useDownloadReceipt";

const TEXT = {
  zh: {
    title: "健身日志",
    subtitle: "// 运动记录小票",
    workoutInfo: "训练信息",
    metrics: "身体反馈",
    log: "训练记录",

    labelType: "训练类型",
    labelDuration: "时长",
    labelDate: "日期",
    labelTime: "开始时间",

    labelPump: "泵感",
    labelPain: "酸痛感",
    labelSweat: "出汗量",
    labelFocus: "专注度",

    labelLocation: "地点",
    labelWorkoutType: "类型",
    labelDurationSummary: "时长",
    labelCalories: "卡路里",
    labelIntensity: "强度",
    labelExercises: "训练列表",
    labelNotesSummary: "训练笔记",
    labelWorkoutTagline: "训练日志已记录",
    labelBodyFeedback: "身体反馈",

    download: "下载",
    downloading: "生成中...",

    types: {
      PUSH: "推 胸肩三头",
      PULL: "拉 背二头",
      LEGS: "腿部",
      CARDIO: "有氧",
      YOGA: "瑜伽拉伸",
      HIIT: "HIIT",
      REST: "主动休息",
    },
  },
  en: {
    title: "BODY_LOG",
    subtitle: "// FITNESS TRACKER",
    workoutInfo: "Session Info",
    metrics: "Body Metrics",
    log: "Workout Log",

    labelType: "Type",
    labelDuration: "Duration (Min)",
    labelDate: "Date",
    labelTime: "Start Time",

    labelPump: "Pump",
    labelPain: "Pain",
    labelSweat: "Sweat",
    labelFocus: "Focus",

    labelLocation: "Location",
    labelWorkoutType: "Type",
    labelDurationSummary: "Duration",
    labelCalories: "Calories",
    labelIntensity: "Intensity",
    labelExercises: "Exercises",
    labelNotesSummary: "Notes",
    labelWorkoutTagline: "#TRAINHARD #NOEXCUSES", // Changed to a tag-line for visual appeal
    labelBodyFeedback: "BODY FEEDBACK",

    download: "DOWNLOAD LOG",
    downloading: "GENERATING...",

    types: {
      PUSH: "Push Day",
      PULL: "Pull Day",
      LEGS: "Leg Day",
      CARDIO: "Cardio",
      YOGA: "Yoga/Stretch",
      HIIT: "HIIT",
      REST: "Active Rest",
    },
  },
};

const InputSection = ({ title, children, isOpen, onToggle }) => (
  <div
    className={`border border-gray-200 rounded-lg bg-white overflow-hidden transition-all duration-300 mb-3 ${
      isOpen ? "shadow-md ring-1 ring-black/5" : "hover:border-gray-300"
    }`}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
    >
      <h3
        className={`text-sm font-bold uppercase tracking-wider ${
          isOpen ? "text-black" : "text-gray-600"
        }`}
      >
        {title}
      </h3>
      <div
        className={`text-gray-400 transition-transform duration-300 ${
          isOpen ? "rotate-180 text-black" : ""
        }`}
      >
        <ChevronDown size={18} />
      </div>
    </button>
    <div
      className={`transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="p-4 pt-0 border-t border-gray-50">
        <div className="pt-4 space-y-4">{children}</div>
      </div>
    </div>
  </div>
);

const InputGroup = ({
  label,
  value,
  onChange,
  placeholder,
  isTextArea = false,
}) => {
  const handleTextareaChange = (e) => {
    // Update the value
    onChange(e.target.value);

    // Automatically adjust the textarea height
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset height to calculate the new one
    textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`; // Set height to scroll height, max 300px
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
          onInput={handleTextareaChange} // Also handle paste and other input events
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm resize-none h-auto min-h-[6rem] block transition-all font-mono"
          style={{ overflow: "hidden" }} // Hide scrollbar while auto-resizing
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm block transition-all"
        />
      )}
    </div>
  );
};

const RatingSlider = ({ label, value, onChange }) => (
  <div className="flex items-center gap-3">
    <span className="w-24 text-[10px] font-bold uppercase text-gray-500 truncate">
      {label}
    </span>
    <div className="flex-1 h-2 border border-gray-300 bg-gray-50 rounded-sm overflow-hidden relative">
      <div className="h-full bg-black" style={{ width: `${value}%` }}></div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
    <span className="w-8 text-right text-xs font-mono font-bold text-gray-900">
      {value}%
    </span>
  </div>
);

export default function FitnessReceiptPage() {
  const [lang, setLang] = useState("zh");
  const [mobileTab, setMobileTab] = useState("edit");
  const [data, setData] = useState({
    type: "LEGS",
    duration: "60", // in minutes
    date: new Date().toLocaleDateString("zh-CN"),
    time: "18:30",
    metrics: {
      pump: 80,
      pain: 90,
      sweat: 75,
      focus: 85,
    },
    intensity: 70, // New: overall intensity 0-100%
    caloriesBurned: 350, // New: calories burned
    location: "Home Gym", // New: workout location
    exercises: [
      // New: Structured exercises
      { name: "深蹲", sets: 5, reps: 5, weight: 100, unit: "kg" },
      { name: "硬拉", sets: 3, reps: 5, weight: 120, unit: "kg" },
      { name: "腿举", sets: 4, reps: 12, weight: 180, unit: "kg" },
    ],
    notes: "今天状态不错，核心收紧感很强，深蹲和硬拉都破了个人记录！", // Retained for free-form notes
  });

  const [expandedSection, setExpandedSection] = useState("workout");
  const receiptRef = useRef(null);
  const { isDownloading, handleDownload, error } = useDownloadReceipt('FITNESS_LOG');
  const t = TEXT[lang];
  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));
  const toggleSection = (s) =>
    setExpandedSection(expandedSection === s ? null : s);

  return (
    <div className="fixed inset-0 bg-gray-100 text-gray-900 font-mono flex flex-col md:flex-row md:justify-center overflow-hidden">
      {/* Editor */}
      <div
        className={`w-full md:w-[450px] md:h-full flex flex-col h-full bg-white z-10 transition-transform duration-300 ${
          mobileTab === "edit"
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } absolute md:relative`}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link
              to="/"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              aria-label={lang === "zh" ? "返回首页" : "Back to home"}
            >
              <ChevronLeft size={18} />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-black text-gray-900 tracking-wider truncate">
                {t.title}
              </h1>
              <p className="text-xs text-gray-400 font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                {t.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={toggleLang}
            className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded font-bold flex items-center gap-1 shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            aria-label={lang === "zh" ? "切换到英文" : "Switch to Chinese"}
          >
            <Globe size={12} aria-hidden="true" />{" "}
            {lang === "zh" ? "EN" : "中文"}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 md:pb-10 no-scrollbar">
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
          <InputSection
            title={t.workoutInfo}
            isOpen={expandedSection === "workout"}
            onToggle={() => toggleSection("workout")}
          >
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">
                {t.labelType}
              </label>
              <select
                value={data.type}
                onChange={(e) => setData({ ...data, type: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm"
              >
                {Object.entries(t.types).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                label={t.labelDuration}
                value={data.duration}
                onChange={(v) => setData({ ...data, duration: v })}
              />
              <InputGroup
                label={t.labelTime}
                value={data.time}
                onChange={(v) => setData({ ...data, time: v })}
              />
            </div>
            <InputGroup
              label={t.labelDate}
              value={data.date}
              onChange={(v) => setData({ ...data, date: v })}
            />
            <InputGroup
              label={t.labelLocation}
              value={data.location}
              onChange={(v) => setData({ ...data, location: v })}
            />
          </InputSection>

          <InputSection
            title={t.metrics}
            isOpen={expandedSection === "metrics"}
            onToggle={() => toggleSection("metrics")}
          >
            <div className="space-y-4 bg-gray-50 p-4 rounded-sm border border-gray-100">
              <RatingSlider
                label={t.labelPump}
                value={data.metrics.pump}
                onChange={(v) =>
                  setData({ ...data, metrics: { ...data.metrics, pump: v } })
                }
              />
              <RatingSlider
                label={t.labelPain}
                value={data.metrics.pain}
                onChange={(v) =>
                  setData({ ...data, metrics: { ...data.metrics, pain: v } })
                }
              />
              <RatingSlider
                label={t.labelSweat}
                value={data.metrics.sweat}
                onChange={(v) =>
                  setData({ ...data, metrics: { ...data.metrics, sweat: v } })
                }
              />
              <RatingSlider
                label={t.labelFocus}
                value={data.metrics.focus}
                onChange={(v) =>
                  setData({ ...data, metrics: { ...data.metrics, focus: v } })
                }
              />
              <RatingSlider
                label={t.labelIntensity}
                value={data.intensity}
                onChange={(v) => setData({ ...data, intensity: parseInt(v) })}
              />
              <InputGroup
                label={t.labelCalories}
                value={data.caloriesBurned}
                onChange={(v) => setData({ ...data, caloriesBurned: v })}
              />
            </div>
          </InputSection>

          <InputSection
            title={t.log}
            isOpen={expandedSection === "log"}
            onToggle={() => toggleSection("log")}
          >
            <InputGroup
              label={t.labelNotesSummary}
              value={data.notes}
              onChange={(v) => setData({ ...data, notes: v })}
              isTextArea
            />
          </InputSection>
          <div className="h-10 md:hidden"></div>
        </div>
      </div>

      {/* Preview */}
      <div
        className={`w-full md:w-[450px] md:h-full bg-gray-200 relative z-0 transition-transform duration-300 ${
          mobileTab === "preview"
            ? "translate-x-0"
            : "translate-x-full md:translate-x-0"
        } absolute md:relative h-full`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => handleDownload(receiptRef)}
            disabled={isDownloading}
            className="bg-black text-white px-5 py-2.5 rounded-full shadow-xl hover:bg-gray-800 transition-all flex items-center gap-2 text-xs font-bold tracking-widest"
          >
            {isDownloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            {isDownloading ? t.downloading : t.download}
          </button>
        </div>

        <div className="w-full h-full overflow-y-auto no-scrollbar">
          <div className="min-h-full flex items-center justify-center py-20 md:py-10">
            <div className="receipt-wrapper origin-top scale-90 sm:scale-100 transition-transform duration-500">
              <FitnessPreview data={data} text={t} ref={receiptRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <nav
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white rounded-full px-1.5 py-1.5 shadow-2xl flex gap-1"
        role="tablist"
        aria-label={lang === "zh" ? "视图切换" : "View tabs"}
      >
        <button
          onClick={() => setMobileTab("edit")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            mobileTab === "edit"
              ? "bg-white text-black"
              : "text-gray-400 hover:text-white"
          }`}
          role="tab"
          aria-selected={mobileTab === "edit"}
          aria-controls="edit-panel"
        >
          <Dumbbell size={14} aria-hidden="true" />{" "}
          {lang === "zh" ? "编辑" : "Edit"}
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            mobileTab === "preview"
              ? "bg-white text-black"
              : "text-gray-400 hover:text-white"
          }`}
          role="tab"
          aria-selected={mobileTab === "preview"}
          aria-controls="preview-panel"
        >
          <Eye size={14} aria-hidden="true" />{" "}
          {lang === "zh" ? "预览" : "Preview"}
        </button>
      </nav>
    </div>
  );
}

// Helper for metrics bars (pump, pain, sweat, focus) - Moved outside FitnessPreview
const MetricBar = ({ label, value }) => (
  <div className="flex items-center gap-2">
    <span className="w-24 text-[10px] font-bold uppercase text-right truncate">
      {label}
    </span>
    <div className="flex-1 h-3 border border-black p-[1px] bg-gray-100 relative">
      <div
        className="h-full bg-black relative z-10"
        style={{ width: `${value}%` }}
      ></div>
    </div>
    <span className="w-8 text-right text-xs font-bold">{value}%</span>
  </div>
);

const FitnessPreview = React.forwardRef(({ data, text }, ref) => {
  // Helper for simple bars (intensity)
  const Bar = ({ val }) => (
    <div className="flex-1 h-2 border border-black p-[1px]">
      <div className="h-full bg-black" style={{ width: `${val}%` }}></div>
    </div>
  );

  // Map for metric labels
  const metricMap = {
    pump: text.labelPump,
    pain: text.labelPain,
    sweat: text.labelSweat,
    focus: text.labelFocus,
  };

  const totalWorkoutVolume = data.exercises.reduce(
    (sum, ex) => sum + ex.sets * ex.reps * ex.weight,
    0
  );

  return (
    // Wrap with a transparent div for html-to-image to capture everything
    <div ref={ref} className="w-[380px] flex flex-col relative">
      {/* Receipt Content */}
      <div className="bg-white p-6 pb-8 flex-1 flex flex-col font-mono shadow-sm text-black">
        {/* Header */}
        <div className="text-center mb-4">
          <h1
            className="font-black tracking-widest uppercase mb-1"
            style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}
          >
            {text.title}
          </h1>
          <div className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">
            {text.subtitle}
          </div>
        </div>

        <div className="border-t-2 border-black my-2"></div>
        <div className="border-t border-black mb-6"></div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-1 text-xs font-bold uppercase mb-4 leading-relaxed">
          <div className="text-gray-500">{text.labelDate}:</div>
          <div className="text-black text-right">{data.date}</div>
          <div className="text-gray-500">{text.labelTime}:</div>
          <div className="text-black text-right">{data.time}</div>
          <div className="text-gray-500">{text.labelType}:</div>
          <div className="text-black text-right">{text.types[data.type]}</div>
          <div className="text-gray-500">{text.labelLocation}:</div>
          <div className="text-black text-right truncate">{data.location}</div>
        </div>

        {/* Workout Summary */}
        <div className="border-y-2 border-dashed border-black py-4 mb-6">
          <div className="grid grid-cols-2 gap-y-4 gap-x-4">
            <div>
              <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">
                {text.labelDurationSummary}
              </div>
              <div className="text-sm font-bold">{data.duration} MIN</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">
                {text.labelCalories}
              </div>
              <div className="text-sm font-bold">
                {data.caloriesBurned} KCAL
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">
                {text.labelIntensity}
              </div>
              <div className="flex items-center gap-2">
                <Bar val={data.intensity} />
                <span className="w-8 text-right text-xs font-bold">
                  {data.intensity}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Exercises Log */}
        {data.exercises && data.exercises.length > 0 && (
          <div className="mb-6">
            <div className="text-[10px] font-bold uppercase border-b border-black pb-1 mb-2">
              -- {text.labelExercises} --
            </div>
            <ul className="space-y-1.5 text-xs">
              {data.exercises.map((ex, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-start leading-tight"
                >
                  <span className="max-w-[200px] truncate">{ex.name}</span>
                  <span className="text-right whitespace-nowrap font-bold">
                    {ex.sets}x{ex.reps} @ {ex.weight}
                    {ex.unit}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-sm font-black border-t-2 border-black pt-2 mt-4">
              <span>TOTAL VOLUME:</span>
              <span>
                {totalWorkoutVolume} {data.exercises[0]?.unit || "KG"}
              </span>
            </div>
          </div>
        )}

        {/* Metrics Bars */}
        <div className="mb-6 space-y-2">
          <div className="text-[10px] font-bold uppercase border-b border-black pb-1 mb-2">
            -- {text.labelBodyFeedback} --
          </div>
          {Object.keys(data.metrics).map((key) => (
            <MetricBar
              key={key}
              label={metricMap[key]}
              value={data.metrics[key]}
            />
          ))}
        </div>

        {/* Notes */}
        {data.notes && data.notes.trim() && (
          <div className="mb-6 flex-1">
            <div className="text-[10px] font-bold uppercase border-b border-black pb-1 mb-2">
              {text.labelNotesSummary}
            </div>
            <p className="text-xs font-mono leading-relaxed whitespace-pre-wrap">
              {data.notes}
            </p>
          </div>
        )}

        {/* Footer / Barcode */}
        <div className="mt-auto pt-4 flex flex-col items-center">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-center">
            {text.labelWorkoutTagline}
          </div>
          <div className="w-full h-12 overflow-hidden flex items-center justify-between">
            {[...Array(32)].map((_, i) => {
              const hash = JSON.stringify(data)
                .split("")
                .reduce((a, c) => a + c.charCodeAt(0), 0);
              const width = ((hash * (i + 1)) % 3) + 2;
              return (
                <div
                  key={i}
                  className="bg-black h-full"
                  style={{ width: width + "px", marginLeft: "1px" }}
                ></div>
              );
            })}
          </div>
          <div className="text-[10px] mt-1 font-mono">
            {Date.now().toString().slice(-8)}
          </div>
        </div>
      </div>

      {/* Zigzag Bottom */}
      <div className="w-full h-2 overflow-hidden">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAyMCAxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwIEwxMCAxMCBMMjAgMCBaIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+')] bg-repeat-x bg-contain"></div>
      </div>
    </div>
  );
});
