import React, { useState, useRef, useId } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Download,
  Loader2,
  ChevronDown,
  Globe,
  Music,
  MapPin,
  Calendar,
  Headphones,
  Eye,
} from "lucide-react";
import { useDownloadReceipt } from "../hooks/useDownloadReceipt";

// --- Lang Config ---
const TEXT = {
  zh: {
    title: "演出日志",
    subtitle: "// 演出日志小票",
    concertInfo: "演出信息",
    experience: "现场体验",
    setlist: "曲目列表",
    thoughts: "观后感想",
    labelArtist: "演出者",
    labelTour: "巡演名称",
    labelVenue: "演出场地",
    labelDate: "演出日期",
    labelDuration: "演出时长",
    labelSeat: "座位位置",
    labelAcoustic: "音质",
    labelVisual: "视觉效果",
    labelAtmosphere: "氛围",
    labelEnergy: "能量",
    labelVocals: "演唱",
    labelFavorite: "最喜欢曲目",
    labelSurprise: "惊喜时刻",
    labelThoughts: "个人感想",
    download: "下载",
    downloading: "生成中...",

    venues: {
      STADIUM: "体育场",
      ARENA: "体育馆",
      THEATER: "剧院",
      LIVEHOUSE: "Live House",
      CLUB: "夜店",
      OUTDOOR: "户外",
    },
    genres: {
      ROCK: "摇滚",
      POP: "流行",
      CLASSICAL: "古典",
      JAZZ: "爵士",
      ELECTRONIC: "电子",
      HIP_HOP: "嘻哈",
      FOLK: "民谣",
    },
  },
  en: {
    title: "CONCERT_LOG",
    subtitle: "// CONCERT LOG",
    concertInfo: "Concert Information",
    experience: "Live Experience",
    setlist: "Setlist",
    thoughts: "Personal Thoughts",
    labelArtist: "Artist",
    labelTour: "Tour Name",
    labelVenue: "Venue",
    labelDate: "Concert Date",
    labelDuration: "Duration",
    labelSeat: "Seat",
    labelAcoustic: "Acoustic Quality",
    labelVisual: "Visual Effects",
    labelAtmosphere: "Atmosphere",
    labelEnergy: "Energy Level",
    labelVocals: "Vocal Performance",
    labelFavorite: "Favorite Song",
    labelSurprise: "Surprise Moment",
    labelThoughts: "Personal Thoughts",
    download: "SAVE RECEIPT",
    downloading: "GENERATING...",

    venues: {
      STADIUM: "Stadium",
      ARENA: "Arena",
      THEATER: "Theater",
      LIVEHOUSE: "Live House",
      CLUB: "Club",
      OUTDOOR: "Outdoor",
    },
    genres: {
      ROCK: "Rock",
      POP: "Pop",
      CLASSICAL: "Classical",
      JAZZ: "Jazz",
      ELECTRONIC: "Electronic",
      HIP_HOP: "Hip-Hop",
      FOLK: "Folk",
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
      className="flex items-center justify-between w-full p-4 text-left transition-colors bg-white hover:bg-gray-50"
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

const InputGroup = ({ label, value, onChange, isTextArea = false }) => {
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
        className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm resize-none h-20 block transition-all"
      />
    ) : (
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm block transition-all"
      />
    )}
  </div>
  );
};

const RatingSlider = ({ label, value, onChange }) => (
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
    <span className="w-8 font-mono text-xs font-bold text-right text-gray-900">
      {value}%
    </span>
  </div>
);

export default function MusicConcertReceiptPage() {
  const [lang, setLang] = useState("zh");
  const [mobileTab, setMobileTab] = useState("edit");
  const [data, setData] = useState({
    artist: "周杰伦",
    tour: "嘉年华世界巡回演唱会",
    venue: "STADIUM",
    venueName: "北京工人体育场",
    date: new Date().toLocaleDateString("zh-CN"),
    duration: "3h 15m",
    seat: "内场 A 区 12 排 15 座",
    genre: "POP",
    experience: {
      acoustic: 95,
      visual: 88,
      atmosphere: 92,
      energy: 96,
      vocals: 90,
    },
    favoriteSong: "《七里香》 - 全场大合唱的感动",
    surpriseMoment: "安可时突然演唱了从未公开的新歌《秘密花园》，全场沸腾！",
    setlist: [
      "开不了口",
      "七里香",
      "龙卷风",
      "青花瓷",
      "晴天",
      "稻香",
      "告白气球",
      "双截棍",
      "夜曲",
      "最伟大的作品",
    ],
    thoughts:
      "现场氛围超级棒，音质完美，舞美很震撼。最感动的是全场一起合唱经典老歌的时刻。杰伦的状态很好，还是那么有魅力。",
  });

  const [expandedSection, setExpandedSection] = useState("concert");
  const receiptRef = useRef(null);
  const { isDownloading, handleDownload, error } = useDownloadReceipt('CONCERT_LOG');

  const t = TEXT[lang];

  const toggleSection = (s) =>
    setExpandedSection(expandedSection === s ? null : s);
  const toggleLang = () => setLang((l) => (l === "zh" ? "en" : "zh"));

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden text-gray-900 bg-gray-100 md:flex-row md:justify-center">
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
            title={t.concertInfo}
            isOpen={expandedSection === "concert"}
            onToggle={() => toggleSection("concert")}
          >
            <InputGroup
              label={t.labelArtist}
              value={data.artist}
              onChange={(v) => setData({ ...data, artist: v })}
            />
            <InputGroup
              label={t.labelTour}
              value={data.tour}
              onChange={(v) => setData({ ...data, tour: v })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase">
                  {t.labelVenue}
                </label>
                <select
                  value={data.venue}
                  onChange={(e) => setData({ ...data, venue: e.target.value })}
                  aria-label={t.labelVenue}
                  className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm"
                >
                  {Object.entries(t.venues).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <InputGroup
                label="场地名称"
                value={data.venueName}
                onChange={(v) => setData({ ...data, venueName: v })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                label={t.labelDate}
                value={data.date}
                onChange={(v) => setData({ ...data, date: v })}
              />
              <InputGroup
                label={t.labelDuration}
                value={data.duration}
                onChange={(v) => setData({ ...data, duration: v })}
              />
            </div>
            <InputGroup
              label={t.labelSeat}
              value={data.seat}
              onChange={(v) => setData({ ...data, seat: v })}
            />
            <div>
              <label className="block text-[10px] font-bold text-gray-700 mb-1.5 uppercase">
                音乐类型
              </label>
              <select
                value={data.genre}
                onChange={(e) => setData({ ...data, genre: e.target.value })}
                aria-label="音乐类型"
                className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm focus:border-black outline-none rounded-sm"
              >
                {Object.entries(t.genres).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </InputSection>

          <InputSection
            title={t.experience}
            isOpen={expandedSection === "experience"}
            onToggle={() => toggleSection("experience")}
          >
            <div className="p-4 space-y-4 border border-gray-100 rounded-sm bg-gray-50">
              <RatingSlider
                label={t.labelAcoustic}
                value={data.experience.acoustic}
                onChange={(v) =>
                  setData({
                    ...data,
                    experience: { ...data.experience, acoustic: v },
                  })
                }
              />
              <RatingSlider
                label={t.labelVisual}
                value={data.experience.visual}
                onChange={(v) =>
                  setData({
                    ...data,
                    experience: { ...data.experience, visual: v },
                  })
                }
              />
              <RatingSlider
                label={t.labelAtmosphere}
                value={data.experience.atmosphere}
                onChange={(v) =>
                  setData({
                    ...data,
                    experience: { ...data.experience, atmosphere: v },
                  })
                }
              />
              <RatingSlider
                label={t.labelEnergy}
                value={data.experience.energy}
                onChange={(v) =>
                  setData({
                    ...data,
                    experience: { ...data.experience, energy: v },
                  })
                }
              />
              <RatingSlider
                label={t.labelVocals}
                value={data.experience.vocals}
                onChange={(v) =>
                  setData({
                    ...data,
                    experience: { ...data.experience, vocals: v },
                  })
                }
              />
            </div>
          </InputSection>

          <InputSection
            title={t.setlist}
            isOpen={expandedSection === "setlist"}
            onToggle={() => toggleSection("setlist")}
          >
            <InputGroup
              label={t.labelFavorite}
              value={data.favoriteSong}
              onChange={(v) => setData({ ...data, favoriteSong: v })}
              isTextArea
            />
            <InputGroup
              label={t.labelSurprise}
              value={data.surpriseMoment}
              onChange={(v) => setData({ ...data, surpriseMoment: v })}
              isTextArea
            />
          </InputSection>

          <InputSection
            title={t.thoughts}
            isOpen={expandedSection === "thoughts"}
            onToggle={() => toggleSection("thoughts")}
          >
            <InputGroup
              label={t.labelThoughts}
              value={data.thoughts}
              onChange={(v) => setData({ ...data, thoughts: v })}
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
              <MusicConcertPreview data={data} text={t} ref={receiptRef} />
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
          <Music size={14} /> 编辑
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

const MusicConcertPreview = React.forwardRef(({ data, text }, ref) => {
  const avgExperience = Math.round(
    (data.experience.acoustic +
      data.experience.visual +
      data.experience.atmosphere +
      data.experience.energy +
      data.experience.vocals) /
      5
  );

  return (
    <div ref={ref} className="w-[380px] relative">
      <div className="min-h-[600px] bg-white p-6 pb-8 font-receipt tracking-receipt flex flex-col">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1
            className="mb-1 font-bold tracking-wider text-black"
            style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}
          >
            {text.title}
          </h1>
          <div className="text-[10px] font-bold text-gray-500 tracking-widest">
            CONCERT EXPERIENCE
          </div>
        </div>
        <div className="my-2 border-t-2 border-black border-dashed"></div>

        {/* Concert Info */}
        {data.artist && data.artist.trim() && (
          <div className="mb-6 text-center">
            <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">
              {text.labelArtist}
            </div>
            <h2 className="mb-2 text-xl font-bold leading-snug">
              {data.artist}
            </h2>
            <div className="mb-2 text-lg font-bold text-black">{data.tour}</div>
            <div className="flex gap-2 text-[10px] font-bold uppercase mb-2 justify-center">
              <span className="px-2 border border-black">
                {text.venues[data.venue]}
              </span>
              <span className="px-2 text-white bg-black">
                {text.genres[data.genre]}
              </span>
            </div>
          </div>
        )}

        {/* Venue & Date */}
        <div className="p-4 mb-6 border border-black">
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase mb-2">
            <div>
              <MapPin className="inline w-3 h-3 mr-1" /> {text.labelVenue}:
            </div>
            <div>{data.venueName}</div>
            <div>
              <Calendar className="inline w-3 h-3 mr-1" /> {text.labelDate}:
            </div>
            <div>{data.date}</div>
            <div>
              <Headphones className="inline w-3 h-3 mr-1" />{" "}
              {text.labelDuration}:
            </div>
            <div>{data.duration}</div>
            <div className="col-span-2">
              <span className="text-gray-500">{text.labelSeat}:</span>{" "}
              {data.seat}
            </div>
          </div>
        </div>

        {/* Experience Ratings */}
        <div className="mb-6">
          <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">
            Live Experience
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{avgExperience}%</div>
              <div className="text-[8px] text-gray-500">AVERAGE</div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span>{text.labelAcoustic}</span>
                <span>{data.experience.acoustic}%</span>
              </div>
              <div className="relative h-2 bg-gray-200 border border-black">
                <div
                  className="h-full bg-black"
                  style={{ width: `${data.experience.acoustic}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span>{text.labelVisual}</span>
                <span>{data.experience.visual}%</span>
              </div>
              <div className="relative h-2 bg-gray-200 border border-black">
                <div
                  className="h-full bg-black"
                  style={{ width: `${data.experience.visual}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span>{text.labelAtmosphere}</span>
                <span>{data.experience.atmosphere}%</span>
              </div>
              <div className="relative h-2 bg-gray-200 border border-black">
                <div
                  className="h-full bg-black"
                  style={{ width: `${data.experience.atmosphere}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span>{text.labelEnergy}</span>
                <span>{data.experience.energy}%</span>
              </div>
              <div className="relative h-2 bg-gray-200 border border-black">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-red-500"
                  style={{ width: `${data.experience.energy}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase">
                <span>{text.labelVocals}</span>
                <span>{data.experience.vocals}%</span>
              </div>
              <div className="relative h-2 bg-gray-200 border border-black">
                <div
                  className="h-full bg-black"
                  style={{ width: `${data.experience.vocals}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Favorite Song */}
        {data.favoriteSong && data.favoriteSong.trim() && (
          <div className="mb-6">
            <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">
              Highlight Moment
            </div>
            <div className="relative p-4 border-l-4 border-black bg-gray-50">
              <Music className="absolute w-6 h-6 text-black top-2 right-2" />
              <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">
                "{data.favoriteSong}"
              </p>
            </div>
          </div>
        )}

        {/* Surprise Moment */}
        {data.surpriseMoment && data.surpriseMoment.trim() && (
          <div className="mb-6">
            <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">
              Surprise Moment
            </div>
            <div className="relative p-4 border-l-4 border-black bg-gray-50">
              <p className="text-sm italic leading-relaxed text-justify text-gray-800 whitespace-pre-wrap">
                "{data.surpriseMoment}"
              </p>
            </div>
          </div>
        )}

        {/* Personal Thoughts */}
        {data.thoughts && data.thoughts.trim() && (
          <div className="flex-1 mb-6">
            <div className="text-[10px] font-bold uppercase text-gray-500 border-b border-black pb-1 mb-2">
              Personal Thoughts
            </div>
            <p className="pb-2 text-sm leading-relaxed whitespace-pre-wrap border-b border-gray-300">
              {data.thoughts}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col items-center pt-6 mt-auto">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-center">
            Thank You For Coming
          </div>
          <div className="flex items-center justify-between w-full h-12 overflow-hidden">
            {/* Musical note pattern */}
            {[...Array(32)].map((_, i) => (
              <div
                key={i}
                className="h-full bg-black"
                style={{
                  width: [1, 2, 1, 3, 1, 2][i % 5] + "px",
                  marginLeft: "1px",
                  height: Math.random() > 0.5 ? "12px" : "8px",
                  alignSelf: Math.random() > 0.5 ? "flex-start" : "flex-end",
                }}
              ></div>
            ))}
          </div>
          <div className="text-[10px] mt-1 font-receipt">
            {Date.now().toString().slice(-8)}
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
