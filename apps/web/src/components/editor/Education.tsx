import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { educationSchema, type EducationFormData } from '@/schemas/resumeSchemas'
import { useResumeStore } from '@/hooks/useResumeStore'
import { Input, Button } from '@/components/ui'
import type { Education } from '@resume-builder/types'

interface EntryFormProps {
  entry: Education
  onUpdate: (id: string, data: Partial<Education>) => void
  onRemove: (id: string) => void
}

function EntryForm({ entry, onUpdate, onRemove }: EntryFormProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: entry.institution,
      degree: entry.degree,
      field: entry.field,
      startDate: entry.startDate,
      endDate: entry.endDate,
      isCurrent: entry.isCurrent,
      gpa: entry.gpa,
    },
  })

  const isCurrent = watch('isCurrent')

  useEffect(() => {
    reset({
      institution: entry.institution,
      degree: entry.degree,
      field: entry.field,
      startDate: entry.startDate,
      endDate: entry.endDate,
      isCurrent: entry.isCurrent,
      gpa: entry.gpa,
    })
  }, [entry, reset])

  const onValid = (data: EducationFormData) => {
    onUpdate(entry.id, data)
  }

  const displayTitle = entry.institution || 'Untitled Institution'

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
          {(entry.degree || entry.field) && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {[entry.degree, entry.field].filter(Boolean).join(' in ')}
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
            label="Institution *"
            placeholder="Massachusetts Institute of Technology"
            error={errors.institution?.message}
            {...register('institution')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Degree *"
              placeholder="Bachelor of Science"
              error={errors.degree?.message}
              {...register('degree')}
            />
            <Input
              label="Field of Study"
              placeholder="Computer Science"
              error={errors.field?.message}
              {...register('field')}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Start Date *"
              placeholder="2018-09"
              error={errors.startDate?.message}
              helperText="YYYY-MM"
              {...register('startDate')}
            />
            <Input
              label="End Date"
              placeholder="2022-06"
              error={errors.endDate?.message}
              helperText="YYYY-MM"
              disabled={isCurrent}
              {...register('endDate')}
            />
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  {...register('isCurrent')}
                />
                Currently studying
              </label>
            </div>
          </div>

          <Input
            label="GPA"
            placeholder="3.8 / 4.0"
            error={errors.gpa?.message}
            {...register('gpa')}
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

export function EducationSection() {
  const { currentResume, addEducation, updateEducation, removeEducation } = useResumeStore()
  const entries = currentResume?.educations ?? []

  const handleAdd = () => {
    addEducation()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Education</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add your educational background.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleAdd} leftIcon={<span className="text-lg">+</span>}>
          Add
        </Button>
      </div>

      {entries.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">No education added yet.</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={handleAdd}>
            Add your first education
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <EntryForm key={entry.id} entry={entry} onUpdate={updateEducation} onRemove={removeEducation} />
        ))}
      </div>
    </div>
  )
}
