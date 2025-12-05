# Contributing to LIFE_LOGGER

Thank you for your interest in LIFE_LOGGER – contributions of any size are appreciated.

## 📜 Code of Conduct

We aim for a friendly, respectful and inclusive community. By participating you agree to:

- Be kind and constructive in all discussions.
- Respect different backgrounds and opinions.
- Focus feedback on the code, not the person.

If you see unacceptable behavior, please report it via GitHub Issues.

## 🤝 Ways to Contribute

- **Report bugs** – unexpected behavior, crashes, layout issues, export problems.
- **Suggest features** – new log types, fields, export options, UX improvements.
- **Improve documentation** – clearer wording, better examples, translations.
- **Submit code** – small fixes, refactors, new components or templates.

Before opening an issue, please quickly search **Issues** to avoid duplicates.

## 🚀 Getting Started

1. Fork the repo on GitHub.
2. Clone your fork:

   ```bash
   git clone https://github.com/YOUR_USERNAME/life-logger.git
   cd life-logger
   ```

3. Install dependencies and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

4. Open **http://localhost:5173** and verify the app runs.

## 🔄 Development Workflow

1. **Create a branch** from your up-to-date `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/my-feature    # or fix/bug-description
   ```

2. **Make focused changes**:
   - Keep PRs small and single-purpose when possible.
   - Prefer reusing existing patterns/components.

3. **Run the app / build** to ensure it still works:

   ```bash
   npm run dev
   # or, for a production check
   npm run build
   ```

4. **Commit and push**:

   ```bash
   git add .
   git commit -m "feat(movie): add director field to movie receipt"
   git push origin feat/my-feature
   ```

5. **Open a Pull Request** against the upstream `main` branch, briefly describing:
   - What you changed.
   - Why it’s useful.
   - Screenshots/GIFs if the UI changed.

## 🧾 Code Style & Practices

- **Language & stack**: React + Vite + Tailwind CSS.
- **Indentation**: 2 spaces, no tabs.
- **Strings**: single quotes in JS/TS, double quotes in JSX attributes.
- **No stray logs**: remove `console.log` and debug code before committing.
- **Internationalization**: all user-facing text must exist in both Chinese and English `TEXT` objects; avoid hard-coded strings.
- **Accessibility**: keep icons labelled (`aria-label`, `aria-hidden`), ensure keyboard-focusable controls and visible focus states.

You can look at existing receipt pages in `src/pages/*ReceiptPage.jsx` as the reference for layout, wording and patterns.

## 🧾 Commit & PR Guidelines

- Use clear, concise messages, ideally following **Conventional Commits**:
  - `feat`: new feature
  - `fix`: bug fix
  - `docs`: documentation changes
  - `style`: formatting only
  - `refactor`: code reorganization without behavior changes
  - `chore` / `test`: tooling, tests, etc.

Examples:

```bash
feat(sleep): add dream intensity slider
fix(export): handle safari image export error
docs(readme): simplify quick start section
```

For pull requests:

- One logical change set per PR when possible.
- Explain the motivation and the solution in a few sentences.
- Mention related issues (e.g. `Fixes #12`).
- Attach screenshots for any visual change.

## ✅ Before You Submit

Please quickly check:

- The app starts with `npm run dev` without errors.
- For UI changes, main screens look correct on desktop and mobile.
- Both languages (中文 / English) render correctly and toggle works.
- No obvious console errors or warnings in the browser.

If your change affects exports or layout, also run `npm run build` and spot-check the built app with `npm run preview`.

## 📄 License

By contributing to LIFE_LOGGER, you agree that your contributions are licensed under the project’s [MIT License](LICENSE).

## 🙏 Thanks

Every issue, suggestion and pull request helps make LIFE_LOGGER better. Thanks for taking the time to contribute.

