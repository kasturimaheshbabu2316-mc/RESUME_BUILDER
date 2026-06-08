import { create } from 'zustand'
import {
  type ResumeState,
  type ResumeMeta,
  type TemplateId,
  type PersonalInfo,
  type WorkExperience,
  type Education,
  type Skill,
  type Project,
  type Certification,
  createEmptyResume,
} from '@resume-builder/types'

// ─── Store Interface ─────────────────────────────────────────────────────────
export interface ResumeStore {
  // State
  currentResume: ResumeState | null
  resumeList: ResumeMeta[]
  isHydrated: boolean

  // Resume-level actions
  createResume: () => string
  loadResume: (id: string) => void
  resetResume: () => void
  updateResumeTitle: (title: string) => void
  changeTemplate: (templateId: TemplateId) => void

  // Personal Info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void

  // Work Experience
  addWorkExperience: () => string
  updateWorkExperience: (id: string, data: Partial<WorkExperience>) => void
  removeWorkExperience: (id: string) => void

  // Education
  addEducation: () => string
  updateEducation: (id: string, data: Partial<Education>) => void
  removeEducation: (id: string) => void

  // Skills
  addSkill: () => string
  updateSkill: (id: string, data: Partial<Skill>) => void
  removeSkill: (id: string) => void

  // Projects
  addProject: () => string
  updateProject: (id: string, data: Partial<Project>) => void
  removeProject: (id: string) => void

  // Certifications
  addCertification: () => string
  updateCertification: (id: string, data: Partial<Certification>) => void
  removeCertification: (id: string) => void

  // Hydration
  setHydrated: (v: boolean) => void
  setResumeList: (list: ResumeMeta[]) => void
}

// ─── Helper: Generate unique ID ──────────────────────────────────────────────
function generateId(): string {
  return crypto.randomUUID()
}

// ─── Helper: Update timestamp ────────────────────────────────────────────────
function touchMeta(resume: ResumeState): ResumeState {
  return {
    ...resume,
    meta: {
      ...resume.meta,
      updatedAt: new Date().toISOString(),
    },
  }
}

// ─── Store Implementation ────────────────────────────────────────────────────
export const useResumeStore = create<ResumeStore>((set, get) => ({
  // Initial state
  currentResume: null,
  resumeList: [],
  isHydrated: false,

  // ── Resume-level actions ───────────────────────────────────────────────────
  createResume: () => {
    const id = generateId()
    const newResume = createEmptyResume(id)
    set({ currentResume: newResume })
    return id
  },

  loadResume: (id: string) => {
    // This will be called after loading from localStorage or API
    // The actual loading logic is in useAutoSave/useResumeStore hooks
    const { currentResume } = get()
    if (currentResume?.meta.id === id) return // Already loaded
    // Reset to empty — the hook will populate from storage
    set({ currentResume: createEmptyResume(id) })
  },

  resetResume: () => {
    const { currentResume } = get()
    if (!currentResume) return
    const reset = createEmptyResume(currentResume.meta.id)
    set({ currentResume: reset })
  },

  updateResumeTitle: (title: string) => {
    const { currentResume } = get()
    if (!currentResume) return
    set({ currentResume: touchMeta({ ...currentResume, meta: { ...currentResume.meta, title } }) })
  },

  changeTemplate: (templateId: TemplateId) => {
    const { currentResume } = get()
    if (!currentResume) return
    set({
      currentResume: touchMeta({
        ...currentResume,
        meta: { ...currentResume.meta, templateId },
      }),
    })
  },

  // ── Personal Info ──────────────────────────────────────────────────────────
  updatePersonalInfo: (info: Partial<PersonalInfo>) => {
    const { currentResume } = get()
    if (!currentResume) return
    set({
      currentResume: touchMeta({
        ...currentResume,
        personalInfo: { ...currentResume.personalInfo, ...info },
      }),
    })
  },

  // ── Work Experience ────────────────────────────────────────────────────────
  addWorkExperience: () => {
    const { currentResume } = get()
    if (!currentResume) return ''
    const id = generateId()
    const newExp: WorkExperience = {
      id,
      company: '',
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    }
    set({
      currentResume: touchMeta({
        ...currentResume,
        workExperiences: [...currentResume.workExperiences, newExp],
      }),
    })
    return id
  },

  updateWorkExperience: (id: string, data: Partial<WorkExperience>) => {
    const { currentResume } = get()
    if (!currentResume) return
    const updated = currentResume.workExperiences.map(exp =>
      exp.id === id ? { ...exp, ...data } : exp
    )
    set({ currentResume: touchMeta({ ...currentResume, workExperiences: updated }) })
  },

  removeWorkExperience: (id: string) => {
    const { currentResume } = get()
    if (!currentResume) return
    const filtered = currentResume.workExperiences.filter(exp => exp.id !== id)
    set({ currentResume: touchMeta({ ...currentResume, workExperiences: filtered }) })
  },

  // ── Education ──────────────────────────────────────────────────────────────
  addEducation: () => {
    const { currentResume } = get()
    if (!currentResume) return ''
    const id = generateId()
    const newEdu: Education = {
      id,
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      gpa: '',
    }
    set({
      currentResume: touchMeta({
        ...currentResume,
        educations: [...currentResume.educations, newEdu],
      }),
    })
    return id
  },

  updateEducation: (id: string, data: Partial<Education>) => {
    const { currentResume } = get()
    if (!currentResume) return
    const updated = currentResume.educations.map(edu =>
      edu.id === id ? { ...edu, ...data } : edu
    )
    set({ currentResume: touchMeta({ ...currentResume, educations: updated }) })
  },

  removeEducation: (id: string) => {
    const { currentResume } = get()
    if (!currentResume) return
    const filtered = currentResume.educations.filter(edu => edu.id !== id)
    set({ currentResume: touchMeta({ ...currentResume, educations: filtered }) })
  },

  // ── Skills ─────────────────────────────────────────────────────────────────
  addSkill: () => {
    const { currentResume } = get()
    if (!currentResume) return ''
    const id = generateId()
    const newSkill: Skill = {
      id,
      name: '',
      level: 'intermediate',
      category: '',
    }
    set({
      currentResume: touchMeta({
        ...currentResume,
        skills: [...currentResume.skills, newSkill],
      }),
    })
    return id
  },

  updateSkill: (id: string, data: Partial<Skill>) => {
    const { currentResume } = get()
    if (!currentResume) return
    const updated = currentResume.skills.map(skill =>
      skill.id === id ? { ...skill, ...data } : skill
    )
    set({ currentResume: touchMeta({ ...currentResume, skills: updated }) })
  },

  removeSkill: (id: string) => {
    const { currentResume } = get()
    if (!currentResume) return
    const filtered = currentResume.skills.filter(skill => skill.id !== id)
    set({ currentResume: touchMeta({ ...currentResume, skills: filtered }) })
  },

  // ── Projects ───────────────────────────────────────────────────────────────
  addProject: () => {
    const { currentResume } = get()
    if (!currentResume) return ''
    const id = generateId()
    const newProject: Project = {
      id,
      name: '',
      description: '',
      techStack: [],
      url: '',
      githubUrl: '',
    }
    set({
      currentResume: touchMeta({
        ...currentResume,
        projects: [...currentResume.projects, newProject],
      }),
    })
    return id
  },

  updateProject: (id: string, data: Partial<Project>) => {
    const { currentResume } = get()
    if (!currentResume) return
    const updated = currentResume.projects.map(proj =>
      proj.id === id ? { ...proj, ...data } : proj
    )
    set({ currentResume: touchMeta({ ...currentResume, projects: updated }) })
  },

  removeProject: (id: string) => {
    const { currentResume } = get()
    if (!currentResume) return
    const filtered = currentResume.projects.filter(proj => proj.id !== id)
    set({ currentResume: touchMeta({ ...currentResume, projects: filtered }) })
  },

  // ── Certifications ─────────────────────────────────────────────────────────
  addCertification: () => {
    const { currentResume } = get()
    if (!currentResume) return ''
    const id = generateId()
    const newCert: Certification = {
      id,
      name: '',
      issuer: '',
      date: '',
      credentialUrl: '',
    }
    set({
      currentResume: touchMeta({
        ...currentResume,
        certifications: [...currentResume.certifications, newCert],
      }),
    })
    return id
  },

  updateCertification: (id: string, data: Partial<Certification>) => {
    const { currentResume } = get()
    if (!currentResume) return
    const updated = currentResume.certifications.map(cert =>
      cert.id === id ? { ...cert, ...data } : cert
    )
    set({ currentResume: touchMeta({ ...currentResume, certifications: updated }) })
  },

  removeCertification: (id: string) => {
    const { currentResume } = get()
    if (!currentResume) return
    const filtered = currentResume.certifications.filter(cert => cert.id !== id)
    set({ currentResume: touchMeta({ ...currentResume, certifications: filtered }) })
  },

  // ── Hydration ──────────────────────────────────────────────────────────────
  setHydrated: (v: boolean) => set({ isHydrated: v }),

  setResumeList: (list: ResumeMeta[]) => set({ resumeList: list }),
}))
