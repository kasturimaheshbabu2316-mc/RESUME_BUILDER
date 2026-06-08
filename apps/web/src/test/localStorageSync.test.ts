import { describe, it, expect, beforeEach } from 'vitest'
import {
  saveResume,
  loadResume,
  listResumes,
  deleteResume,
  createAndSaveResume,
  isLocalStorageAvailable,
} from '@/utils/localStorageSync'
import { createEmptyResume } from '@resume-builder/types'

describe('localStorageSync', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('saveResume / loadResume', () => {
    it('saves and loads a resume by ID', () => {
      const resume = createEmptyResume('test-id-1')
      resume.personalInfo.name = 'Jane Doe'

      saveResume(resume)

      const loaded = loadResume('test-id-1')
      expect(loaded).not.toBeNull()
      expect(loaded!.meta.id).toBe('test-id-1')
      expect(loaded!.personalInfo.name).toBe('Jane Doe')
    })

    it('returns null for non-existent resume', () => {
      expect(loadResume('non-existent')).toBeNull()
    })

    it('returns null and cleans up for corrupted JSON', () => {
      localStorage.setItem('resume_corrupt', '{invalid json}')
      expect(loadResume('corrupt')).toBeNull()
      expect(localStorage.getItem('resume_corrupt')).toBeNull()
    })

    it('returns null and cleans up for resume missing required fields', () => {
      localStorage.setItem('resume_incomplete', JSON.stringify({ meta: {} }))
      expect(loadResume('incomplete')).toBeNull()
      expect(localStorage.getItem('resume_incomplete')).toBeNull()
    })
  })

  describe('listResumes', () => {
    it('returns empty array when no resumes saved', () => {
      expect(listResumes()).toEqual([])
    })

    it('returns all saved resumes sorted by updatedAt descending', () => {
      const r1 = createEmptyResume('id-1')
      r1.meta.title = 'First'
      r1.meta.updatedAt = '2024-01-01T00:00:00Z'
      saveResume(r1)

      const r2 = createEmptyResume('id-2')
      r2.meta.title = 'Second'
      r2.meta.updatedAt = '2024-06-01T00:00:00Z'
      saveResume(r2)

      const r3 = createEmptyResume('id-3')
      r3.meta.title = 'Third'
      r3.meta.updatedAt = '2024-03-01T00:00:00Z'
      saveResume(r3)

      const list = listResumes()
      expect(list).toHaveLength(3)
      expect(list[0].title).toBe('Second') // Most recent
      expect(list[1].title).toBe('Third')
      expect(list[2].title).toBe('First') // Oldest
    })

    it('prunes stale entries from index', () => {
      const r1 = createEmptyResume('exists')
      saveResume(r1)

      // Manually add a stale index entry (no actual data)
      const index = JSON.parse(localStorage.getItem('resume_index') || '{}')
      index['stale-id'] = {
        id: 'stale-id',
        title: 'Stale',
        templateId: 'classic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem('resume_index', JSON.stringify(index))

      const list = listResumes()
      expect(list).toHaveLength(1)
      expect(list[0].id).toBe('exists')

      // Stale entry should be removed from index
      const updatedIndex = JSON.parse(localStorage.getItem('resume_index')!)
      expect(updatedIndex['stale-id']).toBeUndefined()
    })
  })

  describe('deleteResume', () => {
    it('removes resume from storage and index', () => {
      const r = createEmptyResume('to-delete')
      saveResume(r)

      expect(loadResume('to-delete')).not.toBeNull()

      deleteResume('to-delete')

      expect(loadResume('to-delete')).toBeNull()
      expect(listResumes()).toHaveLength(0)
    })

    it('does nothing if resume does not exist', () => {
      deleteResume('non-existent')
      expect(listResumes()).toEqual([])
    })
  })

  describe('createAndSaveResume', () => {
    it('creates a new resume with a unique ID and saves it', () => {
      const r1 = createAndSaveResume()
      const r2 = createAndSaveResume()

      expect(r1.meta.id).not.toBe(r2.meta.id)
      expect(listResumes()).toHaveLength(2)
    })
  })

  describe('isLocalStorageAvailable', () => {
    it('returns true in jsdom environment', () => {
      expect(isLocalStorageAvailable()).toBe(true)
    })
  })
})
