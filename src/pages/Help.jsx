import React, { useState } from 'react'

const FAQS = [
  {
    q: "How does TemplateAI work?",
    a: "We use advanced client-side image processing to blend your uploaded photo with our premium templates. Everything happens in your browser for maximum privacy."
  },
  {
    q: "Is my data private?",
    a: "Yes! Your photos are never uploaded to any external servers. The 'AI' processing runs entirely locally on your device."
  },
  {
    q: "What kind of photos work best?",
    a: "For best results, upload clear, well-lit photos where your face is clearly visible, preferably facing forward."
  },
  {
    q: "Can I use the images commercially?",
    a: "Yes, you can download and use the generated images anywhere you like."
  }
]

export default function Help() {
  const [open, setOpen] = useState(0)

  return (
    <div className="pt-24 pb-20 container max-w-3xl">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="text-gray-400 mt-2">Frequently asked questions</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="glass rounded-2xl border border-white/10 overflow-hidden">
            <button 
              onClick={() => setOpen(open === idx ? -1 : idx)}
              className="w-full px-6 py-4 flex justify-between items-center bg-white/5 hover:bg-white/10 transition text-left"
            >
              <span className="font-semibold text-lg">{faq.q}</span>
              <span className="text-violet-400 text-xl">{open === idx ? '−' : '+'}</span>
            </button>
            {open === idx && (
              <div className="px-6 py-4 text-gray-300 border-t border-white/5">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
