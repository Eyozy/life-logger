import React, { useContext, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Ticket, BookOpen, User, ArrowRight, Sparkles, Globe, Heart, Headphones, Plane, Dumbbell, Users, Moon, ShoppingBag } from 'lucide-react';
import { LanguageContext } from '../AppRouter'; // Import LanguageContext

const TEXT = {
  zh: {
    title: "LIFE_LOGGER",
    subtitle: "// 生活小票生成器 v2.0",
    selectTerminal: ">> 选择记录类型",
    lifeTitle: "日常数据",
    lifeSubtitle: "生活日志",
    lifeDesc: "量化心情、精力、专注和压力 | 记录穿搭、天气、待办",
    foodTitle: "美食追踪",
    foodSubtitle: "饮食日志",
    foodDesc: "追踪餐点、口味、环境 | 量化美味度与饱腹感",
    entTitle: "娱乐票务",
    entSubtitle: "沉浸式日志",
    entDesc: "游戏、电影和节目。追踪沉浸感和情绪。",
    knowTitle: "知识库",
    knowSubtitle: "输入日志",
    knowDesc: "量化所学。追踪脑负荷和吸收率。",
    readTitle: "阅读存档",
    readSubtitle: "阅读日志",
    readDesc: "追踪进度、保存金句 | 量化阅读体验与思考深度",
    launchApp: "开始记录",
    footer: "将转瞬即逝的体验转化为可保存的数据",
    idolTitle: "饭圈观测",
    idolSubtitle: "追星日志",
    idolDesc: "记录本命活动、氪金清单 | 量化理智值与发疯指数",
    travelTitle: "旅行档案",
    travelSubtitle: "旅行日志",
    travelDesc: "记录行程、交通、见闻 | 量化疲劳度与满足感",
    fitnessTitle: "健身追踪",
    fitnessSubtitle: "运动日志",
    fitnessDesc: "记录训练内容、组数重量 | 量化泵感、酸痛与进步",
    socialTitle: "社交诊断",
    socialSubtitle: "社交日志",
    socialDesc: "记录社交活动、人际互动 | 量化社交电量与尴尬度",
    movieTitle: "观影存档",
    movieSubtitle: "电影日志",
    movieDesc: "记录剧情、视效、情绪 | 量化沉浸感与推荐指数",
    gameTitle: "游戏记录",
    gameSubtitle: "游戏日志",
    gameDesc: "记录成就、难度、时长 | 量化爽感、挫败感与评分",
    musicTitle: "现场存档",
    musicSubtitle: "演出日志",
    musicDesc: "记录现场氛围、曲目、互动 | 量化感动值与氛围感",
    sleepTitle: "睡眠监测",
    sleepSubtitle: "睡眠日志",
    sleepDesc: "记录睡眠时长、梦境 | 量化睡眠质量与起床状态",
    coffeeTitle: "咖啡因追踪",
    coffeeSubtitle: "咖啡日志",
    coffeeDesc: "记录饮品类型、口味 | 量化咖啡因摄入与满足度",
    shoppingTitle: "消费观测",
    shoppingSubtitle: "购物日志",
    shoppingDesc: "记录购物清单、消费金额 | 量化必要性与后悔指数"
  },
  en: {
    title: "LIFE_LOGGER",
    subtitle: "// LIFE RECEIPT GENERATOR v2.0",
    selectTerminal: ">> SELECT LOG TYPE",
    lifeTitle: "Daily Stats",
    lifeSubtitle: "Life Log",
    lifeDesc: "Quantify mood, energy, focus, stress | Track OOTD, weather, tasks",
    foodTitle: "Food Tracker",
    foodSubtitle: "Food Log",
    foodDesc: "Track meals, flavors, ambience | Quantify taste & satiety",
    idolTitle: "Fandom Observer",
    idolSubtitle: "Fandom Log",
    idolDesc: "Record idol activities, spending | Quantify sanity & obsession",
    travelTitle: "Travel Archive",
    travelSubtitle: "Travel Log",
    travelDesc: "Record itinerary, transport, sights | Quantify fatigue & satisfaction",
    fitnessTitle: "Fitness Tracker",
    fitnessSubtitle: "Fitness Log",
    fitnessDesc: "Record workouts, sets, weights | Quantify pump, soreness, progress",
    socialTitle: "Social Diagnostics",
    socialSubtitle: "Social Log",
    socialDesc: "Record social events, interactions | Quantify battery & awkwardness",
    movieTitle: "Cinema Archive",
    movieSubtitle: "Movie Log",
    movieDesc: "Record plot, visuals, emotions | Quantify immersion & rating",
    gameTitle: "Gaming Log",
    gameSubtitle: "Game Log",
    gameDesc: "Record achievements, difficulty, time | Quantify enjoyment & rating",
    musicTitle: "Live Archive",
    musicSubtitle: "Concert Log",
    musicDesc: "Record atmosphere, setlist, moments | Quantify emotion & vibe",
    sleepTitle: "Sleep Monitor",
    sleepSubtitle: "Sleep Log",
    sleepDesc: "Record sleep duration, dreams | Quantify quality & wake state",
    coffeeTitle: "Caffeine Tracker",
    coffeeSubtitle: "Coffee Log",
    coffeeDesc: "Record drink type, taste | Quantify caffeine & satisfaction",
    shoppingTitle: "Spending Observer",
    shoppingSubtitle: "Shopping Log",
    shoppingDesc: "Record purchases, spending | Quantify necessity & regret",
    knowTitle: "Knowledge Store",
    knowSubtitle: "Input Log",
    knowDesc: "Quantify what you learn. Track brain load and absorption.",
    readTitle: "Reading Archive",
    readSubtitle: "Reading Log",
    readDesc: "Track progress, save quotes | Quantify experience & depth",
    launchApp: "START LOGGING",
    footer: "Transform fleeting experiences into permanent data"
  }
};

const Homepage = () => {
  const { lang, toggleLang } = useContext(LanguageContext); // Use global lang state
  const t = TEXT[lang];

  // Memoize the apps array to avoid recreating it on every render
  const apps = useMemo(() => [
    {
      id: 'life',
      path: '/receipt/life',
      icon: <User size={32} />,
      title: t.lifeTitle,
      subtitle: t.lifeSubtitle,
      desc: t.lifeDesc,
      color: 'hover:border-gray-800'
    },
    {
      id: 'food',
      path: '/receipt/food',
      icon: <Coffee size={32} />,
      title: t.foodTitle,
      subtitle: t.foodSubtitle,
      desc: t.foodDesc,
      color: 'hover:border-yellow-600'
    },
    {
      id: 'idol',
      path: '/receipt/idol',
      icon: <Heart size={32} />,
      title: t.idolTitle,
      subtitle: t.idolSubtitle,
      desc: t.idolDesc,
      color: 'hover:border-pink-500'
    },
    {
      id: 'travel',
      path: '/receipt/travel',
      icon: <Plane size={32} />,
      title: t.travelTitle,
      subtitle: t.travelSubtitle,
      desc: t.travelDesc,
      color: 'hover:border-cyan-600'
    },
    {
      id: 'fitness',
      path: '/receipt/fitness',
      icon: <Dumbbell size={32} />,
      title: t.fitnessTitle,
      subtitle: t.fitnessSubtitle,
      desc: t.fitnessDesc,
      color: 'hover:border-red-600'
    },
    {
      id: 'social',
      path: '/receipt/social',
      icon: <Users size={32} />,
      title: t.socialTitle,
      subtitle: t.socialSubtitle,
      desc: t.socialDesc,
      color: 'hover:border-indigo-600'
    },
    {
      id: 'movie',
      path: '/receipt/movie',
      icon: <Ticket size={32} />,
      title: t.movieTitle,
      subtitle: t.movieSubtitle,
      desc: t.movieDesc,
      color: 'hover:border-purple-600'
    },
    {
      id: 'game',
      path: '/receipt/game',
      icon: <Ticket size={32} />,
      title: t.gameTitle,
      subtitle: t.gameSubtitle,
      desc: t.gameDesc,
      color: 'hover:border-blue-600'
    },
    {
      id: 'music',
      path: '/receipt/music',
      icon: <Headphones size={32} />,
      title: t.musicTitle,
      subtitle: t.musicSubtitle,
      desc: t.musicDesc,
      color: 'hover:border-pink-600'
    },
    {
      id: 'read',
      path: '/receipt/reading',
      icon: <BookOpen size={32} />,
      title: t.readTitle,
      subtitle: t.readSubtitle,
      desc: t.readDesc,
      color: 'hover:border-emerald-600'
    },
    {
      id: 'sleep',
      path: '/receipt/sleep',
      icon: <Moon size={32} />,
      title: t.sleepTitle,
      subtitle: t.sleepSubtitle,
      desc: t.sleepDesc,
      color: 'hover:border-indigo-800'
    },
    {
      id: 'coffee',
      path: '/receipt/coffee',
      icon: <Coffee size={32} />,
      title: t.coffeeTitle,
      subtitle: t.coffeeSubtitle,
      desc: t.coffeeDesc,
      color: 'hover:border-amber-700'
    },
    {
      id: 'shopping',
      path: '/receipt/shopping',
      icon: <ShoppingBag size={32} />,
      title: t.shoppingTitle,
      subtitle: t.shoppingSubtitle,
      desc: t.shoppingDesc,
      color: 'hover:border-rose-600'
    }
  ], [t]); // Recompute when language changes

  // Memoize event handlers to keep referential stability
  const handleLanguageToggle = useCallback(() => {
    toggleLang();
  }, [toggleLang]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white p-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-widest flex items-center gap-2">
              <Sparkles size={20} /> {t.title}
            </h1>
            <p className="text-xs text-gray-600 font-bold mt-1">{t.subtitle}</p>
          </div>
          {/* Language Toggle for Homepage */}
          <button
            onClick={handleLanguageToggle}
            className="text-xs px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded font-bold flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            <Globe size={12} aria-hidden="true" /> {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto p-6 pb-20">
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase text-gray-600 tracking-wider mb-4">{t.selectTerminal}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {apps.map((app) => (
              <Link
                key={app.id}
                to={app.path}
                className={`group block bg-white border-2 border-transparent rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden ${app.color} focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2`}
              >
                <div className="relative z-10">
                  <div className="mb-4 text-gray-800 group-hover:scale-110 transition-transform duration-300 origin-left">
                    {app.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-black transition-colors">{app.title}</h3>
                  <div className="text-xs font-bold uppercase text-gray-600 mb-3 tracking-wide group-hover:text-gray-700">{app.subtitle}</div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 min-h-[40px]">
                    {app.desc}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span>{t.launchApp}</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Footer Info */}
        <footer className="text-center border-t border-gray-200 pt-8 mt-12 pb-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} LIFE_LOGGER. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

// Use React.memo to avoid unnecessary re-renders
export default React.memo(Homepage);
