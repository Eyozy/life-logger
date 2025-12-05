import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Printer,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  Globe,
  Loader2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Eye,
  Info,
  ChevronLeft,
} from "lucide-react";
import { LanguageContext } from './AppRouter'; // Import LanguageContext

const TEXT = {
  zh: {
    title: "LIFE_LOGGER",
    subtitle: "// 日常日志小票",
    reset: "重置",
    tabEdit: "编辑",
    tabPreview: "预览",
    envTitle: "时间与地点",
    envDesc: "为未来的自己记录背景。",
    envModLabel: "天气",
    locPinLabel: "地点",
    visualTitle: "OOTD / 状态",
    visualDesc: "今天穿了什么？身体感觉如何？",
    visualPlaceholder: "例如：穿着复古毛衣，感觉很困...",
    visualLabel: "状态 / OOTD",
    humoralTitle: "每日数据",
    humoralDesc: "量化你的一天",
    humoralTotal: "总计",
    humoralAuto: "图表",
    labelSan: "心情",
    labelPhl: "精力",
    labelCho: "专注",
    labelMel: "压力",
    rxTitle: "给自己的便条",
    rxDesc: "一句今天的关键提醒或语录。",
    rxPlaceholder: "例如：即使疲惫，你依然在发光。",
    rxLabel: "给自己的便条",
    consTitle: "大脑倾倒",
    consDesc: "转瞬即逝的想法和灵感。",
    surfaceLabel: "想法",
    deepLabel: "备忘录",
    tasksTitle: "待办清单",
    tasksDesc: "今天要完成的任务。",
    newTaskPlaceholder: "新任务...",
    downloadBtn: "下载",
    downloading: "保存中...",
    previewHint: "提示：桌面端推荐",
    endTransaction: "日志已存档"
  },
  en: {
    title: "LIFE_LOGGER",
    subtitle: "// DAILY LIFE TRACKER",
    reset: "Reset",
    tabEdit: "Edit Log",
    tabPreview: "View Receipt",
    envTitle: "Time & Location",
    envDesc: "Context for your future self.",
    envModLabel: "Weather",
    locPinLabel: "Location",
    visualTitle: "OOTD / Status",
    visualDesc: "What are you wearing? How do you feel physically?",
    visualPlaceholder: "e.g., Wearing vintage sweater, feeling sleepy...",
    visualLabel: "STATUS / OOTD",
    humoralTitle: "Daily Stats",
    humoralDesc: "Quantify your day (0-100%).",
    humoralTotal: "Overall",
    humoralAuto: "Chart",
    labelSan: "MOOD",
    labelPhl: "ENERGY",
    labelCho: "FOCUS",
    labelMel: "STRESS",
    rxTitle: "Note to Self",
    rxDesc: "A quote or a key reminder for today.",
    rxPlaceholder: "e.g., Even if tired, you are glowing.",
    rxLabel: "NOTE TO SELF",
    consTitle: "Brain Dump",
    consDesc: "Fleeting thoughts and ideas.",
    surfaceLabel: "Thoughts",
    deepLabel: "Memo",
    tasksTitle: "To-Do List",
    tasksDesc: "Tasks to conquer today.",
    newTaskPlaceholder: "New Task...",
    downloadBtn: "DOWNLOAD",
    downloading: "SAVING...",
    previewHint: "Hint: Desktop recommended",
    endTransaction: "Log Archived"
  }
};

const INITIAL_DATA_ZH = {
  envMod: "晴朗 / 26C",
  locPin: "星巴克",
  visualScan: "穿着新的卡其色风衣，搭配深色牛仔裤。拿着一杯冰美式咖啡，感觉充满活力。",
  humoral: { san: 80, phl: 60, cho: 90, mel: 30 },
  medievalRx: "别担心还没发生的事情。多喝水，深呼吸。",
  consciousStream: "邻桌很吵。突然想吃寿喜烧当晚餐。",
  deepLayer: "记得给妈妈打电话。",
  tasks: ["完成周报", "取干洗衣物", "预订周五餐厅"]
};

const INITIAL_DATA_EN = {
  envMod: "Sunny / 26C",
  locPin: "Starbucks",
  visualScan: "Wearing the new khaki trench coat with dark jeans. Holding an iced americano, feeling alive.",
  humoral: { san: 80, phl: 60, cho: 90, mel: 30 },
  medievalRx: "Don't worry about things that haven't happened yet. Drink water, breathe.",
  consciousStream: "The table next to me is loud. Suddenly craving sukiyaki for dinner.",
  deepLayer: "Remember to call mom.",
  tasks: ["Finish Weekly Report", "Pick up dry cleaning", "Book restaurant for Friday"]
};

export default function SoulReceiptGenerator() {
  const { lang, toggleLang } = useContext(LanguageContext); // Use global lang state
  const [data, setData] = useState(lang === 'zh' ? INITIAL_DATA_ZH : INITIAL_DATA_EN); // Initialize data based on global lang
  const [dateTime, setDateTime] = useState({ date: "", time: "", zone: "", yearProgress: 0, year: 2025 });
  const [isDownloading, setIsDownloading] = useState(false);
  const [expandedSection, setExpandedSection] = useState('env');
  const [mobileTab, setMobileTab] = useState('edit');
  const receiptRef = useRef(null);
  const t = TEXT[lang];

  useEffect(() => {
    // Update data when lang changes
    setData(lang === 'zh' ? INITIAL_DATA_ZH : INITIAL_DATA_EN);

    const now = new Date();
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const day = days[now.getDay()];
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    let zone = "";
    try {
      const short = now.toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];
      if(short) zone = short;
      else {
        const offset = -now.getTimezoneOffset() / 60;
        zone = `GMT${offset >= 0 ? '+' : ''}${offset}`;
      }
    } catch (e) { zone = ""; }

    const startOfYear = new Date(yyyy, 0, 1).getTime();
    const endOfYear = new Date(yyyy + 1, 0, 1).getTime();
    const nowTime = now.getTime();
    const progress = ((nowTime - startOfYear) / (endOfYear - startOfYear) * 100).toFixed(2);

    setDateTime({
      date: `${yyyy}.${mm}.${dd} ${day}`,
      time: `${hh}:${min}`,
      zone: zone,
      yearProgress: progress,
      year: yyyy
    });
  }, [lang]); // Depend on lang to re-run effect

  const handleReset = () => setData(lang === 'zh' ? INITIAL_DATA_ZH : INITIAL_DATA_EN);
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updateHumoral = (key, value) => {
    setData(prev => ({
      ...prev,
      humoral: { ...prev.humoral, [key]: parseInt(value) || 0 }
    }));
  };

  const addTask = () => setData(prev => ({ ...prev, tasks: [...prev.tasks, ""] }));
  const updateTask = (index, value) => {
    const newTasks = [...data.tasks];
    newTasks[index] = value;
    setData(prev => ({ ...prev, tasks: newTasks }));
  };
  const removeTask = (index) => {
    const newTasks = data.tasks.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, tasks: newTasks }));
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setIsDownloading(true);
    try {
      if (!window.htmlToImage) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      await new Promise(r => setTimeout(r, 100));
      const dataUrl = await window.htmlToImage.toPng(receiptRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: null,
        width: 380,
        style: { transform: 'none', boxShadow: 'none', margin: '0', width: '380px' }
      });
      const link = document.createElement('a');
      link.download = `LIFE_LOG_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      alert("");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 text-gray-900 font-mono flex flex-col md:flex-row overflow-hidden">
      {/* --- 编辑面板 --- */}
      <div className={`w-full md:w-1/2 flex flex-col h-full bg-white md:border-r border-gray-200 transition-transform duration-300 ${mobileTab === 'edit' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} absolute md:relative z-10`}>
        <header className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 bg-white z-20 shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link 
              to="/" 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              aria-label={lang === 'zh' ? '返回首页' : 'Back to home'}
            >
              <ChevronLeft size={18} />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-gray-900 tracking-wider">{t.title}</h1>
              <p className="text-xs text-gray-400 font-bold">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleLang} 
              className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded font-bold flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              aria-label={lang === 'zh' ? '切换到英文' : 'Switch to Chinese'}
            >
              <Globe size={12} aria-hidden="true" /> {lang === 'zh' ? 'EN' : '中文'}
            </button>
            <button 
              onClick={handleReset} 
              className="text-xs p-2 text-gray-400 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded" 
              title={t.reset}
              aria-label={t.reset}
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 pb-24 md:pb-10 no-scrollbar">
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
          <InputSection title={t.envTitle} desc={t.envDesc} isOpen={expandedSection === 'env'} onToggle={() => toggleSection('env')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup label={t.envModLabel} value={data.envMod} onChange={v => setData({...data, envMod: v})} />
              <InputGroup label={t.locPinLabel} value={data.locPin} onChange={v => setData({...data, locPin: v})} />
            </div>
          </InputSection>
          <InputSection title={t.visualTitle} desc={t.visualDesc} isOpen={expandedSection === 'visual'} onToggle={() => toggleSection('visual')}>
            <textarea
              value={data.visualScan}
              onChange={(e) => setData({...data, visualScan: e.target.value})}
              placeholder={t.visualPlaceholder}
              className="w-full bg-gray-50 border border-gray-200 p-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm resize-none h-24 transition-all"
            />
          </InputSection>
          <InputSection title={t.humoralTitle} desc={t.humoralDesc} isOpen={expandedSection === 'humoral'} onToggle={() => toggleSection('humoral')}>
             <div className="space-y-4 bg-gray-50 p-4 rounded-sm border border-gray-100">
               <SliderItem label={t.labelSan} value={data.humoral.san} onChange={v => updateHumoral('san', v)} />
               <SliderItem label={t.labelPhl} value={data.humoral.phl} onChange={v => updateHumoral('phl', v)} />
               <SliderItem label={t.labelCho} value={data.humoral.cho} onChange={v => updateHumoral('cho', v)} />
               <SliderItem label={t.labelMel} value={data.humoral.mel} onChange={v => updateHumoral('mel', v)} />
              <div className="text-[10px] text-gray-400 text-center pt-2 border-t border-gray-200">
                {t.humoralTotal}: {Object.values(data.humoral).reduce((a, b) => a + b, 0)}%
              </div>
            </div>
          </InputSection>
          <InputSection title={t.rxTitle} desc={t.rxDesc} isOpen={expandedSection === 'rx'} onToggle={() => toggleSection('rx')}>
            <textarea
              value={data.medievalRx}
              onChange={(e) => setData({...data, medievalRx: e.target.value})}
              placeholder={t.rxPlaceholder}
              className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-serif italic focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm resize-none h-20"
            />
          </InputSection>
          <InputSection title={t.consTitle} desc={t.consDesc} isOpen={expandedSection === 'cons'} onToggle={() => toggleSection('cons')}>
            <div className="space-y-4">
              <InputGroup label={t.surfaceLabel} value={data.consciousStream} onChange={v => setData({...data, consciousStream: v})} isTextArea />
              <InputGroup label={t.deepLabel} value={data.deepLayer} onChange={v => setData({...data, deepLayer: v})} isTextArea className="border-l-4 border-gray-300 bg-gray-50/50" />
            </div>
          </InputSection>
          <InputSection title={t.tasksTitle} desc={t.tasksDesc} isOpen={expandedSection === 'tasks'} onToggle={() => toggleSection('tasks')}>
            <div className="space-y-2">
              {data.tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full shrink-0"></div>
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => updateTask(index, e.target.value)}
                    placeholder={t.newTaskPlaceholder}
                    className="flex-1 bg-transparent border-b border-gray-200 py-1.5 text-sm focus:border-black outline-none transition-colors text-gray-800 placeholder-gray-300"
                  />
                  <button onClick={() => removeTask(index)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button onClick={addTask} className="mt-2 text-xs flex items-center gap-1 text-emerald-600 font-bold hover:text-emerald-700 px-1 py-2">
                <Plus size={14} /> {t.newTaskPlaceholder}
              </button>
            </div>
          </InputSection>
          <div className="h-10 md:hidden"></div>
        </div>
      </div>

      {/* --- 预览面板 --- */}
      <div className={`w-full md:w-1/2 bg-gray-200 relative z-10 transition-transform duration-300 ${mobileTab === 'preview' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} absolute md:relative h-full`}>
        <div className="absolute inset-0 pointer-events-none opacity-5">
           <div className="w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-black text-white px-5 py-2.5 rounded-full shadow-xl hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-xs font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {isDownloading ? t.downloading : t.downloadBtn}
          </button>
        </div>
        <div className="w-full h-full overflow-y-auto no-scrollbar">
           <div className="min-h-full flex items-center justify-center py-20 md:py-10">
             <div className="receipt-wrapper origin-top scale-90 sm:scale-100 transition-transform duration-500">
               <ReceiptPreview data={data} dateTime={dateTime} text={t} ref={receiptRef} />
             </div>
           </div>
        </div>
      </div>

      {/* --- 移动端标签栏 --- */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white rounded-full px-1.5 py-1.5 shadow-2xl flex gap-1" role="tablist" aria-label={lang === 'zh' ? '视图切换' : 'View tabs'}>
        <button 
          onClick={() => setMobileTab('edit')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[44px] ${mobileTab === 'edit' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          role="tab"
          aria-selected={mobileTab === 'edit'}
          aria-controls="edit-panel"
        >
          <Edit3 size={14} aria-hidden="true" /> {t.tabEdit}
        </button>
        <button 
          onClick={() => setMobileTab('preview')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[44px] ${mobileTab === 'preview' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          role="tab"
          aria-selected={mobileTab === 'preview'}
          aria-controls="preview-panel"
        >
          <Eye size={14} aria-hidden="true" /> {t.tabPreview}
        </button>
      </nav>
    </div>
  );
}

// 辅助组件
const SliderItem = ({ label, value, onChange }) => (
  <div className="flex items-center gap-3">
    <span className="w-20 text-[10px] font-bold uppercase text-gray-500 truncate">{label}</span>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
    />
    <span className="w-8 text-right text-xs font-mono font-bold text-gray-900">{value}</span>
  </div>
);

const InputSection = ({ title, desc, children, isOpen, onToggle }) => (
  <div className={`border border-gray-200 rounded-lg bg-white overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md ring-1 ring-black/5' : 'hover:border-gray-300'}`}>
    <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors">
      <div>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${isOpen ? 'text-black' : 'text-gray-600'}`}>{title}</h3>
        <p className="text-[10px] text-gray-400 mt-0.5 font-medium leading-tight">{desc}</p>
      </div>
      <div className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-black' : ''}`}><ChevronDown size={18} /></div>
    </button>
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="p-4 pt-0 border-t border-gray-50"><div className="pt-4">{children}</div></div>
    </div>
  </div>
);

const InputGroup = ({ label, value, onChange, isTextArea = false, className = "" }) => (
  <div className={className}>
    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>
    {isTextArea ?
      <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm resize-none h-20 block transition-all" /> :
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm block transition-all" />
    }
  </div>
);

// 年进度条组件
const YearProgressBar = ({ progress, year }) => {
  return (
    <div className="flex items-center w-full text-[10px] font-bold mt-1 pt-2 border-t border-dashed border-gray-400 text-gray-800 leading-relaxed gap-2">
      <span className="whitespace-nowrap">{year} LOAD:</span>
      <div className="flex-1 h-3 relative">
        <div className="absolute inset-0 w-full h-full opacity-20"
             style={{ backgroundImage: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px)' }}>
        </div>
        <div className="absolute inset-0 h-full overflow-hidden" style={{ width: `${progress}%` }}>
             <div className="w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #000 0px, #000 3px, transparent 3px, transparent 4px)' }}></div>
        </div>
      </div>
      <span className="whitespace-nowrap">{progress}%</span>
    </div>
  );
};

// 条形码组件
const DeterministicBarcode = ({ dataString }) => {
  const bars = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      hash = ((hash << 5) - hash) + dataString.charCodeAt(i);
      hash |= 0;
    }
    const generated = [];
    const seed = Math.abs(hash);
    for (let i = 0; i < 50; i++) {
      const width = ((seed >> (i % 30)) & 3) + 1; // 1-4px
      const margin = ((seed >> ((i + 5) % 30)) & 1) ? 2 : 1; // 1-2px
      generated.push({ width, margin });
    }
    return generated;
  }, [dataString]);

  return (
    <div className="flex h-12 w-full justify-between items-stretch overflow-hidden px-4 mt-2">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="bg-black h-full"
          style={{
            width: `${bar.width}px`,
            marginRight: `${bar.margin}px`,
            flexShrink: 0
          }}
        />
      ))}
    </div>
  );
};

// 收据预览组件
const ReceiptPreview = React.forwardRef(({ data, dateTime, text }, ref) => {
  const { san, phl, cho, mel } = data.humoral;
  const total = san + phl + cho + mel;
  const getWidth = (val) => total === 0 ? 0 : (val / total) * 100;

  const showVisual = data.visualScan && data.visualScan.trim().length > 0;
  const showRx = data.medievalRx && data.medievalRx.trim().length > 0;
  const showSurface = data.consciousStream && data.consciousStream.trim().length > 0;
  const showDeep = data.deepLayer && data.deepLayer.trim().length > 0;
  const showCons = showSurface || showDeep;
  const showTasks = data.tasks.some(t => t.trim().length > 0);

  const barcodeSource = JSON.stringify(data) + dateTime.date + dateTime.time;

  return (
    <div ref={ref} className="w-[380px] min-h-[600px] relative font-mono mx-auto select-none flex flex-col">
      {/* 收据内容 */}
      <div className="bg-white p-6 pb-8 flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="text-center mb-2 leading-normal">
          <h1 className="text-3xl font-bold mb-1 tracking-[0.1em] text-black">{text.title}</h1>
          <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">{text.subtitle}</div>
        </div>
        <div className="border-t-2 border-dashed border-black my-2"></div>

        {/* 时间地点信息 */}
        <div>
          <div className="grid grid-cols-2 gap-y-1 text-sm font-bold w-full leading-relaxed">
            <div className="pr-1 whitespace-nowrap overflow-hidden">{text.envModLabel.toUpperCase()}: <span className="font-normal">{data.envMod}</span></div>
            <div className="pl-1 text-right whitespace-nowrap overflow-hidden">{text.locPinLabel.toUpperCase()}: <span className="font-normal">{data.locPin}</span></div>
            <div className="pr-1 whitespace-nowrap">DATE: <span className="font-normal">{dateTime.date}</span></div>
            <div className="pl-1 text-right whitespace-nowrap">TIME: <span className="font-normal">{dateTime.time}</span> <span className="text-[10px] font-normal align-middle">{dateTime.zone}</span></div>
          </div>
        </div>

        {showVisual && (
          <div className="mt-4">
            <div className="bg-black text-white inline-flex items-center px-2 py-1 text-xs font-bold mb-2 leading-none">{text.visualLabel}</div>
            <div className="border-l-4 border-black pl-3 py-1 text-sm leading-relaxed text-gray-800 break-words whitespace-pre-wrap">{data.visualScan}</div>
          </div>
        )}

        <div className="border border-black p-3 mt-2">
          <div className="text-center text-xs font-bold mb-3 uppercase leading-relaxed">-- {text.humoralTitle} --</div>
          <div className="flex h-6 border border-black mb-3 w-full">
            <div style={{ width: `${getWidth(san)}%` }} className="border-r border-black relative h-full"><svg width="100%" height="100%"><defs><pattern id="dots" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="black" /></pattern></defs><rect width="100%" height="100%" fill="url(#dots)" /></svg></div>
            <div style={{ width: `${getWidth(phl)}%` }} className="border-r border-black h-full"></div>
            <div style={{ width: `${getWidth(cho)}%` }} className="border-r border-black h-full"><svg width="100%" height="100%"><defs><pattern id="lines" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="black" strokeWidth="1" /></pattern></defs><rect width="100%" height="100%" fill="url(#lines)" /></svg></div>
            <div style={{ width: `${getWidth(mel)}%` }} className="bg-black h-full"></div>
          </div>
          <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] uppercase font-bold leading-normal">
            <div className="flex items-center gap-1"><div className="w-2 h-2 border border-black"><svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#dots)"/></svg></div><span>{text.labelSan}: {san}%</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 border border-black bg-white"></div><span>{text.labelPhl}: {phl}%</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 border border-black"><svg width="100%" height="100%"><rect width="100%" height="100%" fill="url(#lines)"/></svg></div><span>{text.labelCho}: {cho}%</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-black"></div><span>{text.labelMel}: {mel}%</span></div>
          </div>
        </div>

        {showRx && (
          <div className="border-[3px] border-double border-black p-3 text-center mt-2 relative">
            <h2 className="font-serif italic font-bold text-lg mb-2 leading-relaxed">{text.rxLabel}</h2>
            <p className="text-xs text-gray-700 font-serif leading-relaxed px-2 break-words whitespace-pre-wrap">"{data.medievalRx}"</p>
          </div>
        )}

        {showCons && (
          <div className="mt-4">
            {showSurface && (
              <>
                <div className="text-xs text-gray-500 mb-1 leading-relaxed">{'>>>'} {text.surfaceLabel.toUpperCase()}</div>
                <div className="border-b border-black mb-3"></div>
                <p className="text-sm italic text-gray-700 mb-4 px-1 break-words whitespace-pre-wrap leading-relaxed">"{data.consciousStream}"</p>
              </>
            )}
            {showDeep && (
              <>
                <div className="text-right text-xs text-gray-500 mb-1 leading-relaxed">{text.deepLabel.toUpperCase()} {'<<<'}</div>
                <div className="border-t border-black mb-1"></div>
                <div className="bg-gray-100 border-l-4 border-black p-3 text-sm font-medium break-words whitespace-pre-wrap leading-relaxed">{data.deepLayer}</div>
              </>
            )}
          </div>
        )}

        {showTasks && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px bg-black flex-1 border-t border-dashed border-gray-400"></div>
              <h3 className="font-bold text-sm tracking-widest leading-relaxed">{text.tasksTitle.toUpperCase()}</h3>
              <div className="h-px bg-black flex-1 border-t border-dashed border-gray-400"></div>
            </div>
            <ul className="text-sm space-y-2 pl-2">
              {data.tasks.filter(t => t.trim().length > 0).map((task, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span>-</span><span className="break-words whitespace-pre-wrap w-full">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 页脚 */}
        <div className="mt-1 flex flex-col items-center">
          <YearProgressBar progress={dateTime.yearProgress} year={dateTime.year} />
          <DeterministicBarcode dataString={barcodeSource} />
          <div className="text-[10px] tracking-widest text-gray-500 uppercase mt-2 leading-relaxed">{text.endTransaction}</div>
        </div>
      </div>

      {/* 撕裂边缘效果 */}
      <div className="w-full h-[12px] overflow-hidden leading-[0]">
        <svg width="100%" height="12px" preserveAspectRatio="none" className="block">
          <defs>
            <pattern id="rip" x="0" y="0" width="20" height="12" patternUnits="userSpaceOnUse">
              <path d="M0 0 L10 12 L20 0 Z" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rip)" />
        </svg>
      </div>
    </div>
  );
});
