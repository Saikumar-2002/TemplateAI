import React, { useState, useMemo } from 'react'
import CategoryCarousel from '../components/CategoryCarousel'
import TemplateCard from '../components/TemplateCard'
import templates from '../data/templates.json'

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))]

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    return templates
      .filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesCategory = activeCategory === 'All' || t.category === activeCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => b.popularity - a.popularity)
  }, [searchTerm, activeCategory])

  return (
    <div className="pt-24 pb-20 container">
      <div className="mb-8 text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold">Explore Templates</h1>
        <p className="text-gray-400 text-lg">Discover {templates.length}+ premium AI templates for any occasion.</p>
        
        {/* Search */}
        <div className="relative mt-6">
          <input
            type="text"
            placeholder="Search templates, tags, styles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-violet-500 transition shadow-inner"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🔍</div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-2 hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat 
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredTemplates.map(t => (
            <div key={t.id} className="w-full">
               <TemplateCard template={t} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-2xl border border-white/5">
          <div className="text-6xl mb-4">👻</div>
          <h3 className="text-2xl font-bold">No templates found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your search or category filter.</p>
          <button 
            onClick={() => { setSearchTerm(''); setActiveCategory('All') }}
            className="mt-6 px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
