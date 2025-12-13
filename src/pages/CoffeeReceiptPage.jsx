import React, { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Download, Loader2, Globe, Eye, Edit3 } from 'lucide-react';
import { DynamicBarcode } from '../components/shared/DynamicBarcode';
import { InputSection, InputGroup, RatingSlider, MetricBar } from '../components/shared/FormComponents';
import { useDownloadReceipt } from '../hooks/useDownloadReceipt';
import { getCaffeineStatus } from '../utils/calculations';

const TEXT = {
  zh: {
    title: "咖啡日志",
    subtitle: "// 咖啡记录小票",
    coffeeInfo: "咖啡信息",
    metrics: "口味评价",
    notes: "备注",
    
    labelDate: "日期",
    labelTime: "时间",
    labelShop: "店铺",
    labelDrink: "饮品",
    labelSize: "杯型",
    labelPrice: "价格",
    
    labelCaffeine: "咖啡因 (mg)",
    labelBitterness: "苦度",
    labelAcidity: "酸度",
    labelSweetness: "甜度",
    labelSatisfaction: "满意度",
    
    labelBean: "豆子产地",
    labelMethod: "制作方式",
    labelNotesContent: "品鉴笔记",
    
    labelTodayTotal: "今日摄入",
    labelStatus: "状态",
    
    sizeOptions: {
      SMALL: "小杯 240ml",
      MEDIUM: "中杯 360ml",
      LARGE: "大杯 480ml"
    },
    
    methodOptions: {
      ESPRESSO: "意式浓缩",
      POUROVER: "手冲",
      COLDBREW: "冷萃",
      LATTE: "拿铁",
      AMERICANO: "美式",
      CAPPUCCINO: "卡布奇诺",
      MOCHA: "摩卡",
      OTHER: "其他"
    },
    
    caffeineStatus: {
      low: "安全范围",
      medium: "适量摄入",
      high: "接近上限",
      danger: "超标警告"
    },
    
    download: "下载",
    downloading: "生成中...",
    tagline: "STAY CAFFEINATED"
  },
  en: {
    title: "CAFFEINE_LOG",
    subtitle: "// CAFFEINE TRACKER",
    coffeeInfo: "Coffee Info",
    metrics: "Taste Metrics",
    notes: "Notes",
    
    labelDate: "Date",
    labelTime: "Time",
    labelShop: "Shop",
    labelDrink: "Drink",
    labelSize: "Size",
    labelPrice: "Price",
    
    labelCaffeine: "Caffeine (mg)",
    labelBitterness: "Bitterness",
    labelAcidity: "Acidity",
    labelSweetness: "Sweetness",
    labelSatisfaction: "Satisfaction",
    
    labelBean: "Bean Origin",
    labelMethod: "Brew Method",
    labelNotesContent: "Tasting Notes",
    
    labelTodayTotal: "Today's Total",
    labelStatus: "Status",
    
    sizeOptions: {
      SMALL: "Small / 240ml",
      MEDIUM: "Medium / 360ml",
      LARGE: "Large / 480ml"
    },
    
    methodOptions: {
      ESPRESSO: "Espresso",
      POUROVER: "Pour Over",
      COLDBREW: "Cold Brew",
      LATTE: "Latte",
      AMERICANO: "Americano",
      CAPPUCCINO: "Cappuccino",
      MOCHA: "Mocha",
      OTHER: "Other"
    },
    
    caffeineStatus: {
      low: "Safe Range",
      medium: "Moderate",
      high: "Near Limit",
      danger: "Over Limit"
    },
    
    download: "DOWNLOAD LOG",
    downloading: "GENERATING...",
    tagline: "STAY CAFFEINATED"
  }
};

export default function CoffeeReceiptPage() {
  const [lang, setLang] = useState('zh');
  const [mobileTab, setMobileTab] = useState('edit');
  const [data, setData] = useState({
    date: new Date().toLocaleDateString('zh-CN'),
    time: "14:30",
    shop: "蓝瓶咖啡",
    drink: "冰美式",
    size: "MEDIUM",
    price: "38",
    caffeine: 150,
    todayTotal: 280,
    metrics: {
      bitterness: 6,
      acidity: 4,
      sweetness: 2,
      satisfaction: 9
    },
    method: "AMERICANO",
    bean: "埃塞俄比亚 耶加雪菲",
    notes: "豆子风味不错，有明显的花香和柑橘调"
  });

  const [expandedSection, setExpandedSection] = useState('coffee');
  const receiptRef = useRef(null);
  const t = TEXT[lang];
  const toggleLang = () => setLang(l => l === 'zh' ? 'en' : 'zh');
  const toggleSection = (s) => setExpandedSection(expandedSection === s ? null : s);

  // 使用自定义 Hook 处理下载
  const { isDownloading, handleDownload: download, error } = useDownloadReceipt('CAFFEINE_LOG');
  
  // 计算咖啡因状态（使用 useMemo 优化性能）
  const caffeineStatusInfo = useMemo(() => 
    getCaffeineStatus(data.todayTotal, t.caffeineStatus),
    [data.todayTotal, t.caffeineStatus]
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
            <Globe size={12} aria-hidden="true" /> {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </header>

        <div className="flex-1 p-4 pb-24 space-y-3 overflow-y-auto md:pb-10 no-scrollbar">
           <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
           <InputSection title={t.coffeeInfo} isOpen={expandedSection === 'coffee'} onToggle={() => toggleSection('coffee')}>
             <div className="grid grid-cols-2 gap-4">
               <InputGroup label={t.labelDate} value={data.date} onChange={v => setData({...data, date: v})} />
               <InputGroup label={t.labelTime} value={data.time} onChange={v => setData({...data, time: v})} />
             </div>
             <InputGroup label={t.labelShop} value={data.shop} onChange={v => setData({...data, shop: v})} />
             <InputGroup label={t.labelDrink} value={data.drink} onChange={v => setData({...data, drink: v})} />
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">{t.labelSize}</label>
                 <select value={data.size} onChange={e => setData({...data, size: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm">
                   {Object.entries(t.sizeOptions).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                 </select>
               </div>
               <InputGroup label={t.labelPrice} value={data.price} onChange={v => setData({...data, price: v})} placeholder="¥" />
             </div>
             <div>
               <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">{t.labelMethod}</label>
               <select value={data.method} onChange={e => setData({...data, method: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm">
                 {Object.entries(t.methodOptions).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
               </select>
             </div>
             <InputGroup label={t.labelBean} value={data.bean} onChange={v => setData({...data, bean: v})} />
             <div className="grid grid-cols-2 gap-4">
               <InputGroup label={t.labelCaffeine} value={data.caffeine} onChange={v => setData({...data, caffeine: parseInt(v) || 0})} type="number" />
               <InputGroup label={t.labelTodayTotal} value={data.todayTotal} onChange={v => setData({...data, todayTotal: parseInt(v) || 0})} type="number" />
             </div>
           </InputSection>

           <InputSection title={t.metrics} isOpen={expandedSection === 'metrics'} onToggle={() => toggleSection('metrics')}>
             <div className="p-4 space-y-4 border border-gray-100 rounded-sm bg-gray-50">
               <RatingSlider label={t.labelBitterness} value={data.metrics.bitterness} onChange={v => setData({...data, metrics: {...data.metrics, bitterness: v}})} />
               <RatingSlider label={t.labelAcidity} value={data.metrics.acidity} onChange={v => setData({...data, metrics: {...data.metrics, acidity: v}})} />
               <RatingSlider label={t.labelSweetness} value={data.metrics.sweetness} onChange={v => setData({...data, metrics: {...data.metrics, sweetness: v}})} />
               <RatingSlider label={t.labelSatisfaction} value={data.metrics.satisfaction} onChange={v => setData({...data, metrics: {...data.metrics, satisfaction: v}})} />
             </div>
           </InputSection>

           <InputSection title={t.notes} isOpen={expandedSection === 'notes'} onToggle={() => toggleSection('notes')}>
             <InputGroup label={t.labelNotesContent} value={data.notes} onChange={v => setData({...data, notes: v})} isTextArea />
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
              <CoffeePreview data={data} text={t} ref={receiptRef} />
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
 * 咖啡收据预览组件
 * 展示咖啡信息、口味评价和咖啡因追踪
 */
const CoffeePreview = React.forwardRef(({ data, text }, ref) => {
  const metricMap = {
    bitterness: text.labelBitterness,
    acidity: text.labelAcidity,
    sweetness: text.labelSweetness,
    satisfaction: text.labelSatisfaction
  };

  // 计算咖啡因状态（使用 useMemo 优化性能）
  const caffeineInfo = useMemo(() => 
    getCaffeineStatus(data.todayTotal, text.caffeineStatus),
    [data.todayTotal, text.caffeineStatus]
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

        {/* Coffee Info */}
        <div className="grid grid-cols-2 mb-4 text-xs font-bold leading-relaxed uppercase gap-y-1">
          {data.date && <><div className="text-gray-500">{text.labelDate}:</div><div className="text-right text-black">{data.date}</div></>}
          {data.time && <><div className="text-gray-500">{text.labelTime}:</div><div className="text-right text-black">{data.time}</div></>}
          {data.shop && data.shop.trim() && <><div className="text-gray-500">{text.labelShop}:</div><div className="text-right text-black truncate">{data.shop}</div></>}
          {data.drink && data.drink.trim() && <><div className="text-gray-500">{text.labelDrink}:</div><div className="text-right text-black">{data.drink}</div></>}
          {data.size && <><div className="text-gray-500">{text.labelSize}:</div><div className="text-right text-black">{text.sizeOptions[data.size]}</div></>}
          {data.method && <><div className="text-gray-500">{text.labelMethod}:</div><div className="text-right text-black">{text.methodOptions[data.method]}</div></>}
        </div>

        {/* Price & Caffeine */}
        {(data.price || data.caffeine > 0) && (
          <div className="py-4 mb-6 border-black border-dashed border-y-2">
            <div className="grid grid-cols-2 gap-4">
              {data.price && (
                <div className="text-center">
                  <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">{text.labelPrice}</div>
                  <div className="text-xl font-black">¥{data.price}</div>
                </div>
              )}
              {data.caffeine > 0 && (
                <div className="text-center">
                  <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">{text.labelCaffeine}</div>
                  <div className="text-xl font-black">{data.caffeine}mg</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bean Origin */}
        {data.bean && data.bean.trim() && (
          <div className="mb-4 text-center">
            <div className="text-[9px] font-bold text-gray-500 uppercase mb-1">{text.labelBean}</div>
            <div className="text-sm font-bold">{data.bean}</div>
          </div>
        )}

        {/* Metrics */}
        <div className="mb-6 space-y-2">
           <div className="text-[10px] font-bold uppercase border-b border-black pb-1 mb-2">-- {text.metrics} --</div>
           {Object.keys(data.metrics).map(key => (
              <MetricBar key={key} label={metricMap[key]} value={data.metrics[key]} />
           ))}
        </div>

        {/* Today's Total */}
        {data.todayTotal > 0 && (
          <div className="p-3 mb-4 border-2 border-black">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] font-bold text-gray-500 uppercase">{text.labelTodayTotal}</div>
                <div className="text-lg font-black">{data.todayTotal}mg</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-bold text-gray-500 uppercase">{text.labelStatus}</div>
                <div className="text-sm font-bold">[{caffeineInfo.icon}] {caffeineInfo.status}</div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {data.notes && data.notes.trim() && (
          <div className="flex-1 mb-6">
             <div className="text-[10px] font-bold uppercase border-b border-black pb-1 mb-2">{text.labelNotesContent}</div>
             <p className="text-xs leading-relaxed whitespace-pre-wrap">{data.notes}</p>
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
});

export { CoffeeReceiptPage };
