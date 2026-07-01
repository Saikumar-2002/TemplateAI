import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    q: "How does the Automated Trend feature work?",
    a: "We constantly monitor Instagram and TikTok for trending AI image styles. We extract the exact complex prompts used to generate them and bundle them into our 1-click templates. You just upload your photo, and our engine automatically applies the trending prompt to your face."
  },
  {
    q: "Do I need to write prompts myself?",
    a: "No! That's the magic. We've hardcoded the exact prompts required for every trend at the code level. You just select the template, and the AI knows exactly what to do."
  },
  {
    q: "Is my data private?",
    a: "Yes! Your photos are processed securely. We don't use your personal photos to train our models, and your data is cleared from our servers after generation."
  },
  {
    q: "What kind of photos work best?",
    a: "For the AI to perfectly map your face to the trend, upload a clear, well-lit selfie where you are facing forward without sunglasses or heavy occlusion."
  },
  {
    q: "Can I use the images commercially?",
    a: "If you are on the Pro or Agency plan, yes! You receive full commercial rights to use the generated images for ads, branding, and merchandise."
  }
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section className="py-24 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="container relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-violet-400 font-semibold tracking-wider text-sm uppercase">Got Questions?</span>
          <h2 className="text-4xl font-bold mt-2 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="glass rounded-2xl border border-white/10 overflow-hidden transition-all duration-300">
              <button
                onClick={() => setOpen(open === idx ? -1 : idx)}
                className={`w-full px-8 py-6 flex justify-between items-center transition-colors ${open === idx ? 'bg-white/5' : 'hover:bg-white/5'}`}
              >
                <span className="font-semibold text-lg text-left pr-8">{faq.q}</span>
                <span className={`text-2xl transition-transform duration-300 text-violet-400 ${open === idx ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${open === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-8 pb-6 text-gray-300 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center p-8 glass rounded-2xl border border-white/10">
          <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
          <p className="text-gray-400 mb-6">Our team is ready to help you with any issues.</p>
          <Link to="/contact" className="inline-block px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition">
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  )
}
