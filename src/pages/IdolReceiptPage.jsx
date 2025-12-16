import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Download,
  Loader2,
  Globe,
  ChevronDown,
  Heart,
  Plus,
  Trash2,
  Zap,
  Smile,
  Wallet,
  Sparkles,
  Eye,
} from "lucide-react";
import { useDownloadReceipt } from "../hooks/useDownloadReceipt";

// --- Lang Config ---
const TEXT = {
  zh: {
    title: "追星日志",
    subtitle: "// 追星日志小票",
    idolInfo: "本命信息",
    supportList: "应援/氪金",
    vitalSigns: "生命体征",
    thoughts: "发疯时刻",

    labelName: "爱豆/本命",
    labelActivity: "活动类型",
    labelIdentity: "粉丝属性",
    labelDate: "记录日期",
    labelItem: "项目名称",
    labelCost: "金额",

    labelDopamine: "多巴胺 (快乐)",
    labelSanity: "理智值",
    labelWallet: "钱包血量",
    labelScream: "尖叫指数",

    labelHighlight: "高光时刻",
    labelPromise: "粉丝誓言",

    labelTotal: "总计支出",

    download: "下载",
    downloading: "生成中...",

    activities: {
      COMEBACK: "回归期",
      CONCERT: "演唱会",
      FANMEETING: "见面会",
      MERCH: "购买周边",
      DAILY: "日常考古",
      STREAMING: "打投/切瓜",
    },
    identities: {
      MOM: "妈粉",
      GF: "女友粉",
      SISTER: "姐姐粉",
      ONLY: "唯粉",
      CP: "CP 粉",
      ALL: "团粉",
    },
  },
  en: {
    title: "IDOL_LOG",
    subtitle: "// FANDOM LOG",
    idolInfo: "Idol Info",
    supportList: "Support / Spending",
    vitalSigns: "Vital Signs",
    thoughts: "Thoughts",

    labelName: "Idol / Bias",
    labelActivity: "Activity Type",
    labelIdentity: "Identity",
    labelDate: "Date",
    labelItem: "Item",
    labelCost: "Cost",

    labelDopamine: "Dopamine",
    labelSanity: "Sanity",
    labelWallet: "Wallet HP",
    labelScream: "Scream Lvl",

    labelHighlight: "Highlight",
    labelPromise: "Promise",

    labelTotal: "TOTAL SPENT",

    download: "DOWNLOAD RECEIPT",
    downloading: "SAVING...",

    activities: {
      COMEBACK: "Comeback",
      CONCERT: "Concert",
      FANMEETING: "Fan Meeting",
      MERCH: "Merch Haul",
      DAILY: "Daily Stanning",
      STREAMING: "Streaming",
    },
    identities: {
      MOM: "Mom Fan",
      GF: "Girlfriend Fan",
      SISTER: "Sister Fan",
      ONLY: "Solo Stan",
      CP: "Shipper",
      ALL: "Group Stan",
    },
  },
};

// --- Shared Components ---
const InputSection = ({ title, children, isOpen, onToggle }) => (
  <div
    className={`border border-gray-200 rounded-lg bg-white overflow-hidden transition-all duration-300 mb-3 ${
      isOpen ? "shadow-md ring-1 ring-black/5" : "hover:border-gray-300"
    }`}
  >
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full p-4 text-left transition-colors bg-white hover:bg-gray-50"
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
}) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm resize-none h-20 block transition-all"
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

const SliderItem = ({ label, value, onChange, icon: Icon }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center w-24 gap-2 text-gray-500">
      {Icon && <Icon size={14} />}
      <span className="text-[10px] font-bold uppercase truncate">{label}</span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
    />
    <span className="w-8 font-mono text-xs font-bold text-right text-gray-900">
      {value}%
    </span>
  </div>
);

export default function IdolReceiptPage() {
  const [lang, setLang] = useState("zh");
  const [mobileTab, setMobileTab] = useState("edit");
  const [data, setData] = useState({
    name: "NewJeans",
    activity: "COMEBACK",
    identity: "MOM",
    date: new Date().toLocaleDateString("zh-CN"),
    items: [
      { name: "Weverse 专辑套装", price: "58.00" },
      { name: "小卡 (Photocards)", price: "25.00" },
      { name: "音源切瓜 (Streaming)", price: "12.00" },
    ],
    stats: {
      dopamine: 100,
      sanity: 10,
      wallet: 25,
    },
    scream: 5,
    highlight:
      "Hanni 今天的双马尾造型简直是神！！！我的天哪怎么会有这么可爱的人类...",
    promise: "下次回归一定还要支持！(只要不跑路)",
  });

  const [expandedSection, setExpandedSection] = useState("idol");
  const receiptRef = useRef(null);
  const { isDownloading, handleDownload, error } = useDownloadReceipt('IDOL_LOG');

  const t = TEXT[lang];
  const toggleSection = (s) =>
    setExpandedSection(expandedSection === s ? null : s);
  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));

  const updateItem = (i, f, v) => {
    const n = [...data.items];
    n[i] = { ...n[i], [f]: v };
    setData({ ...data, items: n });
  };
  const addItem = () =>
    setData({ ...data, items: [...data.items, { name: "", price: "" }] });
  const removeItem = (i) =>
    setData({ ...data, items: data.items.filter((_, idx) => idx !== i) });

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden font-mono text-gray-900 bg-gray-100 md:flex-row md:justify-center">
      {/* Left: Editor */}
      <div
        className={`w-full md:w-[450px] md:h-full flex flex-col h-full bg-white  z-10 transition-transform duration-300 ${
          mobileTab === "edit"
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        } absolute md:relative`}
      >
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 transition-colors rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={18} />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black tracking-wider text-gray-900 truncate">
                {t.title}
              </h1>
              <p className="overflow-hidden text-xs font-bold text-gray-400 whitespace-nowrap text-ellipsis">
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
            title={t.idolInfo}
            isOpen={expandedSection === "idol"}
            onToggle={() => toggleSection("idol")}
          >
            <InputGroup
              label={t.labelName}
              value={data.name}
              onChange={(v) => setData({ ...data, name: v })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">
                  {t.labelActivity}
                </label>
                <select
                  value={data.activity}
                  onChange={(e) =>
                    setData({ ...data, activity: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm"
                >
                  {Object.entries(t.activities).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">
                  {t.labelIdentity}
                </label>
                <select
                  value={data.identity}
                  onChange={(e) =>
                    setData({ ...data, identity: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm"
                >
                  {Object.entries(t.identities).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <InputGroup
              label={t.labelDate}
              value={data.date}
              onChange={(v) => setData({ ...data, date: v })}
            />
          </InputSection>

          <InputSection
            title={t.supportList}
            isOpen={expandedSection === "items"}
            onToggle={() => toggleSection("items")}
          >
            {data.items.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={item.name}
                  onChange={(e) => updateItem(i, "name", e.target.value)}
                  className="flex-1 p-2 text-sm border border-gray-200 rounded-sm outline-none bg-gray-50 focus:border-black"
                  placeholder={t.labelItem}
                />
                <input
                  value={item.price}
                  onChange={(e) => updateItem(i, "price", e.target.value)}
                  className="w-16 p-2 text-sm text-right border border-gray-200 rounded-sm outline-none bg-gray-50 focus:border-black"
                  placeholder={t.labelCost}
                />
                <button
                  onClick={() => removeItem(i)}
                  className="text-gray-300 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addItem}
              className="flex items-center gap-1 mt-2 text-xs font-bold text-pink-600 hover:text-pink-700"
            >
              <Plus size={14} /> ADD ITEM
            </button>
          </InputSection>

          <InputSection
            title={t.vitalSigns}
            isOpen={expandedSection === "stats"}
            onToggle={() => toggleSection("stats")}
          >
            <div className="p-4 space-y-4 border border-gray-100 rounded-sm bg-gray-50">
              <SliderItem
                label={t.labelDopamine}
                value={data.stats.dopamine}
                onChange={(v) =>
                  setData({ ...data, stats: { ...data.stats, dopamine: v } })
                }
                icon={Smile}
              />
              <SliderItem
                label={t.labelSanity}
                value={data.stats.sanity}
                onChange={(v) =>
                  setData({ ...data, stats: { ...data.stats, sanity: v } })
                }
                icon={Brain}
              />
              <SliderItem
                label={t.labelWallet}
                value={data.stats.wallet}
                onChange={(v) =>
                  setData({ ...data, stats: { ...data.stats, wallet: v } })
                }
                icon={Wallet}
              />

              <div className="pt-4 mt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Zap size={14} />
                    <span className="text-[10px] font-bold uppercase">
                      {t.labelScream}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => setData({ ...data, scream: s })}
                        className={
                          s <= data.scream ? "text-pink-500" : "text-gray-300"
                        }
                      >
                        <Heart
                          size={16}
                          fill={s <= data.scream ? "currentColor" : "none"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </InputSection>

          <InputSection
            title={t.thoughts}
            isOpen={expandedSection === "thoughts"}
            onToggle={() => toggleSection("thoughts")}
          >
            <InputGroup
              label={t.labelHighlight}
              value={data.highlight}
              onChange={(v) => setData({ ...data, highlight: v })}
              isTextArea
            />
            <InputGroup
              label={t.labelPromise}
              value={data.promise}
              onChange={(v) => setData({ ...data, promise: v })}
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
              <IdolPreview data={data} text={t} ref={receiptRef} />
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
          <Heart size={14} /> 编辑
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

// --- Brain Icon for Sanity ---
const Brain = ({ size, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const IdolPreview = React.forwardRef(({ data, text }, ref) => {
  const total = data.items
    .reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0)
    .toFixed(2);

  // Simple bar helper
  const Bar = ({ val }) => (
    <div className="flex-1 h-2 border border-black p-[1px]">
      <div className="h-full bg-black" style={{ width: `${val}%` }}></div>
    </div>
  );

  return (
    <div ref={ref} className="w-[380px] relative">
      <div className="min-h-[600px] bg-white p-6 pb-8 font-mono flex flex-col shadow-sm">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1
            className="mb-1 font-black tracking-wider text-black"
            style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}
          >
            {text.title}
          </h1>
          <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
            {text.subtitle}
          </div>
        </div>

        <div className="my-2 border-t-2 border-black border-dashed"></div>

        {/* Info Grid */}
        <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-xs font-bold uppercase mb-4 leading-relaxed">
          <div className="text-gray-500">{text.labelDate}:</div>
          <div className="text-black">{data.date}</div>
          <div className="text-gray-500">{text.labelName}:</div>
          <div className="text-black truncate">{data.name}</div>
          <div className="text-gray-500">{text.labelActivity}:</div>
          <div className="text-black truncate">
            {text.activities[data.activity]}
          </div>
          <div className="text-gray-500">{text.labelIdentity}:</div>
          <div className="text-black truncate">
            {text.identities[data.identity]}
          </div>
        </div>

        {/* Support List */}
        <div className="mb-4">
          <div className="flex justify-between pb-1 mb-2 border-b border-black">
            <span className="text-[10px] font-bold uppercase text-gray-600">
              {text.supportList}
            </span>
          </div>
          <div className="space-y-1.5">
            {data.items.map((item, i) => (
              <div
                key={i}
                className="flex items-start justify-between text-sm leading-tight group"
              >
                <span className="max-w-[240px] text-black">
                  {item.name || "---"}
                </span>
                <span className="font-mono font-bold">
                  {item.price || "0.00"}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2 mt-4 text-sm font-black text-black border-t-2 border-black">
            <span>{text.labelTotal}</span>
            <span>${total}</span>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="p-4 mb-4 font-mono text-xs border-2 border-black">
          <div className="text-center text-[10px] font-bold mb-3 uppercase text-black border-b border-dashed border-black pb-1">
            -- {text.vitalSigns} --
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-24 text-[10px] font-bold uppercase">
                {text.labelDopamine}
              </span>
              <Bar val={data.stats.dopamine} />
              <span className="w-8 font-bold text-right">
                {data.stats.dopamine}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 text-[10px] font-bold uppercase">
                {text.labelSanity}
              </span>
              <Bar val={data.stats.sanity} />
              <span className="w-8 font-bold text-right">
                {data.stats.sanity}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24 text-[10px] font-bold uppercase">
                {text.labelWallet}
              </span>
              <Bar val={data.stats.wallet} />
              <span className="w-8 font-bold text-right">
                {data.stats.wallet}%
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
              <span className="text-[10px] font-bold uppercase">
                {text.labelScream}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-sm">
                    {s <= data.scream ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Highlight */}
        {data.highlight && data.highlight.trim() && (
          <div className="mb-4">
            <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">
              {text.labelHighlight}
            </div>
            <div className="relative pl-3 border-l-4 border-black">
              <p className="font-serif text-sm italic leading-relaxed text-justify text-black whitespace-pre-wrap">
                "{data.highlight}"
              </p>
            </div>
          </div>
        )}

        {/* Promise */}
        {data.promise && data.promise.trim() && (
          <div className="flex-1 mb-6">
            <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">
              {text.labelPromise}
            </div>
            <p className="font-mono text-xs leading-relaxed text-gray-800 whitespace-pre-wrap">
              {data.promise}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col items-center pt-4 mt-auto">
          <div className="mb-2 font-bold text-center text-black">
            ( &gt; ‿ ♥ )
          </div>
          <div className="w-full h-px mb-1 bg-black"></div>
          <div className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
            LOVE FOREVER • {new Date().getFullYear()}
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
