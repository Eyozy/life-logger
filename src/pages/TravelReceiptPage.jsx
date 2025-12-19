import React, { useState, useRef, useId } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Download,
  Loader2,
  ChevronDown,
  Globe,
  Plane,
  Map,
  Compass,
  Eye,
} from "lucide-react";
import { useDownloadReceipt } from "../hooks/useDownloadReceipt";

const TEXT = {
  zh: {
    title: "旅行日志",
    subtitle: "// 旅行日志小票",
    flightInfo: "行程信息",
    metrics: "旅途状态",
    notes: "旅途见闻",

    labelOrigin: "出发地 (FROM)",
    labelDest: "目的地 (TO)",
    labelDate: "日期",
    labelTime: "出发时间",
    labelTransport: "交通方式",
    labelClass: "旅行风格",
    labelSeat: "座位/位置",

    labelFatigue: "疲劳度",
    labelNovelty: "新鲜感",
    labelBudget: "预算消耗",

    labelMemo: "备忘录",

    // Preview Specific
    labelStats: "旅途状态",
    labelClassSuffix: "舱",
    labelBadge: "探索者",
    labelBoardingPass: "登机牌",

    download: "下载",
    downloading: "出票中...",

    transports: {
      FLIGHT: "飞机",
      TRAIN: "高铁/火车",
      CAR: "自驾",
      BUS: "大巴",
      WALK: "徒步/特种兵",
      SHIP: "轮渡",
    },
    classes: {
      BUDGET: "穷游",
      LUXURY: "奢华",
      BUSINESS: "商务",
      SOLO: "独狼",
      GROUP: "跟团",
    },
    weathers: {
      SUNNY: "晴",
      CLOUDY: "阴",
      RAINY: "雨",
      SNOWY: "雪",
      FOGGY: "雾",
    },
    labelMood: "心情/能量",
  },
  en: {
    title: "THE_EXPLORER",
    subtitle: "// TRAVEL LOG",
    flightInfo: "Itinerary",
    metrics: "Trip Metrics",
    notes: "Highlights",

    labelOrigin: "Origin (FROM)",
    labelDest: "Dest (TO)",
    labelDate: "Date",
    labelTime: "Time",
    labelTransport: "Transport",
    labelClass: "Style",
    labelSeat: "Seat",

    labelFatigue: "Fatigue",
    labelNovelty: "Novelty",
    labelBudget: "Budget Burn",
    labelMood: "Mood/Energy",

    labelMemo: "Memo",

    // Preview Specific
    labelStats: "TRAVEL STATS",
    labelClassSuffix: "CLASS",
    labelBadge: "EXPLORER",
    labelBoardingPass: "BOARDING_PASS",

    download: "DOWNLOAD LOG",
    downloading: "PRINTING...",

    transports: {
      FLIGHT: "Flight",
      TRAIN: "Train",
      CAR: "Car",
      BUS: "Bus",
      WALK: "Hike/Walk",
      SHIP: "Ship",
    },
    classes: {
      BUDGET: "Budget",
      LUXURY: "Luxury",
      BUSINESS: "Business",
      SOLO: "Solo",
      GROUP: "Group",
    },
    weathers: {
      SUNNY: "Sunny",
      CLOUDY: "Cloudy",
      RAINY: "Rainy",
      SNOWY: "Snowy",
      FOGGY: "Foggy",
    },
  },
};

const InputSection = ({ title, children, isOpen, onToggle }) => {
  const contentId = useId();

  return (
  <div
    className={`border border-gray-200 rounded-lg bg-white overflow-hidden transition-all duration-300 mb-3 ${
      isOpen ? "shadow-md ring-1 ring-black/5" : "hover:border-gray-300"
    }`}
  >
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full p-4 text-left transition-colors bg-white hover:bg-gray-50"
      aria-expanded={isOpen}
      aria-controls={contentId}
    >
      <h2
        className={`text-sm font-bold uppercase tracking-wider ${
          isOpen ? "text-black" : "text-gray-700"
        }`}
      >
        {title}
      </h2>
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
        isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="p-4 pt-0 border-t border-gray-50">
        <div className="pt-4 space-y-4">{children}</div>
      </div>
    </div>
  </div>
  );
};

const InputGroup = ({
  label,
  value,
  onChange,
  placeholder,
  isTextArea = false,
}) => {
  const inputId = useId();

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
      <label htmlFor={inputId} className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={inputId}
          value={value}
          onChange={handleTextareaChange}
          onInput={handleTextareaChange} // Also handle paste and other input events
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm resize-none h-auto min-h-[6rem] block transition-all"
          style={{ overflow: "hidden" }} // Hide scrollbar while auto-resizing
        />
      ) : (
        <input
          id={inputId}
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

const InteractiveSlider = ({ label, value, onChange }) => (
  <div className="relative py-1">
    <div className="flex items-center gap-3">
      <span className="w-24 text-[10px] font-bold uppercase text-gray-700 truncate">
        {label}
      </span>
      <div className="flex-1 h-3 border border-black p-[2px] relative">
        <div className="h-full bg-black" style={{ width: `${value}%` }}></div>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          aria-label={label}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <span className="w-8 font-mono text-xs font-bold text-right text-gray-900">
        {value}%
      </span>
    </div>
  </div>
);

export default function TravelReceiptPage() {
  const [lang, setLang] = useState("zh");
  const [mobileTab, setMobileTab] = useState("edit");
  const [data, setData] = useState({
    origin: "HOME",
    dest: "TOKYO",
    date: new Date().toLocaleDateString("en-CA").replace(/-/g, "."),
    time: "09:30",
    transport: "FLIGHT",
    classType: "BUDGET",
    seat: "12A",
    weather: "SUNNY",
    metrics: {
      fatigue: 85,
      novelty: 100,
      budget: 60,
      mood: 70,
    },
    memo: "在涩谷街头迷路了，但是意外发现了一家超好吃的拉面店！腿快断了但很值得。",
  });

  const [expandedSection, setExpandedSection] = useState("flight");
  const receiptRef = useRef(null);
  const { isDownloading, handleDownload, error } = useDownloadReceipt('TRAVEL_LOG');
  const t = TEXT[lang];
  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));
  const toggleSection = (s) =>
    setExpandedSection(expandedSection === s ? null : s);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden text-gray-900 bg-gray-100 md:flex-row md:justify-center">
      {/* Editor */}
      <div
        className={`w-full md:w-[450px] flex flex-col h-full bg-white z-10 transition-transform duration-300 ${
          mobileTab === "edit"
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } absolute md:relative`}
      >
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 transition-colors rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              aria-label={lang === "zh" ? "返回首页" : "Back to home"}
            >
              <ChevronLeft size={18} />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black tracking-wider text-gray-900 truncate">
                {t.title}
              </h1>
              <p className="overflow-hidden text-xs font-bold text-gray-600 whitespace-nowrap text-ellipsis">
                {t.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2 py-1 text-xs font-bold bg-gray-100 rounded hover:bg-gray-200 shrink-0"
          >
            <Globe size={12} /> {lang === "zh" ? "EN" : "中文"}
          </button>
        </header>

        <div className="flex-1 p-4 pb-24 space-y-3 overflow-y-auto md:pb-10 no-scrollbar">
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
          <InputSection
            title={t.flightInfo}
            isOpen={expandedSection === "flight"}
            onToggle={() => toggleSection("flight")}
          >
            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                label={t.labelOrigin}
                value={data.origin}
                onChange={(v) => setData({ ...data, origin: v.toUpperCase() })}
                placeholder="NYC"
              />
              <InputGroup
                label={t.labelDest}
                value={data.dest}
                onChange={(v) => setData({ ...data, dest: v.toUpperCase() })}
                placeholder="LON"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                label={t.labelDate}
                value={data.date}
                onChange={(v) => setData({ ...data, date: v })}
              />
              <InputGroup
                label={t.labelTime}
                value={data.time}
                onChange={(v) => setData({ ...data, time: v })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase">
                  {t.labelTransport}
                </label>
                <select
                  value={data.transport}
                  onChange={(e) =>
                    setData({ ...data, transport: e.target.value })
                  }
                  aria-label={t.labelTransport}
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm"
                >
                  {Object.entries(t.transports).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase">
                  {t.labelClass}
                </label>
                <select
                  value={data.classType}
                  onChange={(e) =>
                    setData({ ...data, classType: e.target.value })
                  }
                  aria-label={t.labelClass}
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm"
                >
                  {Object.entries(t.classes).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {["FLIGHT", "TRAIN"].includes(data.transport) && (
              <InputGroup
                label={t.labelSeat}
                value={data.seat}
                onChange={(v) => setData({ ...data, seat: v })}
              />
            )}
          </InputSection>

          <InputSection
            title={t.weathers.title || "天气"}
            isOpen={expandedSection === "weather"}
            onToggle={() => toggleSection("weather")}
          >
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase">
                WEATHER
              </label>
              <select
                value={data.weather}
                onChange={(e) => setData({ ...data, weather: e.target.value })}
                aria-label="WEATHER"
                className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm"
              >
                {Object.entries(t.weathers).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </InputSection>

          <InputSection
            title={t.metrics}
            isOpen={expandedSection === "metrics"}
            onToggle={() => toggleSection("metrics")}
          >
            <div className="p-4 space-y-4 border border-gray-100 rounded-sm bg-gray-50">
              <InteractiveSlider
                label={t.labelFatigue}
                value={data.metrics.fatigue}
                onChange={(v) =>
                  setData({ ...data, metrics: { ...data.metrics, fatigue: v } })
                }
              />
              <InteractiveSlider
                label={t.labelNovelty}
                value={data.metrics.novelty}
                onChange={(v) =>
                  setData({ ...data, metrics: { ...data.metrics, novelty: v } })
                }
              />
              <InteractiveSlider
                label={t.labelBudget}
                value={data.metrics.budget}
                onChange={(v) =>
                  setData({ ...data, metrics: { ...data.metrics, budget: v } })
                }
              />
              <InteractiveSlider
                label={t.labelMood}
                value={data.metrics.mood}
                onChange={(v) =>
                  setData({ ...data, metrics: { ...data.metrics, mood: v } })
                }
              />
            </div>
          </InputSection>

          <InputSection
            title={t.notes}
            isOpen={expandedSection === "notes"}
            onToggle={() => toggleSection("notes")}
          >
            <InputGroup
              label={t.labelMemo}
              value={data.memo}
              onChange={(v) => setData({ ...data, memo: v })}
              isTextArea
            />
          </InputSection>
          <div className="h-10 md:hidden"></div>
        </div>
      </div>

      {/* Preview */}
      <div
        className={`w-full md:w-[450px] bg-gray-200 relative z-0 transition-transform duration-300 ${
          mobileTab === "preview"
            ? "translate-x-0"
            : "translate-x-full md:translate-x-0"
        } absolute md:relative h-full`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute z-20 top-4 right-4">
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
          <div className="flex items-center justify-center min-h-full py-20 md:py-10">
            <div className="transition-transform duration-500 origin-top scale-90 receipt-wrapper sm:scale-100">
              <TravelPreview data={data} text={t} ref={receiptRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white rounded-full px-1.5 py-1.5 shadow-2xl flex gap-1">
        <button
          onClick={() => setMobileTab("edit")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            mobileTab === "edit"
              ? "bg-white text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Plane size={14} /> 编辑
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            mobileTab === "preview"
              ? "bg-white text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Eye size={14} /> 预览
        </button>
      </div>
    </div>
  );
}

const TravelPreview = React.forwardRef(({ data, text }, ref) => {
  // Helper for simple bars
  const Bar = ({ val }) => (
    <div className="flex-1 h-2 border border-black p-[1px]">
      <div className="h-full bg-black" style={{ width: `${val}%` }}></div>
    </div>
  );

  // Helper for weather icons
  const getWeatherIcon = (weather) => {
    switch (weather) {
      case "SUNNY":
        return "☀️";
      case "CLOUDY":
        return "☁️";
      case "RAINY":
        return "🌧️";
      case "SNOWY":
        return "❄️";
      case "FOGGY":
        return "🌫️";
      default:
        return "";
    }
  };

  return (
    <div ref={ref} className="w-[380px] flex flex-col">
      <div className="min-h-[600px] bg-white p-6 pb-8 font-receipt tracking-receipt flex flex-col shadow-sm text-black">
        {/* Header */}
        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Plane size={20} />
            <h1 className="text-2xl font-black tracking-widest uppercase">
              {text.title}
            </h1>
          </div>
          <div className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">
            {text.subtitle}
          </div>
        </div>

        <div className="my-2 border-t-2 border-black"></div>
        <div className="mb-6 border-t border-black"></div>

        {/* Origin -> Dest */}
        <div className="flex items-center justify-between px-2 mb-8">
          <div className="text-left">
            <div className="text-[10px] font-bold text-gray-500 mb-1 uppercase">
              {text.labelOrigin}
            </div>
            <div className="text-5xl font-black tracking-tighter">
              {data.origin.substring(0, 3) || "ORI"}
            </div>
            <div className="text-xs font-bold uppercase mt-1 truncate max-w-[120px]">
              {data.origin}
            </div>
          </div>
          <div className="px-4">
            <Plane size={24} className="text-black rotate-90" />
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-gray-500 mb-1 uppercase">
              {text.labelDest}
            </div>
            <div className="text-5xl font-black tracking-tighter">
              {data.dest.substring(0, 3) || "DES"}
            </div>
            <div className="text-xs font-bold uppercase mt-1 truncate max-w-[120px]">
              {data.dest}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="py-4 mb-6 border-black border-dashed border-y-2">
          <div className="grid grid-cols-2 gap-y-4 gap-x-4">
            <div>
              <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">
                {text.labelDate}
              </div>
              <div className="text-sm font-bold">{data.date}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">
                {text.labelTime}
              </div>
              <div className="text-sm font-bold">{data.time}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">
                WEATHER
              </div>
              <div className="text-sm font-bold">
                {getWeatherIcon(data.weather)} {text.weathers[data.weather]}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">
                {text.labelTransport}
              </div>
              <div className="text-sm font-bold uppercase">
                {text.transports[data.transport] || data.transport}
              </div>
            </div>
            {["FLIGHT", "TRAIN"].includes(data.transport) && (
              <div>
                <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">
                  {text.labelSeat}
                </div>
                <div className="text-sm font-bold uppercase">{data.seat}</div>
              </div>
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-6">
          <div className="flex items-center justify-between pb-1 mb-3 border-b border-black">
            <span className="text-[10px] font-bold uppercase">
              {text.labelStats}
            </span>
            <span className="text-[10px] font-bold uppercase">
              {text.classes[data.classType]}
            </span>
          </div>
          <div className="px-1 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-20 text-[10px] font-bold uppercase">
                {text.labelFatigue}
              </span>
              <Bar val={data.metrics.fatigue} />
              <span className="w-8 text-xs font-bold text-right">
                {data.metrics.fatigue}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 text-[10px] font-bold uppercase">
                {text.labelNovelty}
              </span>
              <Bar val={data.metrics.novelty} />
              <span className="w-8 text-xs font-bold text-right">
                {data.metrics.novelty}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 text-[10px] font-bold uppercase">
                {text.labelBudget}
              </span>
              <Bar val={data.metrics.budget} />
              <span className="w-8 text-xs font-bold text-right">
                {data.metrics.budget}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 text-[10px] font-bold uppercase">
                {text.labelMood}
              </span>
              <Bar val={data.metrics.mood} />
              <span className="w-8 text-xs font-bold text-right">
                {data.metrics.mood}%
              </span>
            </div>
          </div>
        </div>

        {/* Memo */}
        <div className="flex-1 mb-8">
          <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">
            {text.labelMemo}
          </div>
          <p className="font-receipt text-xs leading-relaxed text-justify whitespace-pre-wrap">
            {data.memo}
          </p>
        </div>

        {/* Footer / Barcode */}
        <div className="flex flex-col items-center pt-4 mt-auto">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-center">
            TICKET #8392-{new Date().getFullYear()}
          </div>
          <div className="flex items-center justify-between w-full h-12 overflow-hidden">
            {[...Array(32)].map((_, i) => {
              const hash = JSON.stringify(data)
                .split("")
                .reduce((a, c) => a + c.charCodeAt(0), 0);
              const width = ((hash * (i + 1)) % 3) + 2;
              return (
                <div
                  key={i}
                  className="h-full bg-black"
                  style={{ width: width + "px", marginLeft: "1px" }}
                ></div>
              );
            })}
          </div>
          <div className="text-[10px] mt-1 font-receipt">
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
