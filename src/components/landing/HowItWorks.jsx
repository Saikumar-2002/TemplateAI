import React from 'react'

export default function HowItWorks(){
  const steps = [
    {
      title: 'Upload Photo', 
      desc: 'Take a selfie or upload your favorite portrait photo.',
      icon: '📸'
    },
    {
      title: 'Choose Style', 
      desc: 'Select from 100+ premium templates: Professional, Spiritual, Royal, etc.',
      icon: '✨'
    },
    {
      title: 'AI Processing', 
      desc: 'Our engine automatically applies the trend prompt to your face.',
      icon: '🧠'
    },
    {
      title: 'Download', 
      desc: 'Get your Ultra-HD studio quality photo in seconds.',
      icon: '⬇️'
    }
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container relative z-10 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-violet-400 font-bold tracking-wider text-sm uppercase">Simple Process</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">How TemplateAI Works</h2>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
            Transform your everyday selfies into professional headshots, magical avatars, or viral trends in 4 simple steps. No complex prompting required.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 md:gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-violet-500/0 via-violet-500/50 to-violet-500/0 z-0"></div>

          {steps.map((s,idx)=> (
            <div key={idx} className="relative z-10 p-8 rounded-3xl glass border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-2 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(124,77,255,0.3)] mb-6 mx-auto group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <div className="text-center">
                <div className="text-violet-400 font-bold text-sm mb-2 uppercase tracking-wide">Step {idx+1}</div>
                <h3 className="font-bold text-xl mb-3 text-white">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
