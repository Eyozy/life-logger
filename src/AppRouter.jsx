import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import SoulReceiptGenerator from './App'; // Renamed App to SoulReceiptGenerator for clarity
import LifeReceiptPage from './pages/LifeReceiptPage';
import FoodReceiptPage from './pages/FoodReceiptPage';
import MovieReceiptPage from './pages/MovieReceiptPage';
import GameReceiptPage from './pages/GameReceiptPage';
import MusicConcertReceiptPage from './pages/MusicConcertReceiptPage';
import IdolReceiptPage from './pages/IdolReceiptPage';
import ReadingReceiptPage from './pages/ReadingReceiptPage';
import TravelReceiptPage from './pages/TravelReceiptPage';
import FitnessReceiptPage from './pages/FitnessReceiptPage';
import SocialReceiptPage from './pages/SocialReceiptPage';
import SleepReceiptPage from './pages/SleepReceiptPage';
import CoffeeReceiptPage from './pages/CoffeeReceiptPage';
import ShoppingReceiptPage from './pages/ShoppingReceiptPage';

export const LanguageContext = createContext();

const AppRouter = () => {
  const [lang, setLang] = useState('zh');
  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      <Router>
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
      </Router>
    </LanguageContext.Provider>
  );
};

export default AppRouter;
