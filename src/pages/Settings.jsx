import React from 'react'
import { useApp } from '../context/AppContext'

export default function Settings() {
  const { settings, updateSetting, clearAllData } = useApp()

  const handleClear = () => {
    if (window.confirm('WARNING: This will delete all your history, favorites, and settings. This cannot be undone. Proceed?')) {
      clearAllData()
      alert('All data has been cleared.')
    }
  }

  return (
    <div className="pt-24 pb-20 container max-w-3xl">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your app preferences and data.</p>
      </div>

      <div className="space-y-8">
        
        {/* General Preferences */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-4">General</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Theme</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => updateSetting('theme', 'dark')}
                  className={`px-4 py-2 rounded-lg border transition ${settings.theme === 'dark' ? 'border-violet-500 bg-violet-500/20 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                >
                  Dark Mode
                </button>
                <button 
                  onClick={() => updateSetting('theme', 'light')}
                  className={`px-4 py-2 rounded-lg border transition ${settings.theme === 'light' ? 'border-violet-500 bg-violet-500/20 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                >
                  Light Mode
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Generation Quality</label>
              <p className="text-xs text-gray-500 mb-3">Higher quality takes slightly longer to generate.</p>
              <div className="flex flex-wrap gap-4">
                {['low', 'medium', 'high'].map(q => (
                  <button 
                    key={q}
                    onClick={() => updateSetting('quality', q)}
                    className={`px-4 py-2 rounded-lg border capitalize transition ${settings.quality === q ? 'border-violet-500 bg-violet-500/20 text-white' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass rounded-2xl p-6 border border-red-500/20">
          <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-4 text-red-400">Data Management</h2>
          <p className="text-sm text-gray-400 mb-4">
            All your generated images and favorites are stored locally in your browser. 
            Clearing your data will permanently delete this information.
          </p>
          <button 
            onClick={handleClear}
            className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 font-semibold transition"
          >
            Clear All Local Data
          </button>
        </div>

      </div>
    </div>
  )
}
