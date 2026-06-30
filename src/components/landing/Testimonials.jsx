import React from 'react'

export default function Testimonials(){
  const items = [
    {name:'Jessica Parker', text:'TemplateAI is insanely good!'},
    {name:'Alex Morgan', text:'Super easy to use and templates are amazing!'},
    {name:'Rohan Mehta', text:'I got pro-quality results in minutes.'}
  ]
  return (
    <section className="pt-12">
      <div className="container">
        <h3 className="text-2xl font-semibold mb-4">Loved by Thousands</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((it,idx)=> (
            <div key={idx} className="p-4 rounded-lg card-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/6 flex items-center justify-center">{it.name.split(' ').map(n=>n[0]).join('')}</div>
                <div className="font-semibold">{it.name}</div>
              </div>
              <div className="text-gray-300 text-sm mt-3">{it.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
