import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectFormData } from '@/schemas/resumeSchemas'
import { useResumeStore } from '@/hooks/useResumeStore'
import { Input, Textarea, Button, Badge } from '@/components/ui'
import type { Project } from '@resume-builder/types'

interface EntryFormProps {
  entry: Project
  onUpdate: (id: string, data: Partial<Project>) => void
  onRemove: (id: string) => void
}

function EntryForm({ entry, onUpdate, onRemove }: EntryFormProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [techInput, setTechInput] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: entry.name,
      description: entry.description,
      techStack: entry.techStack,
      url: entry.url,
      githubUrl: entry.githubUrl,
    },
  })

  const techStack = watch('techStack') ?? []

  useEffect(() => {
    reset({
      name: entry.name,
      description: entry.description,
      techStack: entry.techStack,
      url: entry.url,
      githubUrl: entry.githubUrl,
    })
  }, [entry, reset])

  const onValid = (data: ProjectFormData) => {
    onUpdate(entry.id, data)
  }

  const addTech = () => {
    const trimmed = techInput.trim()
    if (!trimmed || techStack.includes(trimmed)) return
    setValue('techStack', [...techStack, trimmed], { shouldDirty: true })
    setTechInput('')
  }

  const removeTech = (tech: string) => {
    setValue(
      'techStack',
      techStack.filter((t) => t !== tech),
      { shouldDirty: true }
    )
  }

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTech()
    }
  }

  const displayTitle = entry.name || 'Untitled Project'

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={isExpanded}
      >
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayTitle}</p>
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
            label="Project Name *"
            placeholder="My Awesome App"
            error={errors.name?.message}
            {...register('name')}
          />

          <Textarea
            label="Description"
            placeholder="A brief description of the project, its goals, and your contributions..."
            error={errors.description?.message}
            rows={4}
            {...register('description')}
          />

          {/* Tech stack */}
          <div>
            <label className="label mb-1">Tech Stack</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {techStack.map((tech) => (
                <Badge key={tech} variant="info" onRemove={() => removeTech(tech)}>
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. React, Node.js, PostgreSQL"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleTechKeyDown}
              />
              <Button type="button" variant="secondary" size="sm" onClick={addTech} disabled={!techInput.trim()}>
                Add
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Live URL"
              placeholder="https://myapp.com"
              error={errors.url?.message}
              {...register('url')}
            />
            <Input
              label="GitHub URL"
              placeholder="https://github.com/user/repo"
              error={errors.githubUrl?.message}
              {...register('githubUrl')}
            />
          </div>

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

export function ProjectsSection() {
  const { currentResume, addProject, updateProject, removeProject } = useResumeStore()
  const entries = currentResume?.projects ?? []

  const handleAdd = () => {
    addProject()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Projects</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showcase your personal or professional projects.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleAdd} leftIcon={<span className="text-lg">+</span>}>
          Add
        </Button>
      </div>

      {entries.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">No projects added yet.</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={handleAdd}>
            Add your first project
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <EntryForm key={entry.id} entry={entry} onUpdate={updateProject} onRemove={removeProject} />
        ))}
      </div>
    </div>
  )
}
