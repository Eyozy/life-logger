import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Download, Plus, Trash2, Loader2, Globe, ChevronDown, Star, Utensils, Eye } from 'lucide-react';

// --- Lang Config ---
const TEXT = {
  zh: {
    title: "THE_DINER",
    subtitle: "// 美食记录小票",
    context: "场景 (Context)",
    orders: "菜单 (Orders)",
    experience: "体验 (Experience)",
    notes: "备注 (Notes)",
    labelRes: "餐厅名称",
    labelComp: "共进餐者",
    labelItem: "菜品",
    labelPrice: "价格",
    labelSatiety: "饱腹感",
    labelRating: "评分",
    labelDate: "日期",
    labelLoc: "地点",
    labelGuest: "同伴",
    labelItemHeader: "品项",
    labelAmtHeader: "金额",
    labelTotal: "总计",
    labelFlavorProfile: "风味分析",
    endTransaction: "交易结束",
    download: "下载",
    downloading: "生成中...",
    flavors: {
      spicy: "辣度",
      sour: "酸度",
      sweet: "甜度",
      salty: "咸度",
      bitter: "苦度"
    }
  },
  en: {
    title: "THE_DINER",
    subtitle: "// FOOD LOG",
    context: "Context",
    orders: "Orders",
    experience: "Experience",
    notes: "Notes",
    labelRes: "Restaurant Name",
    labelComp: "Companion",
    labelItem: "Item",
    labelPrice: "Price",
    labelSatiety: "Satiety",
    labelRating: "Rating",
    labelDate: "Date",
    labelLoc: "Loc",
    labelGuest: "Guest",
    labelItemHeader: "ITEM",
    labelAmtHeader: "AMT",
    labelTotal: "TOTAL",
    labelFlavorProfile: "Flavor Profile",
    endTransaction: "*** END TRANSACTION ***",
    download: "PRINT RECEIPT",
    downloading: "PRINTING...",
    flavors: {
      spicy: "Spicy",
      sour: "Sour",
      sweet: "Sweet",
      salty: "Salty",
      bitter: "Bitter"
    }
  }
};

// --- UI Components ---
const InputSection = ({ title, children, isOpen, onToggle }) => (
  <div className={`border border-gray-200 rounded-lg bg-white overflow-hidden transition-all duration-300 mb-3 ${isOpen ? 'shadow-md ring-1 ring-black/5' : 'hover:border-gray-300'}`}>
    <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors">
      <h3 className={`text-sm font-bold uppercase tracking-wider ${isOpen ? 'text-black' : 'text-gray-600'}`}>{title}</h3>
      <div className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-black' : ''}`}><ChevronDown size={18} /></div>
    </button>
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="p-4 pt-0 border-t border-gray-50"><div className="pt-4 space-y-4">{children}</div></div>
    </div>
  </div>
);

const InputGroup = ({ label, value, onChange, placeholder, isTextArea = false }) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>
    {isTextArea ? (
      <textarea 
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm resize-none h-20 block transition-all"
      />
    ) : (
      <input 
        type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm block transition-all"
      />
    )}
  </div>
);

const SliderItem = ({ label, value, onChange }) => (
  <div className="flex items-center gap-3">
    <span className="w-24 text-[10px] font-bold uppercase text-gray-500 truncate">{label}</span>
    <input
      type="range" min="0" max="100" value={value} onChange={e => onChange(e.target.value)}
      style={{ background: `linear-gradient(to right, black ${value}%, #e5e7eb ${value}%)` }}
      className="flex-1 h-1 rounded-lg appearance-none cursor-pointer accent-black"
    />
    <span className="w-8 text-right text-xs font-mono font-bold text-gray-900">{value}</span>
  </div>
);

export default function FoodReceiptPage() {
  const [lang, setLang] = useState('zh');
  const [mobileTab, setMobileTab] = useState('edit');
  const [data, setData] = useState({
    restaurant: "楼下那家牛肉面",
    companion: "一人食",
    orders: [
      { name: "红烧牛肉面 加辣", price: "28.00" },
      { name: "凉拌黄瓜", price: "12.00" },
      { name: "冰可乐", price: "3.00" }
    ],
    flavors: { spicy: 80, sour: 20, sweet: 10, salty: 60, bitter: 0 },
    satiety: 90,
    rating: 4,
    notes: "牛肉很大块，但面有点硬。下次记得说要煮软一点。"
  });

  const [expandedSection, setExpandedSection] = useState('context');
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef(null);

  const t = TEXT[lang];
  const toggleSection = (section) => setExpandedSection(expandedSection === section ? null : section);
  const toggleLang = () => setLang(l => l === 'zh' ? 'en' : 'zh');

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
        quality: 1.0, pixelRatio: 3, backgroundColor: null, width: 380,
      });
      const link = document.createElement('a');
      link.download = `FOOD_LOG_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      alert("生成失败");
    } finally {
      setIsDownloading(false);
    }
  };

  const updateOrder = (i, f, v) => {
    const n = [...data.orders];
    n[i] = { ...n[i], [f]: v };
    setData({ ...data, orders: n });
  };
  const addOrder = () => setData({ ...data, orders: [...data.orders, { name: "", price: "" }] });
  const removeOrder = (i) => setData({ ...data, orders: data.orders.filter((_, idx) => idx !== i) });

  return (
    <div className="fixed inset-0 bg-gray-50 text-gray-900 font-mono flex flex-col md:flex-row overflow-hidden">
      
      {/* Left: Editor */}
      <div className={`w-full md:w-1/2 flex flex-col h-full bg-white md:border-r border-gray-200 z-10 transition-transform duration-300 ${mobileTab === 'edit' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} absolute md:relative`}>
        <header className="flex items-center justify-between p-4 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft size={18} /></Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-black text-gray-900 tracking-wider truncate">{t.title}</h1>
              <p className="text-xs text-gray-400 font-bold whitespace-nowrap overflow-hidden text-ellipsis">{t.subtitle}</p>
            </div>
          </div>
          <button onClick={toggleLang} className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded font-bold flex items-center gap-1 shrink-0">
              <Globe size={12} /> {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 md:pb-10 no-scrollbar">
           <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
          <InputSection title={t.context} isOpen={expandedSection === 'context'} onToggle={() => toggleSection('context')}>
            <InputGroup label={t.labelRes} value={data.restaurant} onChange={v => setData({...data, restaurant: v})} />
            <InputGroup label={t.labelComp} value={data.companion} onChange={v => setData({...data, companion: v})} />
          </InputSection>

          <InputSection title={t.orders} isOpen={expandedSection === 'orders'} onToggle={() => toggleSection('orders')}>
            {data.orders.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={item.name} onChange={e => updateOrder(i, 'name', e.target.value)} className="flex-1 bg-gray-50 border border-gray-200 p-2 text-sm rounded-sm focus:border-black outline-none" placeholder={t.labelItem} />
                <input value={item.price} onChange={e => updateOrder(i, 'price', e.target.value)} className="w-16 bg-gray-50 border border-gray-200 p-2 text-sm rounded-sm focus:border-black outline-none text-right" placeholder={t.labelPrice} />
                <button onClick={() => removeOrder(i)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            ))}
            <button onClick={addOrder} className="mt-2 text-xs font-bold flex items-center gap-1 text-emerald-600 hover:text-emerald-700"><Plus size={14} /> ADD ITEM</button>
          </InputSection>

          <InputSection title={t.experience} isOpen={expandedSection === 'stats'} onToggle={() => toggleSection('stats')}>
            <div className="space-y-4 bg-gray-50 p-4 rounded-sm border border-gray-100">
               {Object.keys(data.flavors).map(k => (
                 <SliderItem key={k} label={t.flavors[k]} value={data.flavors[k]} onChange={v => setData({...data, flavors: {...data.flavors, [k]: parseInt(v)}})} />
               ))}
               <div className="border-t border-gray-200 pt-4 mt-2">
                 <SliderItem label={t.labelSatiety} value={data.satiety} onChange={v => setData({...data, satiety: parseInt(v)})} />
               </div>
               <div className="flex items-center justify-between pt-2">
                 <span className="text-[10px] font-bold uppercase text-gray-500">{t.labelRating}</span>
                 <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setData({...data, rating: s})} className={s <= data.rating ? "text-black" : "text-gray-300"}><Star size={16} fill={s <= data.rating ? "currentColor" : "none"} /></button>
                    ))}
                 </div>
               </div>
            </div>
          </InputSection>

          <InputSection title={t.notes} isOpen={expandedSection === 'notes'} onToggle={() => toggleSection('notes')}>
             <InputGroup label="Comments" value={data.notes} onChange={v => setData({...data, notes: v})} isTextArea />
          </InputSection>
          
          <div className="h-10 md:hidden"></div>
        </div>
      </div>

      {/* Right: Preview */}
      <div className={`w-full md:w-1/2 bg-gray-200 relative z-0 transition-transform duration-300 ${mobileTab === 'preview' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} absolute md:relative h-full`}>
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="absolute top-4 right-4 z-20">
          <button onClick={handleDownload} disabled={isDownloading} className="bg-black text-white px-5 py-2.5 rounded-full shadow-xl hover:bg-gray-800 transition-all flex items-center gap-2 text-xs font-bold tracking-widest">
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {isDownloading ? t.downloading : t.download}
          </button>
        </div>

        <div className="w-full h-full overflow-y-auto no-scrollbar">
          <div className="min-h-full flex items-center justify-center py-20 md:py-10">
            <div className="receipt-wrapper origin-top scale-90 sm:scale-100 transition-transform duration-500">
              <FoodReceiptPreview data={data} text={t} ref={receiptRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white rounded-full px-1.5 py-1.5 shadow-2xl flex gap-1">
        <button onClick={() => setMobileTab('edit')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${mobileTab === 'edit' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
          <Utensils size={14} /> 编辑
        </button>
        <button onClick={() => setMobileTab('preview')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${mobileTab === 'preview' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
          <Eye size={14} /> 预览
        </button>
      </div>
    </div>
  );
}

const FoodReceiptPreview = React.forwardRef(({ data, text }, ref) => {
  // 价格是可选项，只要有名称就显示
  const validOrders = data.orders.filter(item => item.name && item.name.trim());
  // 计算总价时忽略空价格
  const total = validOrders.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0).toFixed(2);
  const date = new Date().toLocaleDateString('en-CA');

  return (
    <div ref={ref} className="w-[380px] relative">
      <div className="min-h-[600px] bg-white p-6 pb-8 font-mono flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold tracking-wider mb-1 text-black">{text.title}</h1>
        <div className="text-[10px] font-bold text-gray-500 tracking-widest">{text.subtitle}</div>
      </div>
      <div className="border-t-2 border-dashed border-black my-2"></div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-y-1 text-xs font-bold uppercase mb-4 leading-relaxed">
        <div className="text-gray-500">{text.labelDate}:</div><div className="text-right">{date}</div>
        <div className="text-gray-500">{text.labelLoc}:</div><div className="text-right truncate">{data.restaurant}</div>
        <div className="text-gray-500">{text.labelGuest}:</div><div className="text-right truncate">{data.companion}</div>
      </div>

      {/* Orders */}
      {validOrders.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold border-b border-black pb-1 mb-2">
            <span>{text.labelItemHeader}</span><span>{text.labelAmtHeader}</span>
          </div>
          <div className="space-y-1.5">
            {validOrders.map((item, i) => (
              <div key={i} className="flex justify-between text-sm items-start leading-tight">
                <span className="max-w-[240px]">{item.name}</span>
                <span className="font-bold">{item.price}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-black border-t-2 border-black pt-2 mt-4">
            <span>{text.labelTotal}</span><span>${total}</span>
          </div>
        </div>
      )}

      {/* Radar / Stats Visualization (Monochrome) */}
      <div className="border border-black p-3 mb-4">
         <div className="text-center text-[10px] font-bold mb-3 uppercase">-- {text.labelFlavorProfile} --</div>
         <div className="flex items-end justify-between h-16 gap-2 px-2">
            {Object.entries(data.flavors).map(([k, v]) => (
               <div key={k} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[8px] font-bold mb-1 text-gray-700">{v}</span>
                  <div className="w-full bg-gray-100 relative h-full rounded-sm overflow-hidden">
                     <div className="absolute bottom-0 left-0 w-full bg-black transition-all duration-300" style={{ height: `${v}%` }}>
                       {/* Texture pattern for bars */}
                       <div className="w-full h-full opacity-30" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '3px 3px'}}></div>
                     </div>
                  </div>
                  <span className="text-[8px] font-bold uppercase mt-1 whitespace-nowrap">{text.flavors[k].slice(0,3)}</span>
               </div>
            ))}
         </div>
      </div>

      {/* Satisfaction */}
      <div className="mb-4">
         <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase">
            <span className="w-16 truncate">{text.labelSatiety}</span>
            <div className="flex-1 h-3 border border-black p-0.5">
               <div className="h-full bg-black" style={{ width: `${data.satiety}%` }}></div>
            </div>
            <span className="w-8 text-right">{data.satiety}%</span>
         </div>
         <div className="flex items-center gap-2 text-xs font-bold uppercase">
            <span className="w-16 truncate">{text.labelRating}</span>
            <div className="flex gap-1">
               {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-sm">{i <= data.rating ? "★" : "☆"}</span>
               ))}
            </div>
         </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="mt-2">
          <div className="text-[10px] font-bold text-gray-500 mb-1 uppercase">{text.notes}</div>
          <div className="border-l-2 border-black pl-2 text-sm italic leading-relaxed text-gray-800 whitespace-pre-wrap">
            {data.notes}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-6 flex flex-col items-center">
         <div className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">
            {text.endTransaction}
         </div>
         {/* Barcode Strip */}
         <div className="flex h-8 w-full justify-center items-stretch gap-0.5 mt-2 overflow-hidden opacity-80">
            {[...Array(30)].map((_, i) => <div key={i} className="bg-black" style={{width: Math.random()*4+1+'px'}}></div>)}
         </div>
      </div>

      </div>

      {/* Zigzag */}
      <div className="w-full h-3 overflow-hidden">
        <svg width="100%" height="100%" preserveAspectRatio="none" className="block"><defs><pattern id="zag" x="0" y="0" width="20" height="100%" patternUnits="userSpaceOnUse"><path d="M0 0 L10 12 L20 0 Z" fill="white" /></pattern></defs><rect width="100%" height="100%" fill="url(#zag)" /></svg>
      </div>
    </div>
  );
});