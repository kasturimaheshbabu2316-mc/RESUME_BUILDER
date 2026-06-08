# Phase-Wise Implementation Plan — Resume Builder Application

> Based on: `architecture.md`
> Total Estimated Duration: **~10–12 weeks** (solo developer) / **~5–6 weeks** (2-person team)

---

## Phase Overview

| Phase | Name | Duration | Deliverable |
|---|---|---|---|
| 1 | Project Setup & Scaffolding | Week 1 | Runnable skeleton app |
| 2 | Core Data Model & State | Week 1–2 | Resume state + persistence |
| 3 | Form Editor (Sections) | Week 2–3 | Fully functional editor UI |
| 4 | Live Preview & Templates | Week 3–4 | 3 working templates + live preview |
| 5 | PDF Export | Week 4–5 | Client-side PDF download |
| 6 | Backend API | Week 5–7 | Auth + Resume CRUD endpoints |
| 7 | Cloud Sync & Auth UI | Week 7–8 | Login/Register + cloud save |
| 8 | Polish, A11y & Responsiveness | Week 8–9 | Mobile-ready, accessible UI |
| 9 | Testing & QA | Week 9–10 | Unit + integration + E2E tests |
| 10 | Deployment & CI/CD | Week 10–11 | Live on Vercel + Railway |
| 11 | Post-Launch Hardening | Week 11–12 | Monitoring, rate limiting, logging |

---

## Phase 1 — Project Setup & Scaffolding

**Goal:** Bootstrap the monorepo with all tooling configured and a runnable shell app.

### Tasks

- [ ] **1.1** Initialize pnpm monorepo workspace
  ```
  resume/
  ├── apps/
  │   ├── web/       (React + Vite frontend)
  │   └── api/       (Node.js backend)
  └── packages/
      └── types/     (Shared TypeScript types)
  ```

- [ ] **1.2** Scaffold frontend with Vite + React + TypeScript
  ```bash
  pnpm create vite apps/web --template react-ts
  ```

- [ ] **1.3** Scaffold backend with Express + TypeScript
  ```bash
  mkdir apps/api ; cd apps/api ; pnpm init
  pnpm add express typescript ts-node @types/express
  ```

- [ ] **1.4** Install and configure frontend dependencies
  - Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`)
  - Zustand
  - React Router v6
  - React Hook Form
  - Zod
  - `@react-pdf/renderer`

- [ ] **1.5** Install and configure backend dependencies
  - Prisma + PostgreSQL client
  - `jsonwebtoken`, `bcrypt`
  - `cors`, `helmet`, `express-rate-limit`
  - `dotenv`

- [ ] **1.6** Configure shared `packages/types` package with `tsconfig` path aliases

- [ ] **1.7** Set up ESLint + Prettier with shared config across workspaces

- [ ] **1.8** Initialize Git repository with `.gitignore` (node_modules, .env, dist)

- [ ] **1.9** Add root-level `pnpm-workspace.yaml` and `package.json` scripts:
  - `pnpm dev` → starts both web and api concurrently
  - `pnpm build` → builds both
  - `pnpm lint` → lints all

### Exit Criteria
- `pnpm dev` runs without errors
- Blank React app visible at `localhost:5173`
- API server responds at `localhost:3000/health`

---

## Phase 2 — Core Data Model & State

**Goal:** Define all TypeScript interfaces and wire up the Zustand store with localStorage persistence.

### Tasks

- [ ] **2.1** Define all shared TypeScript interfaces in `packages/types/resume.ts`
  ```typescript
  PersonalInfo, WorkExperience, Education,
  Skill, Project, Certification, ResumeState, ResumeMeta
  ```

- [ ] **2.2** Create Zustand store at `apps/web/src/store/resumeStore.ts`
  - Actions: `updatePersonalInfo`, `addWorkExperience`, `updateWorkExperience`,
    `removeWorkExperience`, `addEducation`, `updateSkills`, etc.
  - `createResume`, `loadResume`, `resetResume`

- [ ] **2.3** Implement `useAutoSave` hook
  - Debounced (500ms) write to `localStorage` on every store change
  - Key: `resume_<id>`

- [ ] **2.4** Implement `localStorageSync.ts` utility
  - `saveResume(state: ResumeState): void`
  - `loadResume(id: string): ResumeState | null`
  - `listResumes(): ResumeMeta[]`
  - `deleteResume(id: string): void`

- [ ] **2.5** Add `useResumeStore` custom hook as the single access point to the store

- [ ] **2.6** Write unit tests for store actions and localStorage utilities

### Exit Criteria
- Resume state persists across page refreshes via localStorage
- All CRUD operations on store sections work correctly
- TypeScript compiles with zero errors

---

## Phase 3 — Form Editor (Sections)

**Goal:** Build all editor form sections that write into the Zustand store.

### Tasks

- [ ] **3.1** Build `AppShell` layout with sidebar + main content area

- [ ] **3.2** Build reusable UI primitives (`apps/web/src/components/ui/`)
  - `Input`, `Textarea`, `Button`, `Badge`, `Card`, `Modal`, `Tooltip`
  - All styled with Tailwind CSS

- [ ] **3.3** Implement `PersonalInfo.tsx` section
  - Fields: Full name, email, phone, location, LinkedIn URL, portfolio URL, summary

- [ ] **3.4** Implement `WorkExperience.tsx` section
  - Repeatable entries: company, title, start/end date, description (bullet points)
  - Add / remove / reorder entries (drag handle)

- [ ] **3.5** Implement `Education.tsx` section
  - Repeatable entries: institution, degree, field, start/end, GPA (optional)

- [ ] **3.6** Implement `Skills.tsx` section
  - Tag-based input, skill level selector (Beginner / Intermediate / Expert)
  - Grouping by category (optional)

- [ ] **3.7** Implement `Projects.tsx` section
  - Fields: name, description, tech stack, URL, GitHub link

- [ ] **3.8** Implement `Certifications.tsx` section
  - Fields: name, issuer, date, credential URL

- [ ] **3.9** Implement section navigation (accordion or tab-based sidebar)

- [ ] **3.10** Wire all section components to `useResumeStore` via React Hook Form's
  `defaultValues` + `watch` / `setValue` pattern

- [ ] **3.11** Add Zod validation schemas for each section; show inline field errors

### Exit Criteria
- All 6 sections render and accept input
- Changes immediately update the Zustand store
- Validation errors appear on blur/submit
- Data survives page refresh

---

## Phase 4 — Live Preview & Templates

**Goal:** Render a real-time resume preview panel using template components.

### Tasks

- [ ] **4.1** Build `ResumePreview.tsx` — right-side panel that renders selected template

- [ ] **4.2** Implement **Classic Template** (`ClassicTemplate.tsx`)
  - Traditional layout: name/contact header, left-aligned sections, divider lines

- [ ] **4.3** Implement **Modern Template** (`ModernTemplate.tsx`)
  - Two-column layout: sidebar (skills, contact) + main (experience, education)

- [ ] **4.4** Implement **Minimal Template** (`MinimalTemplate.tsx`)
  - Clean single-column, generous whitespace, sans-serif typography

- [ ] **4.5** Build `TemplatesPage.tsx`
  - Grid of template thumbnails with preview
  - One-click template switch (updates `meta.templateId` in store)

- [ ] **4.6** Add `scale` prop to templates for zoom control in preview pane

- [ ] **4.7** Sync preview scroll position with editor scroll position

- [ ] **4.8** Add "A4 paper" outline / shadow in preview for realism

- [ ] **4.9** Implement toggle between **Edit mode** and **Preview mode** on mobile

### Exit Criteria
- Preview updates in real-time as user types (< 100ms visible lag)
- All 3 templates render without errors
- Template switch is instant and preserves all data

---

## Phase 5 — PDF Export

**Goal:** Allow users to download their resume as a pixel-accurate PDF.

### Tasks

- [ ] **5.1** Create PDF versions of all 3 templates using `@react-pdf/renderer`
  - `ClassicTemplatePDF.tsx`, `ModernTemplatePDF.tsx`, `MinimalTemplatePDF.tsx`
  - Map Tailwind styles → `StyleSheet.create` equivalents

- [ ] **5.2** Implement `usePdfExport` hook
  ```typescript
  const { exportPdf, isExporting } = usePdfExport(resumeState, templateId)
  ```
  - Uses `pdf()` from `@react-pdf/renderer` → `Blob` → `URL.createObjectURL`
  - Triggers browser download with filename `<name>_resume.pdf`

- [ ] **5.3** Add "Download PDF" button in header with loading spinner state

- [ ] **5.4** Implement `pdfExport.ts` utility (font embedding, image handling)

- [ ] **5.5** Register and embed custom fonts (e.g., Inter, Lato) in PDFs via
  `Font.register()` from `@react-pdf/renderer`

- [ ] **5.6** Test PDF output across all 3 templates for layout fidelity

- [ ] **5.7** (Optional) Add "Copy shareable link" (base64-encoded URL for offline share)

### Exit Criteria
- Clicking "Download PDF" produces a well-formatted, correctly named PDF
- All 3 templates export faithfully
- Fonts render correctly in the PDF

---

## Phase 6 — Backend API

**Goal:** Build the REST API for authentication and resume cloud storage.

### Tasks

- [ ] **6.1** Set up Prisma with PostgreSQL
  ```bash
  pnpm add prisma @prisma/client
  npx prisma init
  ```

- [ ] **6.2** Define Prisma schema (`schema.prisma`) for `User`, `Resume`, `Export` tables
  (as per `architecture.md` § 5.3)

- [ ] **6.3** Run initial migration
  ```bash
  npx prisma migrate dev --name init
  ```

- [ ] **6.4** Implement Auth routes (`apps/api/src/routes/auth.ts`)
  - `POST /api/auth/register` — hash password with bcrypt, create user, return JWT
  - `POST /api/auth/login` — verify password, return access + refresh tokens
  - `POST /api/auth/refresh` — validate refresh token, return new access token
  - `POST /api/auth/logout` — invalidate refresh token

- [ ] **6.5** Implement JWT middleware (`apps/api/src/middleware/auth.ts`)
  - Verifies Bearer token on every protected route
  - Attaches `req.userId` for downstream handlers

- [ ] **6.6** Implement Resume CRUD routes (`apps/api/src/routes/resumes.ts`)
  - `GET /api/resumes` — list resumes for `req.userId`
  - `POST /api/resumes` — create new resume
  - `GET /api/resumes/:id` — get (with ownership check)
  - `PUT /api/resumes/:id` — update (with ownership check)
  - `DELETE /api/resumes/:id` — delete (with ownership check)

- [ ] **6.7** Implement Export routes (`apps/api/src/routes/exports.ts`)
  - `POST /api/resumes/:id/export/pdf` — server-side PDF via Puppeteer

- [ ] **6.8** Add global error handler middleware with structured JSON error responses

- [ ] **6.9** Add `helmet`, `cors`, `express-rate-limit` middleware

- [ ] **6.10** Write integration tests for all API routes using `supertest`

### Exit Criteria
- All auth endpoints return correct tokens and status codes
- Resume CRUD enforces ownership (user cannot access another user's resume)
- Rate limiting blocks >5 auth requests/min
- All integration tests pass

---

## Phase 7 — Cloud Sync & Auth UI

**Goal:** Connect the frontend to the backend API for account management and multi-device sync.

### Tasks

- [ ] **7.1** Build `LoginPage.tsx` — email/password login form with Zod validation

- [ ] **7.2** Build `RegisterPage.tsx` — registration form with confirm password check

- [ ] **7.3** Implement `authStore.ts` (Zustand slice)
  - State: `user`, `accessToken`, `isAuthenticated`
  - Actions: `login`, `logout`, `refreshToken`

- [ ] **7.4** Implement `apiClient.ts` (axios instance)
  - Attach `Authorization: Bearer <token>` header
  - Auto-refresh token on 401 response (interceptor)

- [ ] **7.5** Implement `useCloudSync` hook
  - On login: fetch all resumes from API, merge with localStorage
  - On resume save: debounced `PUT /api/resumes/:id` (3 second debounce)

- [ ] **7.6** Build `ResumeDashboard.tsx` (replaces simple `HomePage.tsx`)
  - List of saved resumes with thumbnail, edit, duplicate, delete actions
  - "Create New Resume" button

- [ ] **7.7** Add protected route wrapper (`<ProtectedRoute>`) for editor/dashboard

- [ ] **7.8** Add user menu in header: avatar, email, logout button

- [ ] **7.9** Graceful offline mode: fall back to localStorage if API unreachable,
  show "Offline — changes saved locally" toast

### Exit Criteria
- Users can register, log in, and log out
- Resumes sync to the cloud on save
- Dashboard lists all user resumes
- Offline fallback works transparently

---

## Phase 8 — Polish, Accessibility & Responsiveness

**Goal:** Ensure the app is production-quality across all screen sizes and accessible to all users.

### Tasks

- [ ] **8.1** Responsive layout: stack editor + preview vertically on screens < 768px

- [ ] **8.2** Implement mobile navigation (bottom tab bar or hamburger menu)

- [ ] **8.3** Audit and fix keyboard navigation across all interactive elements

- [ ] **8.4** Add ARIA labels, roles, and `aria-live` regions for dynamic content

- [ ] **8.5** Ensure color contrast ratios meet WCAG 2.1 AA (4.5:1 for normal text)

- [ ] **8.6** Add focus-visible outlines (remove default outline only where custom applied)

- [ ] **8.7** Implement dark mode (Tailwind `dark:` variant + system preference detection)

- [ ] **8.8** Add loading skeletons for async operations (resume fetch, PDF generation)

- [ ] **8.9** Add toast notification system (`react-hot-toast` or custom) for:
  - Save success/failure
  - Export complete
  - Auth errors
  - Offline status

- [ ] **8.10** Polish template thumbnails in template picker with accurate mini-renders

- [ ] **8.11** Add undo/redo support in the editor (Zustand middleware or `immer` patch history)

### Exit Criteria
- App is fully usable on 375px (iPhone SE) screen
- All interactive elements reachable and operable via keyboard
- Lighthouse Accessibility score ≥ 90
- Dark mode renders without contrast issues

---

## Phase 9 — Testing & QA

**Goal:** Achieve confident test coverage across unit, integration, and end-to-end layers.

### Tasks

#### Unit Tests (Vitest + React Testing Library)
- [ ] **9.1** `resumeStore.ts` — all actions and selectors
- [ ] **9.2** `localStorageSync.ts` — save, load, list, delete
- [ ] **9.3** `usePdfExport` hook — mock `@react-pdf/renderer`, assert blob creation
- [ ] **9.4** All form section components — render, input, validation error display
- [ ] **9.5** Template components — snapshot tests for each template × each section filled

#### Integration Tests (Supertest)
- [ ] **9.6** Auth flow: register → login → refresh → logout
- [ ] **9.7** Resume CRUD: create → read → update → delete
- [ ] **9.8** Authorization: user A cannot access user B's resume (expect 403)
- [ ] **9.9** Export endpoint: returns PDF buffer with correct Content-Type

#### End-to-End Tests (Playwright)
- [ ] **9.10** New user journey: register → create resume → fill all sections → download PDF
- [ ] **9.11** Returning user: login → view dashboard → edit existing resume → cloud sync
- [ ] **9.12** Offline mode: disconnect network → edit resume → reconnect → verify sync
- [ ] **9.13** Template switch: change template → verify preview updates → re-export PDF

### Coverage Targets
| Layer | Target |
|---|---|
| Unit (frontend) | ≥ 80% line coverage |
| Unit (backend) | ≥ 85% line coverage |
| Integration | All happy paths + key error paths |
| E2E | All 4 critical user journeys |

### Exit Criteria
- All tests pass in CI
- No P0/P1 bugs outstanding
- PDF output visually verified against design mockups

---

## Phase 10 — Deployment & CI/CD

**Goal:** Ship the application to production with automated pipelines.

### Tasks

- [ ] **10.1** Create `.github/workflows/ci.yml`
  - Trigger: push to `main` and all PRs
  - Jobs: lint → type-check → unit tests → integration tests

- [ ] **10.2** Deploy frontend to **Vercel**
  - Connect GitHub repo, set `apps/web` as root directory
  - Set `VITE_API_BASE_URL` environment variable

- [ ] **10.3** Deploy backend to **Railway** (or Render)
  - Connect GitHub repo, set `apps/api` as root directory
  - Set all backend environment variables (see `architecture.md` § 9)

- [ ] **10.4** Provision **Supabase** (or Neon) PostgreSQL database
  - Run `npx prisma migrate deploy` as part of deployment pipeline

- [ ] **10.5** Set up **AWS S3** bucket (or Cloudflare R2) for exported PDF storage
  - Configure CORS policy on bucket
  - Add bucket name + credentials to backend env vars

- [ ] **10.6** Configure custom domain (if applicable) + SSL via Vercel/Railway

- [ ] **10.7** Add `health-check` endpoint `GET /health` on API for uptime monitoring

- [ ] **10.8** Set up uptime monitoring (UptimeRobot or Better Uptime — free tier)

- [ ] **10.9** Add deployment preview environments for PRs via Vercel

### Exit Criteria
- `main` branch auto-deploys to production on merge
- PRs get preview URLs
- All CI checks must pass before merge is allowed
- Production URL is live and all features work end-to-end

---

## Phase 11 — Post-Launch Hardening

**Goal:** Observe, stabilize, and harden the production system.

### Tasks

- [ ] **11.1** Integrate error monitoring (**Sentry** — free tier)
  - Frontend: `@sentry/react`
  - Backend: `@sentry/node`

- [ ] **11.2** Add structured request logging on backend (`pino` or `winston`)
  - Log: method, path, status, response time, userId (if authenticated)

- [ ] **11.3** Implement database connection pooling (PgBouncer or Prisma connection limit)

- [ ] **11.4** Add `Content-Security-Policy` headers on frontend (via Vercel headers config)

- [ ] **11.5** Perform security audit:
  - Run `pnpm audit` — fix all high/critical vulnerabilities
  - Test for SQL injection via Prisma parameterized queries (confirm)
  - Test JWT secret strength + expiry

- [ ] **11.6** Set up database backup schedule (daily automated backups via Supabase/Neon)

- [ ] **11.7** Load test critical endpoints (`k6` or `autocannon`)
  - Target: `POST /api/resumes` sustains 100 req/s at < 200ms p95

- [ ] **11.8** Document runbook: how to roll back a bad deployment, restore DB, rotate secrets

### Exit Criteria
- Sentry capturing errors in production
- No unhandled promise rejections or uncaught exceptions in logs
- Load test passes targets
- Security audit shows zero high/critical issues

---

## Dependency Graph

```
Phase 1 (Setup)
    └── Phase 2 (State)
            ├── Phase 3 (Editor)
            │       └── Phase 4 (Preview)
            │               └── Phase 5 (PDF Export)
            │
            └── Phase 6 (Backend API)
                    └── Phase 7 (Cloud Sync + Auth UI)

Phase 3 + Phase 4 + Phase 5 + Phase 7 ──▶ Phase 8 (Polish)
Phase 8 ──▶ Phase 9 (Testing)
Phase 9 ──▶ Phase 10 (Deployment)
Phase 10 ──▶ Phase 11 (Hardening)
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `@react-pdf/renderer` CSS limitations cause template drift | High | Medium | Maintain separate DOM + PDF template components |
| Puppeteer cold start too slow for server-side export | Medium | Low | Default to client-side PDF; server-side as optional upgrade |
| localStorage quota exceeded for large resumes | Low | Medium | Compress with LZ-string before storing |
| JWT secret leakage | Low | High | Use strong 256-bit secret; rotate quarterly; never commit to Git |
| Supabase free tier connection limit hit | Medium | Medium | Enable PgBouncer; upgrade plan at scale |
| Prisma migration conflicts in CI/CD | Medium | Medium | Always run `prisma migrate deploy` (not `dev`) in production |

---

## Appendix — Milestone Summary

| Milestone | End of Phase | Shippable? |
|---|---|---|
| M1: Working editor with localStorage | Phase 3 | Internal demo |
| M2: Full resume creation + PDF download | Phase 5 | Beta / MVP |
| M3: Accounts + cloud sync | Phase 7 | Public beta |
| M4: Production-ready release | Phase 10 | v1.0 launch |
| M5: Hardened, monitored, load-tested | Phase 11 | v1.1 stable |
