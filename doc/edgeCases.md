# Edge Cases Reference — Resume Builder Application

> Cross-reference with: `implementationPlan.md`
> Use this file during coding to anticipate, handle, and test non-happy-path scenarios per phase.

---

## Phase 1 — Project Setup & Scaffolding

### 1.1 Monorepo / Workspace
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-1.1 | pnpm version mismatch | Older pnpm versions don't support `workspace:*` protocol | Pin `engines.pnpm` in root `package.json`; add `.npmrc` with `engine-strict=true` |
| EC-1.2 | Circular workspace dependency | `web` depends on `types`, `types` accidentally imports from `web` | Enforce one-way dependency in ESLint with `import/no-restricted-paths` |
| EC-1.3 | TypeScript path aliases not resolving in Vite | `@resume/types` import fails at runtime | Configure both `tsconfig.json` `paths` AND `vite.config.ts` `resolve.alias` |
| EC-1.4 | `pnpm dev` starts only one app | `concurrently` not installed at root | Add `concurrently` to root `devDependencies`; validate both servers start |

### 1.2 Environment & Config
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-1.5 | Missing `.env` file on fresh clone | App crashes with `undefined` env vars | Provide `.env.example` with all keys; fail fast with clear error if required vars absent |
| EC-1.6 | `.env` accidentally committed to Git | Secret leakage | Add `.env*` (except `.env.example`) to `.gitignore` before first commit |
| EC-1.7 | Port 5173 or 3000 already in use | Dev server fails to start silently | Document override via `--port`; add check in startup script |

---

## Phase 2 — Core Data Model & State

### 2.1 TypeScript Types
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-2.1 | Optional fields missing in partial resume | Runtime `undefined` access when user hasn't filled a section | All section arrays default to `[]`; all optional string fields default to `""` |
| EC-2.2 | Date fields stored as strings vs Date objects | Serialization inconsistency in JSON / localStorage | Store all dates as ISO 8601 strings; parse only at display time |
| EC-2.3 | `id` collision on `createResume` | Two resumes get the same UUID | Use `crypto.randomUUID()` (not `Math.random()`); assert uniqueness against `listResumes()` |

### 2.2 Zustand Store
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-2.4 | Store action called before store hydrated | Stale initial state on first render | Initialize store from localStorage synchronously in `create()` initializer |
| EC-2.5 | Concurrent store updates (rapid typing) | Race condition in async auto-save | Use debounce (500ms); ensure only one pending save per resume ID at a time |
| EC-2.6 | `removeWorkExperience` on empty array | Index out of bounds / silent no-op | Guard: `if (index < 0 || index >= state.workExperiences.length) return` |
| EC-2.7 | Zustand store not reset between resumes | Previous resume data bleeds into new resume | Always call `resetResume()` before `loadResume(id)` |

### 2.3 localStorage Persistence
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-2.8 | localStorage quota exceeded (~5MB) | `QuotaExceededError` thrown on save | Catch `QuotaExceededError`; show toast "Storage full — consider deleting old resumes"; optionally compress with LZ-string |
| EC-2.9 | Corrupted JSON in localStorage | `JSON.parse` throws, crashing the app | Wrap `loadResume` in try/catch; on parse failure, delete the key and return `null` |
| EC-2.10 | localStorage unavailable (private browsing / iframe) | `SecurityError` on access | Wrap all localStorage calls in a try/catch; gracefully fall back to in-memory only with a warning banner |
| EC-2.11 | User clears browser storage mid-session | Resume data lost while editor is open | On `storage` event, detect deletion; prompt user "Your saved data was cleared. Save to cloud?" |
| EC-2.12 | `listResumes` returns stale index | Resume deleted externally but index still references it | Validate each indexed key exists before returning; prune stale entries |

---

## Phase 3 — Form Editor (Sections)

### 3.1 Input Handling
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-3.1 | Extremely long text in name/title field | Overflows preview layout | Cap `PersonalInfo.name` at 100 chars; validate with Zod `max(100)` |
| EC-3.2 | Emoji or special Unicode in text fields | PDF renderer can't render emoji | Strip or replace unsupported characters before PDF export; warn user |
| EC-3.3 | Pasted HTML content in textarea | Raw HTML tags appear in preview / PDF | Sanitize paste events with `DOMPurify` or strip tags via regex |
| EC-3.4 | URL fields with invalid format | Broken hyperlinks in PDF | Validate with `z.string().url()` in Zod schema; show inline error |
| EC-3.5 | Phone number in non-standard formats | Inconsistent display across templates | Accept free-text; do not enforce format — user knows their locale |

### 3.2 Repeatable Sections (Work Experience, Education, Projects)
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-3.6 | User adds 20+ work experience entries | Page overflow in PDF; performance lag in preview | Soft warn at >6 entries: "This may overflow a single page resume"; no hard block |
| EC-3.7 | End date before start date | Invalid date range shown in resume | Validate: `endDate >= startDate`; if "Present" is selected as end date, skip comparison |
| EC-3.8 | "Currently working here" checkbox + end date both set | Confusing output | Disable end date field when "Present" checkbox is checked; clear `endDate` value |
| EC-3.9 | Drag-to-reorder on touch devices | Drag handle doesn't work on mobile | Test drag library (e.g., `@dnd-kit`) on iOS Safari and Android Chrome specifically |
| EC-3.10 | Deleting the only remaining entry | Section renders empty with no "Add" affordance | Always keep "Add entry" button visible even when list is empty |
| EC-3.11 | Duplicate section entries (same company + title) | Accidental duplication | No strict block; visually highlight duplicates with a warning badge |

### 3.3 Skills Section
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-3.12 | User adds 50+ skills | Skills section dominates resume layout | Soft cap at 20 skills with a warning; allow override |
| EC-3.13 | Same skill added twice | Duplicate tag visible | Case-insensitive deduplication on tag input |
| EC-3.14 | Skill name with comma (e.g., "C, C++") | Tag parser splits on comma, creating two tags | Trim and validate skill name; treat entire input (before Enter) as one tag |

### 3.4 Validation & Form State
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-3.15 | User submits with all fields empty | Empty resume PDF generated | Block PDF export if `personalInfo.name` is empty; all other sections optional |
| EC-3.16 | React Hook Form `defaultValues` not matching Zustand state on mount | Form shows stale/empty data | Always derive `defaultValues` from `useResumeStore()` synchronously at mount |
| EC-3.17 | User rapidly switches between sections | Pending unsaved changes in current section lost | Trigger `handleSubmit` (RHF) on section blur / navigation away |

---

## Phase 4 — Live Preview & Templates

### 4.1 Live Preview Rendering
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-4.1 | Preview renders before store is hydrated | Flash of empty resume | Show skeleton loader until `isHydrated` flag in store is `true` |
| EC-4.2 | Preview scroll desynced from editor | Frustrating UX | Debounce scroll sync (100ms); use `IntersectionObserver` to detect active section |
| EC-4.3 | Preview pane too narrow on split-screen | Template layout breaks at < 400px | Apply `scale(0.5)` CSS transform on preview container; maintain internal layout at full A4 width |
| EC-4.4 | Long unbreakable word overflows preview | Layout corruption | Apply `word-break: break-word` to all text nodes in templates |
| EC-4.5 | Preview not updating despite store change | React not re-rendering | Ensure template component subscribes to full `resumeState` (not deep destructured pieces) from store |

### 4.2 Template System
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-4.6 | Template switch loses scroll position | User disoriented | Reset preview scroll to top on template change |
| EC-4.7 | `templateId` in store references a deleted/renamed template | Crashes on render | Fallback to `'classic'` if `templateId` is not found in the templates registry |
| EC-4.8 | Template renders differently in Chromium vs Firefox vs Safari | CSS inconsistency | Test all templates in all 3 browsers; avoid `display: contents` and `gap` in flex fallbacks |
| EC-4.9 | User has no data filled (all sections empty) | Template renders with awkward empty sections | Hide empty sections entirely in templates; show no section headings if array is `[]` |

---

## Phase 5 — PDF Export

### 5.1 @react-pdf/renderer Limitations
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-5.1 | Unsupported CSS property used in PDF template | Silent style ignore, broken layout | Test every CSS property against `@react-pdf/renderer` docs; use only supported subset |
| EC-5.2 | Custom font fails to load (network error) | PDF falls back to Helvetica silently | Pre-load fonts at app startup; catch font load errors; show warning before export |
| EC-5.3 | Font file is too large (e.g., full CJK font) | PDF generation hangs or OOM | Use subset fonts; only include Latin character range unless CJK support is explicitly needed |
| EC-5.4 | PDF generation takes > 5 seconds | User thinks app is frozen | Show progress indicator; add 10-second timeout with user-visible error |
| EC-5.5 | `URL.createObjectURL` result not revoked | Memory leak after download | Call `URL.revokeObjectURL(url)` after `anchor.click()` in `usePdfExport` |

### 5.2 Content Edge Cases in PDF
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-5.6 | Resume content overflows one A4 page | Content is cut off | Use `@react-pdf/renderer`'s automatic page breaking (`wrap` prop); test with maxed-out content |
| EC-5.7 | Emoji in PDF | Renders as blank square | Strip emoji from all text before passing to PDF template; optionally convert to text equivalent |
| EC-5.8 | Very long single word (e.g., a URL) in description | PDF text overflows column | Apply `hyphenationCallback` or `break-word` equivalent in `@react-pdf/renderer` |
| EC-5.9 | Image (profile photo) in personal info | Image not loading from blob/data URL | Convert image to base64 data URL before embedding; validate dimensions (max 200×200px) |
| EC-5.10 | PDF downloaded with wrong filename | `John_resume.pdf` vs `undefined_resume.pdf` | Guard: `const name = personalInfo.name.trim() || 'My'`; filename = `${name}_resume.pdf` |

### 5.3 Browser Compatibility
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-5.11 | Safari blocks `URL.createObjectURL` download | Download silently fails | Detect Safari; use `<a href="data:...">` approach or open PDF in new tab |
| EC-5.12 | PDF opens in browser instead of downloading | User confused | Set `Content-Disposition: attachment` if server-side; on client, force via `anchor.download` attribute |

---

## Phase 6 — Backend API

### 6.1 Authentication
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-6.1 | Register with already-existing email | Silent overwrite or crash | Return `409 Conflict` with message "Email already registered" |
| EC-6.2 | Login with wrong password | Timing attack possible if short-circuit | Always run `bcrypt.compare` (even for non-existent user) to prevent timing oracle |
| EC-6.3 | Expired access token | API returns 401 on all requests | Frontend interceptor auto-calls `/api/auth/refresh`; if refresh also fails, force logout |
| EC-6.4 | Expired refresh token | User gets logged out | Return `401` with code `REFRESH_TOKEN_EXPIRED`; frontend clears tokens and redirects to login |
| EC-6.5 | Refresh token reuse (replay attack) | Attacker reuses stolen refresh token | Implement refresh token rotation: invalidate old token on every refresh; detect reuse → revoke all sessions |
| EC-6.6 | JWT with tampered payload | Bypasses auth | Always verify signature with `jsonwebtoken.verify()`; never decode without verify |
| EC-6.7 | Brute-force login attempts | Account enumeration / credential stuffing | Rate limit `/api/auth/login` to 5 req/min per IP; add exponential backoff after 3 failures |
| EC-6.8 | Concurrent login from multiple devices | Refresh token conflict | Use a token family approach or allow multiple valid refresh tokens per user |

### 6.2 Resume CRUD
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-6.9 | `PUT /api/resumes/:id` with malformed JSON body | Prisma throws on invalid `data` field | Validate request body with Zod before touching DB; return `400 Bad Request` |
| EC-6.10 | Resume `data` JSONB exceeds PostgreSQL limit (1GB) | DB error | Enforce max payload size: `express.json({ limit: '1mb' })`; return `413` if exceeded |
| EC-6.11 | Accessing resume with invalid UUID format | Prisma throws `PrismaClientValidationError` | Validate `:id` as UUID with Zod before query; return `400` |
| EC-6.12 | Accessing another user's resume | IDOR vulnerability | Always filter by `WHERE id = :id AND user_id = req.userId`; return `404` (not `403`) to avoid enumeration |
| EC-6.13 | `DELETE` followed immediately by `GET` on same ID | Race condition in tests | DB operations are serialized per connection; no special handling needed unless using distributed cache |
| EC-6.14 | User deletes account with active resumes | Orphaned resume rows | `ON DELETE CASCADE` on `resumes.user_id` FK handles this |

### 6.3 Database & Prisma
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-6.15 | DB connection pool exhausted under load | Requests hang indefinitely | Set `connection_limit` in `DATABASE_URL`; configure `PgBouncer` in transaction mode |
| EC-6.16 | Prisma migration fails in production | DB left in half-migrated state | Always run migrations in a transaction; use `prisma migrate deploy` which is idempotent |
| EC-6.17 | `updatedAt` not refreshed on update | Stale timestamp in response | Use Prisma `@updatedAt` decorator — it auto-updates on every `update` call |

---

## Phase 7 — Cloud Sync & Auth UI

### 7.1 Token & Session Management
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-7.1 | Access token expires while user is actively editing | Next API call returns 401 | Axios interceptor silently refreshes token; user never sees error |
| EC-7.2 | Both access and refresh tokens expired | User is effectively logged out | Clear all auth state; redirect to `/login` with message "Session expired, please log in again" |
| EC-7.3 | User opens app in two tabs | Auth state may diverge | Use `BroadcastChannel` API to sync logout/login events across tabs |
| EC-7.4 | Token stored in localStorage vs memory | XSS risk with localStorage | Store access token in memory (Zustand); store refresh token in `httpOnly` cookie |

### 7.2 Cloud Sync
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-7.5 | Merge conflict: same resume edited offline on two devices | One version overwrites the other | Compare `updatedAt` timestamps; if cloud version is newer, prompt user to choose which version to keep |
| EC-7.6 | Sync request fails mid-way (network drop) | Partial save / inconsistent state | Queue failed sync in a `pendingSync` list; retry with exponential backoff (max 3 retries) |
| EC-7.7 | User is offline and creates a new resume | Resume has no server ID yet | Assign a temporary local UUID prefixed `local_`; reconcile with server UUID after sync |
| EC-7.8 | First login with existing localStorage data | localStorage resumes not uploaded | On first successful login, iterate `listResumes()` and `POST` each to API |
| EC-7.9 | API returns resumes that were deleted locally | Deleted resume reappears | Track deletions with a `deletedIds` set in localStorage; filter out on merge |
| EC-7.10 | Auto-save fires on every keystroke | Floods API with PUT requests | Debounce cloud sync at 3 seconds (separate from localStorage 500ms debounce) |

### 7.3 Auth UI
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-7.11 | Double-submit login form | Two concurrent login requests | Disable submit button while request is in-flight; use `isSubmitting` from React Hook Form |
| EC-7.12 | User navigates to `/editor` while logged out | Unprotected route renders briefly | `<ProtectedRoute>` checks auth synchronously from store; redirect immediately before render |
| EC-7.13 | User is on the editor and logs out in another tab | Editor continues working but API calls fail | Listen for `BroadcastChannel` logout event; redirect to login with "You've been logged out" |
| EC-7.14 | Register form — passwords don't match | Zod `.refine()` fires correctly but message is unclear | Show error on `confirmPassword` field: "Passwords do not match" |
| EC-7.15 | Very long email address in header avatar | Overflows header layout | Truncate email with CSS `text-overflow: ellipsis`; show full email in tooltip |

---

## Phase 8 — Polish, Accessibility & Responsiveness

### 8.1 Responsive Layout
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-8.1 | User resizes browser from desktop → mobile mid-session | Layout collapses abruptly | Use CSS media queries, not JS resize listeners; layout transitions smoothly |
| EC-8.2 | iPad in landscape mode (~1024px) | Neither desktop nor mobile layout optimal | Add a tablet breakpoint (768–1024px) with adjusted column widths |
| EC-8.3 | Mobile browser virtual keyboard pushes layout up | Preview pane pushed off screen | Detect keyboard open via `visualViewport` API; hide preview pane when keyboard is visible |
| EC-8.4 | iOS Safari bottom bar overlaps content | Fixed footer buttons obscured | Add `env(safe-area-inset-bottom)` padding to bottom navigation |

### 8.2 Accessibility
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-8.5 | Screen reader announces form validation errors incorrectly | User doesn't know which field has an error | Add `aria-describedby` pointing to error message element; use `aria-invalid="true"` on errored inputs |
| EC-8.6 | Drag-and-drop for reordering inaccessible via keyboard | Keyboard users cannot reorder entries | Implement keyboard alternative: up/down arrow buttons on each entry |
| EC-8.7 | Color used as the sole indicator of state | Color-blind users miss status | Always pair color with an icon or text label (e.g., red border + "Error" text) |
| EC-8.8 | Modal dialog does not trap focus | Screen reader or tab key escapes modal | Use `focus-trap-react` or native `<dialog>` element for all modals |
| EC-8.9 | Toast notifications not announced to screen readers | User unaware of save/error events | Add `role="status"` and `aria-live="polite"` to the toast container |

### 8.3 Dark Mode
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-8.10 | User's OS changes theme mid-session | App doesn't respond | Listen to `prefers-color-scheme` media query change event; update theme reactively |
| EC-8.11 | User prefers light mode but OS is dark | No override option | Provide a manual theme toggle button; store preference in localStorage |
| EC-8.12 | Resume preview in dark mode shows dark background | Resume appears dark when printed | Always render the preview pane with `color-scheme: light` regardless of app theme |

### 8.4 Undo / Redo
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-8.13 | Undo past the initial state | History stack underflows | Guard: disable undo when `historyIndex === 0` |
| EC-8.14 | Redo after a new action | Redo stack should be cleared | On any new action, clear all forward history (standard undo/redo behavior) |
| EC-8.15 | Undo/redo across section switches | Undoing in Work Experience section undoes Personal Info change | Scope history globally to the full `ResumeState`; do not scope per-section |
| EC-8.16 | Auto-save triggers on each undo step | Floods localStorage with rapid saves | Debounce auto-save; do not save intermediate undo states |

---

## Phase 9 — Testing & QA

### 9.1 Unit Test Edge Cases
| # | Edge Case | Test Scenario |
|---|---|---|
| EC-9.1 | `loadResume` with corrupted JSON | Returns `null`, does not throw |
| EC-9.2 | `addWorkExperience` when list already has 10 entries | 11th entry is appended correctly |
| EC-9.3 | `usePdfExport` when `personalInfo.name` is empty | Filename defaults to `My_resume.pdf` |
| EC-9.4 | Store `resetResume` leaves no residual state | All arrays are `[]`, all strings are `""` |
| EC-9.5 | Zod schema rejects future `startDate` for education | Validation error returned |

### 9.2 Integration Test Edge Cases
| # | Edge Case | Test Scenario |
|---|---|---|
| EC-9.6 | Register with duplicate email | Returns `409`, no new user created |
| EC-9.7 | Access resume with valid JWT but wrong `user_id` | Returns `404` |
| EC-9.8 | Send `PUT` with `data` field exceeding 1MB | Returns `413` |
| EC-9.9 | Login after account deletion | Returns `401`, not `500` |
| EC-9.10 | Refresh with already-used refresh token | Returns `401 REFRESH_TOKEN_REUSED`, all sessions revoked |

### 9.3 E2E Test Edge Cases
| # | Edge Case | Test Scenario |
|---|---|---|
| EC-9.11 | User navigates away mid-form fill without saving | Unsaved changes warning shown (if implemented) |
| EC-9.12 | PDF download on slow network | Loading spinner visible; download completes |
| EC-9.13 | User fills 10 work experiences | PDF renders all on multiple pages without clipping |
| EC-9.14 | Offline → edit → online sync | All offline changes appear in dashboard after reconnect |

---

## Phase 10 — Deployment & CI/CD

### 10.1 Build & Bundle
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-10.1 | Environment variable not set in Vercel | `VITE_API_BASE_URL` is `undefined` in production build | Vite replaces `import.meta.env.*` at build time; missing vars produce `undefined` silently — add a startup check |
| EC-10.2 | Build fails due to TypeScript errors in CI | Deployment is blocked | Run `tsc --noEmit` as a required CI step before build |
| EC-10.3 | Prisma client not generated in CI | Runtime error: "Prisma client not initialized" | Add `prisma generate` as a `postinstall` script in `apps/api/package.json` |
| EC-10.4 | Vite build includes source maps in production | Exposes source code | Set `build.sourcemap: false` (or `'hidden'`) in `vite.config.ts` for production |

### 10.2 Database Migrations in Production
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-10.5 | Migration adds NOT NULL column without default | All existing rows fail constraint | Always provide a default value or run a two-step migration: add nullable → backfill → add NOT NULL |
| EC-10.6 | Migration runs twice (CI retries) | Duplicate migration error | `prisma migrate deploy` is idempotent — already-applied migrations are skipped |
| EC-10.7 | Migration runs while app is serving traffic | In-flight requests hit schema mismatch | Schedule migrations during low-traffic windows; use backward-compatible migrations |

### 10.3 Infrastructure
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-10.8 | Railway/Render cold start on free tier | First request times out (~30s) | Add a health-check ping via UptimeRobot every 5 minutes to keep dyno warm |
| EC-10.9 | Vercel function timeout on large PDF export | Export request times out | Ensure PDF export is client-side; if server-side, set function `maxDuration` to 30s in `vercel.json` |
| EC-10.10 | S3 bucket region mismatch | PDF upload fails with `301 Redirect` | Set `AWS_REGION` to match the bucket's actual region; use path-style URLs |

---

## Phase 11 — Post-Launch Hardening

### 11.1 Security
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-11.1 | XSS via resume content rendered in DOM | Attacker stores `<script>` tag | Never use `dangerouslySetInnerHTML` with user content; use React's default text rendering |
| EC-11.2 | CSRF on state-mutating endpoints | Attacker tricks user into submitting form | API uses JWT Bearer tokens (not cookies); CSRF is not applicable; if cookies are used, add `SameSite=Strict` |
| EC-11.3 | Open redirect after login | `?redirect=/api/resumes` sends user to API | Validate redirect URL is a relative path on the same origin before redirecting |
| EC-11.4 | `Content-Security-Policy` blocks `@react-pdf/renderer` blob | PDF generation fails in production | Allow `blob:` in CSP `default-src`; test CSP in staging before pushing to prod |
| EC-11.5 | Sensitive data in error messages | Stack traces exposed to client | Never forward raw error messages in production API responses; log server-side, return generic message |

### 11.2 Observability
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-11.6 | Sentry captures PII (email, resume content) in error payloads | Privacy violation | Configure Sentry `beforeSend` hook to scrub known PII fields from payloads |
| EC-11.7 | Log volume exceeds free tier in production | Logs start dropping | Set log level to `warn` in production; only log `error` and above by default |
| EC-11.8 | Unhandled promise rejection not caught by Sentry | Silent failure | Add global `process.on('unhandledRejection')` handler in Node.js entry point |

### 11.3 Load & Reliability
| # | Edge Case | What Can Go Wrong | Handling |
|---|---|---|---|
| EC-11.9 | DB connection pool exhausted during load spike | Requests queue indefinitely | Set `statement_timeout = 5000ms` in PostgreSQL; return `503` when pool is full |
| EC-11.10 | Memory leak in Puppeteer (server-side PDF) | Server OOM crashes | Close browser instance after each PDF job; use a browser pool with max size limit |
| EC-11.11 | Backup restoration takes too long | Extended downtime during incident | Test restore procedure in staging monthly; document RTO/RPO in runbook |

---

## Cross-Phase Edge Cases

These scenarios span multiple phases and should be considered throughout development.

| # | Scenario | Affected Phases | Handling |
|---|---|---|---|
| EC-X.1 | User with very long name (100+ chars) | 3, 4, 5 | Truncate in templates; validate max length in form |
| EC-X.2 | Resume with ALL sections empty | 3, 4, 5 | Block PDF export; show "Fill in at least your name to export" |
| EC-X.3 | Simultaneous edit on two browser tabs | 2, 7 | Last write wins for localStorage; cloud sync resolves by `updatedAt` |
| EC-X.4 | User on slow 3G connection | 5, 6, 7 | All UI actions must show loading states; no silent failures |
| EC-X.5 | User with disabled JavaScript | All | App requires JS; show `<noscript>` message: "This app requires JavaScript" |
| EC-X.6 | User uses browser back/forward buttons | 3, 4 | React Router handles this; ensure no state loss on navigation |
| EC-X.7 | Session timeout during PDF export | 5, 7 | Token refresh happens transparently; if export is client-side, auth is irrelevant |
| EC-X.8 | App deployed with stale frontend (cached) against new API | 10, 11 | Version frontend assets with content hash (Vite default); add API version header check |
| EC-X.9 | User with adblocker blocking API requests | 6, 7 | Show clear error: "Something is blocking network requests. Try disabling your adblocker." |
| EC-X.10 | Right-to-left (RTL) language content in resume | 4, 5 | Templates do not currently support RTL; document as known limitation for v1 |
