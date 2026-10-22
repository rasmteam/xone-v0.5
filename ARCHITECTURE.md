# Xone v0.5 — Project Architecture & Logic

> A complete technical walkthrough of the Xone CDE prototype: how it is structured, how navigation and state work, what each module does, and how to extend it.
> Companion document to `README.md` (which covers installation and scripts).

---

## 1. What this project is

Xone is a **single-page, front-end-only prototype** of a Common Data Environment (CDE) platform for Baran Construction Group. It demonstrates how two distinct organizational personas interact with the same project data:

| Persona | Persian label | Landing page |
|---|---|---|
| Design Manager / CDE lead | مدیر ارشد طراحی و CDE | `dashboard` — design-oriented project home |
| Construction Manager | مدیر ساخت و هماهنگی کارگاه | `constructionDashboard` — site-oriented project home |

The domain vocabulary follows **ISO 19650** (CDE states `WIP → Shared → Published`, suitability codes, document naming, clash coordination, IPC certificates, MoM records). All data is **mocked locally** — there is no backend, database, or API.

The artifact is optimized for a **pitch-demo ("پیچ‌دک") session**: every screen is clickable, every action gives visual feedback (toast, transition, modal), and a floating demo bar lets a presenter jump between screens instantly.

---

## 2. Technology stack

| Layer | Choice | Notes |
|---|---|---|
| UI runtime | React 19 | Function components + hooks only |
| Build tool | Vite 8 | `base` driven by `VITE_BASE_PATH` |
| Language | TypeScript | Types in `src/types/index.ts` |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) | Utility-first, no separate config file; theme in `src/index.css` |
| Icons | Google Material Symbols Outlined | Loaded in `index.html` |
| Fonts | Markazi Text + Vazirmatn | Loaded in `index.html`, applied globally in `index.css` |
| Smooth scroll | Lenis | Initialized once in `App.tsx` |
| Animation | CSS keyframes (`animate-dissolve*`) | No animation library usage in practice (though `motion` is a dependency) |

**Unused dependencies:** `express`, `dotenv`, `@google/genai`, `esbuild`, `tsx` are present in `package.json` but not imported by the client bundle. They are leftovers from the AI Studio project template. `metadata.json` still advertises `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`, but no server code exists in `src/`.

---

## 3. High-level architecture

```
index.html
└── src/main.tsx                 (React root)
    └── src/App.tsx              (single stateful shell — all routing & app state)
        ├── Standalone screens   (rendered WITHOUT header/sidebar)
        │   ├── LoginView            tab: 'login'
        │   └── RoleSelectionView    tab: 'roleSelect'
        └── Application shell    (header + sidebar + content)
            ├── Header               (fixed top, project switcher, search, notifications)
            ├── Sidebar              (fixed right rail, role-aware "خانه")
            ├── <main key={currentTab}>  ← remounts per tab (scroll reset + animation)
            │   ├── DashboardView            tab: 'dashboard'
            │   ├── ConstructionDashboardView tab: 'constructionDashboard'
            │   ├── CdeFilesView             tab: 'cde'
            │   ├── ClashDetectionView       tab: 'bim'
            │   ├── ApprovalsView            tab: 'approvals'
            │   ├── PermissionsView          tab: 'permissions'
            │   └── PortfolioView            tab: 'portfolio'
            ├── Floating demo navigation bar (presenter shortcut)
            └── Global overlays (modals, drawer, toasts)
```

### 3.1 No router library

Navigation is a **finite state machine** implemented with a single `useState<NavigationTab>` in `App.tsx`. `NavigationTab` (in `src/types/index.ts`) enumerates every screen.

`navigate(tab)` does **not** switch immediately; it plays a dissolve transition:

```ts
navigate(tab)                 // if tab === currentTab → no-op
  setIsPageDissolving(true)   // adds .animate-dissolve-out (220 ms fade)
  setTimeout(200 ms)
    setCurrentTab(tab)
    setIsPageDissolving(false) // .animate-dissolve (260 ms fade-in)
```

Consequences to remember when extending:

- There is **no URL / deep-link / browser-history support**. A refresh always restarts at `login`.
- Any new screen must be added to `NavigationTab` **and** rendered in the `App.tsx` switch-like block.
- The `<main key={currentTab}>` trick forces a remount on every tab change, which resets internal view state (filters, selected folder, form fields) and re-triggers Lenis scroll reset (`scrollTo(0)`).

### 3.2 Application state (owned by `App.tsx`)

| State | Type | Purpose |
|---|---|---|
| `currentTab` | `NavigationTab` | Active screen |
| `isPageDissolving` | `boolean` | Transition lock/animation |
| `currentProject` | `Project` | Active project object, shared to Header/dashboards/portfolio |
| `userRole` | `'cde' \| 'construction' \| null` | Persona picked on the role screen; governs home routing |
| `documents` | `CdeDocument[]` | Live CDE document list (seeded from mock; new uploads prepend) |
| `toasts` | `ToastMessage[]` | Global notification queue |
| `isProjectSwitcherOpen` / `isSearchOpen` / `isNotificationsOpen` / `isUploadOpen` / `isExcelIpcOpen` | `boolean` | Overlay visibility |
| `selectedDossierDocId` | `string \| null` | Which document dossier modal is open |
| `clashPreset` | `ClashPreset \| null` | Filter preset handed to the BIM screen |
| `cdeTargetFolder` | `string \| undefined` | Folder to pre-select when opening CDE (deep link from dashboards) |
| `showDemoTour`, `isBarMinimized` | `boolean` | Floating demo bar UI |

There is **no Context, Redux, or Zustand**. Props are passed explicitly (typically one level deep, from `App` to the active view). This keeps the prototype simple but means adding a deeply-needed value requires threading a prop through `App`.

### 3.3 Role-aware routing (key logic)

The flow is:

```
LoginView ──onLoginSuccess──▶ 'roleSelect'
RoleSelectionView ──onRoleSelect(role)──▶ setUserRole(role) ▶ 'portfolio'
PortfolioView ──select project──▶ handleSelectAndGo(proj, homeTab)
                                      │
                                      ├─ userRole === 'construction' → 'constructionDashboard'
                                      └─ otherwise                   → 'dashboard'
```

Two mechanisms keep the "home" consistent everywhere:

1. **`homeTab` prop** — `App` passes `homeTab={userRole === 'construction' ? 'constructionDashboard' : 'dashboard'}` to both `Sidebar` and `PortfolioView`.
   - `Sidebar`: the «خانه» button targets `homeTab` instead of a hard-coded `dashboard`.
   - `PortfolioView`: `handleSelectAndGo` defaults its destination to `homeTab`, so every "select project & enter" affordance (card, table row, dossier modal) lands on the correct persona home.
2. **`userRole` state** — set on the role screen and consumed only for the above routing.

### 3.4 Cross-screen coordination patterns

| Pattern | Implementation |
|---|---|
| **Toast notifications** | `addToast(title, desc, type)` in `App`; `<Toast>` auto-dismisses the newest item after 4s. Passed down as `onTriggerToast`. |
| **Dissolve modals** | `useDissolve(isOpen, 220ms)` keeps a component mounted long enough to play `.animate-modal-dissolve-out`. Every modal follows `if (!visible) return null`. |
| **Document dossier** | Any view calls `onOpenDocumentDossier(docId)`; `App` resolves the document from `documents` (falling back to mock) and opens `DocumentDossierModal`. |
| **IPC Excel viewer** | `onOpenExcelIpc()` opens `ExcelIpcModal` with `DEFAULT_IPC_CERTIFICATE` (read-only spreadsheet simulation). |
| **Clash filter presets** | Dashboard histograms/matrix cells call `onOpenClashFilters({status, severity, label})`; `App` stores it in `clashPreset`, switches to `bim`, and `ClashDetectionView` applies it on mount (`useEffect` on `initialFilters`) and jumps to the register subtab. |
| **CDE folder deep links** | Dashboard bottom cards call `onNavigateToCdeFolder(folderId)`; `App` stores `cdeTargetFolder` and navigates to `cde`. `CdeFilesView` reads it as `initialFolderId` and auto-expands the ancestor path in the folder tree. |
| **Project switching** | `Header` opens `ProjectSwitcherModal`; selecting a project only updates `currentProject` (no navigation). `PortfolioView` selection additionally navigates home. |
| **Global search** | `Cmd/Ctrl + K` toggles `GlobalSearchModal`; it scans mock documents, clashes, and folders. |
| **Notifications** | Bell opens `NotificationDrawer` with hard-coded alerts that navigate to `approvals`/`bim`/`cde` and open a dossier. |

---

## 4. Directory map

```
Xone-v0.4/
├── index.html                  # RTL shell, fonts, Material Symbols, #root
├── metadata.json               # AI Studio metadata (name/description; server capability flag)
├── vite.config.ts              # base from VITE_BASE_PATH, @ alias → project root
├── package.json                # scripts incl. build:pages / deploy (gh-pages)
├── tsconfig.json               # ES2022, bundler resolution, react-jsx, noEmit
├── public/img/*.webp           # project cover images referenced by mock data
└── src/
    ├── main.tsx                # createRoot + <App/> + index.css
    ├── App.tsx                 # routing, state, overlays, demo bar (≈500 lines)
    ├── index.css               # Tailwind import, global font/RTL, dissolve keyframes, scrollbar
    ├── types/index.ts          # every domain interface + NavigationTab union
    ├── data/mockData.ts        # all seed data (1,800+ lines)
    ├── hooks/useDissolve.ts    # mount-lifetime helper for exit animations
    ├── components/
    │   ├── Header.tsx              # project switcher trigger, search, bell, user menu
    │   ├── Sidebar.tsx             # icon rail; «خانه» is role-aware
    │   ├── Toast.tsx               # toast stack + ToastMessage type
    │   ├── ProjectSwitcherModal.tsx
    │   ├── GlobalSearchModal.tsx
    │   └── NotificationDrawer.tsx
    ├── modals/
    │   ├── UploadModal.tsx         # 2-step upload wizard → creates CdeDocument
    │   ├── DocumentDossierModal.tsx# document passport, revisions, hash, diff tab
    │   ├── ExcelIpcModal.tsx       # IPC spreadsheet (BOQ / summary / deductions / signatures)
    │   └── ClashDetailModal.tsx    # clash detail + "view in 3D"
    └── views/
        ├── LoginView.tsx
        ├── RoleSelectionView.tsx
        ├── DashboardView.tsx
        ├── ConstructionDashboardView.tsx
        ├── PortfolioView.tsx
        ├── CdeFilesView.tsx
        ├── ClashDetectionView.tsx
        ├── ApprovalsView.tsx
        └── PermissionsView.tsx
```

Approximate size: ~8,000 lines of TSX across views, 1,805 lines of mock data.

---

## 5. Domain model (`src/types/index.ts`)

| Interface | Represents | Notable fields |
|---|---|---|
| `NavigationTab` | Screen union | `dashboard`, `constructionDashboard`, `cde`, `bim`, `approvals`, `permissions`, `portfolio`, `roleSelect`, `login` |
| `Project` | A portfolio project | `code`, `progress`, `baselineProgress`, `status`, `image`, `lod`, `clashesCount`, `documentsCount`, `stats[]` (catalogue cards) |
| `CdeFolder` | Node in the CDE tree | `path`, `filesCount`, `badge`, recursive `children` |
| `CdeDocument` | A controlled document | `isoCode`, `format` (`RVT/IFC/NWD/DWG/XLSX/PDF`), `discipline`, `revision`, `status` (`wip/shared/approved/rejected/pending/revise`), `suitabilityCode`, `folderPath`, `folderId` |
| `IpcCertificate` / `IpcItem` | Interim Payment Certificate | totals, deductions, `bimStatus` reconciliation per BOQ row |
| `ClashItem` | A model clash | `severity`, `type` (Hard/Soft/Resolved), discipline pair, Revit element IDs, `floorLevel`, `disciplinePair`, coordinates |
| `ClashPreset` | Incoming filter instruction | `severity`, `status`, `label` |
| `ApprovalItem` | Workflow inbox item | `sla`, `slaUrgent`, `status`, `phase` |
| `RolePermission`, `UserOverride` | Governance matrix | permission level, per-user exceptions |
| `Milestone` | Legacy timeline model | `isCompleted`, `isCurrent` (dashboards currently hard-code their own steppers) |

`mockData.ts` exports:

- `PROJECTS` — 8 flagship Baran projects (Kish, Baran 1–5, Unique One, Pure One; images resolved via `import.meta.env.BASE_URL`)
- `CDE_FOLDERS` — ISO-19650 folder tree (`f-doc`, `f-import`, `f-ph1` with discipline branches, `f-ph1-financial`, `f-ph2`, plus `f-doc-mom` for meeting minutes)
- `CDE_DOCUMENTS` — 26 controlled documents across folders
- `DEFAULT_IPC_CERTIFICATE` — full IPC #5 payload
- `APPROVAL_ITEMS` — 5 workflow inbox items
- `CLASHES` — 26 fully-populated clash records (Revit element IDs, penetration, coordinates, coordinator notes)
- `ROLE_PERMISSIONS`, `USER_OVERRIDES`, `MILESTONES`

> **Data is read-only except for uploads.** `documents` is React state seeded from `CDE_DOCUMENTS`; `UploadModal` prepends a generated `CdeDocument`. Everything else (approvals, clashes, permissions) is rendered directly from constants, so actions affecting them are simulated with toasts.

---

## 6. Screen-by-screen logic

### 6.1 `LoginView` (standalone)
Dark themed sign-in. Two methods: password (simulated 1.2 s delay) and OTP (120 s countdown) plus "smart-card" path. All paths eventually call `onLoginSuccess()`, which navigates to `roleSelect`. No credential validation — purely presentational.

### 6.2 `RoleSelectionView` (standalone)
The persona gate ("CoP V 0.5"). Four bento cards: two active (Design Lead & CDE, Construction Coordination) and two locked (Commercial, Hospitality/FM). Contains a help modal describing the two demo scenarios. Active cards call `onRoleSelect('cde' | 'construction')`; header links jump to `portfolio` / `permissions`; "خروج از حساب" returns to `login`. Styling intentionally mirrors the Material-3-like palette from the design source (primary `#005652`, container `#00716B`, secondary `#296862`).

### 6.3 `DashboardView` — Design Manager home
Vertical stack of sections, all data static:

1. **5 KPI cards** — manager actions (→ `approvals`), physical progress 78.5% (conic-gradient ring), financial 64%, clash count (→ `bim`), SLA overdue (toast action).
2. **Two-column row** — approvals worktable with internal tabs (`نیازمند اقدام` / `تاریخچه`) and per-row "بررسی" → `onOpenDocumentDossier`; clash coordination 4-week grouped bar chart whose bars call `onOpenClashFilters`.
3. **Milestone timeline** — horizontal stepper, 8 nodes hard-coded.
4. **Three support cards** — latest IPCs (click → `ExcelIpcModal`), MoM list (download toasts), recent CDE files (→ dossier). Each ends with a **full-width CDE folder button**:
   - IPCs → `f-ph1-financial`
   - MoM → `f-doc-mom`
   - Recent files → `f-ph1`

State: only `approvalTab`.

### 6.4 `ConstructionDashboardView` — Construction Manager home
Same overall grammar, construction semantics:

1. Breadcrumb bar with project code/name (dynamic from `currentProject`) + "ثبت گزارش روزانه" toast.
2. **5 KPIs** — actions 5, physical 62.40%, financial 58.5%, change orders 4, SLA 3 (issue warning toast). Progress rings use the same conic-gradient style as the design dashboard.
3. **S-Curve card (inline SVG, not an image)** — baseline dashed curve, actual curve with gradient fill, "week 44" marker line, point markers, annotation badge, x-axis labels W01–W68; below it four phase progress bars.
4. **Clash card** — counts, 4-week reduction histogram, latest critical conflict; footer → `bim`.
5. **Milestone stepper** — 7 construction milestones (2 done, 1 active, 4 pending).
6. **Three support cards** with the same full-width CDE folder buttons as the design dashboard.

State: none (fully static presentation).

### 6.5 `PortfolioView` — project selection & management
- Search (name/code/location/usage/contractor), status chips (`all/onTrack/finalizing/issues`), usage filter, sort (`progress`, `budget`, `code`, `area`), and grid/table view toggle.
- Grid cards show cover image, status, progress vs baseline, budget, clash count, critical note, and a single **primary CTA** (`انتخاب پروژه و ورود`) routed to `homeTab`. Secondary CDE/BIM/dossier shortcuts were deliberately removed to reduce cognitive load (client request).
- Table view is denser and still exposes a dossier icon per row.
- Overlays: project dossier modal (catalogue specs, progress, budget, BIM data, actions to enter CDE/home), 3-project comparison modal, and "new project" modal (form only, no persistence).
- `handleSelectAndGo(proj, destinationTab = homeTab)` is the single selection pipeline: `onSelectProject(proj)` → `onNavigate(destinationTab)` → toast.

### 6.6 `CdeFilesView` — the repository
- Left: recursive folder tree (`CDE_FOLDERS`) with expand/collapse, search, and badges.
- Right: breadcrumbs, subfolder cards, format filter chips, and a document table (ISO code, revision, status, suitability, issuer, actions).
- Selection state: `selectedFolderId` (initialized from `initialFolderId` prop → deep link) and `expandedFolders` (ancestors of the selected folder are auto-expanded by a `useEffect`).
- Document filtering matches either `folderId ∈ branch` or `folderPath` containing the folder name/path.
- Actions: open dossier, open IPC Excel for XLSX rows, upload.

### 6.7 `ClashDetectionView` — BIM coordination
Two subtabs:
- **Coordination dashboard** — KPI tiles, discipline-pair risk matrix (5 floor zones × 5 pair columns) with heat colours; any cell click applies a filter, opens the register, and shows a badge explaining the active preset. Also a 3D viewer mock and focused-clash panel.
- **Clash register** — filterable/searchable table (floor, pair, severity, status, type) with detail modal → "view in 3D".
- Accepts `initialFilters` from the dashboard histogram; applied once on mount via `useEffect`, switching to the register.

### 6.8 `ApprovalsView` — ISO 19650 workflow inbox
Tabs (`myAction`, `all`, `published`, `delayed`) filter `APPROVAL_ITEMS` by status/SLA; search across title/code/sender/discipline; multi-select with bulk actions; row actions open the document dossier or the IPC Excel modal. Actions are simulated with toasts (no mutation).

### 6.9 `PermissionsView` — governance
Two modes: **folder-centric** (permission levels per role for the selected folder, inheritance toggle) and **role-centric** matrix. Also a per-user override table with add/remove operations kept in local state (reset on remount).

---

## 7. Overlays

| Component | Trigger | Behaviour |
|---|---|---|
| `ProjectSwitcherModal` | Header's project chip | Searchable project list; select updates `currentProject` only |
| `GlobalSearchModal` | Header search box, `⌘/Ctrl+K` | Searches docs/clashes/folders from mock data; can navigate or open dossier |
| `NotificationDrawer` | Header bell | Hard-coded alerts; each maps to a tab (+ optional dossier) |
| `UploadModal` | Header upload, demo bar, CDE screen | 2 steps: ISO naming matrix → file metadata; builds a `CdeDocument` and prepends to `documents` |
| `DocumentDossierModal` | Any "بررسی"/file row | Tabs: passport details (hash SHA-256, revision history, workflow, QR-ish block) and revision diff; actions: download toast, open 3D viewer → `bim` |
| `ExcelIpcModal` | IPC cards, XLSX rows | Sheet tabs (BOQ, summary, deductions, signatures), cell selection, row verification, manager note, approve/revise toasts |
| `ClashDetailModal` | Clash rows/cells | Clash metadata, resolution notes, "view in 3D" |
| `Toast` | global | Auto-dismiss newest after 4 s; typed success/error/info styling |

All overlays use `useDissolve` for enter/exit animation, `data-lenis-prevent` where scroll must be native, and are rendered from `App.tsx` so they survive tab changes.

---

## 8. Styling & UX conventions

- **Direction / language:** the whole app is RTL Persian. `dir="rtl"` is set on `<html>` and again on major containers.
- **Typography:** `index.css` forces Markazi Text globally (including inputs/buttons), with an exception that preserves the Material Symbols icon font and monospace for codes. Dashboards additionally use `font-['Markazi_Text']` for numeric KPI emphasis.
- **Palette:** brand teal `#00716B` (container), deep `#005652` (primary), secondary `#296862`, terracotta `#965335`, error `#BA1A1A`, page background `#E3E8EF`; the role screen uses its own Material-3-ish surface tokens expressed as arbitrary Tailwind values. Cards use `rounded-2xl`/`rounded-xl`, `border-slate-200`, `shadow-sm`.
- **Icons:** always `<span className="material-symbols-outlined">name</span>`.
- **Motion:** page dissolve (`animate-dissolve`), modal dissolve, backdrop fade; `hover:-translate-y-1` / `hover:shadow-md` card lift; `animate-pulse` status dots; Lenis smooth scrolling bound to `window`.
- **Responsive:** content grids collapse `lg:grid-cols-5 → sm:grid-cols-2 → 1`; wide tables/steppers live inside `overflow-x-auto` with `min-w-[900px]` where needed.
- **Layout chrome:** fixed `h-16` header at top, fixed `w-16` sidebar on the right, content padded `pt-16 pr-16`. Views themselves are `max-w-[1600px] mx-auto` with `p-4/6/7`.

---

## 9. Build & deployment flow

```
npm run dev            → Vite dev server (port 3002)
npm run lint           → tsc --noEmit
npm run build          → dist/ with base "/"
npm run build:pages    → dist/ with base "/xone-v0.5/"
npm run deploy         → build:pages + gh-pages -d dist -t
```

`vite.config.ts` computes `base` from `VITE_BASE_PATH`, so GitHub Pages assets resolve under the repository subpath. Images in `mockData` use `import.meta.env.BASE_URL` for the same reason. Deployment target: `rasmteam/xone-v0.5` → `https://rasmteam.github.io/xone-v0.5/`.

---

## 10. Extension recipes

### Add a new screen
1. Add the key to `NavigationTab` in `src/types/index.ts`.
2. Create `src/views/MyView.tsx` accepting the props it needs (follow `DashboardViewProps` as a template).
3. In `App.tsx`: import it, render `{currentTab === 'myView' && <MyView ... />}`, and (optionally) add a demo-bar button and a `getPageTitle` case in `Header.tsx`.
4. If it is a persona home, thread it through `homeTab`.

### Add a new role
1. Extend `userRole` state type.
2. Add a card in `RoleSelectionView` calling `onRoleSelect('newRole')`.
3. Create the role home view, add its `NavigationTab`, and extend the `homeTab` ternaries (better: replace them with a lookup map `{ cde: 'dashboard', construction: 'constructionDashboard', … }`).

### Add data
1. Define/extend an interface in `src/types/index.ts`.
2. Add the constant to `src/data/mockData.ts`.
3. Consume it in the view (remember: remounts reset local state, constants never mutate).
4. If it must be user-mutable, lift it into `App` state and pass down a setter, as done for `documents`.

### Make an action "real"
Today most write actions only toast. To persist within the session: hold the dataset in `App` state, pass `setX`/handlers into the view, and update immutably. For real persistence you would add an API layer — none exists.

---

## 11. Known limitations (prototype scope)

- **No backend / auth / persistence.** Refresh resets everything to the login screen; uploaded documents vanish on reload.
- **No URL routing.** Browser back/forward and shareable links do not work for internal screens.
- **Mock-only business logic.** Approvals, clashes, permissions, MoM and IPC mutations are simulations.
- **Hard-coded UI copy** in many sections (KPI values, milestones, conflict counts) — some are dynamic (`currentProject` name/code), most are not.
- **`Header` title for new tabs** falls back to a generic string unless a `getPageTitle` case is added.
- **Template residue:** unused server/AI dependencies and `metadata.json` capability flag; Google-hosted images are external and require internet access.
- **Accessibility:** interactive `<div onClick>` elements (cards) are not keyboard-focusable; icon-only buttons rely on `title` tooltips.

---

> **Sections 12–18 are the pitch-deck baseline.** They translate the technical facts above into narrative, messaging, and demo material that an AI deck generator (or a human designer) can turn directly into presentation slides. Sections 1–11 remain the source of truth for *what is actually implemented*.

---

## 12. Product story (narrative layer)

### 12.1 Elevator pitch (short)

> **Xone** is the unified digital workspace of Baran Construction Group: one ISO 19650-compliant Common Data Environment where every project document, BIM coordination issue, approval workflow, and payment certificate lives — tailored to each manager's role, from the design office to the construction site.

### 12.2 Elevator pitch (long, for the "solution" slide)

> Large construction portfolios lose weeks every month to scattered documents, ambiguous approval responsibilities, and BIM clashes discovered too late. Xone replaces e-mail threads, shared drives, and disconnected tools with a single platform: documents follow the ISO 19650 lifecycle (`WIP → Shared → Published`) with cryptographic traceability, design and construction managers each get a role-specific cockpit of KPIs, and coordination issues flow from the 3D model to the workshop. The prototype presented here runs entirely in the browser with realistic data from 8 live Baran projects.

### 12.3 Problem statements (one slide bullet each)

| # | Pain today | Xone's answer (implemented in prototype) |
|---|---|---|
| 1 | Documents scattered across e-mail, USB drives, and shared folders — "which revision is valid?" | Single CDE tree with ISO naming (`XON-1006-BRK-PH1-ARC-REVIT-MOD-R04.rvt`), revision history, SHA-256 hash, suitability codes (§6.6, §7 DocumentDossierModal) |
| 2 | Approval responsibilities unclear; SLAs slip silently | Role-based approval cartable with SLA countdowns, overdue warnings, and escalation actions (§6.8, KPI card 1/5 on both dashboards) |
| 3 | BIM clashes found on site, after they cost money | Discipline-pair risk matrix, clash register with severity/penetration data, and resolution trending (§6.7) |
| 4 | Managers see either *design* dashboards or *site* spreadsheets — never their own view | Two persona-specific home screens driven by the same project data (§3.3, §6.3–6.4) |
| 5 | Financial certificates (IPC) reconciled manually against progress | Interactive IPC spreadsheet with BIM-verified quantities per BOQ row (§7 ExcelIpcModal) |
| 6 | Executives can't compare projects at a glance | Portfolio with progress/budget/risk comparison across the whole holding (§6.5) |

### 12.4 Value pillars (slide-ready)

1. **One source of truth** — ISO 19650 CDE with naming convention, revision control, and traceability.
2. **Role-aware intelligence** — the same platform shows the Design Manager their approval queue and the Construction Manager their S-Curve.
3. **Prevention over correction** — clash coordination moved *before* site execution (80% resolution rate in demo data).
4. **Financial transparency** — IPC certificates linked to BIM-verified physical progress.
5. **Portfolio oversight** — 8 projects, one screen, comparable KPIs.

### 12.5 Differentiators worth claiming in the deck

- Built around **two organizational personas**, not one generic dashboard (demonstrated by the role-selection gate).
- Deep-linking between layers: a KPI card → the exact CDE folder; a clash histogram bar → the pre-filtered clash register; an approval row → the document dossier. This "every number is clickable" behaviour is the demo's signature moment.
- Localized for Iranian construction practice: Persian RTL, Jalali dates, Toman amounts, local consultant workflows — while keeping ISO 19650 terminology.

---

## 13. Feature → benefit inventory (slide content source)

| Feature (where it lives) | Benefit to quote |
|---|---|
| Role selection gate with 2 active personas + 2 "in development" (§6.2) | Shows product vision beyond current scope; roadmap is visible in the UI itself |
| 5 KPI cards per dashboard (§6.3–6.4) | "Managers open one page and know what needs action today" |
| S-Curve with baseline vs actual + deviation (§6.4) | "Early warning: −3.4% deviation surfaced automatically, not at month-end" |
| Clash heatmap matrix + register + presets (§6.7) | "From a red cell to the list of responsible clashes in one click" |
| Approval cartable with SLA timers & bulk actions (§6.8) | "Nothing waits longer than its SLA without an escalation" |
| Document dossier (hash, revisions, diff, QR block) (§7) | "Full forensic traceability for every drawing and model" |
| 2-step upload wizard with ISO naming matrix (§7) | "Compliance by construction — users can't name files wrongly" |
| IPC Excel modal with BIM reconciliation (§7) | "Payments verified against the model, not against paperwork" |
| Portfolio comparison (up to 3 projects) (§6.5) | "Board-level decisions on comparable data" |
| Permissions matrix + per-user overrides (§6.9) | "Governance that auditors can read" |
| Global search ⌘K, notifications, project switcher (§7) | "Enterprise-grade everyday ergonomics" |
| Full-width folder deep-links on support cards (§6.3–6.4) | "From any summary widget into the authoritative folder" |

---

## 14. Numbers to quote (demo-data figures — label them as such on slides)

All figures below are **fictional demo values** baked into `mockData.ts`; on slides, caption them "نمونه داده‌های پروژه باران" (sample Baran project data).

| Metric | Value | Source |
|---|---|---|
| Projects in portfolio | 8 | `PROJECTS` |
| Total built area across portfolio | 408,000 m² (stated on portfolio header, pre-removal of KPI cards — safe to reuse as a factoid) | design source |
| Controlled documents in CDE | 26 sample documents, "45 documents in the workflow" (UI copy) | `CDE_DOCUMENTS` / UI |
| Clash records modelled | 26 detailed records; UI aggregate: 60 total, 48 resolved (**80% resolution rate**), 12 open, 3 critical | `CLASHES` / UI |
| Design-manager KPIs | 78.5% physical progress (+1.2% w/w), 64% financial (4.3 of 6.8 Toman-trillion), 3 approvals < 24h SLA, 2 SLA-overdue docs | `DashboardView` |
| Construction-manager KPIs | 62.40% physical (baseline 65.8%, −3.4% deviation), 58.5% financial (3.4 of 5.8), 4 change orders (>1.25B Toman impact), week 44 of 68 | `ConstructionDashboardView` |
| IPC settlement shown | 3.4B Toman total paid; IPC #5 890M Toman in review | `ConstructionDashboardView` / IPC modal |
| Milestones | 3 of 8 done (design view), 3 of 7 done (construction view) | dashboards |
| Clash-resolution trend | 45 → 32 → 21 → 12 open over 4 weeks (−73%) | clash card |

---

## 15. Guided demo script (click path + narration)

A presenter can follow this exact path; each step maps to implemented behaviour.

1. **Login** — pick password or OTP; narrate "enterprise authentication, smart-card ready." *(LoginView)*
2. **Role gate** — "One platform, two worlds." Point out the two locked future modules as roadmap. Click **مدیر ارشد طراحی و CDE**. *(RoleSelectionView)*
3. **Portfolio** — "The whole holding at a glance." Use search or status chips, open the comparison modal briefly, then select **باران ۵ / برج آلفا**. *(PortfolioView)*
4. **Design Manager home** — sweep top-to-bottom: KPI row → approval worktable → click «بررسی» on the Revit row to open the **document dossier** (show hash + revision diff, then "open in 3D") → back to clash chart, click a histogram bar → **pre-filtered clash register** opens (the preset badge proves it). *(DashboardView → BIM)*
5. **CDE** — show the folder tree, the ISO naming, and the upload wizard's naming matrix (2 steps, never finishing the upload is fine). *(CdeFilesView / UploadModal)*
6. **Approvals cartable** — tabs, SLA badges, bulk selection. *(ApprovalsView)*
7. **⌘K global search** — type "چیلر" or "IPC" to show cross-repository search. *(GlobalSearchModal)*
8. **Switch persona** — via demo bar or role flow: pick **مدیر ساخت و کارگاه**, select a project → the **Construction home** loads. Walk the S-Curve (baseline vs actual, week-44 marker), the clash reduction histogram, milestones, and click one of the bottom-card buttons to deep-link into the exact CDE folder (`f-ph1-financial` or `f-doc-mom`). *(ConstructionDashboardView)*
9. **Close** on the IPC Excel modal or the permissions matrix, depending on the audience (finance vs. IT/governance).

Timing guide: full loop ≈ 12–15 minutes; the help modal inside the role screen (§6.2) already encodes the two official scenarios (design/BIM focus vs. site/finance focus) — use it as the in-app cheat sheet.

---

## 16. Roadmap signals (safe to present)

Visible in-product:

- Two locked role cards: **Commercial & Assets** (sales stack, buyer receivables) and **Hospitality & FM** (operations, preventive maintenance) — labelled "در دست توسعه".
- Multi-project governance already implied by the portfolio and permissions screens.

Engineering roadmap implied by §11 (prototype scope → production):

1. Real authentication + persistence (API layer; document state currently survives only in-session).
2. URL routing & shareable deep links.
3. Live BIM viewer (3D areas are currently branded image mocks).
4. Workflow engine for approvals (state machine replacing mock `APPROVAL_ITEMS`).
5. The two locked modules above.

---

## 17. Suggested deck outline (14 slides)

| # | Slide | Content source |
|---|---|---|
| 1 | Title — "Xone · یکپارچه‌ساز مدیریت ساخت باران" + CoP V 0.5 badge | §12.1, §8 palette |
| 2 | The problem — 6 pains of document/coordination chaos | §12.3 (pick 3–4) |
| 3 | The solution — one CDE, ISO 19650 lifecycle diagram (WIP→Shared→Published) | §12.2, §5 |
| 4 | Two personas, one platform — role-gate screenshot + persona cards | §6.2, §12.4-2 |
| 5 | Design Manager cockpit — KPI row + approval worktable screenshot | §6.3, §14 |
| 6 | Traceability — document dossier (hash, revisions, diff) screenshot | §7 |
| 7 | BIM coordination — heatmap matrix + clash register + −73% trend | §6.7, §14 |
| 8 | Construction Manager cockpit — S-Curve + milestones screenshot | §6.4, §14 |
| 9 | Financial control — IPC spreadsheet with BIM reconciliation | §7, §14 |
| 10 | Portfolio governance — comparison + permissions matrix | §6.5, §6.9 |
| 11 | Live demo interlude — "now let's click it" + demo script steps 4–8 | §15 |
| 12 | Architecture slide — thin-client React SPA, role-aware routing, extension-ready | §3, §10 |
| 13 | Roadmap — locked modules + production hardening plan | §16 |
| 14 | Close — value pillars recap + call to action | §12.4 |

Speaker-notes hint for AI generators: keep each slide to one claim + one screenshot + one number from §14; put everything else in appendix.

---

## 18. Visual asset inventory (for deck design)

**Screens to capture (1280×800, RTL):** login, role gate, portfolio grid, design dashboard (top & bottom halves), document dossier (details tab + diff tab), CDE folder tree + document table, upload wizard step 1 & 2, clash heatmap, clash register (pre-filtered), approvals cartable, construction dashboard (S-Curve section), IPC Excel modal (BOQ sheet), permissions matrix.

**Brand tokens:** primary `#005652`, container/action `#00716B`, secondary `#296862`, terracotta accent `#965335`, error `#BA1A1A`, light surface `#f7f9fb`, page `#E3E8EF`; fonts **Markazi Text** (headings/numerals) and **Vazirmatn** (body); Material Symbols icon set. Live site for reference: `https://rasmteam.github.io/xone-v0.5/`.

**Logos:** Baran Group logo and badge are currently hot-linked from Google's `aida` image CDN (URLs in `RoleSelectionView`, `Header`, `LoginView`) — re-host locally before print use.

---

## 19. Glossary (for deck writers unfamiliar with the domain)

| Term | Meaning |
|---|---|
| **CDE** | Common Data Environment — the single repository where project information is created, shared, and archived (ISO 19650) |
| **WIP / Shared / Published** | CDE lifecycle states: work-in-progress (author's sandbox) → shared (discipline coordination) → published (authoritative for wider team) |
| **ISO 19650** | International standard for information management over the asset lifecycle; drives Xone's naming, states, and governance UI |
| **Suitability code** | Marker of what a revision may be used for (e.g. S1 preliminary, S4 for construction) |
| **BIM / LOD 350** | Building Information Modelling; Level of Development 350 = elements modelled with connections and coordination-grade detail |
| **Clash / Clash matrix** | Detected interference between disciplines (e.g. duct vs beam); matrix = floors × discipline-pairs risk grid |
| **IPC** | Interim Payment Certificate — periodic payment application verified against physical progress |
| **BOQ** | Bill of Quantities — priced item list an IPC is measured against |
| **MoM** | Minutes of Meeting — technical/site coordination records (folder `f-doc-mom`) |
| **SLA** | Service Level Agreement — maximum allowed response time on approvals; overdue triggers escalation |
| **S-Curve** | Cumulative progress vs time curve; baseline (contract) vs actual (site) comparison |
| **WBS** | Work Breakdown Structure — phase/activity tree behind progress measurement |
| **Change Order** | Contractual instruction modifying scope/cost (4 active, >1.25B Toman impact in demo data) |
| **RACI** | Responsibility assignment matrix (Responsible/Accountable/Consulted/Informed) — appears as an XLSX sample in the CDE |
