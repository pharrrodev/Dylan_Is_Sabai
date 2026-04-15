# Technical Report: Dylan Is Sabai (DIS) Web Application

| Field | Value |
| --- | --- |
| **Document type** | Application technical report |
| **Product** | Dylan Is Sabai — UK creator financial cockpit (MVP UI) |
| **Repository** | `dylan-is-sabai` |
| **Report date** | 15 April 2026 |
| **Primary stack** | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |

---

## 1. Executive summary

Dylan Is Sabai is a browser-based **minimum viable product (MVP)** for a UK-oriented financial “intelligence command” interface aimed at independent creators. The current implementation delivers a **fixed-layout dashboard shell**, an **executive summary** view driven by **in-memory demo constants**, a **client-side ledger** with categorised income and expense entries, and a **placeholder HMRC sandbox** screen with no live API integration.

The application is suitable for **demonstration, design validation, and front-end iteration**. It does **not** persist ledger data to a server, perform authenticated HMRC calls, or provide tax or legal advice.

---

## 2. Purpose and scope

### 2.1 Stated product intent

The broader product vision (see `docs/PRD.md`) positions DIS as a label-as-a-service (LaaS) platform with MTD-aligned tax workflows, banking aggregation, and additional modules. **This report describes only what is implemented in the codebase today.**

### 2.2 In-scope (implemented)

- Server-rendered **App Router** pages under `app/`.
- Global **dashboard chrome**: sidebar navigation and main content region (`DashboardShell`).
- **Executive Summary** (`/`): KPI cards, personal allowance progress (demo), links to Ledger and HMRC Auth.
- **Ledger** (`/ledger`): add/remove entries, categories, optional attachments (images/PDF), running net total; **Spendable Cash** derived from static MTD demo parameters in `lib/mtd-demo.ts` (not from the editable ledger list).
- **HMRC Auth** (`/hmrc-auth`): static UI copy and non-functional action buttons (no OAuth, no sandbox API).

### 2.3 Out of scope (not implemented)

- User accounts, authentication, and session management.
- Database persistence, APIs, or server actions for financial data.
- Live HMRC Developer Hub or MTD API integration.
- Open banking (e.g. Plaid, TrueLayer) or bank feeds.
- Automated tax filing, obligations scheduling, or compliance guarantees.

---

## 3. System architecture

### 3.1 High-level structure

The application follows the **Next.js App Router** convention: each route is a React Server Component by default unless marked with `"use client"`. The root layout wraps all routes in a shared shell component.

```text
Browser
  └── Next.js (React 19)
        ├── Server Components: pages, layout, ExecutiveSummary (data from lib)
        └── Client Components: SidebarNav, LedgerCockpit (local state)
```

### 3.2 Layout and navigation

- **`app/layout.tsx`**: Defines document metadata, loads Google fonts (Inter, Space Grotesk, Geist Mono, Playfair Display), applies global `dark` styling, and wraps `children` with `DashboardShell`.
- **`components/intelligence-command/dashboard-shell.tsx`**: Two-column layout — fixed-width sidebar (`aside`) and flexible main area. Visual design follows a “no-line” tonal separation between regions.
- **`components/intelligence-command/sidebar-nav.tsx`**: Client component using `usePathname` for active route highlighting. Routes: `/`, `/ledger`, `/hmrc-auth`.

### 3.3 Routing map

| Path | Source | Rendering |
| --- | --- | --- |
| `/` | `app/page.tsx` | Server; embeds `ExecutiveSummary` |
| `/ledger` | `app/ledger/page.tsx` | Server; embeds `LedgerCockpit` (client) |
| `/hmrc-auth` | `app/hmrc-auth/page.tsx` | Server; static content and buttons |

Pages accept `searchParams` as a `Promise` (Next.js 16 async request APIs pattern) and `await` it where declared, keeping compatibility with the framework’s typing without using query parameters in the current UI.

---

## 4. Technology stack

| Layer | Technology | Notes |
| --- | --- | --- |
| Framework | Next.js **16.2.2** | App Router, `next.config.ts` enables **React Compiler** |
| UI library | React **19.2.4** | Server and client components |
| Language | TypeScript **5** | Strict typing in components and `lib/` |
| Styling | Tailwind CSS **4** | Utility-first; `@tailwindcss/postcss` |
| Components | shadcn-style patterns, **Radix UI**, **CVA**, **tailwind-merge** | Shared primitives under `components/ui/` |
| Icons | **lucide-react** | Consistent stroke-based icon set |
| Linting | ESLint 9 with **eslint-config-next** | `npm run lint` |

---

## 5. Key modules and data flow

### 5.1 Executive summary (`lib/executive-summary-demo.ts`)

Demo constants model year-to-date income, expenses, a flat **estimated tax rate** (26% in code comments: illustrative blended Income Tax + Class 4 NI), and a static **ledger actions logged** count. Derived helpers compute:

- Total profit (income minus expenses).
- Estimated tax (zero if profit is non-positive).
- Progress toward a static **UK personal allowance** figure (£12,570) for UI progress display — **not** a full tax computation engine.

Currency display uses `formatGbp` from `lib/mtd-demo.ts` (`Intl.NumberFormat` en-GB, GBP).

### 5.2 MTD demo parameters (`lib/mtd-demo.ts`)

Separate constants define **income YTD** and **tax vault reserve rate** for the “Spendable Cash” pill on the Ledger page:

- `taxVaultReserve()` = income × rate.
- `spendableCash()` = income − reserve.

These values are **decoupled** from the ledger’s running total in `LedgerCockpit`; product owners should treat this as intentional for the demo or as a known consistency gap to resolve when wiring real data.

### 5.3 Ledger cockpit (`components/ledger/ledger-cockpit.tsx`)

- **State**: React `useState` holds the list of entries; initial data is **seeded in memory** (`SEED_ENTRIES`).
- **Entry model**: `id`, `description`, `amount`, `kind` (`income` | `expense`), `categoryLabel`, `dateIso`, optional `attachment` (object URL for user-selected files).
- **Categories**: Curated lists for creator-relevant income and music production expenses.
- **UX**: Quick description chips, file attach with validation, modal preview (image via `next/image`, PDF via `iframe`), Escape to close preview, cleanup of object URLs on unmount.

### 5.4 HMRC Auth page

Presents messaging that interaction is confined to the **HMRC Developer Sandbox** conceptually; **no network calls** to HMRC are implemented. Buttons are presentational only.

---

## 6. Security, privacy, and compliance posture (current build)

| Topic | Status |
| --- | --- |
| Authentication | None |
| Data persistence | None (refresh clears client-side ledger changes except where browser behaviour applies) |
| PII | User-supplied descriptions and attachments exist only in browser memory; no upload pipeline |
| HMRC | No tokens, no API client, no submission path |
| Tax accuracy | **Demo figures and simplified maths only** — not suitable for filing or advisory use |

Any production deployment would require a full threat model, secure handling of financial and identity data, and integration with HMRC’s official APIs and user consent flows.

---

## 7. Build, run, and quality

### 7.1 Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development server (Turbopack in default Next 16 dev workflow) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

### 7.2 Configuration highlights

- **`next.config.ts`**: `reactCompiler: true` for automated memoisation and related optimisations via `babel-plugin-react-compiler`.
- **Fonts**: Loaded through `next/font/google` for self-hosting and layout stability.

---

## 8. Known limitations and technical debt

1. **Demo vs live data**: Executive figures and ledger list are not synchronised; replacing demo modules with a single source of truth is a prerequisite for a coherent product.
2. **No backend**: No multi-user support, audit trail, or backup of entries.
3. **HMRC module**: UI-only; integration would require OAuth 2.0, test user setup, and MTD API versioning per HMRC documentation.
4. **Accessibility**: Partial patterns exist (e.g. `aria-label`, progressbar semantics); a formal WCAG audit is not evidenced in the repository.

---

## 9. Related documentation

| Artifact | Role |
| --- | --- |
| `docs/PRD.md` | Product vision and future feature set (broader than current code) |
| `DESIGN.md` | Design system notes (referenced in component comments) |
| `README.md` | Generic Next.js bootstrap instructions |
| `AGENTS.md` | Contributor guidance for this Next.js major version |

---

## 10. Conclusion

The Dylan Is Sabai web application is a **polished front-end MVP** demonstrating an executive-style financial cockpit for UK creators, with a functional **local-only ledger prototype** and **placeholder compliance UX**. Engineering effort to reach production would centre on **data layer design**, **authentication**, **HMRC sandbox and production API integration**, and **alignment of all monetary displays** to one authoritative ledger or accounting service.

---

*End of report.*
