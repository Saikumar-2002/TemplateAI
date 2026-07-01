import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

const LS_KEYS = {
  history: 'templateai.history',
  favorites: 'templateai.favorites',
  settings: 'templateai.settings',
  userPlan: 'templateai.userPlan',
  downloadsCount: 'templateai.downloadsCount',
  planExpiry: 'templateai.planExpiry',
  paymentId: 'templateai.paymentId',
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
  const [userPlan, setUserPlan] = useState(() => loadLS(LS_KEYS.userPlan, 'Starter'))
  const [downloadsCount, setDownloadsCount] = useState(() => loadLS(LS_KEYS.downloadsCount, 0))
  const [planExpiry, setPlanExpiry] = useState(() => loadLS(LS_KEYS.planExpiry, null))
  const [paymentId, setPaymentId] = useState(() => loadLS(LS_KEYS.paymentId, null))

  useEffect(() => { saveLS(LS_KEYS.history, history) }, [history])
  useEffect(() => { saveLS(LS_KEYS.favorites, favorites) }, [favorites])
  useEffect(() => { saveLS(LS_KEYS.settings, settings) }, [settings])
  useEffect(() => { saveLS(LS_KEYS.userPlan, userPlan) }, [userPlan])
  useEffect(() => { saveLS(LS_KEYS.downloadsCount, downloadsCount) }, [downloadsCount])
  useEffect(() => { saveLS(LS_KEYS.planExpiry, planExpiry) }, [planExpiry])
  useEffect(() => { saveLS(LS_KEYS.paymentId, paymentId) }, [paymentId])

  // Check if plan has expired on load
  useEffect(() => {
    if (planExpiry && new Date(planExpiry) < new Date()) {
      setUserPlan('Starter')
      setPlanExpiry(null)
      setPaymentId(null)
    }
  }, [planExpiry])

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
    setUserPlan('Starter')
    setDownloadsCount(0)
    Object.values(LS_KEYS).forEach(k => localStorage.removeItem(k))
  }, [])

  const upgradePlan = useCallback((planName, expiresAt, razorpayPaymentId) => {
    setUserPlan(planName)
    setDownloadsCount(0) // reset download counter on upgrade
    if (expiresAt) setPlanExpiry(expiresAt)
    if (razorpayPaymentId) setPaymentId(razorpayPaymentId)
  }, [])

  const incrementDownloads = useCallback(() => {
    setDownloadsCount(prev => prev + 1)
  }, [])

  return (
    <AppContext.Provider value={{
      history, addHistory, clearHistory, removeHistoryItem,
      favorites, toggleFavorite, isFavorite,
      settings, updateSetting, clearAllData,
      generationCount: history.length,
      userPlan, upgradePlan, planExpiry, paymentId,
      downloadsCount, incrementDownloads
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}

export default AppContext
