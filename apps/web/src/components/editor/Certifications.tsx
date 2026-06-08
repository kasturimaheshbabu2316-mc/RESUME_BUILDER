import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { certificationSchema, type CertificationFormData } from '@/schemas/resumeSchemas'
import { useResumeStore } from '@/hooks/useResumeStore'
import { Input, Button } from '@/components/ui'
import type { Certification } from '@resume-builder/types'

interface EntryFormProps {
  entry: Certification
  onUpdate: (id: string, data: Partial<Certification>) => void
  onRemove: (id: string) => void
}

function EntryForm({ entry, onUpdate, onRemove }: EntryFormProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: entry.name,
      issuer: entry.issuer,
      date: entry.date,
      credentialUrl: entry.credentialUrl,
    },
  })

  useEffect(() => {
    reset({
      name: entry.name,
      issuer: entry.issuer,
      date: entry.date,
      credentialUrl: entry.credentialUrl,
    })
  }, [entry, reset])

  const onValid = (data: CertificationFormData) => {
    onUpdate(entry.id, data)
  }

  const displayTitle = entry.name || 'Untitled Certification'

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={isExpanded}
      >
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayTitle}</p>
          {entry.issuer && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {entry.issuer}
              {entry.date && ` · ${entry.date}`}
            </p>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit(onValid)} className="space-y-4 border-t border-gray-200 px-4 py-4 dark:border-gray-700">
          <Input
            label="Certification Name *"
            placeholder="AWS Solutions Architect"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Issuing Organization *"
              placeholder="Amazon Web Services"
              error={errors.issuer?.message}
              {...register('issuer')}
            />
            <Input
              label="Date Obtained *"
              placeholder="2024-01"
              error={errors.date?.message}
              helperText="YYYY-MM"
              {...register('date')}
            />
          </div>

          <Input
            label="Credential URL"
            placeholder="https://credly.com/badges/..."
            error={errors.credentialUrl?.message}
            {...register('credentialUrl')}
          />

          <div className="flex items-center justify-between">
            <Button type="button" variant="danger" size="sm" onClick={() => onRemove(entry.id)}>
              Remove
            </Button>
            <button
              type="submit"
              disabled={!isDirty}
              className="btn-primary rounded-md px-4 py-2 text-sm disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function CertificationsSection() {
  const { currentResume, addCertification, updateCertification, removeCertification } =
    useResumeStore()
  const entries = currentResume?.certifications ?? []

  const handleAdd = () => {
    addCertification()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Certifications</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add your professional certifications and licenses.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleAdd} leftIcon={<span className="text-lg">+</span>}>
          Add
        </Button>
      </div>

      {entries.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">No certifications added yet.</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={handleAdd}>
            Add your first certification
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <EntryForm
            key={entry.id}
            entry={entry}
            onUpdate={updateCertification}
            onRemove={removeCertification}
          />
        ))}
      </div>
    </div>
  )
}
