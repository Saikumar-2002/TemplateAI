import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const BACKEND_URL = 'http://localhost:4000'

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    priceNum: 0,
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
    price: '₹199',
    priceNum: 199,
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
    price: '₹999',
    priceNum: 999,
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
    buttonText: 'Upgrade to Agency',
    popular: false,
    color: 'border-white/10 hover:border-indigo-500/50'
  }
]

export default function Pricing() {
  const { userPlan, upgradePlan, planExpiry } = useApp()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null) // which plan is loading

  const handleUpgrade = async (plan) => {
    // If already on this plan, do nothing
    if (plan.name === userPlan) return

    // Free plan logic
    if (plan.name === 'Starter') {
      if (userPlan !== 'Starter') {
        alert('You are currently on a paid plan. Downgrading to Free will cancel your premium benefits immediately.')
        return // Prevent accidental downgrade (or you could add a confirmation dialog here)
      }
      upgradePlan('Starter')
      return
    }

    // Must be logged in to pay
    if (!currentUser) {
      alert('Please log in first to upgrade your plan!')
      navigate('/login')
      return
    }

    setLoading(plan.name)

    try {
      // Step 1: Create order on backend
      const orderRes = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName: plan.name }),
      })

      if (!orderRes.ok) {
        const err = await orderRes.json()
        throw new Error(err.error || 'Failed to create order')
      }

      const orderData = await orderRes.json()

      // Step 2: Open Razorpay Checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TemplateAI',
        description: `${plan.name} Plan — 1 Month`,
        order_id: orderData.orderId,
        prefill: {
          name: currentUser.displayName || '',
          email: currentUser.email || '',
        },
        theme: {
          color: '#7c4dff',
          backdrop_color: 'rgba(0,0,0,0.85)',
        },
        handler: async function (response) {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await fetch(`${BACKEND_URL}/api/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planName: plan.name,
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              // Upgrade the user!
              upgradePlan(plan.name, verifyData.expiresAt, verifyData.paymentId)
              alert(`🎉 Payment successful! You are now on the ${plan.name} plan!`)
            } else {
              alert('Payment verification failed. Please contact support.')
            }
          } catch (verifyErr) {
            console.error('Verification error:', verifyErr)
            alert('Payment received but verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id)
          }
          setLoading(null)
        },
        modal: {
          ondismiss: function () {
            setLoading(null)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error)
        alert(`Payment failed: ${response.error.description}`)
        setLoading(null)
      })
      rzp.open()
    } catch (err) {
      console.error('Payment error:', err)
      alert('Could not initiate payment: ' + err.message)
      setLoading(null)
    }
  }

  // Format expiry date for display
  const formatExpiry = (dateStr) => {
    if (!dateStr) return null
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <section id="pricing" className="py-24 relative">
      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-400 text-lg">
            Whether you're just having fun or building an audience, we have a plan for you.
            Upgrade anytime, cancel anytime.
          </p>
          {userPlan !== 'Starter' && planExpiry && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Active: {userPlan} Plan · Renews {formatExpiry(planExpiry)}
            </div>
          )}
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

              <button 
                onClick={() => handleUpgrade(plan)}
                disabled={loading === plan.name || userPlan === plan.name}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  userPlan === plan.name
                    ? 'bg-emerald-500/20 text-emerald-400 cursor-default border border-emerald-500/50'
                    : loading === plan.name
                      ? 'bg-violet-600/50 text-white/70 cursor-wait'
                      : plan.popular
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-lg hover:shadow-violet-500/25 hover:scale-[1.02]'
                        : 'bg-white/5 hover:bg-white/10 text-white'
                }`}>
                {userPlan === plan.name 
                  ? '✓ Current Plan' 
                  : loading === plan.name 
                    ? '⏳ Processing...' 
                    : plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Payment trust badges */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 font-bold">Secure Payments via</p>
          <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
            <span className="flex items-center gap-1.5"><span className="text-lg">🏦</span> UPI</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5"><span className="text-lg">💳</span> Cards</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5"><span className="text-lg">📱</span> Google Pay</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5"><span className="text-lg">📲</span> PhonePe</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5"><span className="text-lg">🔒</span> Razorpay</span>
          </div>
        </div>
      </div>
    </section>
  )
}
