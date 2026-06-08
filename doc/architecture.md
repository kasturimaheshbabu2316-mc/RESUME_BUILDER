# Architecture Document — Resume Builder Application

## 1. Overview

The Resume Builder is a full-stack web application that allows users to create, customize, preview, and export professional resumes. Users can fill in structured sections (personal info, experience, education, skills, etc.), choose from multiple templates, and download their resume as a PDF.

---

## 2. Goals & Non-Goals

### Goals
- Enable users to create and manage multiple resumes
- Provide live preview of the resume as the user types
- Support multiple professional templates
- Export resume to PDF and optionally to DOCX
- Persist user data (local storage or cloud-based)
- Be mobile-responsive and accessible (WCAG 2.1 AA)

### Non-Goals
- Job board / job application tracking (out of scope v1)
- LinkedIn / GitHub profile import (future enhancement)

---

## 3. System Architecture

### 3.1 High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                        │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────────────┐ │
│  │  Form Editor │──▶│  State Store │──▶│   Live Preview Pane │ │
│  │  (Sections)  │   │  (Zustand /  │   │   (React render)    │ │
│  └──────────────┘   │   Context)   │   └─────────────────────┘ │
│                     └──────┬───────┘                           │
│                            │                                   │
│                     ┌──────▼───────┐                           │
│                     │  PDF Export  │                           │
│                     │ (react-pdf / │                           │
│                     │  html2canvas)│                           │
│                     └──────────────┘                           │
└─────────────────────────────┬───────────────────────────────────┘
                              │ REST / GraphQL API (optional cloud sync)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Backend (Optional)                      │
│  ┌───────────────┐   ┌──────────────┐   ┌────────────────────┐ │
│  │  Auth Service │   │  Resume CRUD │   │  PDF Generation    │ │
│  │  (JWT / OAuth)│   │  API Routes  │   │  Service (Puppeteer│ │
│  └───────────────┘   └──────────────┘   │  / wkhtmltopdf)    │ │
│                                         └────────────────────┘ │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Database (PostgreSQL)                    │  │
│  │    users | resumes | sections | templates | exports       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Frontend Architecture

### 4.1 Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite | Fast HMR, modern React features |
| Language | TypeScript | Type safety across forms and state |
| Styling | Tailwind CSS | Utility-first, easy theming |
| State Management | Zustand | Lightweight, no boilerplate |
| Routing | React Router v6 | SPA navigation |
| PDF Export | `@react-pdf/renderer` | Component-based PDF generation |
| Form Handling | React Hook Form | Performant, uncontrolled forms |
| Schema Validation | Zod | End-to-end type-safe validation |

### 4.2 Directory Structure

```
src/
├── assets/               # Static images, fonts, icons
├── components/
│   ├── editor/           # Form section components
│   │   ├── PersonalInfo.tsx
│   │   ├── WorkExperience.tsx
│   │   ├── Education.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   └── Certifications.tsx
│   ├── preview/          # Live preview rendering
│   │   ├── ResumePreview.tsx
│   │   └── templates/
│   │       ├── ClassicTemplate.tsx
│   │       ├── ModernTemplate.tsx
│   │       └── MinimalTemplate.tsx
│   ├── ui/               # Reusable UI primitives (Button, Input, Modal)
│   └── layout/           # AppShell, Sidebar, Header
├── hooks/                # Custom React hooks
│   ├── useResumeStore.ts
│   ├── usePdfExport.ts
│   └── useAutoSave.ts
├── pages/
│   ├── HomePage.tsx
│   ├── EditorPage.tsx
│   ├── TemplatesPage.tsx
│   └── LoginPage.tsx
├── store/
│   └── resumeStore.ts    # Zustand global state
├── types/
│   └── resume.ts         # Shared TypeScript interfaces
├── utils/
│   ├── pdfExport.ts
│   └── localStorageSync.ts
├── App.tsx
└── main.tsx
```

### 4.3 State Model

```typescript
// types/resume.ts
interface ResumeState {
  id: string;
  meta: {
    title: string;
    templateId: string;
    createdAt: string;
    updatedAt: string;
  };
  personalInfo: PersonalInfo;
  workExperiences: WorkExperience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
}
```

### 4.4 Data Flow

```
User Input (Form Field)
        │
        ▼
React Hook Form (local field state)
        │  onChange / onBlur
        ▼
Zustand Store (resumeStore.updateSection)
        │
        ├──▶ localStorage (auto-save via useAutoSave hook)
        │
        └──▶ Live Preview (React re-renders ResumePreview)
                  │
                  └──▶ PDF Export (on-demand via usePdfExport)
```

---

## 5. Backend Architecture (Optional Cloud Sync)

> The app works fully offline via localStorage. The backend is required only for multi-device sync, account management, and server-side PDF generation.

### 5.1 Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express.js / Fastify |
| Language | TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + Refresh Tokens (or Auth0) |
| PDF Service | Puppeteer (headless Chrome) |
| File Storage | AWS S3 / Cloudflare R2 (for exported PDFs) |

### 5.2 API Endpoints

#### Authentication
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Invalidate refresh token |

#### Resumes
| Method | Path | Description |
|---|---|---|
| GET | `/api/resumes` | List all resumes for user |
| POST | `/api/resumes` | Create new resume |
| GET | `/api/resumes/:id` | Get single resume |
| PUT | `/api/resumes/:id` | Update resume |
| DELETE | `/api/resumes/:id` | Delete resume |

#### Export
| Method | Path | Description |
|---|---|---|
| POST | `/api/resumes/:id/export/pdf` | Generate and return PDF |
| POST | `/api/resumes/:id/export/docx` | Generate and return DOCX |

### 5.3 Database Schema

```sql
-- Users
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT,                    -- NULL if OAuth
  provider    TEXT,                    -- 'local' | 'google' | 'github'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Resumes
CREATE TABLE resumes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  template_id TEXT NOT NULL DEFAULT 'classic',
  data        JSONB NOT NULL,          -- Full ResumeState JSON
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Export Log
CREATE TABLE exports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id   UUID REFERENCES resumes(id) ON DELETE CASCADE,
  format      TEXT NOT NULL,           -- 'pdf' | 'docx'
  storage_url TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. Template System

Templates are React components that receive `ResumeState` as props and render a styled layout. The same component is used for both live preview (DOM) and PDF export (`@react-pdf/renderer` version).

```
templates/
├── classic/
│   ├── ClassicTemplate.tsx       (DOM / preview)
│   └── ClassicTemplatePDF.tsx    (@react-pdf version)
├── modern/
│   ├── ModernTemplate.tsx
│   └── ModernTemplatePDF.tsx
└── minimal/
    ├── MinimalTemplate.tsx
    └── MinimalTemplatePDF.tsx
```

### Template Interface

```typescript
interface TemplateProps {
  resume: ResumeState;
  scale?: number;  // for preview zoom
}
```

---

## 7. PDF Export Strategy

Two approaches depending on deployment mode:

| Mode | Approach | Pros | Cons |
|---|---|---|---|
| Client-only | `@react-pdf/renderer` | No server needed | Limited CSS support |
| Server-side | Puppeteer (headless Chrome) | Pixel-perfect | Requires Node server |

Default: client-side with `@react-pdf/renderer`. Server-side available as premium option.

---

## 8. Security Considerations

- All API endpoints authenticated via JWT Bearer token
- Resume data owned strictly per `user_id` (row-level authorization)
- Passwords hashed with `bcrypt` (cost factor 12)
- HTTPS enforced in production
- Rate limiting on auth endpoints (5 req/min)
- Input sanitization via Zod schemas on both client and server
- CORS restricted to known frontend origins

---

## 9. Deployment Architecture

```
┌──────────────┐      ┌───────────────────────┐
│   Vercel     │      │   Railway / Render     │
│  (Frontend)  │─────▶│   (Backend API)        │
│  React SPA   │      │   Node.js + Prisma     │
└──────────────┘      └──────────┬────────────┘
                                 │
                      ┌──────────▼────────────┐
                      │   Supabase / Neon      │
                      │   (PostgreSQL DB)      │
                      └───────────────────────┘
```

### Environment Variables

```env
# Frontend (.env)
VITE_API_BASE_URL=https://api.resumebuilder.com
VITE_APP_ENV=production

# Backend (.env)
DATABASE_URL=postgresql://user:pass@host:5432/resumedb
JWT_SECRET=<secret>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
AWS_S3_BUCKET=resume-exports
AWS_REGION=us-east-1
```

---

## 10. Key Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| State management | Zustand over Redux | Less boilerplate, sufficient for this scope |
| PDF export | Client-side first | No server cold-start latency; works offline |
| Data persistence | localStorage + optional DB | Works offline, upgrades gracefully to cloud |
| Template rendering | Separate DOM and PDF components | PDF renderer has different constraints than DOM |
| Monorepo vs multi-repo | Monorepo (pnpm workspaces) | Shared types between frontend and backend |

---

## 11. AI Integration — Groq LLM

The application uses **Groq** as the LLM provider for AI-assisted resume content generation. Groq's LPU (Language Processing Unit) inference engine delivers ultra-fast token generation, making it ideal for real-time interactive content suggestions.

### 11.1 Why Groq

| Factor | Groq Advantage |
|---|---|
| Speed | LPU hardware delivers 10–100x faster inference than GPU-based providers |
| Cost | Significantly cheaper per token compared to OpenAI / Anthropic |
| Latency | Sub-second response times enable real-time typing suggestions |
| Models | Supports Llama 3, Mixtral, and other open-weight models |
| API Compatibility | OpenAI-compatible chat completions API (drop-in replacement) |

### 11.2 AI Features

| Feature | Description | Model |
|---|---|---|
| Summary Generator | Generate a professional summary from work experience + skills | `llama-3.3-70b-versatile` |
| Bullet Point Enhancer | Rewrite vague descriptions into impactful, ATS-friendly bullets | `llama-3.3-70b-versatile` |
| Skill Suggestions | Suggest relevant skills based on job title and experience | `llama-3.1-8b-instant` |
| Content Improver | Improve grammar, tone, and clarity of any text field | `llama-3.3-70b-versatile` |
| Job-Tailored Resume | Optimize resume content for a specific job description | `llama-3.3-70b-versatile` |

### 11.3 Architecture

```
┌──────────────────────────────────────────────────┐
│                 Frontend (React)                  │
│  ┌─────────────────────────────────────────────┐ │
│  │  AI Suggestion Button (per field / section) │ │
│  │         │                                    │ │
│  │         ▼                                    │ │
│  │  useAiSuggestions() hook                     │ │
│  │   - Debounced request to backend             │ │
│  │   - Streaming response display               │ │
│  │   - Accept / Reject / Edit UI               │ │
│  └─────────┬───────────────────────────────────┘ │
└────────────┼─────────────────────────────────────┘
             │  POST /api/ai/suggest
             ▼
┌──────────────────────────────────────────────────┐
│              Backend (Express API)                │
│  ┌─────────────────────────────────────────────┐ │
│  │  AI Route: /api/ai/suggest                  │ │
│  │   - Validates request with Zod               │ │
│  │   - Rate-limits per user (10 req/min)        │ │
│  │   - Constructs system + user prompt           │ │
│  │   - Calls Groq API via groq-sdk              │ │
│  │   - Streams response back to client          │ │
│  └─────────┬───────────────────────────────────┘ │
└────────────┼─────────────────────────────────────┘
             │  HTTPS
             ▼
┌──────────────────────────────────────────────────┐
│              Groq Cloud API                       │
│  Endpoint: https://api.groq.com/openai/v1/       │
│  Auth: Bearer token (GROQ_API_KEY)               │
│  Models: llama-3.3-70b-versatile, etc.           │
└──────────────────────────────────────────────────┘
```

### 11.4 Backend AI Service

```typescript
// apps/api/src/services/groqService.ts
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

interface SuggestParams {
  prompt: string
  systemPrompt: string
  model?: string
  maxTokens?: number
  stream?: boolean
}

export async function generateSuggestion({
  prompt,
  systemPrompt,
  model = 'llama-3.3-70b-versatile',
  maxTokens = 1024,
  stream = false,
}: SuggestParams) {
  return groq.chat.completions.create({
    model,
    max_tokens: maxTokens,
    stream,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
  })
}
```

### 11.5 Frontend AI Hook

```typescript
// apps/web/src/hooks/useAiSuggestions.ts
interface UseAiSuggestionsReturn {
  suggest: (context: AiSuggestContext) => Promise<string>
  isGenerating: boolean
  error: string | null
  streamingText: string
}

type AiSuggestContext =
  | { type: 'summary'; resumeData: ResumeState }
  | { type: 'bullet'; workEntry: WorkExperience }
  | { type: 'skills'; jobTitle: string; existingSkills: string[] }
  | { type: 'improve'; text: string; fieldName: string }
  | { type: 'tailor'; resumeData: ResumeState; jobDescription: string }
```

### 11.6 Prompt Engineering Strategy

All prompts follow a consistent structure:
1. **System prompt** — Sets the persona ("expert resume writer") and output constraints (JSON, bullet format, max length)
2. **Context injection** — Passes relevant resume sections as structured context
3. **User instruction** — Specific ask ("Generate a 2-sentence professional summary")
4. **Output format** — Always request structured JSON to enable Accept/Reject UI

### 11.7 Rate Limiting & Cost Control

| Control | Limit | Reason |
|---|---|---|
| Per-user rate limit | 10 requests / minute | Prevent abuse |
| Daily quota | 50 suggestions / user / day | Cost control |
| Max tokens per request | 1024 (default) | Prevent runaway costs |
| Request size limit | 4KB prompt payload | Prevent abuse |

### 11.8 Environment Variables

```env
# Backend (.env)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
GROQ_MODEL_DEFAULT=llama-3.3-70b-versatile
GROQ_MODEL_FAST=llama-3.1-8b-instant
GROQ_DAILY_QUOTA=50
```

### 11.9 Error Handling

| Error | Handling |
|---|---|
| `GROQ_API_KEY` missing | Disable AI features silently; hide "AI Suggest" buttons |
| Rate limit exceeded (429) | Show toast: "AI quota exceeded. Try again in a minute." |
| Model timeout (> 10s) | Retry once, then show "AI is busy. Try again." |
| Invalid response format | Fall back to raw text display |
| Network error | Show "AI unavailable" toast; do not block editing |

---

## 12. Future Enhancements

- LinkedIn profile import via OAuth
- Resume ATS (Applicant Tracking System) score analyzer
- Collaborative editing (real-time via WebSockets / CRDTs)
- Cover letter builder with linked resume data
- Analytics dashboard (views, downloads per resume)
- Multi-language resume support (AI-powered translation via Groq)
- AI interview prep based on resume content

---

## 13. Glossary

| Term | Definition |
|---|---|
| Resume | A structured document containing personal and professional information |
| Template | A visual layout component that renders resume data |
| Section | A logical grouping of resume fields (e.g., Work Experience) |
| Export | The action of converting the resume to a downloadable file (PDF/DOCX) |
| ATS | Applicant Tracking System — software used by employers to filter resumes |
| Groq | AI inference platform using LPU hardware for ultra-fast LLM serving |
| LPU | Language Processing Unit — Groq's custom silicon for AI inference |
