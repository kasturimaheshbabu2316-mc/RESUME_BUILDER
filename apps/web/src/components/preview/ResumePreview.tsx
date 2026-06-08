import type { ResumeState, TemplateId } from '@resume-builder/types'
import { ClassicTemplate, ModernTemplate, MinimalTemplate } from './templates'

interface ResumePreviewProps {
  resume: ResumeState
  templateId: TemplateId
  scale?: number
}

const templateMap: Record<TemplateId, React.ComponentType<{ resume: ResumeState; scale?: number }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
}

export function ResumePreview({ resume, templateId, scale = 0.65 }: ResumePreviewProps) {
  const Template = templateMap[templateId] || ClassicTemplate

  return (
    <div className="flex justify-center overflow-auto bg-gray-100 p-6 dark:bg-gray-900">
      <div
        className="rounded-lg bg-white shadow-2xl"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Template resume={resume} scale={scale} />
      </div>
    </div>
  )
}
