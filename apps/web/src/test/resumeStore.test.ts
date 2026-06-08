import { describe, it, expect, beforeEach } from 'vitest'
import { useResumeStore } from '@/store/resumeStore'

describe('resumeStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useResumeStore.setState({
      currentResume: null,
      resumeList: [],
      isHydrated: false,
    })
  })

  describe('createResume', () => {
    it('creates a new empty resume and sets it as current', () => {
      const id = useResumeStore.getState().createResume()

      expect(id).toBeTruthy()
      expect(typeof id).toBe('string')

      const current = useResumeStore.getState().currentResume
      expect(current).not.toBeNull()
      expect(current!.meta.id).toBe(id)
      expect(current!.personalInfo.name).toBe('')
      expect(current!.workExperiences).toEqual([])
    })
  })

  describe('updatePersonalInfo', () => {
    it('updates personal info fields', () => {
      useResumeStore.getState().createResume()
      useResumeStore.getState().updatePersonalInfo({
        name: 'John Doe',
        email: 'john@example.com',
      })

      const current = useResumeStore.getState().currentResume!
      expect(current.personalInfo.name).toBe('John Doe')
      expect(current.personalInfo.email).toBe('john@example.com')
      // Other fields should remain empty
      expect(current.personalInfo.phone).toBe('')
    })

    it('does nothing if no current resume', () => {
      useResumeStore.getState().updatePersonalInfo({ name: 'Test' })
      expect(useResumeStore.getState().currentResume).toBeNull()
    })
  })

  describe('workExperiences', () => {
    it('adds, updates, and removes work experience', () => {
      useResumeStore.getState().createResume()

      // Add
      const expId = useResumeStore.getState().addWorkExperience()
      expect(expId).toBeTruthy()
      expect(useResumeStore.getState().currentResume!.workExperiences).toHaveLength(1)

      // Update
      useResumeStore.getState().updateWorkExperience(expId, {
        company: 'Acme Corp',
        title: 'Engineer',
      })
      const exp = useResumeStore.getState().currentResume!.workExperiences[0]
      expect(exp.company).toBe('Acme Corp')
      expect(exp.title).toBe('Engineer')

      // Remove
      useResumeStore.getState().removeWorkExperience(expId)
      expect(useResumeStore.getState().currentResume!.workExperiences).toHaveLength(0)
    })

    it('returns empty string if no current resume', () => {
      const id = useResumeStore.getState().addWorkExperience()
      expect(id).toBe('')
    })
  })

  describe('educations', () => {
    it('adds, updates, and removes education', () => {
      useResumeStore.getState().createResume()

      const eduId = useResumeStore.getState().addEducation()
      expect(eduId).toBeTruthy()

      useResumeStore.getState().updateEducation(eduId, {
        institution: 'MIT',
        degree: 'B.S.',
        field: 'Computer Science',
      })

      const edu = useResumeStore.getState().currentResume!.educations[0]
      expect(edu.institution).toBe('MIT')
      expect(edu.degree).toBe('B.S.')

      useResumeStore.getState().removeEducation(eduId)
      expect(useResumeStore.getState().currentResume!.educations).toHaveLength(0)
    })
  })

  describe('skills', () => {
    it('adds, updates, and removes skills', () => {
      useResumeStore.getState().createResume()

      const skillId = useResumeStore.getState().addSkill()
      expect(skillId).toBeTruthy()

      useResumeStore.getState().updateSkill(skillId, {
        name: 'TypeScript',
        level: 'expert',
        category: 'Frontend',
      })

      const skill = useResumeStore.getState().currentResume!.skills[0]
      expect(skill.name).toBe('TypeScript')
      expect(skill.level).toBe('expert')

      useResumeStore.getState().removeSkill(skillId)
      expect(useResumeStore.getState().currentResume!.skills).toHaveLength(0)
    })
  })

  describe('projects', () => {
    it('adds, updates, and removes projects', () => {
      useResumeStore.getState().createResume()

      const projId = useResumeStore.getState().addProject()
      expect(projId).toBeTruthy()

      useResumeStore.getState().updateProject(projId, {
        name: 'My App',
        description: 'A cool app',
        techStack: ['React', 'Node.js'],
      })

      const proj = useResumeStore.getState().currentResume!.projects[0]
      expect(proj.name).toBe('My App')
      expect(proj.techStack).toEqual(['React', 'Node.js'])

      useResumeStore.getState().removeProject(projId)
      expect(useResumeStore.getState().currentResume!.projects).toHaveLength(0)
    })
  })

  describe('certifications', () => {
    it('adds, updates, and removes certifications', () => {
      useResumeStore.getState().createResume()

      const certId = useResumeStore.getState().addCertification()
      expect(certId).toBeTruthy()

      useResumeStore.getState().updateCertification(certId, {
        name: 'AWS Solutions Architect',
        issuer: 'Amazon',
        date: '2024-01',
      })

      const cert = useResumeStore.getState().currentResume!.certifications[0]
      expect(cert.name).toBe('AWS Solutions Architect')
      expect(cert.issuer).toBe('Amazon')

      useResumeStore.getState().removeCertification(certId)
      expect(useResumeStore.getState().currentResume!.certifications).toHaveLength(0)
    })
  })

  describe('changeTemplate', () => {
    it('changes the template ID', () => {
      useResumeStore.getState().createResume()
      expect(useResumeStore.getState().currentResume!.meta.templateId).toBe('classic')

      useResumeStore.getState().changeTemplate('modern')
      expect(useResumeStore.getState().currentResume!.meta.templateId).toBe('modern')
    })
  })

  describe('updateResumeTitle', () => {
    it('updates the resume title', () => {
      useResumeStore.getState().createResume()
      expect(useResumeStore.getState().currentResume!.meta.title).toBe('Untitled Resume')

      useResumeStore.getState().updateResumeTitle('My Awesome Resume')
      expect(useResumeStore.getState().currentResume!.meta.title).toBe('My Awesome Resume')
    })
  })

  describe('resetResume', () => {
    it('resets current resume to empty state', () => {
      useResumeStore.getState().createResume()
      useResumeStore.getState().updatePersonalInfo({ name: 'John' })
      useResumeStore.getState().addWorkExperience()

      expect(useResumeStore.getState().currentResume!.personalInfo.name).toBe('John')
      expect(useResumeStore.getState().currentResume!.workExperiences).toHaveLength(1)

      useResumeStore.getState().resetResume()

      const current = useResumeStore.getState().currentResume!
      expect(current.personalInfo.name).toBe('')
      expect(current.workExperiences).toHaveLength(0)
    })
  })

  describe('updatedAt timestamp', () => {
    it('updates updatedAt on every action', async () => {
      useResumeStore.getState().createResume()
      const initial = useResumeStore.getState().currentResume!.meta.updatedAt

      // Small delay to ensure timestamp differs
      await new Promise(r => setTimeout(r, 10))

      useResumeStore.getState().updatePersonalInfo({ name: 'Test' })
      const afterUpdate = useResumeStore.getState().currentResume!.meta.updatedAt

      expect(new Date(afterUpdate).getTime()).toBeGreaterThanOrEqual(new Date(initial).getTime())
    })
  })
})
