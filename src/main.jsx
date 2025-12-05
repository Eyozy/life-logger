import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './AppRouter';
import '@fontsource/fusion-pixel-12px-proportional-sc';
import './styles/tailwind.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
