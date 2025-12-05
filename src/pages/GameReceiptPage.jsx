import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Download, Loader2, ChevronDown, Globe, Gamepad2, Trophy, Timer, Zap, Eye } from 'lucide-react';

// --- Lang Config ---
const TEXT = {
  zh: {
    title: "游戏收据",
    subtitle: "// 游戏日志小票",
    gameInfo: "游戏信息",
    gameplay: "游戏体验",
    achievements: "成就记录",
    thoughts: "游戏感想",
    labelTitle: "游戏名称",
    labelDeveloper: "开发商",
    labelPlatform: "平台",
    labelGenre: "类型",
    labelPlaytime: "游戏时长",
    labelDate: "游戏日期",
    labelGraphics: "画面表现",
    labelGameplay: "玩法",
    labelStory: "剧情",
    labelDifficulty: "难度",
    labelChallenge: "挑战性",
    labelAddiction: "沉迷度",
    labelAchievement: "获得成就",
    labelCompletion: "完成度",
    labelMemorable: "难忘时刻",
    labelThoughts: "个人感想",
    download: "下载",
    downloading: "生成中...",

    platforms: {
      PC: "PC",
      PS5: "PS5",
      XBOX: "Xbox",
      SWITCH: "Switch",
      MOBILE: "手机"
    },
    genres: {
      RPG: "角色扮演",
      FPS: "第一人称射击",
      STRATEGY: "策略",
      PUZZLE: "益智",
      ADVENTURE: "冒险",
      SIMULATION: "模拟",
      HORROR: "恐怖",
      SPORTS: "体育"
    }
  },
  en: {
    title: "GAME RECEIPT",
    subtitle: "// GAMING LOG",
    gameInfo: "Game Information",
    gameplay: "Gameplay Experience",
    achievements: "Achievements",
    thoughts: "Personal Thoughts",
    labelTitle: "Game Title",
    labelDeveloper: "Developer",
    labelPlatform: "Platform",
    labelGenre: "Genre",
    labelPlaytime: "Play Time",
    labelDate: "Play Date",
    labelGraphics: "Graphics",
    labelGameplay: "Gameplay",
    labelStory: "Story",
    labelDifficulty: "Difficulty",
    labelChallenge: "Challenge",
    labelAddiction: "Addiction Level",
    labelAchievement: "New Achievement",
    labelCompletion: "Completion",
    labelMemorable: "Memorable Moment",
    labelThoughts: "Personal Thoughts",
    download: "SAVE RECEIPT",
    downloading: "GENERATING...",

    platforms: {
      PC: "PC",
      PS5: "PS5",
      XBOX: "Xbox",
      SWITCH: "Switch",
      MOBILE: "Mobile"
    },
    genres: {
      RPG: "RPG",
      FPS: "FPS",
      STRATEGY: "Strategy",
      PUZZLE: "Puzzle",
      ADVENTURE: "Adventure",
      SIMULATION: "Simulation",
      HORROR: "Horror",
      SPORTS: "Sports"
    }
  }
};

// --- Shared Components ---
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

const RatingSlider = ({ label, value, onChange, max = 100 }) => (
  <div className="flex items-center gap-3">
    <span className="w-20 text-[10px] font-bold uppercase text-gray-500 truncate">{label}</span>
    <input
      type="range" min="0" max={max} value={value} onChange={e => onChange(parseInt(e.target.value))}
      className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
    />
    <span className="w-8 text-right text-xs font-mono font-bold text-gray-900">{value}%</span>
  </div>
);

export default function GameReceiptPage() {
  const [lang, setLang] = useState('zh');
  const [mobileTab, setMobileTab] = useState('edit');
  const [data, setData] = useState({
    title: "艾尔登法环",
    developer: "FromSoftware",
    platform: "PC",
    genre: "RPG",
    playtime: "120h 35m",
    date: new Date().toLocaleDateString('zh-CN'),
    gameplay: {
      graphics: 95,
      gameplay: 98,
      story: 85,
      difficulty: 90
    },
    challenge: 92,
    addiction: 88,
    achievement: "击败「艾尔登之兽」",
    completion: 78,
    memorableMoment: "第一次骑着马在宁姆格福平原上奔跑，看到夕阳下的黄金树，那种震撼感难以忘怀。",
    thoughts: "开放世界的巅峰之作，战斗系统深度十足，但对于新手玩家门槛较高。收集要素丰富，但有时候会让人感到压力。"
  });

  const [expandedSection, setExpandedSection] = useState('game');
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
      link.download = `GAME_RECEIPT_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      alert("生成失败");
    } finally {
      setIsDownloading(false);
    }
  };

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
          <InputSection title={t.gameInfo} isOpen={expandedSection === 'game'} onToggle={() => toggleSection('game')}>
            <InputGroup label={t.labelTitle} value={data.title} onChange={v => setData({...data, title: v})} />
            <InputGroup label={t.labelDeveloper} value={data.developer} onChange={v => setData({...data, developer: v})} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">{t.labelPlatform}</label>
                <select value={data.platform} onChange={e => setData({...data, platform: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm">
                  {Object.entries(t.platforms).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase">{t.labelGenre}</label>
                <select value={data.genre} onChange={e => setData({...data, genre: e.target.value})} className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm">
                  {Object.entries(t.genres).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup label={t.labelPlaytime} value={data.playtime} onChange={v => setData({...data, playtime: v})} />
              <InputGroup label={t.labelDate} value={data.date} onChange={v => setData({...data, date: v})} />
            </div>
          </InputSection>

          <InputSection title={t.gameplay} isOpen={expandedSection === 'gameplay'} onToggle={() => toggleSection('gameplay')}>
            <div className="space-y-4 bg-gray-50 p-4 rounded-sm border border-gray-100">
              <RatingSlider label={t.labelGraphics} value={data.gameplay.graphics} onChange={v => setData({...data, gameplay: {...data.gameplay, graphics: v}})} />
              <RatingSlider label={t.labelGameplay} value={data.gameplay.gameplay} onChange={v => setData({...data, gameplay: {...data.gameplay, gameplay: v}})} />
              <RatingSlider label={t.labelStory} value={data.gameplay.story} onChange={v => setData({...data, gameplay: {...data.gameplay, story: v}})} />
              <RatingSlider label={t.labelDifficulty} value={data.gameplay.difficulty} onChange={v => setData({...data, gameplay: {...data.gameplay, difficulty: v}})} />

              <div className="border-t border-gray-200 pt-4 mt-2">
                <RatingSlider label={t.labelChallenge} value={data.challenge} onChange={v => setData({...data, challenge: v})} />
              </div>
              <RatingSlider label={t.labelAddiction} value={data.addiction} onChange={v => setData({...data, addiction: v})} />
            </div>
          </InputSection>

          <InputSection title={t.achievements} isOpen={expandedSection === 'achievements'} onToggle={() => toggleSection('achievements')}>
            <InputGroup label={t.labelAchievement} value={data.achievement} onChange={v => setData({...data, achievement: v})} />
            <RatingSlider label={t.labelCompletion} value={data.completion} onChange={v => setData({...data, completion: v})} />
          </InputSection>

          <InputSection title={t.thoughts} isOpen={expandedSection === 'thoughts'} onToggle={() => toggleSection('thoughts')}>
            <InputGroup label={t.labelMemorable} value={data.memorableMoment} onChange={v => setData({...data, memorableMoment: v})} isTextArea />
            <InputGroup label={t.labelThoughts} value={data.thoughts} onChange={v => setData({...data, thoughts: v})} isTextArea />
          </InputSection>

          <div className="h-10 md:hidden"></div>
        </div>
      </div>

      {/* Right: Preview */}
      <div className={`w-full md:w-1/2 bg-gray-200 relative z-0 transition-transform duration-300 ${mobileTab === 'preview' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} absolute md:relative h-full`}>
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute top-4 right-4 z-20">
          <button onClick={handleDownload} disabled={isDownloading} className="bg-black text-white px-5 py-2.5 rounded-full shadow-xl hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-xs font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed">
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {isDownloading ? t.downloading : t.download}
          </button>
        </div>

        <div className="w-full h-full overflow-y-auto no-scrollbar">
          <div className="min-h-full flex items-center justify-center py-20 md:py-10">
            <div className="receipt-wrapper origin-top scale-90 sm:scale-100 transition-transform duration-500">
              <GamePreview data={data} text={t} ref={receiptRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white rounded-full px-1.5 py-1.5 shadow-2xl flex gap-1">
        <button onClick={() => setMobileTab('edit')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${mobileTab === 'edit' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
          <Gamepad2 size={14} /> 编辑
        </button>
        <button onClick={() => setMobileTab('preview')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${mobileTab === 'preview' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
          <Eye size={14} /> 预览
        </button>
      </div>
    </div>
  );
}

const GamePreview = React.forwardRef(({ data, text }, ref) => {
  const avgRating = Math.round((data.gameplay.graphics + data.gameplay.gameplay + data.gameplay.story + data.gameplay.difficulty) / 4);

  return (
    <div ref={ref} className="w-[380px] relative">
      <div className="min-h-[600px] bg-white p-6 pb-8 font-mono flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold tracking-wider mb-1 text-black">GAME_LOG</h1>
        <div className="text-[10px] font-bold text-gray-500 tracking-widest">GAMING EXPERIENCE</div>
      </div>
      <div className="border-t-2 border-dashed border-black my-2"></div>

      {/* Game Info */}
      {data.title && data.title.trim() && (
        <div className="mb-6">
          <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">{text.labelTitle}</div>
          <h2 className="text-xl font-bold leading-snug mb-2">{data.title}</h2>
          <div className="flex gap-2 text-[10px] font-bold uppercase mb-2">
            <span className="border border-black px-2">{text.genres[data.genre]}</span>
            <span className="bg-black text-white px-2">{text.platforms[data.platform]}</span>
          </div>
          <p className="text-xs font-bold text-gray-600">{text.labelDeveloper}: {data.developer}</p>
        </div>
      )}

      {/* Gameplay Ratings */}
      <div className="mb-6">
        <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">Gameplay Ratings</div>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{avgRating}%</div>
            <div className="text-[8px] text-gray-500">AVERAGE</div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span>{text.labelGraphics}</span>
              <span>{data.gameplay.graphics}%</span>
            </div>
            <div className="h-2 bg-gray-200 border border-black relative">
              <div className="h-full bg-black" style={{ width: `${data.gameplay.graphics}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span>{text.labelGameplay}</span>
              <span>{data.gameplay.gameplay}%</span>
            </div>
            <div className="h-2 bg-gray-200 border border-black relative">
              <div className="h-full bg-black" style={{ width: `${data.gameplay.gameplay}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span>{text.labelStory}</span>
              <span>{data.gameplay.story}%</span>
            </div>
            <div className="h-2 bg-gray-200 border border-black relative">
              <div className="h-full bg-black" style={{ width: `${data.gameplay.story}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase">
              <span>{text.labelDifficulty}</span>
              <span>{data.gameplay.difficulty}%</span>
            </div>
            <div className="h-2 bg-gray-200 border border-black relative">
              <div className="h-full bg-black" style={{ width: `${data.gameplay.difficulty}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
          <span>{text.labelAddiction}</span>
          <span>{data.addiction}%</span>
        </div>
        <div className="h-3 bg-gray-200 border border-black relative">
          <div className="h-full bg-gradient-to-r from-yellow-400 to-red-500" style={{ width: `${data.addiction}%` }}></div>
        </div>
      </div>

      {/* Achievement */}
      {data.achievement && data.achievement.trim() && (
        <div className="mb-6">
          <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">Latest Achievement</div>
          <div className="relative p-4 bg-gray-50 border-l-4 border-black">
            <Trophy className="absolute top-2 right-2 w-8 h-8 text-yellow-500" />
            <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">"{data.achievement}"</p>
          </div>
        </div>
      )}

      {/* Memorable Moment */}
      {data.memorableMoment && data.memorableMoment.trim() && (
        <div className="mb-6">
          <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">Memorable Moment</div>
          <div className="relative p-4 bg-gray-50 border-l-4 border-black">
            <p className="text-sm italic leading-relaxed text-gray-800 text-justify whitespace-pre-wrap">"{data.memorableMoment}"</p>
          </div>
        </div>
      )}

      {/* Personal Thoughts */}
      {data.thoughts && data.thoughts.trim() && (
        <div className="mb-6 flex-1">
          <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">Personal Thoughts</div>
          <p className="text-sm leading-relaxed border-b border-gray-300 pb-2 whitespace-pre-wrap">{data.thoughts}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto pt-6 flex flex-col items-center">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-center">Press Any Key to Continue</div>
        <div className="w-full h-12 overflow-hidden flex items-center justify-between">
          {/* Pixel pattern */}
          {[...Array(45)].map((_, i) => (
            <div key={i} className="bg-black h-full" style={{
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