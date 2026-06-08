# Deployment Plan — Resume Builder Application

> **Last Updated:** June 2026  
> **Project Stage:** Phase 5 Complete (PDF Export)  
> **Target Platforms:** Vercel (Frontend) + Railway (Backend)

---

## 1. Deployment Architecture Overview

### Current Architecture (Phase 5)
```
┌─────────────────────────────────────┐
│         User's Browser              │
│   React SPA (Vite + React)          │
│   └─ localStorage persistence       │
│   └─ Client-side PDF export         │
└─────────────────────────────────────┘
         ↕ (no backend yet)
```

### Target Architecture (Phase 7+)
```
┌──────────────────────┐         ┌──────────────────────┐
│   Vercel (Frontend)  │         │  Railway (Backend)   │
│                      │   HTTP  │                      │
│  React SPA           │────────▶│  Express.js API      │
│  • Static assets     │         │  • Auth (JWT)        │
│  • Client-side logic │◀────────│  • Resume CRUD       │
│  • PDF generation    │         │  • PostgreSQL DB     │
└──────────────────────┘         └──────────────────────┘
         ↕                              ↕
┌──────────────────────┐         ┌──────────────────────┐
│   Custom Domain      │         │   Supabase/Neon DB   │
│   resume-builder.io  │         │   PostgreSQL 15+     │
└──────────────────────┘         └──────────────────────┘
```

---

## 2. Deployment Phases

### Phase A: Frontend-Only Deployment (NOW — Phase 5 Complete)
**When:** Immediately after Phase 5 completion  
**What:** Deploy `apps/web` to Vercel  
**Why:** Share working MVP with users, collect feedback

#### Prerequisites
- [x] TypeScript compiles with zero errors
- [x] Dev server runs locally (`pnpm dev`)
- [x] All features work with localStorage
- [x] PDF export generates valid files

#### Deployment Steps

##### Step 1: Prepare Repository
```bash
# 1. Ensure Git repository is initialized
git status

# 2. Commit all current changes
git add .
git commit -m "feat: complete Phase 5 - PDF export ready for deployment"

# 3. Push to GitHub
git push origin main
```

##### Step 2: Configure Vercel Project
1. **Sign in to Vercel:** https://vercel.com/dashboard
2. **Click "New Project"**
3. **Import Git Repository:**
   - Select your GitHub account
   - Find `resume` repository
   - Click "Import"

4. **Configure Build Settings:**
   ```
   Framework Preset: Vite
   Root Directory: apps/web
   Build Command: pnpm build
   Output Directory: apps/web/dist
   Install Command: corepack pnpm install
   ```

5. **Environment Variables:** (leave empty for now)
   - No backend API yet, so no `VITE_API_BASE_URL` needed

6. **Click "Deploy"**

##### Step 3: Verify Deployment
- [ ] Vercel build completes successfully (~2-3 minutes)
- [ ] Preview URL works: `https://resume-xxx.vercel.app`
- [ ] All editor sections functional
- [ ] PDF download works
- [ ] Console shows no errors

##### Step 4: Custom Domain (Optional)
```bash
# 1. Add domain in Vercel Dashboard
#    Settings → Domains → Add Domain

# 2. Configure DNS (example: Namecheap)
#    Type: CNAME
#    Host: @
#    Value: cname.vercel-dns.com

# 3. Wait for DNS propagation (up to 48 hours)
```

##### Step 5: Share & Test
- Share preview URL with beta testers
- Collect feedback on UX, template designs, PDF quality
- Monitor Vercel Analytics for usage patterns

#### Estimated Time: **30-45 minutes**

---

### Phase B: Backend API Deployment (Phase 6-7 Complete)
**When:** After auth + cloud sync implemented  
**What:** Deploy `apps/api` to Railway  
**Why:** Enable multi-device sync, user accounts

#### Prerequisites
- [ ] Prisma schema defined (`apps/api/prisma/schema.prisma`)
- [ ] Auth endpoints tested locally
- [ ] Resume CRUD endpoints tested locally
- [ ] PostgreSQL database provisioned

#### Step 1: Provision PostgreSQL Database

**Option A: Supabase (Recommended)**
1. Sign up: https://supabase.com
2. Create new project
3. Go to **Project Settings → Database**
4. Copy **Connection string** (URI format):
   ```
   postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
5. Enable **Connection Pooling** (Transaction mode, port 6543)

**Option B: Neon**
1. Sign up: https://neon.tech
2. Create new project
3. Copy connection string from dashboard

#### Step 2: Deploy Backend to Railway

1. **Sign in to Railway:** https://railway.app
2. **Click "New Project" → "Deploy from GitHub repo"**
3. **Configure:**
   ```
   Root Directory: apps/api
   Build Command: corepack pnpm install && corepack pnpm --filter api build
   Start Command: corepack pnpm --filter api start
   ```

4. **Add Environment Variables:**
   ```env
   # Database
   DATABASE_URL=postgresql://... (from Supabase/Neon)

   # JWT Secrets
   JWT_ACCESS_SECRET=<generate-strong-256-bit-secret>
   JWT_REFRESH_SECRET=<generate-different-strong-secret>
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d

   # CORS
   ALLOWED_ORIGINS=https://your-domain.vercel.app,https://resume-builder.io

   # Node Environment
   NODE_ENV=production
   PORT=3000
   ```

5. **Deploy**

6. **Run Database Migrations:**
   ```bash
   # In Railway shell or locally with Railway CLI
   railway run -- npx prisma migrate deploy
   ```

7. **Verify Deployment:**
   - Visit `https://your-api.railway.app/health`
   - Should return: `{"status":"ok","timestamp":"..."}`
   - Test auth endpoints with Postman/curl

#### Step 3: Configure Frontend for Backend

1. **Add Environment Variable to Vercel:**
   ```
   VITE_API_BASE_URL=https://your-api.railway.app
   ```

2. **Update Vite Config** (if not already done):
   ```typescript
   // apps/web/vite.config.ts
   export default defineConfig({
     server: {
       proxy: {
         '/api': {
           target: process.env.VITE_API_BASE_URL || 'http://localhost:3000',
           changeOrigin: true,
         },
       },
     },
   })
   ```

3. **Redeploy Frontend:**
   ```bash
   git commit -m "chore: configure API URL for production"
   git push origin main
   ```

#### Estimated Time: **1-2 hours**

---

### Phase C: Production Hardening (Phase 10-11)
**When:** Before public launch  
**What:** CI/CD, monitoring, security

#### Checklist

##### CI/CD Pipeline
- [ ] Create `.github/workflows/ci.yml`
- [ ] Jobs: lint → type-check → unit tests → build
- [ ] Branch protection: require CI pass before merge
- [ ] Vercel preview deployments for PRs (automatic)

##### Monitoring & Error Tracking
- [ ] **Sentry Integration:**
  ```bash
  # Frontend
  pnpm add @sentry/react @sentry/vite-plugin
  
  # Backend
  pnpm add @sentry/node @sentry/tracing
  ```
- [ ] Configure DSN in environment variables
- [ ] Test error capture with sample errors

##### Logging
- [ ] **Backend structured logging:**
  ```bash
  pnpm add pino pino-http
  ```
- [ ] Log format: `{"method":"GET","path":"/api/resumes","status":200,"responseTime":45,"userId":"..."}`

##### Security Audit
- [ ] Run `pnpm audit` — fix high/critical vulnerabilities
- [ ] Verify JWT secret strength (min 256 bits)
- [ ] Test rate limiting on auth endpoints
- [ ] Configure Content-Security-Policy headers
- [ ] Enable HTTPS (automatic on Vercel/Railway)

##### Database Backups
- [ ] **Supabase:** Automatic daily backups (enable in settings)
- [ ] **Neon:** Point-in-time recovery (built-in)
- [ ] Document restore procedure

##### Load Testing
```bash
# Install k6
brew install k6

# Run load test
k6 run scripts/load-test.js

# Target: POST /api/resumes sustains 100 req/s at < 200ms p95
```

##### Runbook Documentation
Create `doc/runbook.md` with:
- How to roll back a bad deployment
- How to restore database from backup
- How to rotate JWT secrets
- How to scale database connections

#### Estimated Time: **1-2 days**

---

## 3. Environment Variables Reference

### Frontend (`apps/web/.env.local`)
```env
# Development (local)
VITE_API_BASE_URL=http://localhost:3000

# Production (Vercel)
VITE_API_BASE_URL=https://api.resume-builder.io
```

### Backend (`apps/api/.env`)
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/resume_db

# JWT
JWT_ACCESS_SECRET=<256-bit-random-string>
JWT_REFRESH_SECRET=<different-256-bit-random-string>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://resume-builder.io

# Server
NODE_ENV=production
PORT=3000

# PDF Storage (Phase 7+)
AWS_S3_BUCKET=resume-exports
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_REGION=us-east-1
```

### Generate Strong Secrets
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Run twice: once for ACCESS_SECRET, once for REFRESH_SECRET
```

---

## 4. Cost Estimation

### Free Tier (Development / Beta)
| Service | Tier | Cost | Limits |
|---------|------|------|--------|
| Vercel | Hobby | **$0** | 100 GB bandwidth, 1M serverless requests |
| Railway | Trial | **$5/month** | $5 credit, enough for low traffic |
| Supabase | Free | **$0** | 500 MB database, 2 GB bandwidth |
| Sentry | Free | **$0** | 5K errors/month |
| **Total** | | **~$5/month** | |

### Production Tier (100-1000 users)
| Service | Tier | Cost |
|---------|------|------|
| Vercel | Pro | **$20/month** |
| Railway | Standard | **$10-20/month** |
| Supabase | Pro | **$25/month** |
| Sentry | Team | **$26/month** |
| **Total** | | **~$80/month** |

### Scale (>1000 users)
- Upgrade Supabase to Team plan ($50/month)
- Add Redis for session caching ($15/month)
- Upgrade Sentry to Business ($80/month)
- **Total: ~$200-300/month**

---

## 5. Rollback Procedures

### Frontend Rollback (Vercel)
```bash
# 1. View deployments
vercel deployments ls

# 2. Rollback to previous deployment
vercel deployments promote <deployment-url> --environment production

# Or via Dashboard:
# Deployments → Click previous deployment → "Promote to Production"
```

### Backend Rollback (Railway)
```bash
# 1. View deployment history
railway logs --service api

# 2. Rollback via Dashboard:
# Project → Deployments → Click previous → "Redeploy"

# 3. Or revert Git commit and push
git revert HEAD
git push origin main
```

### Database Rollback
```bash
# Supabase
# Dashboard → Database → Backups → Restore to point in time

# Neon
# Dashboard → Branches → Restore from PITR

# WARNING: Always test restore on staging first!
```

---

## 6. Pre-Deployment Checklist

### Before First Deployment (Phase A)
- [ ] All TypeScript errors resolved
- [ ] Dev server runs without console errors
- [ ] PDF export tested on all 3 templates
- [ ] Git repository clean, all changes committed
- [ ] README.md updated with project status
- [ ] `.gitignore` excludes `node_modules`, `.env`, `dist`

### Before Backend Deployment (Phase B)
- [ ] Auth endpoints tested with Postman
- [ ] Resume CRUD enforces ownership (user A ≠ user B)
- [ ] Rate limiting blocks >5 auth requests/min
- [ ] CORS configured with production domain
- [ ] JWT secrets generated and stored securely
- [ ] Database migrations run successfully
- [ ] `/health` endpoint responds correctly

### Before Public Launch (Phase C)
- [ ] Sentry capturing errors in production
- [ ] Lighthouse scores: Performance ≥ 90, Accessibility ≥ 90
- [ ] Mobile responsive tested (375px iPhone SE)
- [ ] Keyboard navigation audited
- [ ] Load test passes targets
- [ ] Security audit shows zero high/critical issues
- [ ] Database backups automated
- [ ] Runbook documented
- [ ] Custom domain configured with HTTPS

---

## 7. Monitoring & Alerts

### Vercel Monitoring
- **Uptime:** Automatic (Vercel dashboard)
- **Analytics:** Built-in page views, geography, devices
- **Alerts:** Configure email for deployment failures

### Railway Monitoring
- **Uptime:** Automatic health checks
- **Logs:** Real-time log streaming
- **Alerts:** Email on service crashes

### Sentry Alerts
- **Error Rate:** Alert if >100 errors/hour
- **Release Tracking:** Deployments tagged with Git SHA
- **Performance:** Alert if p95 latency > 500ms

### Database Monitoring
- **Connection Pool:** Alert if >80% capacity
- **Storage:** Alert if >80% disk usage
- **Query Performance:** Slow query log (>1s)

---

## 8. Post-Deployment Validation

### Immediate Checks (Within 1 Hour)
1. **Homepage loads:** `https://your-domain.com`
2. **Editor functional:** Create new resume
3. **Form sections work:** Fill all 6 sections
4. **Preview updates:** Right panel shows changes
5. **PDF downloads:** Click button, verify file
6. **Console clean:** No JavaScript errors
7. **Network requests:** All 200/204 status codes

### Day 1 Monitoring
- [ ] Check Vercel Analytics for traffic
- [ ] Review Sentry for any captured errors
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (iOS, Android)
- [ ] Verify PDF downloads work on different OS

### Week 1 Monitoring
- [ ] Review error logs daily
- [ ] Monitor database connection usage
- [ ] Collect user feedback (if beta testers onboarded)
- [ ] Check performance metrics (Core Web Vitals)
- [ ] Verify no memory leaks in backend

---

## 9. Troubleshooting Guide

### Common Issues

#### Frontend Build Fails
**Symptom:** Vercel build fails with TypeScript errors
```bash
# Fix locally first
cd apps/web
pnpm type-check

# Common causes:
# - Missing dependencies in package.json
# - Path alias misconfiguration (tsconfig.json)
# - Environment variables not set
```

#### PDF Export Fails in Production
**Symptom:** Download button shows error toast
- Check browser console for CSP errors
- Verify `@react-pdf/renderer` is in `dependencies` (not devDependencies)
- Test with minimal resume data (isolates font loading issues)

#### Backend Can't Connect to Database
**Symptom:** 500 errors on API calls
```bash
# Verify connection string
railway run -- npx prisma db pull

# Check network access (Supabase needs IP whitelist)
# Supabase: Settings → Database → Network Restrictions

# Test connection locally
railway run -- npx prisma migrate status
```

#### CORS Errors
**Symptom:** Browser blocks API requests
```env
# Backend .env
ALLOWED_ORIGINS=https://your-domain.vercel.app

# Verify response headers
curl -I https://api.your-domain.com/api/health
# Should include: Access-Control-Allow-Origin: https://your-domain.vercel.app
```

---

## 10. Deployment Timeline

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| **Phase A: Frontend MVP** | Week 6 (Now) | 🟡 In Progress |
| **Phase B: Backend API** | Week 8 | ⏳ Pending Phase 6 |
| **Phase C: Production Launch** | Week 11 | ⏳ Pending Phase 10 |

---

## Appendix A: Useful Commands

```bash
# Deploy frontend to Vercel
vercel --prod

# Deploy backend to Railway
railway up

# Run database migrations
npx prisma migrate deploy

# Check build locally
pnpm build

# Test production build locally
pnpm preview

# View Vercel logs
vercel logs <deployment-url>

# View Railway logs
railway logs --service api
```

---

## Appendix B: Git Branch Strategy

```
main (production)
  ├── develop (integration branch)
  │     ├── feature/editor-sections
  │     ├── feature/pdf-export
  │     └── feature/auth-system
  ├── release/v1.0.0
  └── hotfix/fix-pdf-fonts
```

- **main:** Production-ready code (auto-deploys to Vercel production)
- **develop:** Integration branch for completed features
- **feature/\*:** Individual feature branches (deploy to Vercel preview)
- **release/\*:** Pre-release stabilization
- **hotfix/\*:** Emergency production fixes

---

## Appendix C: Environment Parity

| Environment | Purpose | URL | Branch |
|-------------|---------|-----|--------|
| **Local** | Development | `localhost:5173` | Any |
| **Preview** | PR testing | `*.vercel.app` | Feature branches |
| **Staging** | QA testing | `staging.resume-builder.io` | `develop` |
| **Production** | Live users | `resume-builder.io` | `main` |

---

**Next Steps:**
1. Complete pre-deployment checklist (Section 6)
2. Initialize Git repository if not done
3. Push to GitHub
4. Follow Phase A deployment steps
5. Share preview URL with stakeholders
