import { useState } from 'react'
import { useResumeStore } from '@/hooks/useResumeStore'
import { Input, Button, Badge, Card } from '@/components/ui'
import type { Skill, SkillLevel } from '@resume-builder/types'

const LEVEL_OPTIONS: { value: SkillLevel; label: string; color: 'default' | 'info' | 'success' }[] = [
  { value: 'beginner', label: 'Beginner', color: 'default' },
  { value: 'intermediate', label: 'Intermediate', color: 'info' },
  { value: 'expert', label: 'Expert', color: 'success' },
]

export function SkillsSection() {
  const { currentResume, addSkill, updateSkill, removeSkill } = useResumeStore()
  const skills = currentResume?.skills ?? []

  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('intermediate')
  const [newSkillCategory, setNewSkillCategory] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editLevel, setEditLevel] = useState<SkillLevel>('intermediate')
  const [editCategory, setEditCategory] = useState('')

  const handleAdd = () => {
    const trimmed = newSkillName.trim()
    if (!trimmed) return
    const id = addSkill()
    if (id) {
      updateSkill(id, { name: trimmed, level: newSkillLevel, category: newSkillCategory.trim() })
    }
    setNewSkillName('')
    setNewSkillLevel('intermediate')
    setNewSkillCategory('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const startEdit = (skill: Skill) => {
    setEditingId(skill.id)
    setEditName(skill.name)
    setEditLevel(skill.level)
    setEditCategory(skill.category)
  }

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return
    updateSkill(editingId, { name: editName.trim(), level: editLevel, category: editCategory.trim() })
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  // Group skills by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Skills</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add your technical and soft skills.
        </p>
      </div>

      {/* Add skill form */}
      <Card title="Add Skill">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="e.g. React, Python, Project Management"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <select
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
            className="input sm:w-40"
          >
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Input
            placeholder="Category"
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value)}
            onKeyDown={handleKeyDown}
            className="sm:w-36"
          />
          <Button variant="primary" size="sm" onClick={handleAdd} disabled={!newSkillName.trim()}>
            Add
          </Button>
        </div>
      </Card>

      {/* Skills grouped by category */}
      {Object.keys(grouped).length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center dark:border-gray-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">No skills added yet.</p>
        </div>
      )}

      {Object.entries(grouped).map(([category, categorySkills]) => (
        <div key={category}>
          <h3 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-300">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => {
              if (editingId === skill.id) {
                return (
                  <div key={skill.id} className="flex items-center gap-2 rounded-lg border border-brand-300 bg-brand-50 p-2 dark:border-brand-600 dark:bg-brand-900/30">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-24 rounded border-none bg-transparent p-0 text-sm focus:outline-none focus:ring-0"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit()
                        if (e.key === 'Escape') cancelEdit()
                      }}
                    />
                    <select
                      value={editLevel}
                      onChange={(e) => setEditLevel(e.target.value as SkillLevel)}
                      className="rounded border-none bg-transparent p-0 text-xs focus:outline-none"
                    >
                      {LEVEL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <button onClick={saveEdit} className="text-xs text-brand-600 hover:underline">
                      Save
                    </button>
                    <button onClick={cancelEdit} className="text-xs text-gray-400 hover:underline">
                      Cancel
                    </button>
                  </div>
                )
              }

              const levelConfig = LEVEL_OPTIONS.find((o) => o.value === skill.level)
              return (
                <span
                  key={skill.id}
                  className="group relative"
                >
                  <Badge
                    variant={levelConfig?.color ?? 'default'}
                    onRemove={() => removeSkill(skill.id)}
                  >
                    {skill.name}
                  </Badge>
                  <button
                    onClick={() => startEdit(skill)}
                    className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-gray-400 text-[8px] text-white group-hover:flex"
                    aria-label={`Edit ${skill.name}`}
                  >
                    ✎
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
