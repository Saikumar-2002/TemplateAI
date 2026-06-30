import React from 'react'
import CategoryCarousel from '../CategoryCarousel'
import templates from '../../data/templates.json'

export default function TrendingTemplates(){
  const trending = templates.slice(0,8)
  return (
    <section className="pt-12">
      <div className="container">
        <h3 className="text-2xl font-semibold mb-4">Trending Templates</h3>
        <CategoryCarousel title="Trending This Week" templates={trending} />
      </div>
    </section>
  )
}
