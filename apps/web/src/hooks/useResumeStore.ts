import { useCallback } from 'react'
import { useResumeStore as useStore } from '@/store/resumeStore'
import { useAutoSave } from '@/hooks/useAutoSave'
import { loadResume, deleteResume, createAndSaveResume, saveResume } from '@/utils/localStorageSync'
import type { ResumeState } from '@resume-builder/types'
import toast from 'react-hot-toast'

/**
 * useResumeStore — High-level hook that combines the Zustand store
 * with localStorage persistence and auto-save functionality.
 *
 * Use this as the single access point for all resume operations.
 */
export function useResumeStore() {
  // Auto-save is always active when this hook is used
  useAutoSave()

  // ── Selectors (subscribe only to what you need) ───────────────────────────
  const currentResume = useStore(state => state.currentResume)
  const resumeList = useStore(state => state.resumeList)
  const isHydrated = useStore(state => state.isHydrated)

  // ── Store actions ─────────────────────────────────────────────────────────
  const storeLoadResume = useStore(state => state.loadResume)
  const storeResetResume = useStore(state => state.resetResume)
  const setResumeList = useStore(state => state.setResumeList)

  // ── Wrapped actions with localStorage integration ─────────────────────────

  /**
   * Create a new resume and persist it to localStorage.
   * Returns the new resume ID.
   */
  const createResume = useCallback((): string => {
    const resume = createAndSaveResume()
    useStore.getState().setResumeList(
      useStore.getState().resumeList.concat(resume.meta)
    )
    useStore.setState({ currentResume: resume })
    toast.success('Resume created')
    return resume.meta.id
  }, [])

  /**
   * Load a resume from localStorage by ID.
   * Falls back to creating an empty resume if not found.
   */
  const loadResumeById = useCallback(
    (id: string): ResumeState => {
      const saved = loadResume(id)
      if (saved) {
        useStore.setState({ currentResume: saved })
        return saved
      }

      // Not found — create empty with the given ID
      storeLoadResume(id)
      const resume = useStore.getState().currentResume!
      return resume
    },
    [storeLoadResume]
  )

  /**
   * Delete a resume from localStorage and update the list.
   */
  const deleteResumeById = useCallback(
    (id: string) => {
      deleteResume(id)

      // Update list
      const list = useStore.getState().resumeList.filter(r => r.id !== id)
      setResumeList(list)

      // If we deleted the current resume, clear it
      const current = useStore.getState().currentResume
      if (current?.meta.id === id) {
        storeResetResume()
      }

      toast.success('Resume deleted')
    },
    [setResumeList, storeResetResume]
  )

  /**
   * Duplicate an existing resume.
   * Creates a copy with a new ID and " (Copy)" suffix.
   */
  const duplicateResume = useCallback(
    (id: string): string => {
      const original = loadResume(id)
      if (!original) {
        toast.error('Resume not found')
        return ''
      }

      const newId = crypto.randomUUID()
      const now = new Date().toISOString()
      const copy: ResumeState = {
        ...structuredClone(original),
        meta: {
          ...original.meta,
          id: newId,
          title: `${original.meta.title} (Copy)`,
          createdAt: now,
          updatedAt: now,
        },
      }

      // Save to localStorage
      saveResume(copy)

      // Update list
      const list = [...useStore.getState().resumeList, copy.meta]
      setResumeList(list)

      // Set as current
      useStore.setState({ currentResume: copy })

      toast.success('Resume duplicated')
      return newId
    },
    [setResumeList]
  )

  /**
   * Get the current resume ID (for routing purposes).
   */
  const getCurrentResumeId = useCallback((): string | null => {
    return useStore.getState().currentResume?.meta.id ?? null
  }, [])

  return {
    // State
    currentResume,
    resumeList,
    isHydrated,

    // Actions
    createResume,
    loadResumeById,
    deleteResumeById,
    duplicateResume,
    getCurrentResumeId,

    // Direct store actions (for convenience)
    updatePersonalInfo: useStore(state => state.updatePersonalInfo),
    addWorkExperience: useStore(state => state.addWorkExperience),
    updateWorkExperience: useStore(state => state.updateWorkExperience),
    removeWorkExperience: useStore(state => state.removeWorkExperience),
    addEducation: useStore(state => state.addEducation),
    updateEducation: useStore(state => state.updateEducation),
    removeEducation: useStore(state => state.removeEducation),
    addSkill: useStore(state => state.addSkill),
    updateSkill: useStore(state => state.updateSkill),
    removeSkill: useStore(state => state.removeSkill),
    addProject: useStore(state => state.addProject),
    updateProject: useStore(state => state.updateProject),
    removeProject: useStore(state => state.removeProject),
    addCertification: useStore(state => state.addCertification),
    updateCertification: useStore(state => state.updateCertification),
    removeCertification: useStore(state => state.removeCertification),
    updateResumeTitle: useStore(state => state.updateResumeTitle),
    changeTemplate: useStore(state => state.changeTemplate),
    resetResume: useStore(state => state.resetResume),
  }
}
