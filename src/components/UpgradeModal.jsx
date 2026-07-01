import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, X } from 'lucide-react'

export default function UpgradeModal({ isOpen, onClose, feature = "Download Limit Reached" }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-500" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 flex items-center justify-center mb-6 mx-auto">
            <Crown className="w-8 h-8 text-violet-400" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-3">Upgrade to Pro</h2>
          
          <p className="text-gray-400 text-center mb-8">
            {feature === "Download Limit Reached" 
              ? "You've reached your free download limit. Upgrade to Pro Creator to download unlimited images and access premium features."
              : `Upgrade to Pro Creator to unlock ${feature} and take your content to the next level.`}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <span className="text-emerald-400">✓</span> Unlimited High-Quality Downloads
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <span className="text-emerald-400">✓</span> No Watermarks
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <span className="text-emerald-400">✓</span> Priority Processing
            </div>
          </div>

          <button 
            onClick={() => {
              onClose()
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
              // If not on landing page, user needs to navigate. 
              // A safer bet is to use window.location.href if they are deep in the app
              if (window.location.pathname !== '/') {
                window.location.href = '/#pricing'
              }
            }}
            className="w-full mt-8 py-4 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-lg hover:shadow-violet-500/25 hover:scale-[1.02] transition-all"
          >
            View Pricing Plans
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
