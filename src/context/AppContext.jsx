import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

const LS_KEYS = {
  history: 'templateai.history',
  favorites: 'templateai.favorites',
  settings: 'templateai.settings',
}

function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function AppProvider({ children }) {
  const [history, setHistory] = useState(() => loadLS(LS_KEYS.history, []))
  const [favorites, setFavorites] = useState(() => loadLS(LS_KEYS.favorites, []))
  const [settings, setSettings] = useState(() => loadLS(LS_KEYS.settings, {
    quality: 'high',
    theme: 'dark',
  }))

  useEffect(() => { saveLS(LS_KEYS.history, history) }, [history])
  useEffect(() => { saveLS(LS_KEYS.favorites, favorites) }, [favorites])
  useEffect(() => { saveLS(LS_KEYS.settings, settings) }, [settings])

  const addHistory = useCallback((entry) => {
    setHistory(prev => [{ ...entry, id: Date.now(), timestamp: new Date().toISOString() }, ...prev].slice(0, 100))
  }, [])

  const clearHistory = useCallback(() => setHistory([]), [])

  const removeHistoryItem = useCallback((id) => {
    setHistory(prev => prev.filter(h => h.id !== id))
  }, [])

  const toggleFavorite = useCallback((templateId) => {
    setFavorites(prev =>
      prev.includes(templateId) ? prev.filter(f => f !== templateId) : [...prev, templateId]
    )
  }, [])

  const isFavorite = useCallback((templateId) => favorites.includes(templateId), [favorites])

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const clearAllData = useCallback(() => {
    setHistory([])
    setFavorites([])
    Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k))
  }, [])

  return (
    <AppContext.Provider value={{
      history, addHistory, clearHistory, removeHistoryItem,
      favorites, toggleFavorite, isFavorite,
      settings, updateSetting, clearAllData,
      generationCount: history.length,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}

export default AppContext
