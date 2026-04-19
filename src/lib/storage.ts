import type { DocumentAnalysis, RecentDocument } from "@/types/lexiguide";

const STORAGE_KEY = "lexiguide_analyses";

export interface StoredAnalysis {
  analysis: DocumentAnalysis;
  documentText: string;
}

/**
 * Saves a new analysis to local storage.
 * Caps at 20 most recent entries.
 */
export function saveAnalysisToStorage(analysis: DocumentAnalysis, documentText: string): void {
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    const existing: StoredAnalysis[] = existingRaw ? JSON.parse(existingRaw) : [];
    
    // Check if this ID already exists (update if so)
    const index = existing.findIndex(a => a.analysis.id === analysis.id);
    
    if (index >= 0) {
      existing[index] = { analysis, documentText };
    } else {
      existing.unshift({ analysis, documentText });
    }

    // Cap at 20
    const limited = existing.slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch (e) {
    console.error("Failed to save to storage", e);
  }
}

/**
 * Returns summary records for the sidebar history.
 */
export function getRecentDocumentsFromStorage(): RecentDocument[] {
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    if (!existingRaw) return [];
    
    const stored: StoredAnalysis[] = JSON.parse(existingRaw);
    return stored.map(s => ({
      id: s.analysis.id,
      name: s.analysis.fileName,
      persona: s.analysis.persona,
      uploadedAt: s.analysis.uploadedAt
    }));
  } catch (e) {
    console.error("Failed to read history", e);
    return [];
  }
}

/**
 * Retrieves a full analysis record by ID.
 */
export function getStoredAnalysisById(id: string): StoredAnalysis | null {
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    if (!existingRaw) return null;
    
    const stored: StoredAnalysis[] = JSON.parse(existingRaw);
    return stored.find(s => s.analysis.id === id) || null;
  } catch (e) {
    return null;
  }
}

/**
 * Deletes a record from storage.
 */
export function deleteAnalysisFromStorage(id: string): void {
  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    if (!existingRaw) return;
    
    const stored: StoredAnalysis[] = JSON.parse(existingRaw);
    const filtered = stored.filter(s => s.analysis.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error("Failed to delete", e);
  }
}

/**
 * Utilities for storage stats.
 */
export function getStorageStats(): { count: number; sizeKB: number } {
  const raw = localStorage.getItem(STORAGE_KEY) || "";
  return {
    count: getRecentDocumentsFromStorage().length,
    sizeKB: Math.round(raw.length / 1024)
  };
}
