import React from 'react'
import { Link } from 'react-router-dom'

// Daily challenges rotate automatically based on the day of the year
const CHALLENGES = [
  {
    title: 'Cyberpunk Neon Portrait',
    desc: 'Transform your selfie into a futuristic cyberpunk warrior with neon lights and rain.',
    img: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '3.2K',
    tag: 'cyberpunk'
  },
  {
    title: 'Royal King / Queen',
    desc: 'See yourself as royalty — gold crown, velvet robes, and a grand throne room.',
    img: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '2.8K',
    tag: 'royal'
  },
  {
    title: 'Anime Hero Transformation',
    desc: 'Turn your photo into a stunning anime character straight from a manga series.',
    img: 'https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '5.1K',
    tag: 'anime'
  },
  {
    title: 'Bollywood Movie Poster',
    desc: 'Become the star of your own Bollywood blockbuster with dramatic lighting and typography.',
    img: 'https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '4.7K',
    tag: 'movie'
  },
  {
    title: 'Spiritual Meditation Aura',
    desc: 'Generate a peaceful divine portrait with golden aura, lotus flowers, and sacred geometry.',
    img: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '1.9K',
    tag: 'spiritual'
  },
  {
    title: 'CEO LinkedIn Headshot',
    desc: 'Get a sharp, professional corporate headshot worthy of a Fortune 500 profile.',
    img: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '6.3K',
    tag: 'professional'
  },
  {
    title: 'Fantasy Elf Warrior',
    desc: 'Transform into an ethereal elf warrior in an enchanted forest with magical lighting.',
    img: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '3.5K',
    tag: 'fantasy'
  }
]

function getTodayChallenge() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return CHALLENGES[dayOfYear % CHALLENGES.length]
}

const avatars = [
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=80',
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=80',
  'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=80'
]

export default function ChallengeOfDay(){
  const challenge = getTodayChallenge()

  return (
    <section className="pt-12">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-[0_36px_110px_rgba(0,0,0,0.55)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,77,255,0.18),transparent_35%)]" />
          <div className="absolute inset-0 rounded-[2rem] border border-white/10 pointer-events-none" />
          <div className="grid lg:grid-cols-[1.45fr_0.95fr] items-center">
            <div className="relative z-10 px-8 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-400/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-violet-300">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-400 text-slate-950">🏆</span>
                  Challenge of the Day
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE NOW
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-4">{challenge.title}</h3>
              <p className="text-gray-400 max-w-2xl leading-8 mb-8">{challenge.desc}</p>
              <div className="flex flex-wrap gap-4 items-center">
                <Link 
                  to="/challenge" 
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-8 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(124,77,255,0.28)] hover:shadow-[0_18px_55px_rgba(124,77,255,0.4)] hover:scale-105 transition-all"
                >
                  Join Challenge →
                </Link>
                <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/85 border border-white/10 px-4 py-2 text-sm text-gray-300">
                  <div className="flex -space-x-2">
                    {avatars.map((src, idx) => (
                      <span key={idx} className="inline-flex h-10 w-10 rounded-full border-2 border-slate-950 bg-slate-900 overflow-hidden shadow-lg">
                        <img src={src} alt={`avatar ${idx + 1}`} className="h-full w-full object-cover" />
                      </span>
                    ))}
                  </div>
                  <span className="font-semibold">{challenge.joined} Joined</span>
                </div>
              </div>
            </div>
            <div className="relative h-[28rem] lg:h-[34rem] overflow-hidden">
              <img
                src={challenge.img}
                alt={challenge.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.18),transparent_30%,rgba(15,23,42,0.32))] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
