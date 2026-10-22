# Xone v0.5 – CDE Platform

A prototype **Construction Document Engineering (CDE)** platform built with React, Vite, Tailwind CSS, and TypeScript. Designed to support multiple organizational roles (Design Manager & Construction Manager) and compliant with ISO 19650 data‑management standards.

---

## 📦 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run the development server (http://localhost:3002)
npm run dev

# 3. Open your browser at the URL shown (default port 3002)
```

---

## 🛠 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server on port 3002 (host 0.0.0.0) |
| `npm run build` | Build production bundle (`vite build`) |
| `npm run build:pages` | Build with `VITE_BASE_PATH=/xone-v0.5/` for GitHub Pages |
| `npm run deploy` | Run `build:pages` then deploy `dist` to GitHub Pages |
| `npm run preview` | Run `vite preview` to preview the production build |
| `npm run lint` | Run `tsc --noEmit` for type‑checking |

---

## 👤 Roles & Navigation

| Role | Home Tab | Key Features |
|------|----------|--------------|
| **Design Manager** | **Dashboard** (project dashboard) | KPI cards, S‑Curve, clash coordination, milestones, IPC/MoM cards, CDE folder navigation |
| **Construction Manager** | **Construction Dashboard** (project dashboard) | Same KPI set, plus dedicated folders for financial reports & meeting minutes, and quick access to CDE documents |
| **All users** | Role‑selection screen (CoP V 0.5) | Choose **Design Manager** or **Construction Manager** at login; then pick a project from the portfolio |

- After login, users are prompted to select their organizational role.
- The **sidebar** “خانه” button dynamically routes to the appropriate home page based on the selected role.
- The top navigation bar and floating demo‑bar also adapt to the selected role.

---

## 📂 Project Structure (key folders)

```
src/
├─ data/              # mock data (projects, folders, documents)
├─ types/             # TypeScript interfaces (NavigationTab, Project, …)
├─ views/             # page components
│  ├─ DashboardView.tsx           # Design‑manager home
│  ├─ ConstructionDashboardView.tsx  # Construction‑manager home
│  ├─ RoleSelectionView.tsx       # Role‑picker on login
│  ├─ PortfolioView.tsx           # Project list & management
│  └─ … (CDE files, approvals, BIM, permissions)
├─ components/        # reusable UI (Sidebar, Header, Toast, …)
├─ hooks/             # custom hooks (useDissolve)
└─ index.css          # Tailwind + project‑specific theming
```

---

## 🖥 Screenshots (optional)

- **Role selection**: `CoP V 0.5` banner, two role cards (Design Manager / Construction Manager)
- **Dashboard**: 5 KPI cards, S‑Curve chart, clash histogram, milestones stepper, 3 bottom support cards (IPC, MoM, CDE uploads)
- **Construction Dashboard**: same layout with role‑specific folder deep‑links

---

## 📦 Deployment

The project is configured for GitHub Pages under the repository **rasmteam/xone-v0.5**.

```bash
# Deploy to GitHub Pages (official repo)
npm run deploy
```

The public site will be available at:

> **https://rasmteam.github.io/xone-v0.5/**

---

## 🛠 Tech Stack

- **React 19** + **Vite 8** (ESM, native `import.meta.dirname`)
- **Tailwind CSS 4** (JIT, config‑as‑code)
- **Material‑Symbols Outlined** for icons
- **Lenis** for smooth scroll
- **TypeScript** strict typing throughout
- ISO 19650‑compliant data‑structure mock‑up

---

## 📄 License

MIT – feel free to fork, extend, or use as a basis for your own CDE platform.