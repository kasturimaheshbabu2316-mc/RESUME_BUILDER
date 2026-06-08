import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { workExperienceSchema, type WorkExperienceFormData } from '@/schemas/resumeSchemas'
import { useResumeStore } from '@/hooks/useResumeStore'
import { Input, Textarea, Button } from '@/components/ui'
import type { WorkExperience } from '@resume-builder/types'

interface EntryFormProps {
  entry: WorkExperience
  onUpdate: (id: string, data: Partial<WorkExperience>) => void
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
  } = useForm<WorkExperienceFormData>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      company: entry.company,
      title: entry.title,
      location: entry.location,
      startDate: entry.startDate,
      endDate: entry.endDate,
      isCurrent: entry.isCurrent,
      description: entry.description,
    },
  })

  const isCurrent = watch('isCurrent')

  useEffect(() => {
    reset({
      company: entry.company,
      title: entry.title,
      location: entry.location,
      startDate: entry.startDate,
      endDate: entry.endDate,
      isCurrent: entry.isCurrent,
      description: entry.description,
    })
  }, [entry, reset])

  const onValid = (data: WorkExperienceFormData) => {
    onUpdate(entry.id, data)
  }

  const displayTitle = entry.title || entry.company || 'Untitled Position'

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Header — collapsible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={isExpanded}
      >
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayTitle}</p>
          {entry.company && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {entry.company}
              {entry.startDate && ` · ${entry.startDate}`}
              {entry.endDate && ` – ${entry.endDate}`}
              {entry.isCurrent && ' – Present'}
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

      {/* Form body */}
      {isExpanded && (
        <form onSubmit={handleSubmit(onValid)} className="space-y-4 border-t border-gray-200 px-4 py-4 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Job Title *"
              placeholder="Software Engineer"
              error={errors.title?.message}
              {...register('title')}
            />
            <Input
              label="Company *"
              placeholder="Acme Inc."
              error={errors.company?.message}
              {...register('company')}
            />
          </div>

          <Input
            label="Location"
            placeholder="San Francisco, CA"
            error={errors.location?.message}
            {...register('location')}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Start Date *"
              placeholder="2022-01"
              error={errors.startDate?.message}
              helperText="YYYY-MM"
              {...register('startDate')}
            />
            <Input
              label="End Date"
              placeholder="2024-06"
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
                Currently working here
              </label>
            </div>
          </div>

          <Textarea
            label="Description"
            placeholder="• Led a team of 5 engineers to deliver...&#10;• Increased system throughput by 40%..."
            error={errors.description?.message}
            helperText="Use bullet points (one per line)"
            rows={5}
            {...register('description')}
          />

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => onRemove(entry.id)}
            >
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

export function WorkExperience() {
  const { currentResume, addWorkExperience, updateWorkExperience, removeWorkExperience } =
    useResumeStore()
  const entries = currentResume?.workExperiences ?? []

  const handleAdd = () => {
    addWorkExperience()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Work Experience</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add your relevant work history. Most recent first.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleAdd} leftIcon={<span className="text-lg">+</span>}>
          Add
        </Button>
      </div>

      {entries.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No work experience added yet.
          </p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={handleAdd}>
            Add your first position
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <EntryForm
            key={entry.id}
            entry={entry}
            onUpdate={updateWorkExperience}
            onRemove={removeWorkExperience}
          />
        ))}
      </div>
    </div>
  )
}
