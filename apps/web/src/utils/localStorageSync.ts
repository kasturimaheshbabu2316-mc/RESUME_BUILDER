import type { ResumeState, ResumeMeta } from '@resume-builder/types'
import { createEmptyResume } from '@resume-builder/types'

// ─── Constants ───────────────────────────────────────────────────────────────
const STORAGE_KEY_PREFIX = 'resume_'
const INDEX_KEY = 'resume_index'

// ─── Types ───────────────────────────────────────────────────────────────────
interface ResumeIndex {
  [id: string]: ResumeMeta
}

// ─── Helper: Get index of all resumes ────────────────────────────────────────
function getIndex(): ResumeIndex {
  try {
    const raw = localStorage.getItem(INDEX_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as ResumeIndex
  } catch {
    // Corrupted index — reset
    localStorage.removeItem(INDEX_KEY)
    return {}
  }
}

// ─── Helper: Save index ──────────────────────────────────────────────────────
function saveIndex(index: ResumeIndex): void {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(index))
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Consider deleting old resumes.')
    }
    throw e
  }
}

// ─── Save a resume to localStorage ───────────────────────────────────────────
export function saveResume(state: ResumeState): void {
  const key = STORAGE_KEY_PREFIX + state.meta.id
  try {
    localStorage.setItem(key, JSON.stringify(state))

    // Update index
    const index = getIndex()
    index[state.meta.id] = {
      id: state.meta.id,
      title: state.meta.title,
      templateId: state.meta.templateId,
      createdAt: state.meta.createdAt,
      updatedAt: state.meta.updatedAt,
    }
    saveIndex(index)
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.error('[localStorageSync] Storage quota exceeded')
      throw new Error('Storage quota exceeded. Consider deleting old resumes.')
    }
    throw e
  }
}

// ─── Load a resume from localStorage ─────────────────────────────────────────
export function loadResume(id: string): ResumeState | null {
  const key = STORAGE_KEY_PREFIX + id
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null

    const parsed = JSON.parse(raw) as ResumeState

    // Basic validation: ensure required fields exist
    if (!parsed.meta?.id || !parsed.personalInfo) {
      console.warn(`[localStorageSync] Resume ${id} is corrupted, removing`)
      localStorage.removeItem(key)
      return null
    }

    return parsed
  } catch {
    console.warn(`[localStorageSync] Failed to parse resume ${id}, removing`)
    localStorage.removeItem(key)
    return null
  }
}

// ─── List all saved resumes (metadata only) ──────────────────────────────────
export function listResumes(): ResumeMeta[] {
  const index = getIndex()
  const list = Object.values(index)

  // Validate each entry exists in storage
  const valid: ResumeMeta[] = []
  for (const meta of list) {
    const key = STORAGE_KEY_PREFIX + meta.id
    if (localStorage.getItem(key)) {
      valid.push(meta)
    } else {
      // Stale entry — prune it
      delete index[meta.id]
    }
  }

  // Save pruned index if any stale entries were found
  if (valid.length !== list.length) {
    saveIndex(index)
  }

  // Sort by updatedAt descending (most recent first)
  return valid.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

// ─── Delete a resume from localStorage ───────────────────────────────────────
export function deleteResume(id: string): void {
  const key = STORAGE_KEY_PREFIX + id
  localStorage.removeItem(key)

  // Remove from index
  const index = getIndex()
  delete index[id]
  saveIndex(index)
}

// ─── Create a new resume and save to localStorage ────────────────────────────
export function createAndSaveResume(): ResumeState {
  const id = crypto.randomUUID()
  const resume = createEmptyResume(id)
  saveResume(resume)
  return resume
}

// ─── Check if localStorage is available ──────────────────────────────────────
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}
