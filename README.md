# ScriptSense AI — Hollywood Production Intelligence Engine 🎬

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-000000?style=for-the-badge&logo=vercel)](https://scriptsense-ai-app.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Built With: Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge&logo=google)](https://gemini.google.com)
[![Stitch & Antigravity](https://img.shields.io/badge/Tools-Stitch%20%26%20Antigravity-FFD341?style=for-the-badge)](#)

> **Agentic Cinema: The Blockbuster Hackathon Submission**
> An all-in-one Hollywood-grade screenplay studio, 5-tier budget engine, stripboard scheduler, and production analytics suite.

---

## 🌐 Live Production Application
🔗 **Live Application URL**: [https://scriptsense-ai-app.vercel.app](https://scriptsense-ai-app.vercel.app)

**Demo Credentials**:
- **Email**: `director@hollywood.com`
- **Password**: `studio2026`

---

## 🌟 Key Features

- **🎬 Master Screenplay Studio**: 12pt Courier Hollywood format text area, real-time element parser, line counter gutter, and PDF export powered by `html2pdf.js`.
- **💰 5-Tier Hollywood Budget Engine**: Real-time production cost forecasting ($ / page) factoring:
  - INT/EXT location surcharges (+40%)
  - DAY/NIGHT filming differentials (+25%)
  - Page 1/8ths and SAG cast day rates
- **📅 Production Stripboard (One-Liner Schedule)**: Location-grouped schedule strips with filming duration estimates and 4-week principal photography forecasts.
- **🔄 Touch & Mouse Scene Reordering**:
  - Reorder scenes seamlessly via `SortableJS` drag-and-drop.
  - Direct 1-click **Position Selector Dropdowns** (`Pos 1`, `Pos 2`, etc.).
  - Step arrows (⬆️ / ⬇️) and a dedicated **Reorder Organiser Modal**.
- **📊 Act I–III Character Arc & Ratio Analytics**: Renders dynamic glowing SVG character tension curves and dialogue ratio progress bars.
- **⚠️ Production Safety Controls**: Single-scene and bulk scene deletion with explicit warning prompts.
- **🔒 Encrypted Studio Auth & Session**: Tabbed Email Sign In / Sign Up modal with local session storage.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Tailwind CSS (Dark Noir aesthetic).
- **Libraries**:
  - `SortableJS`: Cross-platform touch & mouse drag-and-drop scene reordering.
  - `html2pdf.js`: Screenplay PDF export.
- **Hosting & Infrastructure**: Vercel Edge.
- **Development Tools**: Google Gemini, Stitch, Antigravity.

---

## 🚀 Local Setup & Installation

Clone the repository and launch locally:

```bash
git clone https://github.com/fsk2/scriptsense-ai-app.git
cd scriptsense-ai-app
```

Serve with any local web server (e.g. VS Code Live Server, `npx serve`, or Python HTTP server):

```bash
npx serve .
```

Open `http://localhost:3000` in your browser.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.
