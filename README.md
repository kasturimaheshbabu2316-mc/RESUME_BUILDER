# Resume Builder

A modern, full-featured resume builder application with live preview, PDF export, and cloud sync capabilities.

**Features:**
- 📝 6-section form editor (Personal Info, Work Experience, Education, Skills, Projects, Certifications)
- 👁️ Real-time live preview with 3 professional templates (Classic, Modern, Minimal)
- 📄 Client-side PDF export with font embedding
- 💾 Auto-save to localStorage with debounced writes
- 📱 Fully responsive with mobile edit/preview toggle
- 🎨 Dark mode support
- ⚡ Built with React 18, Vite 6, TypeScript, Zustand, and Tailwind CSS

---

## Quick Start

### Prerequisites
- Node.js ≥ 20.0.0
- pnpm ≥ 8.0.0 (or use corepack)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd resume

# Enable corepack for pnpm
corepack enable

# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000 (Phase 6+)

---

## Project Structure

```
resume/
├── apps/
│   ├── web/              # React frontend (Vite + TypeScript)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── editor/     # Form section components
│   │   │   │   ├── layout/     # AppShell, SectionNav
│   │   │   │   ├── preview/    # ResumePreview, Templates
│   │   │   │   └── ui/         # Reusable UI primitives
│   │   │   ├── hooks/          # Custom hooks (useResumeStore, usePdfExport)
│   │   │   ├── pages/          # Route components
│   │   │   ├── schemas/        # Zod validation schemas
│   │   │   ├── store/          # Zustand store
│   │   │   ├── test/           # Unit tests
│   │   │   └── utils/          # Utilities (localStorage, PDF)
│   │   └── package.json
│   └── api/              # Express backend (Phase 6+)
│       ├── prisma/           # Database schema
│       └── src/
├── packages/
│   └── types/            # Shared TypeScript types
├── doc/                  # Documentation
│   ├── architecture.md
│   ├── implementationPlan.md
│   ├── edgeCases.md
│   └── deploymentPlan.md
├── vercel.json           # Vercel deployment config
└── pnpm-workspace.yaml   # Monorepo workspace config
```

---

## Development

### Available Scripts

```bash
# Start both frontend and backend
pnpm dev

# Build all packages
pnpm build

# Run type checking
pnpm type-check

# Run tests
pnpm test

# Lint code
pnpm lint

# Clean build artifacts
pnpm clean
```

### Frontend Only

```bash
# Start frontend dev server
pnpm --filter web dev

# Build frontend
pnpm --filter web build

# Preview production build
pnpm --filter web preview
```

---

## Deployment to Vercel

### Prerequisites
1. Push your code to GitHub
2. Create a Vercel account: https://vercel.com/signup

### Method 1: Vercel Dashboard (Recommended)

1. **Import Project**
   - Go to https://vercel.com/dashboard
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

2. **Configure Build Settings**
   The `vercel.json` file auto-configures these settings:
   - **Framework:** Vite
   - **Build Command:** `corepack pnpm install && corepack pnpm --filter @resume-builder/types build && corepack pnpm --filter web build`
   - **Output Directory:** `apps/web/dist`
   - **Install Command:** `corepack pnpm install`

3. **Environment Variables** (Optional)
   ```
   VITE_API_BASE_URL=https://your-api-domain.com
   ```
   Leave empty for localStorage-only mode (current phase).

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2 minutes)
   - Your app is live!

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Post-Deployment Checklist

- [ ] Homepage loads successfully
- [ ] Editor creates new resumes
- [ ] All 6 form sections work
- [ ] Live preview updates in real-time
- [ ] PDF download generates valid file
- [ ] Mobile responsive (test on phone or DevTools)
- [ ] No console errors in browser DevTools

---

## Environment Variables

### Frontend (apps/web/.env.local)

```env
# API Base URL (leave empty for localStorage mode)
VITE_API_BASE_URL=
```

### Backend (apps/api/.env)

See `apps/api/.env.example` for template.

---

## Technology Stack

### Frontend
- **React 18** - UI library
- **Vite 6** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **React Router v6** - Client-side routing
- **React Hook Form + Zod** - Form validation
- **@react-pdf/renderer** - PDF generation

### Backend (Phase 6+)
- **Express.js** - HTTP server
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT + bcrypt** - Authentication

### DevOps
- **pnpm** - Package manager (monorepo)
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting (Phase 6+)
- **Supabase** - PostgreSQL database (Phase 6+)

---

## Current Progress

✅ **Phase 1:** Project Setup & Scaffolding  
✅ **Phase 2:** Core Data Model & State  
✅ **Phase 3:** Form Editor (Sections)  
✅ **Phase 4:** Live Preview & Templates  
✅ **Phase 5:** PDF Export  

⏳ **Phase 6:** Backend API (Next)  
⏳ **Phase 7:** Cloud Sync & Auth UI  
⏳ **Phase 8:** Polish, A11y & Responsiveness  
⏳ **Phase 9:** Testing & QA  
⏳ **Phase 10:** Deployment & CI/CD  
⏳ **Phase 11:** Post-Launch Hardening  

---

## Documentation

- [Architecture Design](doc/architecture.md)
- [Implementation Plan](doc/implementationPlan.md)
- [Edge Cases Reference](doc/edgeCases.md)
- [Deployment Guide](doc/deploymentPlan.md)

---

## License

MIT

---

## Support

For issues or questions, please create an issue in the GitHub repository.
