// Local storage utilities for draft management
export interface Draft {
  id: string
  title: string
  body: string
  createdAt: Date
  updatedAt: Date
}

const DRAFTS_KEY = "github-cms-drafts"

export function getDrafts(): Draft[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(DRAFTS_KEY)
    if (!stored) return []

    const drafts = JSON.parse(stored)
    return drafts.map((draft: any) => ({
      ...draft,
      createdAt: new Date(draft.createdAt),
      updatedAt: new Date(draft.updatedAt),
    }))
  } catch (error) {
    console.error("Failed to load drafts:", error)
    return []
  }
}

export function saveDraft(draft: Omit<Draft, "id" | "createdAt" | "updatedAt"> | Draft): Draft {
  const drafts = getDrafts()
  const now = new Date()

  let updatedDraft: Draft

  if ("id" in draft && draft.id) {
    // Update existing draft
    const index = drafts.findIndex((d) => d.id === draft.id)
    if (index >= 0) {
      updatedDraft = {
        ...draft,
        updatedAt: now,
      }
      drafts[index] = updatedDraft
    } else {
      throw new Error("Draft not found")
    }
  } else {
    // Create new draft
    updatedDraft = {
      id: crypto.randomUUID(),
      title: draft.title,
      body: draft.body,
      createdAt: now,
      updatedAt: now,
    }
    drafts.push(updatedDraft)
  }

  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
  return updatedDraft
}

export function deleteDraft(id: string): void {
  const drafts = getDrafts().filter((draft) => draft.id !== id)
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
}

export function clearAllDrafts(): void {
  localStorage.removeItem(DRAFTS_KEY)
}
