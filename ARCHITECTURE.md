# Xone v0.5 — Project Architecture & Logic

> A complete technical walkthrough of the Xone CDE prototype: how it is structured, how navigation and state work, what each module does, and how to extend it.
> Companion document to `README.md` (which covers installation and scripts).

---

## 1. What this project is

Xone is a **single-page, front-end-only prototype** of a Construction Document Environment (CDE) platform for Baran Construction Group. It demonstrates how two distinct organizational personas interact with the same project data:

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

- `PROJECTS` — 8 flagship Baran projects (images resolved via `import.meta.env.BASE_URL`)
- `CDE_FOLDERS` — ISO-19650 folder tree (`f-doc`, `f-import`, `f-ph1` with discipline branches, `f-ph1-financial`, `f-ph2`, plus `f-doc-mom` for meeting minutes)
- `CDE_DOCUMENTS` — 26 documents across folders
- `DEFAULT_IPC_CERTIFICATE` — full IPC #5 payload
- `APPROVAL_ITEMS`, `CLASHES`, `ROLE_PERMISSIONS`, `USER_OVERRIDES`, `MILESTONES`

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
