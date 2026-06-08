import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppShell } from '@/components/layout'
import type { SectionId } from '@/components/layout'
import {
  PersonalInfo,
  WorkExperience,
  EducationSection,
  SkillsSection,
  ProjectsSection,
  CertificationsSection,
} from '@/components/editor'
import { useResumeStore } from '@/hooks/useResumeStore'
import { usePdfExport } from '@/hooks/usePdfExport'

const sectionComponents: Record<SectionId, React.ComponentType> = {
  personalInfo: PersonalInfo,
  workExperience: WorkExperience,
  education: EducationSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  certifications: CertificationsSection,
}

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const { currentResume, createResume, loadResumeById, isHydrated } = useResumeStore()
  const templateId = currentResume?.meta.templateId ?? 'classic'
  const { exportPdf, isExporting } = usePdfExport(currentResume, templateId)

  // Ensure a resume exists when entering the editor
  useEffect(() => {
    if (!isHydrated) return

    if (id) {
      loadResumeById(id)
    } else if (!currentResume) {
      createResume()
    }
  }, [id, isHydrated, currentResume, createResume, loadResumeById])

  return (
    <AppShell
      resume={currentResume!}
      templateId={templateId}
      onExportPdf={exportPdf}
      isExporting={isExporting}
    >
      {(activeSection) => {
        if (!currentResume) {
          return (
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-gray-400">Loading resume...</p>
            </div>
          )
        }
        const SectionComponent = sectionComponents[activeSection]
        return <SectionComponent />
      }}
    </AppShell>
  )
}
