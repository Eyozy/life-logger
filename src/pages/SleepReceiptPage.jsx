import React, { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Download, Loader2, Globe, Eye, Edit3 } from 'lucide-react';
import { DynamicBarcode } from '../components/shared/DynamicBarcode';
import { InputSection, InputGroup, RatingSlider, MetricBar } from '../components/shared/FormComponents';
import { useDownloadReceipt } from '../hooks/useDownloadReceipt';
import { calculateSleepDuration, calculateSleepScore, getSleepScoreLabel } from '../utils/calculations';

const TEXT = {
  zh: {
    title: "睡眠日志",
    subtitle: "// 睡眠记录小票",
    sleepInfo: "睡眠信息",
    metrics: "睡眠质量",
    dreamLog: "梦境记录",
    preSleepSection: "睡前活动",
    
    labelDate: "日期",
    labelBedtime: "入睡时间",
    labelWakeTime: "起床时间",
    labelDuration: "睡眠时长",
    
    labelQuality: "睡眠质量",
    labelDreamClarity: "梦境清晰度",
    labelWakeFreshness: "起床精神度",
    labelDeepSleep: "深度睡眠感",
    
    labelDreamContent: "梦境内容",
    labelNotes: "备注",
    labelMorningMood: "起床心情",
    labelSleepScore: "睡眠评分",
    labelPreSleep: "睡前活动",
    
    moodOptions: {
      REFRESHED: "神清气爽",
      NORMAL: "正常",
      TIRED: "疲惫",
      GROGGY: "昏沉",
      ANXIOUS: "焦虑"
    },
    
    preSleepActivities: {
      phone: "看手机",
      reading: "阅读",
      exercise: "运动",
      caffeine: "咖啡因",
      alcohol: "酒精",
      bath: "热水澡",
      work: "工作",
      meditation: "冥想"
    },
    
    scoreLabels: {
      excellent: "优秀",
      good: "良好",
      fair: "一般",
      poor: "较差"
    },
    
    download: "下载",
    downloading: "生成中...",
    tagline: "SWEET DREAMS"
  },
  en: {
    title: "SLEEP_LOG",
    subtitle: "// SLEEP TRACKER",
    sleepInfo: "Sleep Info",
    metrics: "Quality Metrics",
    dreamLog: "Dream Log",
    preSleepSection: "Pre-sleep Activities",
    
    labelDate: "Date",
    labelBedtime: "Bedtime",
    labelWakeTime: "Wake Time",
    labelDuration: "Duration",
    
    labelQuality: "Sleep Quality",
    labelDreamClarity: "Dream Clarity",
    labelWakeFreshness: "Wake Freshness",
    labelDeepSleep: "Deep Sleep",
    
    labelDreamContent: "Dream Content",
    labelNotes: "Notes",
    labelMorningMood: "Morning Mood",
    labelSleepScore: "Sleep Score",
    labelPreSleep: "Pre-sleep",
    
    moodOptions: {
      REFRESHED: "Refreshed",
      NORMAL: "Normal",
      TIRED: "Tired",
      GROGGY: "Groggy",
      ANXIOUS: "Anxious"
    },
    
    preSleepActivities: {
      phone: "Phone",
      reading: "Reading",
      exercise: "Exercise",
      caffeine: "Caffeine",
      alcohol: "Alcohol",
      bath: "Hot Bath",
      work: "Work",
      meditation: "Meditation"
    },
    
    scoreLabels: {
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor"
    },
    
    download: "DOWNLOAD LOG",
    downloading: "GENERATING...",
    tagline: "SWEET DREAMS"
  }
};

export default function SleepReceiptPage() {
  const [lang, setLang] = useState('zh');
  const [mobileTab, setMobileTab] = useState('edit');
  const [data, setData] = useState({
    date: new Date().toLocaleDateString('zh-CN'),
    bedtime: "23:30",
    wakeTime: "07:15",
    metrics: {
      quality: 80,
      dreamClarity: 60,
      wakeFreshness: 70,
      deepSleep: 75
    },
    morningMood: "NORMAL",
    dreamContent: "在云端飞行，风景很美...",
    notes: "睡前少看手机，早点休息",
    preSleepActivities: {
      phone: true,
      reading: false,
      exercise: false,
      caffeine: false,
      alcohol: false,
      bath: true,
      work: false,
      meditation: false
    }
  });

  const [expandedSection, setExpandedSection] = useState('sleep');
  const receiptRef = useRef(null);
  const t = TEXT[lang];
  const toggleLang = () => setLang(l => l === 'zh' ? 'en' : 'zh');
  const toggleSection = (s) => setExpandedSection(expandedSection === s ? null : s);

  // 使用自定义 Hook 处理下载
  const { isDownloading, handleDownload: download, error } = useDownloadReceipt('SLEEP_LOG');
  
  // 计算睡眠时长（使用 useMemo 优化性能）
  const duration = useMemo(() => 
    calculateSleepDuration(data.bedtime, data.wakeTime),
    [data.bedtime, data.wakeTime]
  );

  // 错误提示
  if (error) {
    alert(error);
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden font-receipt tracking-receipt text-gray-900 bg-gray-50 md:flex-row">
      {/* Editor */}
      <div className={`w-full md:w-1/2 flex flex-col h-full bg-white md:border-r border-gray-200 z-10 transition-transform duration-300 ${mobileTab === 'edit' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} absolute md:relative`}>
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link 
              to="/" 
              className="p-2 transition-colors rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              aria-label={lang === 'zh' ? '返回首页' : 'Back to home'}
            >
              <ChevronLeft size={18} />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black tracking-wider text-gray-900 truncate">{t.title}</h1>
              <p className="overflow-hidden text-xs font-bold text-gray-400 whitespace-nowrap text-ellipsis">{t.subtitle}</p>
            </div>
          </div>
          <button 
            onClick={toggleLang} 
            className="flex items-center gap-1 px-3 py-2 text-xs font-bold bg-gray-100 rounded hover:bg-gray-200 shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            aria-label={lang === 'zh' ? '切换到英文' : 'Switch to Chinese'}
          >
            <Globe size={12} /> {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </header>

        <div className="flex-1 p-4 pb-24 space-y-3 overflow-y-auto md:pb-10 no-scrollbar">
           <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
           <InputSection title={t.sleepInfo} isOpen={expandedSection === 'sleep'} onToggle={() => toggleSection('sleep')}>
             <InputGroup label={t.labelDate} value={data.date} onChange={v => setData({...data, date: v})} />
             <div className="grid grid-cols-2 gap-4">
               <InputGroup label={t.labelBedtime} value={data.bedtime} onChange={v => setData({...data, bedtime: v})} />
               <InputGroup label={t.labelWakeTime} value={data.wakeTime} onChange={v => setData({...data, wakeTime: v})} />
             </div>
             <div>
               <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">{t.labelMorningMood}</label>
               <select value={data.morningMood} onChange={e => setData({...data, morningMood: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm">
                 {Object.entries(t.moodOptions).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
               </select>
             </div>
           </InputSection>

           <InputSection title={t.metrics} isOpen={expandedSection === 'metrics'} onToggle={() => toggleSection('metrics')}>
             <div className="p-4 space-y-4 border border-gray-100 rounded-sm bg-gray-50">
               <RatingSlider label={t.labelQuality} value={data.metrics.quality} onChange={v => setData({...data, metrics: {...data.metrics, quality: v}})} />
               <RatingSlider label={t.labelDreamClarity} value={data.metrics.dreamClarity} onChange={v => setData({...data, metrics: {...data.metrics, dreamClarity: v}})} />
               <RatingSlider label={t.labelWakeFreshness} value={data.metrics.wakeFreshness} onChange={v => setData({...data, metrics: {...data.metrics, wakeFreshness: v}})} />
               <RatingSlider label={t.labelDeepSleep} value={data.metrics.deepSleep} onChange={v => setData({...data, metrics: {...data.metrics, deepSleep: v}})} />
             </div>
           </InputSection>

           <InputSection title={t.preSleepSection} isOpen={expandedSection === 'presleep'} onToggle={() => toggleSection('presleep')}>
             <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
               {Object.entries(t.preSleepActivities).map(([key, label]) => (
                 <button
                   key={key}
                   onClick={() => setData({...data, preSleepActivities: {...data.preSleepActivities, [key]: !data.preSleepActivities[key]}})}
                   className={`p-2 text-xs font-bold border-2 rounded transition-all ${data.preSleepActivities[key] ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                 >
                   {data.preSleepActivities[key] ? '✓ ' : ''}{label}
                 </button>
               ))}
             </div>
           </InputSection>

           <InputSection title={t.dreamLog} isOpen={expandedSection === 'dream'} onToggle={() => toggleSection('dream')}>
             <InputGroup label={t.labelDreamContent} value={data.dreamContent} onChange={v => setData({...data, dreamContent: v})} isTextArea />
             <InputGroup label={t.labelNotes} value={data.notes} onChange={v => setData({...data, notes: v})} isTextArea />
           </InputSection>
           <div className="h-10 md:hidden"></div>
        </div>
      </div>

      {/* Preview */}
      <div className={`w-full md:w-1/2 bg-gray-200 relative z-0 transition-transform duration-300 ${mobileTab === 'preview' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} absolute md:relative h-full`}>
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute z-20 top-4 right-4">
          <button onClick={() => download(receiptRef)} disabled={isDownloading} className="bg-black text-white px-5 py-2.5 rounded-full shadow-xl hover:bg-gray-800 transition-all flex items-center gap-2 text-xs font-bold tracking-widest">
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {isDownloading ? t.downloading : t.download}
          </button>
        </div>

        <div className="w-full h-full overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-center min-h-full py-20 md:py-10">
            <div className="transition-transform duration-500 origin-top scale-90 receipt-wrapper sm:scale-100">
              <SleepPreview data={data} text={t} duration={duration} ref={receiptRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white rounded-full px-1.5 py-1.5 shadow-2xl flex gap-1" role="tablist" aria-label={lang === 'zh' ? '视图切换' : 'View tabs'}>
        <button 
          onClick={() => setMobileTab('edit')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${mobileTab === 'edit' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          role="tab"
          aria-selected={mobileTab === 'edit'}
          aria-controls="edit-panel"
        >
          <Edit3 size={14} aria-hidden="true" /> {lang === 'zh' ? '编辑' : 'Edit'}
        </button>
        <button 
          onClick={() => setMobileTab('preview')} 
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${mobileTab === 'preview' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
          role="tab"
          aria-selected={mobileTab === 'preview'}
          aria-controls="preview-panel"
        >
          <Eye size={14} aria-hidden="true" /> {lang === 'zh' ? '预览' : 'Preview'}
        </button>
      </nav>
    </div>
  );
}

/**
 * 睡眠收据预览组件
 * 展示睡眠数据的收据样式预览，包括评分、时长、梦境等信息
 */
const SleepPreview = React.forwardRef(({ data, text, duration }, ref) => {
  const metricMap = {
    quality: text.labelQuality,
    dreamClarity: text.labelDreamClarity,
    wakeFreshness: text.labelWakeFreshness,
    deepSleep: text.labelDeepSleep
  };

  // 计算睡眠综合评分（使用 useMemo 优化）
  const sleepScore = useMemo(() => 
    calculateSleepScore(data.metrics),
    [data.metrics]
  );
  
  // 获取评分等级标签
  const scoreLabel = useMemo(() => 
    getSleepScoreLabel(sleepScore, text.scoreLabels),
    [sleepScore, text.scoreLabels]
  );

  // 获取选中的睡前活动
  const activeActivities = useMemo(() => 
    Object.entries(data.preSleepActivities || {})
      .filter(([_, active]) => active)
      .map(([key]) => key),
    [data.preSleepActivities]
  );

  return (
    <div ref={ref} className="w-[380px] flex flex-col relative">
      <div className="flex flex-col flex-1 p-6 pb-8 font-receipt tracking-receipt text-black bg-white shadow-sm">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="mb-1 text-2xl font-black tracking-widest uppercase">{text.title}</h1>
          <div className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">{text.subtitle}</div>
        </div>
        
        <div className="my-2 border-t-2 border-black"></div>
        <div className="mb-6 border-t border-black"></div>

        {/* Sleep Info */}
        <div className="grid grid-cols-2 mb-4 text-xs font-bold leading-relaxed uppercase gap-y-1">
          {data.date && <><div className="text-gray-500">{text.labelDate}:</div><div className="text-right text-black">{data.date}</div></>}
          {data.bedtime && <><div className="text-gray-500">{text.labelBedtime}:</div><div className="text-right text-black">{data.bedtime}</div></>}
          {data.wakeTime && <><div className="text-gray-500">{text.labelWakeTime}:</div><div className="text-right text-black">{data.wakeTime}</div></>}
          {duration && <><div className="text-gray-500">{text.labelDuration}:</div><div className="font-black text-right text-black">{duration}</div></>}
        </div>

        {/* Morning Mood */}
        <div className="py-4 mb-6 text-center border-black border-dashed border-y-2">
          <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">{text.labelMorningMood}</div>
          <div className="text-lg font-black">{text.moodOptions[data.morningMood]}</div>
        </div>

        {/* Pre-sleep Activities */}
        {activeActivities.length > 0 && (
          <div className="mb-6">
            <div className="text-[10px] font-bold uppercase border-b border-black pb-1 mb-2">-- {text.labelPreSleep} --</div>
            <div className="flex flex-wrap gap-2">
              {activeActivities.map(key => (
                <span key={key} className="px-2 py-1 text-xs font-bold border border-black">
                  {text.preSleepActivities[key]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metrics */}
        <div className="mb-6 space-y-2">
           <div className="text-[10px] font-bold uppercase border-b border-black pb-1 mb-2">-- {text.metrics} --</div>
           {Object.keys(data.metrics).map(key => (
              <MetricBar key={key} label={metricMap[key]} value={data.metrics[key]} />
           ))}
        </div>

        {/* Dream Content */}
        {data.dreamContent && data.dreamContent.trim() && (
          <div className="mb-4">
             <div className="text-[10px] font-bold uppercase border-b border-black pb-1 mb-2">{text.labelDreamContent}</div>
             <p className="text-xs italic leading-relaxed whitespace-pre-wrap">"{data.dreamContent}"</p>
          </div>
        )}

        {/* Notes */}
        {data.notes && data.notes.trim() && (
          <div className="flex-1 mb-6">
             <div className="text-[10px] font-bold uppercase border-b border-black pb-1 mb-2">{text.labelNotes}</div>
             <p className="text-xs leading-relaxed whitespace-pre-wrap">{data.notes}</p>
          </div>
        )}

        {/* Sleep Score */}
        <div className="mb-6 text-center">
          <div className="inline-block px-6 py-3 border-2 border-black">
            <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">{text.labelSleepScore}</div>
            <div className="text-3xl font-black">{sleepScore}</div>
            <div className="text-xs font-bold text-gray-600">/100 {scoreLabel}</div>
          </div>
        </div>

        {/* Footer / Barcode */}
        <DynamicBarcode data={data} tagline={text.tagline} />
      </div>
      
      {/* Zigzag Bottom */}
      <div className="w-full h-2 overflow-hidden">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAyMCAxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwIEwxMCAxMCBMMjAgMCBaIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+')] bg-repeat-x bg-contain"></div>
      </div>
    </div>
  );
});

export { SleepReceiptPage };
