import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import TemplateModal from './TemplateModal'

export default function TemplateCard({ template }) {
  const [modalOpen, setModalOpen] = useState(false)
  const { isFavorite, toggleFavorite } = useApp()
  const fav = isFavorite(template.id)

  return (
    <>
      <motion.div whileHover={{ scale: 1.04 }} className="w-52 flex-shrink-0 mr-4">
        <div
          className="relative rounded-2xl overflow-hidden card-float cursor-pointer group shadow-xl"
          onClick={() => setModalOpen(true)}
        >
          <img
            src={template.preview}
            alt={template.title}
            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${template.id}/400/600` }}
          />
          
          {/* Always visible gradient at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

          {/* Full overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]" />

          {/* Text always at bottom */}
          <div className="absolute bottom-0 left-0 w-full p-4 pointer-events-none z-10">
            <div className="font-bold text-white text-sm truncate">{template.title}</div>
            <div className="text-xs text-gray-300 font-medium tracking-wide uppercase mt-1">{template.category}</div>
          </div>

          {/* Hover actions in the MIDDLE */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
             <button
                onClick={(e) => { e.stopPropagation(); setModalOpen(true) }}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-xl text-sm font-bold text-white shadow-[0_0_20px_rgba(124,77,255,0.4)] hover:scale-105 transition-transform"
              >
                Use Template
              </button>
          </div>
          
          {/* Favorite button top right */}
          <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(template.id) }}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm transition z-30 ${fav ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-black/50 text-white/70 hover:bg-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100'}`}
            >
              {fav ? '♥' : '♡'}
          </button>
        </div>
      </motion.div>

      {/* Modal */}
      <TemplateModal template={template} open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
