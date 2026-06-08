import { useState, type ReactNode } from 'react'
import { SectionNav, type SectionId } from './SectionNav'
import { ResumePreview } from '@/components/preview'
import type { ResumeState, TemplateId } from '@resume-builder/types'

interface AppShellProps {
  children: (activeSection: SectionId) => ReactNode
  resume: ResumeState
  templateId: TemplateId
  onExportPdf?: () => void
  isExporting?: boolean
}

export function AppShell({ children, resume, templateId, onExportPdf, isExporting }: AppShellProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('personalInfo')
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-brand-600">Resume Builder</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile view toggle */}
          <div className="flex rounded-md bg-gray-100 p-1 lg:hidden dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setMobileView('edit')}
              className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                mobileView === 'edit'
                  ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-brand-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setMobileView('preview')}
              className={`rounded px-3 py-1.5 text-xs font-medium transition ${
                mobileView === 'preview'
                  ? 'bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-brand-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
              }`}
            >
              Preview
            </button>
          </div>

          {onExportPdf && (
            <button
              type="button"
              onClick={onExportPdf}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
            >
              {isExporting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download PDF</span>
                </>
              )}
            </button>
          )}
          <span className="text-xs text-gray-400">Auto-saved</span>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — Section navigation (hidden on mobile) */}
        <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-3 lg:block dark:border-gray-700 dark:bg-gray-900">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Sections
          </p>
          <SectionNav activeSection={activeSection} onSectionChange={setActiveSection} />
        </aside>

        {/* Editor panel */}
        <main className={`flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-950 ${
          mobileView === 'preview' ? 'hidden lg:block' : ''
        }`}>
          <div className="mx-auto max-w-3xl">
            {/* Mobile section navigation */}
            <div className="mb-4 lg:hidden">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value as SectionId)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="personalInfo">Personal Info</option>
                <option value="workExperience">Work Experience</option>
                <option value="education">Education</option>
                <option value="skills">Skills</option>
                <option value="projects">Projects</option>
                <option value="certifications">Certifications</option>
              </select>
            </div>
            {children(activeSection)}
          </div>
        </main>

        {/* Preview panel */}
        <aside className={`w-[420px] shrink-0 overflow-y-auto border-l border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900 ${
          mobileView === 'edit' ? 'hidden lg:block' : ''
        }`}>
          <ResumePreview resume={resume} templateId={templateId} scale={0.65} />
        </aside>
      </div>
    </div>
  )
}
