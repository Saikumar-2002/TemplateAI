import React from 'react'
import { Sparkles, TrendingUp, Video, Briefcase, Heart, Gamepad2, Crown, Feather, Globe, Camera } from 'lucide-react'

export default function CategoriesSection(){
  const cats = [
    { name: 'Trending', desc: 'Viral hits', icon: TrendingUp, color: 'from-pink-500 to-rose-500' },
    { name: 'Professional', desc: 'LinkedIn & Resumes', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
    { name: 'Spiritual', desc: 'Peaceful & Divine', icon: Sparkles, color: 'from-yellow-400 to-orange-500' },
    { name: 'Movie Posters', desc: 'Cinematic styles', icon: Video, color: 'from-red-500 to-rose-600' },
    { name: 'Wedding', desc: 'Romantic memories', icon: Heart, color: 'from-pink-400 to-rose-400' },
    { name: 'Gaming', desc: 'Esports avatars', icon: Gamepad2, color: 'from-green-400 to-emerald-600' },
    { name: 'Royal', desc: 'Kings & Queens', icon: Crown, color: 'from-amber-400 to-yellow-600' },
    { name: 'Fantasy', desc: 'Magic & Myth', icon: Feather, color: 'from-purple-500 to-violet-600' },
    { name: 'Travel', desc: 'Global aesthetics', icon: Globe, color: 'from-sky-400 to-blue-600' },
    { name: 'Instagram', desc: 'Social media ready', icon: Camera, color: 'from-fuchsia-500 to-pink-500' }
  ]

  return (
    <section className="py-24 bg-[#0a0a0f] border-y border-white/5 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center mb-16">
           <span className="text-violet-400 font-bold tracking-wider text-sm uppercase">Limitless Options</span>
           <h2 className="text-4xl md:text-5xl font-bold mt-2">Transform Into Anything</h2>
           <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
             Whether you need a sharp professional headshot or a mystical spiritual avatar, our templates have you covered.
           </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {cats.map(({ name, desc, icon: Icon, color }, i) => (
            <div key={i} className="p-6 rounded-3xl glass border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 cursor-pointer group hover:-translate-y-1">
              <div className={`w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-white mb-1">{name}</h3>
              <p className="text-xs text-gray-400 font-medium">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
