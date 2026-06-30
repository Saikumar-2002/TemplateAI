import React from 'react'
import { motion } from 'framer-motion'

export default function Hero(){
  const stats = [
    {label:'Templates', value:'10,000+'},
    {label:'Happy Users', value:'500K+'},
    {label:'Satisfaction', value:'99.9%'},
    {label:'Secure', value:'Private'}
  ]

  return (
    <section className="pt-6 pb-20 relative overflow-hidden ">
      <div className="absolute inset-x-0 top-14 h-72 bg-[radial-gradient(circle_at_top,rgba(124,77,255,0.18),transparent_55%)]" />
      <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="container relative z-10">
        <div className="grid xl:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-sky-100">
              <span className="h-2 w-2 rounded-full bg-violet-400"></span>
              Premium AI Template Platform
            </div>
            <motion.h1 initial={{y:18,opacity:0}} animate={{y:0,opacity:1}} className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-[-0.03em]">
              Create Stunning <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-sky-300">AI Images</span> Without Prompts
            </motion.h1>
            <p className="text-gray-300 max-w-xl text-lg leading-8">Upload your photo, choose a template, customize the look, and watch AI create premium visuals instantly with zero prompt writing.</p>
            <div className="flex flex-wrap gap-4 items-center">
              <button className="btn-primary py-3 px-8 rounded-full shadow-[0_20px_60px_rgba(124,77,255,0.22)]">Start Creating</button>
              <button className="py-3 px-8 rounded-full border border-white/15 text-white/90 hover:bg-white/5 transition">Explore Templates</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat)=> (
                <div key={stat.label} className="p-4 rounded-3xl bg-white/5 border border-white/10">
                  <div className="text-xl sm:text-2xl font-semibold">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.div initial={{x:24,opacity:0}} animate={{x:0,opacity:1}} className="relative">
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%,rgba(0,0,0,0.4))] pointer-events-none" />
              <img
                src="/images/hero.png"
                alt="Portrait of a futuristic man"
                className="w-full h-[620px] object-cover"
              />
            </div>
            <div className="absolute left-0 top-5 w-64 p-4 rounded-3xl bg-slate-950/90 border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="text-xs text-sky-200 uppercase tracking-[0.22em] mb-2">AI Template of the Day</div>
              <div className="font-semibold text-lg">Cyber Elite Portrait</div>
              <p className="mt-3 text-sm text-gray-300">Neon-lit hero portrait with cinematic detail and premium color grading.</p>
            </div>
            <div className="absolute right-0 top-20 w-44 p-4 rounded-3xl bg-slate-950/85 border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="text-sm text-gray-300">New arrivals</div>
              <div className="mt-3 text-lg font-semibold">+125 templates</div>
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] rounded-[2rem] bg-slate-950/90 border border-white/10 p-4 shadow-2xl backdrop-blur-xl flex flex-wrap gap-3 justify-between">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-3xl overflow-hidden border border-white/10">
                  <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200" alt="thumb" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm text-gray-300">Image Preview</div>
                  <div className="font-semibold">Cyberpunk Hero</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-500/20 p-3">
                  <div className="h-3 w-3 rounded-full bg-violet-300"></div>
                </div>
                <div>
                  <div className="text-sm text-gray-300">Premium quality</div>
                  <div className="font-semibold">4.9/5</div>
                </div>
              </div>
              <button className="btn-primary rounded-full px-5 py-3">Use Now</button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
