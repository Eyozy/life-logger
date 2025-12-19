import React, { useState, useRef, useId } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Download,
  Loader2,
  ChevronDown,
  Globe,
  BookOpen,
  Bookmark,
  Feather,
  Coffee,
  Eye,
} from "lucide-react";
import { useDownloadReceipt } from "../hooks/useDownloadReceipt";

// --- Lang Config ---
const TEXT = {
  zh: {
    title: "图书馆",
    subtitle: "// 阅读记录小票",
    bookInfo: "图书信息",
    progress: "阅读进度",
    metrics: "阅读体验",
    thoughts: "摘录与思考",

    labelTitle: "书名",
    labelAuthor: "作者",
    labelFormat: "载体",
    labelGenre: "类别",
    labelPages: "页数/时长",
    labelDate: "完成日期",

    labelImmersion: "沉浸感",
    labelIntellect: "启发性",
    labelEmotion: "情感共鸣",
    labelWriting: "文笔/翻译",
    labelRating: "综合评分",

    labelQuote: "金句摘录",
    labelReview: "个人书评",

    // Preview Specific
    labelAnalysis: "阅读分析",
    labelScore: "综合得分",
    labelKeepReading: "*** 保持阅读 ***",
    labelHeader: "阅读日志终端",

    download: "下载",
    downloading: "归档中...",

    formats: {
      PAPER: "实体书",
      EBOOK: "电子书",
      AUDIO: "有声书",
    },
    genres: {
      FICTION: "小说",
      NONFICTION: "非虚构",
      SCI_FI: "科幻",
      FANTASY: "奇幻",
      BUSINESS: "商业",
      HISTORY: "历史",
      PHILOSOPHY: "哲学",
      POETRY: "诗歌",
    },
  },
  en: {
    title: "THE_LIBRARY",
    subtitle: "// READING LOG",
    bookInfo: "Book Metadata",
    progress: "Progress",
    metrics: "Reading Metrics",
    thoughts: "Quotes & Thoughts",

    labelTitle: "Title",
    labelAuthor: "Author",
    labelFormat: "Format",
    labelGenre: "Genre",
    labelPages: "Length",
    labelDate: "Date Finished",

    labelImmersion: "Immersion",
    labelIntellect: "Insight",
    labelEmotion: "Emotion",
    labelWriting: "Writing",
    labelRating: "Rating",

    labelQuote: "Key Quote",
    labelReview: "Review",

    // Preview Specific
    labelAnalysis: "--- Analysis ---",
    labelScore: "Score",
    labelKeepReading: "*** KEEP READING ***",
    labelHeader: "READING LOG TERMINAL",

    download: "ARCHIVE",
    downloading: "ARCHIVING...",

    formats: {
      PAPER: "Physical",
      EBOOK: "E-Book",
      AUDIO: "Audiobook",
    },
    genres: {
      FICTION: "Fiction",
      NONFICTION: "Non-Fiction",
      SCI_FI: "Sci-Fi",
      FANTASY: "Fantasy",
      BUSINESS: "Business",
      HISTORY: "History",
      PHILOSOPHY: "Philosophy",
      POETRY: "Poetry",
    },
  },
};

// --- Shared Components ---
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
      className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors"
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

  return (
  <div>
    <label htmlFor={inputId} className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm resize-none h-24 block transition-all"
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

const SliderItem = ({ label, value, onChange }) => (
  <div className="flex items-center gap-3">
    <span className="w-24 text-[10px] font-bold uppercase text-gray-700 truncate">
      {label}
    </span>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      aria-label={label}
      className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
    />
    <span className="w-8 text-right text-xs font-mono font-bold text-gray-900">
      {value}%
    </span>
  </div>
);

export default function ReadingReceiptPage() {
  const [lang, setLang] = useState("zh");
  const [mobileTab, setMobileTab] = useState("edit");
  const [data, setData] = useState({
    title: "悉达多",
    author: "赫尔曼·黑塞",
    format: "PAPER",
    genre: "FICTION",
    pages: "180 P.",
    date: new Date().toLocaleDateString("zh-CN"),
    metrics: {
      immersion: 90,
      intellect: 95,
      emotion: 85,
      writing: 100,
    },
    rating: 5,
    quote:
      "知识可以传授，但智慧不能。人们可以找到智慧，在生活中实行智慧，以智慧自强，以智慧创造奇迹，但人们不可能传授智慧。",
    review:
      "一本关于自我探索的流浪之书。读完内心非常平静，仿佛也听到了河水的声音。黑塞的文字如诗般优美，值得反复阅读。",
  });

  const [expandedSection, setExpandedSection] = useState("book");
  const receiptRef = useRef(null);
  const { isDownloading, handleDownload, error } = useDownloadReceipt('READING_LOG');

  const t = TEXT[lang];
  const toggleSection = (s) =>
    setExpandedSection(expandedSection === s ? null : s);
  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));

  return (
    <div className="fixed inset-0 bg-gray-100 text-gray-900 flex flex-col md:flex-row md:justify-center overflow-hidden">
      {/* Left: Editor */}
      <div
        className={`w-full md:w-[450px] md:h-full flex flex-col h-full bg-white  z-10 transition-transform duration-300 ${
          mobileTab === "edit"
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } absolute md:relative`}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
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
              <p className="text-xs text-gray-600 font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                {t.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={toggleLang}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold flex items-center gap-1 shrink-0"
          >
            <Globe size={12} /> {lang === "zh" ? "EN" : "中文"}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 md:pb-10 no-scrollbar">
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
          <InputSection
            title={t.bookInfo}
            isOpen={expandedSection === "book"}
            onToggle={() => toggleSection("book")}
          >
            <InputGroup
              label={t.labelTitle}
              value={data.title}
              onChange={(v) => setData({ ...data, title: v })}
            />
            <InputGroup
              label={t.labelAuthor}
              value={data.author}
              onChange={(v) => setData({ ...data, author: v })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase">
                  {t.labelGenre}
                </label>
                <select
                  value={data.genre}
                  onChange={(e) => setData({ ...data, genre: e.target.value })}
                  aria-label={t.labelGenre}
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm"
                >
                  {Object.entries(t.genres).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase">
                  {t.labelFormat}
                </label>
                <select
                  value={data.format}
                  onChange={(e) => setData({ ...data, format: e.target.value })}
                  aria-label={t.labelFormat}
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm"
                >
                  {Object.entries(t.formats).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                label={t.labelPages}
                value={data.pages}
                onChange={(v) => setData({ ...data, pages: v })}
              />
              <InputGroup
                label={t.labelDate}
                value={data.date}
                onChange={(v) => setData({ ...data, date: v })}
              />
            </div>
          </InputSection>

          <InputSection
            title={t.metrics}
            isOpen={expandedSection === "metrics"}
            onToggle={() => toggleSection("metrics")}
          >
            <div className="space-y-4 bg-gray-50 p-4 rounded-sm border border-gray-100">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-[10px] font-bold uppercase text-gray-500">
                  {t.labelRating}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setData({ ...data, rating: s })}
                      className={
                        s <= data.rating ? "text-black" : "text-gray-300"
                      }
                    >
                      {s <= data.rating ? "★" : "☆"}
                    </button>
                  ))}
                </div>
              </div>
              <SliderItem
                label={t.labelImmersion}
                value={data.metrics.immersion}
                onChange={(v) =>
                  setData({
                    ...data,
                    metrics: { ...data.metrics, immersion: v },
                  })
                }
              />
              <SliderItem
                label={t.labelIntellect}
                value={data.metrics.intellect}
                onChange={(v) =>
                  setData({
                    ...data,
                    metrics: { ...data.metrics, intellect: v },
                  })
                }
              />
              <SliderItem
                label={t.labelEmotion}
                value={data.metrics.emotion}
                onChange={(v) =>
                  setData({ ...data, metrics: { ...data.metrics, emotion: v } })
                }
              />
              <SliderItem
                label={t.labelWriting}
                value={data.metrics.writing}
                onChange={(v) =>
                  setData({ ...data, metrics: { ...data.metrics, writing: v } })
                }
              />
            </div>
          </InputSection>

          <InputSection
            title={t.thoughts}
            isOpen={expandedSection === "thoughts"}
            onToggle={() => toggleSection("thoughts")}
          >
            <InputGroup
              label={t.labelQuote}
              value={data.quote}
              onChange={(v) => setData({ ...data, quote: v })}
              isTextArea
            />
            <InputGroup
              label={t.labelReview}
              value={data.review}
              onChange={(v) => setData({ ...data, review: v })}
              isTextArea
            />
          </InputSection>

          <div className="h-10 md:hidden"></div>
        </div>
      </div>

      {/* Right: Preview */}
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
              <ReadingPreview data={data} text={t} ref={receiptRef} />
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
          <BookOpen size={14} /> 编辑
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

const ReadingPreview = React.forwardRef(({ data, text }, ref) => {
  // Simple helper for black bars
  const Bar = ({ val }) => (
    <div className="flex-1 h-2 border border-black p-[1px]">
      <div className="h-full bg-black" style={{ width: `${val}%` }}></div>
    </div>
  );

  return (
    <div ref={ref} className="w-[380px] relative">
      <div className="min-h-[600px] bg-white p-6 pb-8 font-receipt tracking-receipt flex flex-col">
        {/* Header */}
        <div className="text-center mb-4">
          <h1
            className="font-bold tracking-wider mb-1 text-black uppercase"
            style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}
          >
            THE_LIBRARY
          </h1>
          <div className="text-[10px] font-bold text-gray-500 tracking-widest">
            {text.labelHeader}
          </div>
        </div>
        <div className="border-t-2 border-dashed border-black my-2"></div>

        {/* Metadata */}
        {data.title && data.title.trim() && (
          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-gray-500 uppercase">
                {text.labelTitle}:
              </span>
              <span className="text-black max-w-[240px] text-right">
                {data.title}
              </span>
            </div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-gray-500 uppercase">
                {text.labelAuthor}:
              </span>
              <span className="text-black text-right">{data.author}</span>
            </div>
            <div className="flex justify-between text-xs font-bold mb-3">
              <span className="text-gray-500 uppercase">{text.labelDate}:</span>
              <span className="text-black text-right">{data.date}</span>
            </div>

            <div className="flex gap-2 text-[10px] font-bold uppercase border-b border-black pb-3">
              <span className="border border-black px-1.5 py-0.5">
                {text.genres[data.genre]}
              </span>
              <span className="bg-black text-white px-1.5 py-0.5">
                {text.formats[data.format]}
              </span>
              <span className="border border-black px-1.5 py-0.5">
                {data.pages}
              </span>
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="mb-6">
          <div className="text-[10px] font-bold uppercase mb-2 text-gray-500 text-center">
            {text.labelAnalysis}
          </div>
          <div className="space-y-2 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-20 uppercase text-[9px]">
                {text.labelImmersion}
              </span>
              <Bar val={data.metrics.immersion} />
              <span className="w-6 text-right">{data.metrics.immersion}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 uppercase text-[9px]">
                {text.labelIntellect}
              </span>
              <Bar val={data.metrics.intellect} />
              <span className="w-6 text-right">{data.metrics.intellect}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 uppercase text-[9px]">
                {text.labelEmotion}
              </span>
              <Bar val={data.metrics.emotion} />
              <span className="w-6 text-right">{data.metrics.emotion}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-20 uppercase text-[9px]">
                {text.labelWriting}
              </span>
              <Bar val={data.metrics.writing} />
              <span className="w-6 text-right">{data.metrics.writing}</span>
            </div>
          </div>

          <div className="flex justify-center gap-1 mt-4 text-xl">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s}>{s <= data.rating ? "★" : "☆"}</span>
            ))}
          </div>
        </div>

        {/* Quote */}
        {data.quote && (
          <div className="mb-6">
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">
              {text.labelQuote}
            </div>
            <div className="border-l-4 border-black pl-3 py-1">
              <p className="text-sm italic leading-relaxed whitespace-pre-wrap">
                "{data.quote}"
              </p>
            </div>
          </div>
        )}

        {/* Review */}
        {data.review && (
          <div className="mb-6 flex-1">
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">
              {text.labelReview}
            </div>
            <p className="text-xs leading-relaxed text-justify border-t border-gray-300 pt-2 whitespace-pre-wrap">
              {data.review}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-6 flex flex-col items-center">
          <div className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">
            {text.labelKeepReading}
          </div>
          {/* Barcode */}
          <div className="flex h-10 w-full justify-center items-stretch gap-0.5 overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="bg-black"
                style={{ width: Math.random() > 0.5 ? "2px" : "4px" }}
              ></div>
            ))}
          </div>
          <div className="text-[10px] font-receipt mt-1">
            {Date.now().toString().slice(-10)}
          </div>
        </div>
      </div>

      {/* Zigzag */}
      <div className="w-full h-3 overflow-hidden">
        <svg
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          className="block"
        >
          <defs>
            <pattern
              id="zag"
              x="0"
              y="0"
              width="20"
              height="100%"
              patternUnits="userSpaceOnUse"
            >
              <path d="M0 0 L10 12 L20 0 Z" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#zag)" />
        </svg>
      </div>
    </div>
  );
});
