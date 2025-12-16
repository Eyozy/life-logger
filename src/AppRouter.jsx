import React, { useState, createContext, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';

// Lazy load all receipt pages for better performance
const SoulReceiptGenerator = lazy(() => import('./App'));
const LifeReceiptPage = lazy(() => import('./pages/LifeReceiptPage'));
const FoodReceiptPage = lazy(() => import('./pages/FoodReceiptPage'));
const MovieReceiptPage = lazy(() => import('./pages/MovieReceiptPage'));
const GameReceiptPage = lazy(() => import('./pages/GameReceiptPage'));
const MusicConcertReceiptPage = lazy(() => import('./pages/MusicConcertReceiptPage'));
const IdolReceiptPage = lazy(() => import('./pages/IdolReceiptPage'));
const ReadingReceiptPage = lazy(() => import('./pages/ReadingReceiptPage'));
const TravelReceiptPage = lazy(() => import('./pages/TravelReceiptPage'));
const FitnessReceiptPage = lazy(() => import('./pages/FitnessReceiptPage'));
const SocialReceiptPage = lazy(() => import('./pages/SocialReceiptPage'));
const SleepReceiptPage = lazy(() => import('./pages/SleepReceiptPage'));
const CoffeeReceiptPage = lazy(() => import('./pages/CoffeeReceiptPage'));
const ShoppingReceiptPage = lazy(() => import('./pages/ShoppingReceiptPage'));

export const LanguageContext = createContext();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
      <p className="text-sm text-gray-600 font-mono">Loading...</p>
    </div>
  </div>
);

const AppRouter = () => {
  const [lang, setLang] = useState('zh');
  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/receipt/life" element={<SoulReceiptGenerator />} />
            <Route path="/receipt/food" element={<FoodReceiptPage />} />
            <Route path="/receipt/movie" element={<MovieReceiptPage />} />
            <Route path="/receipt/game" element={<GameReceiptPage />} />
            <Route path="/receipt/music" element={<MusicConcertReceiptPage />} />
            <Route path="/receipt/idol" element={<IdolReceiptPage />} />
            <Route path="/receipt/reading" element={<ReadingReceiptPage />} />
            <Route path="/receipt/travel" element={<TravelReceiptPage />} />
            <Route path="/receipt/fitness" element={<FitnessReceiptPage />} />
            <Route path="/receipt/social" element={<SocialReceiptPage />} />
            <Route path="/receipt/sleep" element={<SleepReceiptPage />} />
            <Route path="/receipt/coffee" element={<CoffeeReceiptPage />} />
            <Route path="/receipt/shopping" element={<ShoppingReceiptPage />} />
          </Routes>
        </Suspense>
      </Router>
    </LanguageContext.Provider>
  );
};

export default AppRouter;
