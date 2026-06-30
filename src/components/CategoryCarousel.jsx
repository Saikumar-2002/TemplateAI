import React from 'react'
import { Link } from 'react-router-dom'
import TemplateCard from './TemplateCard'

export default function CategoryCarousel({ title, templates }){
  return (
    <section className="my-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        <Link to="/explore" className="text-sm text-violet-400 hover:text-violet-300 font-medium transition">View all →</Link>
      </div>
      <div className="flex overflow-x-auto pb-4 hide-scrollbar">
        {templates.map(t => <TemplateCard key={t.id} template={t} />)}
      </div>
    </section>
  )
}
