import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="pt-24 pb-20 container max-w-4xl">
      <div className="glass rounded-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 space-y-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold">About <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">TemplateAI</span></h1>
          
          <p className="text-xl text-gray-300 leading-relaxed">
            TemplateAI is a revolutionary platform that empowers anyone to create professional, studio-quality visuals in seconds. 
            No prompting required, no design skills needed.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div>
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="text-lg font-bold">Zero Prompts</h3>
              <p className="text-sm text-gray-400 mt-2">Forget complex prompt engineering. Just click a template and get results.</p>
            </div>
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-lg font-bold">Instant Results</h3>
              <p className="text-sm text-gray-400 mt-2">Our on-device compositing engine renders your images in seconds.</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="text-lg font-bold">Privacy First</h3>
              <p className="text-sm text-gray-400 mt-2">Your photos are processed entirely on your device. We don't store your face.</p>
            </div>
          </div>
          
          <div className="pt-8">
            <Link to="/explore" className="inline-block px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition">
              Explore Templates
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
