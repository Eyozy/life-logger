import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Download, Loader2, ChevronDown, Globe, Film, Clock, Star, Heart } from 'lucide-react';

// --- Lang Config ---
const TEXT = {
  zh: {
    title: "电影院票",
    subtitle: "// 电影日志小票",
    movieInfo: "电影信息",
    experience: "观影体验",
    thoughts: "观影感受",
    labelTitle: "电影名称",
    labelDirector: "导演",
    labelGenre: "类型",
    labelYear: "年份",
    labelDuration: "片长",
    labelCinema: "影院",
    labelSeat: "座位",
    labelDate: "观影日期",
    labelVisual: "视觉效果",
    labelStory: "剧情",
    labelActing: "演技",
    labelMusic: "配乐",
    labelEmotion: "情感冲击",
    labelImmersion: "沉浸感",
    labelFavorite: "最喜欢的场景",
    labelThoughts: "个人思考",
    download: "下载",
    downloading: "生成中...",

    genres: {
      ACTION: "动作",
      COMEDY: "喜剧",
      DRAMA: "剧情",
      SCI_FI: "科幻",
      HORROR: "恐怖",
      ROMANCE: "爱情",
      THRILLER: "惊悚",
      ANIMATION: "动画"
    }
  },
  en: {
    title: "CINEMA_TICKET",
    subtitle: "// MOVIE LOG",
    movieInfo: "Movie Information",
    experience: "Viewing Experience",
    thoughts: "Personal Thoughts",
    labelTitle: "Movie Title",
    labelDirector: "Director",
    labelGenre: "Genre",
    labelYear: "Year",
    labelDuration: "Duration",
    labelCinema: "Cinema",
    labelSeat: "Seat",
    labelDate: "Viewing Date",
    labelVisual: "Visual Effects",
    labelStory: "Story",
    labelActing: "Acting",
    labelMusic: "Music",
    labelEmotion: "Emotional Impact",
    labelImmersion: "Immersion",
    labelFavorite: "Favorite Scene",
    labelThoughts: "Personal Thoughts",
    download: "SAVE TICKET",
    downloading: "GENERATING...",

    genres: {
      ACTION: "ACTION",
      COMEDY: "COMEDY",
      DRAMA: "DRAMA",
      SCI_FI: "SCI-FI",
      HORROR: "HORROR",
      ROMANCE: "ROMANCE",
      THRILLER: "THRILLER",
      ANIMATION: "ANIMATION"
    }
  }
};

// --- Shared Components ---
const InputSection = ({ title, children, isOpen, onToggle }) => (
  <div className={`border border-gray-200 rounded-lg bg-white overflow-hidden transition-all duration-300 mb-3 ${isOpen ? 'shadow-md ring-1 ring-black/5' : 'hover:border-gray-300'}`}>
    <button onClick={onToggle} className="flex items-center justify-between w-full p-4 text-left transition-colors bg-white hover:bg-gray-50">
      <h3 className={`text-sm font-bold uppercase tracking-wider ${isOpen ? 'text-black' : 'text-gray-600'}`}>{title}</h3>
      <div className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-black' : ''}`}><ChevronDown size={18} /></div>
    </button>
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="p-4 pt-0 border-t border-gray-50"><div className="pt-4 space-y-4">{children}</div></div>
    </div>
  </div>
);

const InputGroup = ({ label, value, onChange, isTextArea = false }) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>
    {isTextArea ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm resize-none h-20 block transition-all" />
    ) : (
      <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm block transition-all" />
    )}
  </div>
);

const RatingSlider = ({ label, value, onChange }) => (
  <div className="flex items-center gap-3">
    <span className="w-20 text-[10px] font-bold uppercase text-gray-500 truncate">{label}</span>
    <div className="flex items-center flex-1 gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={16}
          className={`cursor-pointer transition-colors ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
    <span className="w-8 font-mono text-xs font-bold text-right text-gray-900">{value}/5</span>
  </div>
);

export default function MovieReceiptPage() {
  const [lang, setLang] = useState('zh');
  const [mobileTab, setMobileTab] = useState('edit');
  const [data, setData] = useState({
    title: "沙丘 2",
    director: "丹尼斯·维伦纽瓦",
    genre: "SCI_FI",
    year: "2024",
    duration: "2h 46m",
    cinema: "万达影城 IMAX 厅",
    seat: "H 排 12 座",
    date: new Date().toLocaleDateString('zh-CN'),
    experience: {
      visual: 5,
      story: 4,
      acting: 4,
      music: 5
    },
    emotion: 5,
    immersion: 4,
    favoriteScene: "弗雷曼人骑着沙虫冲锋的场景，视觉效果震撼，配乐完美配合。",
    personalThoughts: "相比第一部，这一部更深入地探讨了政治和宗教主题，但也失去了一些角色发展的细腻度。整体依然是一部史诗级的科幻巨作。"
  });

  const [expandedSection, setExpandedSection] = useState('movie');
  const [isDownloading, setIsDownloading] = useState(false);
  const receiptRef = useRef(null);

  const t = TEXT[lang];

  const toggleSection = (s) => setExpandedSection(expandedSection === s ? null : s);
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
      link.download = `MOVIE_RECEIPT_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      alert("生成失败");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden font-mono text-gray-900 bg-gray-50 md:flex-row">
      {/* Left: Editor */}
      <div className={`w-full md:w-1/2 flex flex-col h-full bg-white md:border-r border-gray-200 z-10 transition-transform duration-300 ${mobileTab === 'edit' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} absolute md:relative`}>
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 transition-colors rounded-full hover:bg-gray-100"><ChevronLeft size={18} /></Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black tracking-wider text-gray-900 truncate">{t.title}</h1>
              <p className="overflow-hidden text-xs font-bold text-gray-400 whitespace-nowrap text-ellipsis">{t.subtitle}</p>
            </div>
          </div>
          <button onClick={toggleLang} className="flex items-center gap-1 px-2 py-1 text-xs font-bold bg-gray-100 rounded hover:bg-gray-200 shrink-0">
              <Globe size={12} /> {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </header>

        <div className="flex-1 p-4 pb-24 space-y-3 overflow-y-auto md:pb-10">
          <InputSection title={t.movieInfo} isOpen={expandedSection === 'movie'} onToggle={() => toggleSection('movie')}>
            <InputGroup label={t.labelTitle} value={data.title} onChange={v => setData({...data, title: v})} />
            <InputGroup label={t.labelDirector} value={data.director} onChange={v => setData({...data, director: v})} />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">{t.labelGenre}</label>
                <select value={data.genre} onChange={e => setData({...data, genre: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm">
                  {Object.entries(t.genres).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <InputGroup label={t.labelYear} value={data.year} onChange={v => setData({...data, year: v})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label={t.labelDuration} value={data.duration} onChange={v => setData({...data, duration: v})} />
              <InputGroup label={t.labelDate} value={data.date} onChange={v => setData({...data, date: v})} />
            </div>
            <InputGroup label={t.labelCinema} value={data.cinema} onChange={v => setData({...data, cinema: v})} />
            <InputGroup label={t.labelSeat} value={data.seat} onChange={v => setData({...data, seat: v})} />
          </InputSection>

          <InputSection title={t.experience} isOpen={expandedSection === 'experience'} onToggle={() => toggleSection('experience')}>
            <div className="p-4 space-y-4 border border-gray-100 rounded-sm bg-gray-50">
              <RatingSlider label={t.labelVisual} value={data.experience.visual} onChange={v => setData({...data, experience: {...data.experience, visual: v}})} />
              <RatingSlider label={t.labelStory} value={data.experience.story} onChange={v => setData({...data, experience: {...data.experience, story: v}})} />
              <RatingSlider label={t.labelActing} value={data.experience.acting} onChange={v => setData({...data, experience: {...data.experience, acting: v}})} />
              <RatingSlider label={t.labelMusic} value={data.experience.music} onChange={v => setData({...data, experience: {...data.experience, music: v}})} />

              <div className="pt-4 mt-2 border-t border-gray-200">
                <RatingSlider label={t.labelEmotion} value={data.emotion} onChange={v => setData({...data, emotion: v})} />
              </div>
              <RatingSlider label={t.labelImmersion} value={data.immersion} onChange={v => setData({...data, immersion: v})} />
            </div>
          </InputSection>

          <InputSection title={t.thoughts} isOpen={expandedSection === 'thoughts'} onToggle={() => toggleSection('thoughts')}>
            <InputGroup label={t.labelFavorite} value={data.favoriteScene} onChange={v => setData({...data, favoriteScene: v})} isTextArea />
            <InputGroup label={t.labelThoughts} value={data.personalThoughts} onChange={v => setData({...data, personalThoughts: v})} isTextArea />
          </InputSection>
        </div>
      </div>

      {/* Right: Preview */}
      <div className={`w-full md:w-1/2 bg-gray-200 relative z-0 transition-transform duration-300 ${mobileTab === 'preview' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} absolute md:relative h-full`}>
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute z-20 top-4 right-4">
          <button onClick={handleDownload} disabled={isDownloading} className="bg-black text-white px-5 py-2.5 rounded-full shadow-xl hover:bg-gray-800 transition-all flex items-center gap-2 text-xs font-bold tracking-widest">
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {isDownloading ? t.downloading : t.download}
          </button>
        </div>

        <div className="w-full h-full overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-center min-h-full py-20 md:py-10">
            <div className="transition-transform scale-90 md:scale-100">
              <MoviePreview data={data} text={t} ref={receiptRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white rounded-full px-1.5 py-1.5 shadow-2xl flex gap-1">
        <button onClick={() => setMobileTab('edit')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${mobileTab === 'edit' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
          <Film size={14} /> 编辑
        </button>
        <button onClick={() => setMobileTab('preview')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${mobileTab === 'preview' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
          <Download size={14} /> 预览
        </button>
      </div>
    </div>
  );
}

const MoviePreview = React.forwardRef(({ data, text }, ref) => {
  const avgRating = Math.round((data.experience.visual + data.experience.story + data.experience.acting + data.experience.music) / 4);

  return (
    <div ref={ref} className="w-[380px] relative">
      <div className="min-h-[600px] bg-white p-6 pb-8 font-mono flex flex-col">
      {/* Header */}
      <div className="mb-4 text-center">
        <h1 className="mb-1 text-3xl font-bold tracking-wider text-black">CINEMA</h1>
        <div className="text-[10px] font-bold text-gray-500 tracking-widest">MOVIE TICKET</div>
      </div>
      <div className="my-2 border-t-2 border-black border-dashed"></div>

      {/* Movie Info */}
      {data.title && data.title.trim() && (
        <div className="mb-6">
          <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">{text.labelTitle}</div>
          <h2 className="mb-2 text-xl font-bold leading-snug">{data.title}</h2>
          <div className="flex gap-2 text-[10px] font-bold uppercase mb-2">
            <span className="px-2 border border-black">{text.genres[data.genre]}</span>
            <span>{data.year}</span>
            <span>{data.duration}</span>
          </div>
          <p className="text-xs font-bold text-gray-600">{text.labelDirector}: {data.director}</p>
        </div>
      )}

      {/* Screening Info */}
      <div className="p-4 mb-6 border border-black">
        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase mb-2">
          <div><span className="text-gray-500">{text.labelCinema}:</span> {data.cinema}</div>
          <div><span className="text-gray-500">{text.labelSeat}:</span> {data.seat}</div>
          <div className="col-span-2"><span className="text-gray-500">{text.labelDate}:</span> {data.date}</div>
        </div>
      </div>

      {/* Ratings */}
      <div className="mb-6">
        <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">Ratings</div>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{avgRating}</div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={12}
                  className={`star ${star <= avgRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span>{text.labelVisual}</span>
              <span>{data.experience.visual}/5</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span>{text.labelStory}</span>
              <span>{data.experience.story}/5</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span>{text.labelActing}</span>
              <span>{data.experience.acting}/5</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span>{text.labelMusic}</span>
              <span>{data.experience.music}/5</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
              <span>{text.labelEmotion}</span>
              <span>{data.emotion}/5</span>
            </div>
            <div className="relative h-2 bg-gray-200 border border-black">
              <div className="h-full bg-black" style={{ width: `${(data.emotion / 5) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
              <span>{text.labelImmersion}</span>
              <span>{data.immersion}/5</span>
            </div>
            <div className="relative h-2 bg-gray-200 border border-black">
              <div className="h-full bg-black" style={{ width: `${(data.immersion / 5) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Scene */}
      {data.favoriteScene && data.favoriteScene.trim() && (
        <div className="mb-6">
          <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">Favorite Scene</div>
          <div className="relative p-4 border-l-4 border-black bg-gray-50">
            <p className="font-serif text-sm italic leading-loose text-justify text-gray-800 whitespace-pre-wrap">"{data.favoriteScene}"</p>
          </div>
        </div>
      )}

      {/* Personal Thoughts */}
      {data.personalThoughts && data.personalThoughts.trim() && (
        <div className="flex-1 mb-6">
          <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">Personal Thoughts</div>
          <p className="pb-2 text-sm leading-relaxed whitespace-pre-wrap border-b border-gray-300">{data.personalThoughts}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col items-center pt-6 mt-auto">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-center">Thank You For Watching</div>
        <div className="flex items-center justify-between w-full h-12 overflow-hidden">
          {/* Barcode pattern */}
          {[...Array(32)].map((_, i) => (
            <div key={i} className="h-full bg-black" style={{
              width: Math.random() > 0.5 ? '2px' : '4px',
              marginLeft: '1px'
            }}></div>
          ))}
        </div>
        <div className="text-[10px] mt-1 font-mono">{Date.now().toString().slice(-8)}</div>
      </div>

      </div>

      {/* Zigzag */}
      <div className="w-full h-3 overflow-hidden">
        <svg width="100%" height="100%" preserveAspectRatio="none" className="block">
          <defs>
            <pattern id="zag" x="0" y="0" width="20" height="100%" patternUnits="userSpaceOnUse">
              <path d="M0 0 L10 12 L20 0 Z" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#zag)" />
        </svg>
      </div>
    </div>
  );
});