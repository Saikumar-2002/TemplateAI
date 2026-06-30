import React from 'react'
import { Link } from 'react-router-dom'
import templates from '../data/templates.json'

export default function Collections() {
  // Group templates by category for the collections view
  const categories = Array.from(new Set(templates.map(t => t.category)))
  
  const collections = categories.map(cat => ({
    title: cat,
    templates: templates.filter(t => t.category === cat),
    cover: templates.find(t => t.category === cat)?.preview
  }))

  return (
    <div className="pt-24 pb-20 container">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold">Collections</h1>
        <p className="text-gray-400 mt-2">Browse templates organized by theme and category.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map(col => (
          <Link to="/explore" state={{ filter: col.title }} key={col.title} className="group block">
            <div className="relative rounded-2xl overflow-hidden glass border border-white/10 aspect-video">
              <img 
                src={col.cover} 
                alt={col.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${col.title}/600/400` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white group-hover:text-violet-300 transition-colors">{col.title}</h3>
                <p className="text-gray-300 text-sm mt-1">{col.templates.length} Templates</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
