# LIFE_LOGGER

A retro thermal receipt-style life logging app that uses data and visualization to reframe your everyday life.

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=flat-square)](https://life-logger.netlify.app/) [![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE) [![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=flat-square&logo=react)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-6.4.1-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)

[English](README.md) • [简体中文](README.zh.md)

## ✨ Features

- **13+ preset log templates** covering everyday life, sleep, food, fitness, entertainment, social events and travel.
- **Thermal receipt look**: 380px-wide receipt layout, barcode, and pixel font for the receipt output.
- **Interactive forms with live preview**: sliders, ratings and metrics update the receipt in real time.
- **One-click PNG export**: generate high-quality images entirely in the browser, no server required.
- **Bilingual interface**: switch between Chinese and English with fully aligned copy.
- **Responsive and accessible**: works on mobile and desktop, keyboard-friendly, with ARIA labels.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Chrome / Firefox / Safari / Edge

### Install & run

```bash
git clone https://github.com/Eyozy/life-logger.git
cd life-logger

npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## 🛠 Tech Stack

- **Framework**: React 19, React Router DOM 7, Vite 6
- **Styling**: Tailwind CSS 3, Lucide React icon set
- **Utilities**: `html-to-image` for client-side PNG export, PostCSS + Autoprefixer for CSS processing

## 💻 Development

Common scripts:

```bash
npm run dev     # start the development server
npm run build   # build for production (outputs to dist/)
npm run preview # preview the production build locally
```

## 🌐 Deploying to Netlify

You can host LIFE_LOGGER as a static site on Netlify using your own fork.

1. On GitHub, click **Fork** to create your own copy of the repository.
2. In Netlify, click **Add new site → Import an existing project** and select your forked repository.
3. Click **Deploy site**. Netlify will build and deploy on every new push to the main branch of your fork.

## 🤝 Contributing

All kinds of contributions are welcome: bug reports, copy tweaks, small improvements or brand-new receipt ideas.

- See the contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Use GitHub Issues for bug reports and feature requests
- Submit code changes via Pull Requests

## 📄 License

This project uses the **MIT License**. See [LICENSE](LICENSE) for details.