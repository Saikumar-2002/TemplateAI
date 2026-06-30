import React from 'react'

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for trying out the platform and hopping on basic trends.',
    features: [
      '5 AI Generations per day',
      'Access to standard templates',
      'Standard processing speed',
      '720p Image Downloads',
      'Basic community support'
    ],
    buttonText: 'Get Started Free',
    popular: false,
    color: 'border-white/10 hover:border-white/30'
  },
  {
    name: 'Pro Creator',
    price: '$9.99',
    period: '/month',
    description: 'Everything you need to go viral on Instagram & TikTok.',
    features: [
      'Unlimited AI Generations',
      'Access to Premium & Trending templates',
      'Priority processing speed (3x faster)',
      '4K Ultra HD Downloads',
      'No watermarks',
      'Early access to new trends'
    ],
    buttonText: 'Upgrade to Pro',
    popular: true,
    color: 'border-violet-500 shadow-[0_0_30px_rgba(124,77,255,0.2)] scale-105 relative z-10 bg-gradient-to-b from-violet-500/10 to-transparent'
  },
  {
    name: 'Agency',
    price: '$29.99',
    period: '/month',
    description: 'For social media managers and high-volume creators.',
    features: [
      'Everything in Pro Creator',
      'Commercial usage rights',
      'Batch processing (up to 10 images)',
      'Custom template requests',
      'Dedicated API access',
      '24/7 Priority Support'
    ],
    buttonText: 'Contact Sales',
    popular: false,
    color: 'border-white/10 hover:border-indigo-500/50'
  }
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-400 text-lg">
            Whether you're just having fun or building an audience, we have a plan for you. 
            Upgrade anytime, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {PLANS.map((plan, i) => (
            <div key={i} className={`rounded-3xl glass p-8 border transition-all duration-300 ${plan.color}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-violet-600 to-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6 h-10">{plan.description}</p>
              
              <div className="mb-8 border-b border-white/10 pb-8">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-gray-400 ml-2">{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span className="text-gray-300 text-sm leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.popular 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-lg hover:shadow-violet-500/25 hover:scale-[1.02]' 
                  : 'bg-white/5 hover:bg-white/10 text-white'
              }`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
