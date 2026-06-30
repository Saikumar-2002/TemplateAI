import React from 'react'
import { Link } from 'react-router-dom'
import CategoryCarousel from '../components/CategoryCarousel'
import templates from '../data/templates.json'
import { useApp } from '../context/AppContext'

export default function Dashboard() {
  const { history, favorites, generationCount } = useApp()

  const categories = [
    { title: 'Trending Now', data: templates.slice(0, 8) },
    { title: 'New Arrivals', data: templates.slice(24, 32) },
    { title: 'Movie Posters', data: templates.filter(t => t.category === 'Movie Posters').slice(0,8) },
    { title: 'Professional Headshots', data: templates.filter(t => t.category === 'LinkedIn').slice(0,8) },
    { title: 'Social Media', data: templates.filter(t => t.category === 'Instagram').slice(0,8) },
  ]

  return (
    <div className="pt-24 pb-20 container space-y-12">
      
      {/* Welcome & Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl glass p-8 border border-white/10 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-violet-500/20 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">👋 Welcome back, Creator</h1>
            <p className="text-gray-400 text-lg max-w-lg">
              Ready to transform another photo? Explore our newest premium templates below.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/explore" className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-semibold shadow-lg shadow-violet-500/20 hover:scale-[1.02] transition">
                Explore Templates
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-rows-2 gap-4">
           <div className="rounded-2xl glass p-6 border border-white/10 flex flex-col justify-center items-center text-center">
              <div className="text-4xl font-bold text-violet-400">{generationCount}</div>
              <div className="text-sm text-gray-400 mt-1">Total Generations</div>
           </div>
           <div className="rounded-2xl glass p-6 border border-white/10 flex flex-col justify-center items-center text-center">
              <div className="text-4xl font-bold text-pink-400">{favorites.length}</div>
              <div className="text-sm text-gray-400 mt-1">Saved Favorites</div>
           </div>
        </div>
      </div>

      {/* Recent History Shortcut */}
      {history.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Recent Generations</h3>
            <Link to="/history" className="text-violet-400 hover:text-violet-300 text-sm font-medium">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {history.slice(0, 5).map(item => (
              <div key={item.id} className="rounded-xl overflow-hidden glass border border-white/10 relative group">
                <img src={item.resultDataUrl} alt={item.templateTitle} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                   <div className="text-sm font-medium truncate">{item.templateTitle}</div>
                   <div className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Carousels */}
      <div className="space-y-2">
        {categories.map((c, idx) => (
          <CategoryCarousel key={c.title} title={c.title} templates={c.data} />
        ))}
      </div>
    </div>
  )
}
