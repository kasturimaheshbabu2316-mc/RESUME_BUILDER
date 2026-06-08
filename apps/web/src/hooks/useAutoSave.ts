import { useEffect, useRef } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { saveResume, listResumes } from '@/utils/localStorageSync'
import toast from 'react-hot-toast'

// ─── Debounce delay in milliseconds ──────────────────────────────────────────
const DEBOUNCE_MS = 500

/**
 * useAutoSave — Automatically persists the current resume to localStorage
 * whenever the store changes. Uses debouncing to avoid excessive writes.
 *
 * Also hydrates the resume list on mount.
 */
export function useAutoSave() {
  const currentResume = useResumeStore(state => state.currentResume)
  const setHydrated = useResumeStore(state => state.setHydrated)
  const setResumeList = useResumeStore(state => state.setResumeList)
  const isHydrated = useResumeStore(state => state.isHydrated)

  // Ref to track the pending save timeout
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Hydrate resume list on mount ──────────────────────────────────────────
  useEffect(() => {
    if (isHydrated) return

    try {
      const list = listResumes()
      setResumeList(list)
      setHydrated(true)
    } catch (err) {
      console.error('[useAutoSave] Failed to hydrate from localStorage:', err)
      // Still mark as hydrated so the app doesn't get stuck
      setHydrated(true)
    }
  }, [isHydrated, setHydrated, setResumeList])

  // ── Debounced save on every store change ──────────────────────────────────
  useEffect(() => {
    if (!currentResume) return
    if (!isHydrated) return // Don't save until initial hydration is complete

    // Clear any pending save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Schedule new save
    timeoutRef.current = setTimeout(() => {
      try {
        saveResume(currentResume)

        // Update the resume list (title, updatedAt may have changed)
        const list = listResumes()
        setResumeList(list)
      } catch (err) {
        console.error('[useAutoSave] Failed to save resume:', err)
        toast.error('Failed to save — storage may be full')
      }
    }, DEBOUNCE_MS)

    // Cleanup on unmount or next change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentResume, isHydrated, setResumeList])
}
