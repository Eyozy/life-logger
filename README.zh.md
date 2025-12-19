# LIFE_LOGGER

一款用复古热敏小票风格记录生活的应用，用数据和可视化重构你的日常。

[![在线演示](https://img.shields.io/badge/demo-live-success?style=flat-square)](https://life-logger.netlify.app/) [![许可证](https://img.shields.io/badge/许可证-MIT-blue.svg?style=flat-square)](LICENSE) [![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=flat-square&logo=react)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-6.4.1-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)

[English](README.md) • [简体中文](README.zh.md)

## ✨ 功能特性

- **13+ 预设日志模板**：覆盖日常、睡眠、饮食、健身、娱乐、社交、旅行等场景。
- **热敏小票风格**：380px 固定宽度小票布局 + 条形码 + 小票专用像素字体。
- **交互式表单与实时预览**：滑块、评分、指标变化实时映射到小票。
- **一键导出 PNG**：浏览器端生成高质量图片，无需服务器。
- **中英文双语界面**：一键切换，中英文文案完整对齐。
- **响应式与无障碍**：适配移动/桌面，键盘可用，带 ARIA 标签。

## 🚀 快速开始

### 前置环境

- Node.js 18+
- Chrome / Firefox / Safari / Edge

### 安装与运行

```bash
git clone https://github.com/Eyozy/life-logger.git
cd life-logger

npm install
npm run dev
```

在浏览器中打开 **http://localhost:5173**。

## 🛠 技术栈

- **框架**：React 19、React Router DOM 7、Vite 6。
- **样式**：Tailwind CSS 3、Lucide React 图标库。
- **工具**：`html-to-image` 用于前端 PNG 导出，PostCSS + Autoprefixer 处理样式。

## 💻 开发

常用脚本：

```bash
# 启动开发服务器
npm run dev     
# 生产构建（输出到 dist/）
npm run build   
# 本地预览生产构建
npm run preview 
```

## 🌐 部署到 Netlify

你可以通过 fork 的方式，将 LIFE_LOGGER 作为静态站点部署到 Netlify：

1. 在 GitHub 上点击 **Fork**，将仓库 fork 到你自己的账号下。
2. 在 Netlify 后台点击 **Add new site → Import an existing project**，选择你 fork 的仓库。
3. 点击 **Deploy site**，之后每次向 fork 仓库的主分支推送代码，Netlify 都会自动重新构建并部署。

## 🤝 贡献

欢迎任何形式的贡献：Bug 反馈、文案修正、小功能优化，或新的小票创意。

- 贡献流程与规范见文档：[CONTRIBUTING.md](CONTRIBUTING.md)
- Bug 与功能需求请通过 GitHub Issues 提交
- 代码更改请通过 Pull Request 提交

## 📄 许可证

本项目采用 MIT License，详情见 [LICENSE](LICENSE) 文件。