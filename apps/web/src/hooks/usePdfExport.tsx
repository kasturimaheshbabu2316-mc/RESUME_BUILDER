import { useState, useCallback } from 'react'
import { pdf } from '@react-pdf/renderer'
import type { ResumeState, TemplateId } from '@resume-builder/types'
import { ClassicTemplatePDF } from '@/utils/pdf/ClassicTemplatePDF'
import { ModernTemplatePDF } from '@/utils/pdf/ModernTemplatePDF'
import { MinimalTemplatePDF } from '@/utils/pdf/MinimalTemplatePDF'
import toast from 'react-hot-toast'

const templatePdfMap: Record<TemplateId, React.ComponentType<{ resume: ResumeState }>> = {
  classic: ClassicTemplatePDF,
  modern: ModernTemplatePDF,
  minimal: MinimalTemplatePDF,
}

/**
 * Hook to export resume as PDF using @react-pdf/renderer.
 * Generates a Blob from the selected template and triggers browser download.
 */
export function usePdfExport(resume: ResumeState | null, templateId: TemplateId) {
  const [isExporting, setIsExporting] = useState(false)

  const exportPdf = useCallback(async () => {
    if (!resume) {
      toast.error('No resume to export')
      return
    }

    setIsExporting(true)
    const toastId = toast.loading('Generating PDF...')

    try {
      const PdfTemplate = templatePdfMap[templateId] || ClassicTemplatePDF
      const blob = await pdf(<PdfTemplate resume={resume} />).toBlob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${resume.personalInfo.name || 'resume'}_resume.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('PDF downloaded!', { id: toastId })
    } catch (error) {
      console.error('PDF export failed:', error)
      toast.error('Failed to generate PDF', { id: toastId })
    } finally {
      setIsExporting(false)
    }
  }, [resume, templateId])

  return { exportPdf, isExporting }
}
