import React from 'react'
import { Link } from 'react-router-dom'
import TemplateCard from '../components/TemplateCard'
import templates from '../data/templates.json'
import { useApp } from '../context/AppContext'

export default function Favorites() {
  const { favorites } = useApp()
  
  const favTemplates = templates.filter(t => favorites.includes(t.id))

  return (
    <div className="pt-24 pb-20 container">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold">Your Favorites</h1>
        <p className="text-gray-400 mt-2">Templates you've saved for later ({favorites.length})</p>
      </div>

      {favTemplates.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favTemplates.map(t => (
            <div key={t.id} className="w-full">
               <TemplateCard template={t} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-2xl border border-white/5 max-w-2xl mx-auto">
          <div className="text-6xl mb-4 text-pink-500">♡</div>
          <h3 className="text-2xl font-bold">No favorites yet</h3>
          <p className="text-gray-400 mt-2">When you see a template you like, click the heart icon to save it here.</p>
          <Link to="/explore" className="inline-block mt-6 px-6 py-3 bg-violet-600 rounded-xl hover:bg-violet-500 font-semibold transition">
            Explore Templates
          </Link>
        </div>
      )}
    </div>
  )
}
