import React from 'react'

export default function Showcase() {
  const showcaseImages = [
    { src: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600', author: '@sarah_styles', likes: '12.4k' },
    { src: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=600', author: '@mark_cinema', likes: '8.9k' },
    { src: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=600', author: '@tech_founder', likes: '45.1k' },
    { src: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600', author: '@neon_dreams', likes: '21.2k' },
    { src: 'https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg?auto=compress&cs=tinysrgb&w=600', author: '@wedding_vows', likes: '15.6k' },
    { src: 'https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg?auto=compress&cs=tinysrgb&w=600', author: '@gamer_pro', likes: '9.3k' },
  ]

  return (
    <section className="py-24 bg-black/40 border-y border-white/5">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-violet-400 font-semibold tracking-wider text-sm uppercase">Community</span>
          <h2 className="text-4xl font-bold mt-2 mb-4">Trending on Instagram</h2>
          <p className="text-gray-400 text-lg">
            See what our community is creating. These creators went viral using our 1-click trend templates.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {showcaseImages.map((img, i) => (
            <div key={i} className="relative group rounded-2xl overflow-hidden border border-white/10 aspect-[4/5]">
              <img 
                src={img.src} 
                alt="Showcase" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              {/* Instagram overlay simulation */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-0.5">
                       <div className="w-full h-full bg-black rounded-full border-2 border-black"></div>
                    </div>
                    {img.author}
                  </div>
                  <div className="flex items-center gap-1 text-pink-500 font-semibold">
                    <span>♥</span> {img.likes}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition font-semibold">
            View Full Gallery
          </button>
        </div>
      </div>
    </section>
  )
}
