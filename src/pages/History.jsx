import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { downloadImage, generateFilename } from '../utils/downloadUtils'

export default function History() {
  const { history, clearHistory, removeHistoryItem } = useApp()

  return (
    <div className="pt-24 pb-20 container max-w-6xl">
      <div className="mb-8 flex flex-wrap gap-4 items-end justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold">Generation History</h1>
          <p className="text-gray-400 mt-2">Your past creations ({history.length})</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your entire history?')) {
                clearHistory()
              }
            }} 
            className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition"
          >
            Clear History
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {history.map(item => (
            <div key={item.id} className="rounded-xl overflow-hidden glass border border-white/10 flex flex-col">
              <div className="relative group">
                <img src={item.resultDataUrl} alt={item.templateTitle} className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-2">
                   <button 
                     onClick={() => downloadImage(item.resultDataUrl, generateFilename(item.templateTitle))}
                     className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:scale-110 transition"
                     title="Download"
                   >
                     ⬇
                   </button>
                   <button 
                     onClick={() => removeHistoryItem(item.id)}
                     className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition"
                     title="Delete"
                   >
                     ✕
                   </button>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="font-semibold truncate">{item.templateTitle}</div>
                <div className="text-xs text-gray-400 mt-1 mb-3">{new Date(item.timestamp).toLocaleString()}</div>
                <Link 
                  to={`/templates/${item.templateId}`}
                  className="mt-auto block text-center w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition"
                >
                  Generate Again
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-2xl border border-white/5 max-w-2xl mx-auto">
          <div className="text-6xl mb-4 text-gray-500">⏱</div>
          <h3 className="text-2xl font-bold">No history yet</h3>
          <p className="text-gray-400 mt-2">Images you generate will appear here so you can download them later.</p>
          <Link to="/explore" className="inline-block mt-6 px-6 py-3 bg-violet-600 rounded-xl hover:bg-violet-500 font-semibold transition">
            Start Creating
          </Link>
        </div>
      )}
    </div>
  )
}
