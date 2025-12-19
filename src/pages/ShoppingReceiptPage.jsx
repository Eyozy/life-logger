import React, { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Download,
  Loader2,
  Globe,
  Eye,
  Edit3,
  Plus,
  Trash2,
} from "lucide-react";
import { DynamicBarcode } from "../components/shared/DynamicBarcode";
import {
  InputSection,
  InputGroup,
  RatingSlider,
  MetricBar,
} from "../components/shared/FormComponents";
import { useDownloadReceipt } from "../hooks/useDownloadReceipt";
import { calculateShoppingTotal } from "../utils/calculations";

const TEXT = {
  zh: {
    title: "购物日志",
    subtitle: "// 购物记录小票",
    shoppingInfo: "购物信息",
    items: "购物清单",
    metrics: "消费评估",

    labelDate: "日期",
    labelLocation: "地点",
    labelChannel: "渠道",
    labelCategory: "类别",

    labelItemName: "商品名称",
    labelItemPrice: "价格",
    labelAddItem: "添加商品",

    labelNecessity: "必要性",
    labelRegret: "后悔指数",
    labelJoy: "快乐指数",
    labelValue: "性价比",

    labelTotal: "总计",
    labelVerdict: "消费评定",
    labelNotes: "购物心得",

    channelOptions: {
      OFFLINE: "线下",
      ONLINE: "线上",
      MIXED: "混合",
    },

    categoryOptions: {
      CLOTHING: "服装",
      ELECTRONICS: "电子产品",
      FOOD: "食品",
      HOME: "家居",
      BEAUTY: "美妆",
      BOOKS: "书籍",
      ENTERTAINMENT: "娱乐",
      OTHER: "其他",
    },

    verdictOptions: {
      RATIONAL: "[✓] 理性消费",
      IMPULSE: "[!] 冲动消费",
      REGRET: "[×] 后悔消费",
      INVESTMENT: "[★] 投资消费",
    },

    download: "下载",
    downloading: "生成中...",
    tagline: "MONEY WELL SPENT",
  },
  en: {
    title: "SPENDING_LOG",
    subtitle: "// SHOPPING LOG",
    shoppingInfo: "Shopping Info",
    items: "Items",
    metrics: "Metrics",

    labelDate: "Date",
    labelLocation: "Location",
    labelChannel: "Channel",
    labelCategory: "Category",

    labelItemName: "Item Name",
    labelItemPrice: "Price",
    labelAddItem: "Add Item",

    labelNecessity: "Necessity",
    labelRegret: "Regret Index",
    labelJoy: "Joy Index",
    labelValue: "Value for Money",

    labelTotal: "Total",
    labelVerdict: "Verdict",
    labelNotes: "Shopping Notes",

    channelOptions: {
      OFFLINE: "Offline",
      ONLINE: "Online",
      MIXED: "Mixed",
    },

    categoryOptions: {
      CLOTHING: "Clothing",
      ELECTRONICS: "Electronics",
      FOOD: "Food",
      HOME: "Home",
      BEAUTY: "Beauty",
      BOOKS: "Books",
      ENTERTAINMENT: "Entertainment",
      OTHER: "Other",
    },

    verdictOptions: {
      RATIONAL: "[✓] Rational",
      IMPULSE: "[!] Impulse",
      REGRET: "[×] Regret",
      INVESTMENT: "[★] Investment",
    },

    download: "DOWNLOAD LOG",
    downloading: "GENERATING...",
    tagline: "MONEY WELL SPENT",
  },
};

export default function ShoppingReceiptPage() {
  const [lang, setLang] = useState("zh");
  const [mobileTab, setMobileTab] = useState("edit");
  const [data, setData] = useState({
    date: new Date().toLocaleDateString("zh-CN"),
    location: "优衣库",
    channel: "OFFLINE",
    category: "CLOTHING",
    items: [
      { name: "羊毛外套", price: 599 },
      { name: "基础 T 恤 x2", price: 158 },
      { name: "袜子套装", price: null },
    ],
    metrics: {
      necessity: 7,
      regret: 2,
      joy: 8,
      value: 7,
    },
    verdict: "RATIONAL",
    notes: "换季打折，趁机入手了几件基础款",
  });

  const [expandedSection, setExpandedSection] = useState("shopping");
  const receiptRef = useRef(null);
  const t = TEXT[lang];
  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));
  const toggleSection = (s) =>
    setExpandedSection(expandedSection === s ? null : s);

  // Use custom hook for download/export
  const {
    isDownloading,
    handleDownload: download,
    error,
  } = useDownloadReceipt("SPENDING_LOG");

  const addItem = () => {
    setData({ ...data, items: [...data.items, { name: "", price: null }] });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...data.items];
    if (field === "price") {
      newItems[index][field] = value === "" ? null : parseFloat(value);
    } else {
      newItems[index][field] = value;
    }
    setData({ ...data, items: newItems });
  };

  const removeItem = (index) => {
    const newItems = data.items.filter((_, i) => i !== index);
    setData({ ...data, items: newItems });
  };

  // Calculate total (memoized)
  const { total, hasTotal } = useMemo(
    () => calculateShoppingTotal(data.items),
    [data.items]
  );

  // Error handling
  if (error) {
    alert(error);
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden text-gray-900 bg-gray-100 md:flex-row md:justify-center">
      {/* Editor */}
      <div
        className={`w-full md:w-[450px] flex flex-col h-full bg-white  z-10 transition-transform duration-300 ${
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
            title={t.shoppingInfo}
            isOpen={expandedSection === "shopping"}
            onToggle={() => toggleSection("shopping")}
          >
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase">
                  {t.labelChannel}
                </label>
                <select
                  value={data.channel}
                  onChange={(e) =>
                    setData({ ...data, channel: e.target.value })
                  }
                  aria-label={t.labelChannel}
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm"
                >
                  {Object.entries(t.channelOptions).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase">
                  {t.labelCategory}
                </label>
                <select
                  value={data.category}
                  onChange={(e) =>
                    setData({ ...data, category: e.target.value })
                  }
                  aria-label={t.labelCategory}
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm"
                >
                  {Object.entries(t.categoryOptions).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </InputSection>

          <InputSection
            title={t.items}
            isOpen={expandedSection === "items"}
            onToggle={() => toggleSection("items")}
          >
            <div className="space-y-3">
              {data.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    placeholder={t.labelItemName}
                    aria-label={t.labelItemName}
                    className="flex-1 p-2 text-sm border border-gray-200 rounded-sm outline-none bg-gray-50 focus:border-black"
                  />
                  <input
                    type="number"
                    value={item.price === null ? "" : item.price}
                    onChange={(e) => updateItem(index, "price", e.target.value)}
                    placeholder="¥ (可选)"
                    aria-label={t.labelItemPrice || t.labelItemName}
                    className="w-24 p-2 text-sm border border-gray-200 rounded-sm outline-none bg-gray-50 focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-gray-400 transition-colors hover:text-red-500"
                    aria-label={lang === "zh" ? "删除项目" : "Remove item"}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="flex items-center justify-center w-full gap-2 py-2 text-sm font-bold text-gray-500 transition-colors border-2 border-gray-300 border-dashed hover:border-black hover:text-black"
              >
                <Plus size={16} /> {t.labelAddItem}
              </button>
            </div>
          </InputSection>

          <InputSection
            title={t.metrics}
            isOpen={expandedSection === "metrics"}
            onToggle={() => toggleSection("metrics")}
          >
            <div className="p-4 space-y-4 border border-gray-100 rounded-sm bg-gray-50">
              <RatingSlider
                label={t.labelNecessity}
                value={data.metrics.necessity}
                onChange={(v) =>
                  setData({
                    ...data,
                    metrics: { ...data.metrics, necessity: v },
                  })
                }
              />
              <RatingSlider
                label={t.labelRegret}
                value={data.metrics.regret}
                onChange={(v) =>
                  setData({ ...data, metrics: { ...data.metrics, regret: v } })
                }
              />
              <RatingSlider
                label={t.labelJoy}
                value={data.metrics.joy}
                onChange={(v) =>
                  setData({ ...data, metrics: { ...data.metrics, joy: v } })
                }
              />
              <RatingSlider
                label={t.labelValue}
                value={data.metrics.value}
                onChange={(v) =>
                  setData({ ...data, metrics: { ...data.metrics, value: v } })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase">
                {t.labelVerdict}
              </label>
              <select
                value={data.verdict}
                onChange={(e) => setData({ ...data, verdict: e.target.value })}
                aria-label={t.labelVerdict}
                className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm"
              >
                {Object.entries(t.verdictOptions).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <InputGroup
              label={t.labelNotes}
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
        className={`w-full md:w-[450px] bg-gray-200 relative z-0 transition-transform duration-300 ${
          mobileTab === "preview"
            ? "translate-x-0"
            : "translate-x-full md:translate-x-0"
        } absolute md:relative h-full`}
      >
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute z-20 top-4 right-4">
          <button
            onClick={() => download(receiptRef)}
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
              <ShoppingPreview
                data={data}
                text={t}
                total={total}
                hasTotal={hasTotal}
                ref={receiptRef}
              />
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
          <Edit3 size={14} /> 编辑
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

/**
 * Shopping receipt preview component.
 * Shows the shopping list, totals, and a spending verdict.
 */
const ShoppingPreview = React.forwardRef(
  ({ data, text, total, hasTotal }, ref) => {
    const metricMap = {
      necessity: text.labelNecessity,
      regret: text.labelRegret,
      joy: text.labelJoy,
      value: text.labelValue,
    };

    const validItems = data.items.filter(
      (item) => item.name && item.name.trim()
    );

    return (
      <div ref={ref} className="w-[380px] flex flex-col relative">
        <div className="flex flex-col flex-1 p-6 pb-8 text-black bg-white shadow-sm font-receipt tracking-receipt">
          {/* Header */}
          <div className="mb-4 text-center">
            <h1
              className="mb-1 font-black tracking-widest uppercase"
              style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}
            >
              {text.title}
            </h1>
            <div className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">
              {text.subtitle}
            </div>
          </div>

          <div className="my-2 border-t-2 border-black"></div>
          <div className="mb-6 border-t border-black"></div>

          {/* Shopping Info */}
          <div className="grid grid-cols-2 mb-4 text-xs font-bold leading-relaxed uppercase gap-y-1">
            {data.date && (
              <>
                <div className="text-gray-500">{text.labelDate}:</div>
                <div className="text-right text-black">{data.date}</div>
              </>
            )}
            {data.location && data.location.trim() && (
              <>
                <div className="text-gray-500">{text.labelLocation}:</div>
                <div className="text-right text-black truncate">
                  {data.location}
                </div>
              </>
            )}
            {data.channel && (
              <>
                <div className="text-gray-500">{text.labelChannel}:</div>
                <div className="text-right text-black">
                  {text.channelOptions[data.channel]}
                </div>
              </>
            )}
            {data.category && (
              <>
                <div className="text-gray-500">{text.labelCategory}:</div>
                <div className="text-right text-black">
                  {text.categoryOptions[data.category]}
                </div>
              </>
            )}
          </div>

          {/* Items List */}
          {validItems.length > 0 && (
            <div className="py-4 mb-6 border-black border-dashed border-y-2">
              <div className="space-y-2">
                {validItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="truncate max-w-[200px]">{item.name}</span>
                    {item.price !== null &&
                      item.price !== undefined &&
                      !isNaN(item.price) && (
                        <span className="font-bold">
                          ¥{item.price.toFixed(0)}
                        </span>
                      )}
                  </div>
                ))}
              </div>
              {hasTotal && (
                <div className="flex justify-between pt-3 mt-4 text-sm font-black border-t border-black">
                  <span>{text.labelTotal}:</span>
                  <span>¥{total.toFixed(0)}</span>
                </div>
              )}
            </div>
          )}

          {/* Metrics */}
          <div className="mb-6 space-y-2">
            <div className="text-[10px] font-bold uppercase border-b border-black pb-1 mb-2">
              -- {text.metrics} --
            </div>
            {Object.keys(data.metrics).map((key) => (
              <MetricBar
                key={key}
                label={metricMap[key]}
                value={data.metrics[key]}
              />
            ))}
          </div>

          {/* Verdict */}
          <div className="p-3 mb-4 text-center border-2 border-black">
            <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">
              {text.labelVerdict}
            </div>
            <div className="text-lg font-black">
              {text.verdictOptions[data.verdict]}
            </div>
          </div>

          {/* Notes */}
          {data.notes && data.notes.trim() && (
            <div className="flex-1 mb-6">
              <div className="text-[10px] font-bold uppercase border-b border-black pb-1 mb-2">
                {text.labelNotes}
              </div>
              <p className="text-xs leading-relaxed whitespace-pre-wrap">
                {data.notes}
              </p>
            </div>
          )}

          {/* Footer / Barcode */}
          <DynamicBarcode data={data} tagline={text.tagline} />
        </div>

        {/* Zigzag Bottom */}
        <div className="w-full h-2 overflow-hidden">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAyMCAxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwIEwxMCAxMCBMMjAgMCBaIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+')] bg-repeat-x bg-contain"></div>
        </div>
      </div>
    );
  }
);

export { ShoppingReceiptPage };
