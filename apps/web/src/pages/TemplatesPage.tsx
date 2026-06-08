import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/hooks/useResumeStore'
import type { TemplateId } from '@resume-builder/types'
import toast from 'react-hot-toast'

export default function TemplatesPage() {
  const { createResume, changeTemplate } = useResumeStore()
  const navigate = useNavigate()

  const templates: { id: TemplateId; name: string; description: string }[] = [
    { id: 'classic', name: 'Classic', description: 'Traditional single-column layout' },
    { id: 'modern', name: 'Modern', description: 'Two-column with sidebar' },
    { id: 'minimal', name: 'Minimal', description: 'Clean and spacious' },
  ]

  const handleSelectTemplate = (templateId: TemplateId) => {
    const id = createResume()
    changeTemplate(templateId)
    toast.success(`Created resume with ${templateId} template`)
    navigate(`/editor/${id}`)
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <h1 className="mb-2 text-2xl font-bold">Choose a Template</h1>
      <p className="mb-8 text-gray-500">Pick a template and start building your resume.</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map(t => (
          <div
            key={t.id}
            className="card group cursor-pointer transition hover:border-brand-500 hover:shadow-md"
            onClick={() => handleSelectTemplate(t.id)}
          >
            <div className="mb-4 h-48 rounded-md bg-gray-100 dark:bg-gray-700" />
            <h3 className="font-semibold group-hover:text-brand-600">{t.name}</h3>
            <p className="text-sm text-gray-500">{t.description}</p>
            <button
              type="button"
              className="mt-4 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Use This Template
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
