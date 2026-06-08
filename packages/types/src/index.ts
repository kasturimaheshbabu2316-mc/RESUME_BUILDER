// ─── Personal Information ────────────────────────────────────────────────────
export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
  linkedinUrl: string
  portfolioUrl: string
  summary: string
}

// ─── Work Experience ─────────────────────────────────────────────────────────
export interface WorkExperience {
  id: string
  company: string
  title: string
  location: string
  startDate: string      // ISO date string e.g. "2022-01"
  endDate: string        // ISO date string or "" if currently working
  isCurrent: boolean
  description: string    // Markdown bullet points
}

// ─── Education ───────────────────────────────────────────────────────────────
export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  isCurrent: boolean
  gpa: string            // Optional; free text
}

// ─── Skills ──────────────────────────────────────────────────────────────────
export type SkillLevel = 'beginner' | 'intermediate' | 'expert'

export interface Skill {
  id: string
  name: string
  level: SkillLevel
  category: string       // e.g. "Frontend", "Backend", "DevOps"
}

// ─── Projects ────────────────────────────────────────────────────────────────
export interface Project {
  id: string
  name: string
  description: string
  techStack: string[]
  url: string
  githubUrl: string
}

// ─── Certifications ──────────────────────────────────────────────────────────
export interface Certification {
  id: string
  name: string
  issuer: string
  date: string           // ISO date string
  credentialUrl: string
}

// ─── Resume Meta ─────────────────────────────────────────────────────────────
export type TemplateId = 'classic' | 'modern' | 'minimal'

export interface ResumeMeta {
  id: string
  title: string
  templateId: TemplateId
  createdAt: string
  updatedAt: string
}

// ─── Full Resume State ───────────────────────────────────────────────────────
export interface ResumeState {
  meta: ResumeMeta
  personalInfo: PersonalInfo
  workExperiences: WorkExperience[]
  educations: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
}

// ─── Default / Empty Resume ──────────────────────────────────────────────────
export function createEmptyResume(id: string): ResumeState {
  const now = new Date().toISOString()
  return {
    meta: {
      id,
      title: 'Untitled Resume',
      templateId: 'classic',
      createdAt: now,
      updatedAt: now,
    },
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedinUrl: '',
      portfolioUrl: '',
      summary: '',
    },
    workExperiences: [],
    educations: [],
    skills: [],
    projects: [],
    certifications: [],
  }
}

// ─── API Response shapes ─────────────────────────────────────────────────────
export interface ApiError {
  error: string
  code?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  id: string
  email: string
}
