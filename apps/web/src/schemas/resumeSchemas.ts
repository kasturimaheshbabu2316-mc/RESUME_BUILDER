import { z } from 'zod'

// ─── Shared validators ───────────────────────────────────────────────────────
const optionalUrl = z
  .string()
  .trim()
  .refine((val) => val === '' || /^https?:\/\/.+/i.test(val), { message: 'Must be a valid URL starting with http(s)://' })
  .optional()
  .or(z.literal(''))

const optionalEmail = z
  .string()
  .trim()
  .refine((val) => val === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: 'Invalid email address' })
  .optional()
  .or(z.literal(''))

// ─── Personal Info ───────────────────────────────────────────────────────────
export const personalInfoSchema = z.object({
  name: z.string().trim().min(1, 'Full name is required').max(100),
  email: optionalEmail,
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  location: z.string().trim().max(100).optional().or(z.literal('')),
  linkedinUrl: optionalUrl,
  portfolioUrl: optionalUrl,
  summary: z.string().trim().max(2000).optional().or(z.literal('')),
})

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>

// ─── Work Experience ─────────────────────────────────────────────────────────
export const workExperienceSchema = z.object({
  company: z.string().trim().min(1, 'Company name is required').max(100),
  title: z.string().trim().min(1, 'Job title is required').max(100),
  location: z.string().trim().max(100).optional().or(z.literal('')),
  startDate: z.string().trim().min(1, 'Start date is required').regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM format'),
  endDate: z.string().trim().optional().or(z.literal('')),
  isCurrent: z.boolean().optional(),
  description: z.string().trim().max(5000).optional().or(z.literal('')),
})

export type WorkExperienceFormData = z.infer<typeof workExperienceSchema>

// ─── Education ───────────────────────────────────────────────────────────────
export const educationSchema = z.object({
  institution: z.string().trim().min(1, 'Institution name is required').max(150),
  degree: z.string().trim().min(1, 'Degree is required').max(100),
  field: z.string().trim().max(100).optional().or(z.literal('')),
  startDate: z.string().trim().min(1, 'Start date is required').regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM format'),
  endDate: z.string().trim().optional().or(z.literal('')),
  isCurrent: z.boolean().optional(),
  gpa: z.string().trim().max(10).optional().or(z.literal('')),
})

export type EducationFormData = z.infer<typeof educationSchema>

// ─── Skill ───────────────────────────────────────────────────────────────────
export const skillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required').max(60),
  level: z.enum(['beginner', 'intermediate', 'expert']).default('intermediate'),
  category: z.string().trim().max(60).optional().or(z.literal('')),
})

export type SkillFormData = z.infer<typeof skillSchema>

// ─── Project ─────────────────────────────────────────────────────────────────
export const projectSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required').max(100),
  description: z.string().trim().max(3000).optional().or(z.literal('')),
  techStack: z.array(z.string().trim()).max(20).optional(),
  url: optionalUrl,
  githubUrl: optionalUrl,
})

export type ProjectFormData = z.infer<typeof projectSchema>

// ─── Certification ───────────────────────────────────────────────────────────
export const certificationSchema = z.object({
  name: z.string().trim().min(1, 'Certification name is required').max(150),
  issuer: z.string().trim().min(1, 'Issuer is required').max(100),
  date: z.string().trim().min(1, 'Date is required').regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM format'),
  credentialUrl: optionalUrl,
})

export type CertificationFormData = z.infer<typeof certificationSchema>
