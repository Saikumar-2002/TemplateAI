import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { downloadImage, generateFilename } from '../utils/downloadUtils'
import { useApp } from '../context/AppContext'
import UpgradeModal from '../components/UpgradeModal'
import { useState } from 'react'

export default function Generate() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const resultUrl = state?.result
  const template = state?.template
  const { userPlan, downloadsCount, incrementDownloads } = useApp()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState('Download Limit Reached')

  const handleStandardDownload = () => {
    if (userPlan === 'Starter' && downloadsCount >= 2) {
      setUpgradeFeature('Download Limit Reached')
      setShowUpgradeModal(true)
      return
    }
    if (userPlan === 'Starter') incrementDownloads()
    downloadImage(resultUrl, generateFilename(template?.title))
  }

  const handleHDDownload = () => {
    if (userPlan === 'Starter') {
      setUpgradeFeature('High-Quality Downloads')
      setShowUpgradeModal(true)
      return
    }
    downloadImage(resultUrl, generateFilename(template?.title + '_HD'))
  }

  if (!resultUrl) {
    return (
      <div className="pt-32 pb-20 container text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-3xl font-bold">No Generation Found</h2>
        <p className="text-gray-400 mt-4 max-w-md mx-auto">
          It looks like you haven't generated an image recently or the session expired.
        </p>
        <button onClick={() => navigate('/explore')} className="mt-8 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold transition">
          Explore Templates
        </button>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 container max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
         <div>
           <h1 className="text-3xl font-bold flex items-center gap-3">
             <span className="text-emerald-400">✨</span> Success!
           </h1>
           <p className="text-gray-400 mt-2">Your AI image based on "{template?.title}" is ready.</p>
         </div>
         <button onClick={() => navigate(-1)} className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition">
           ← Go Back
         </button>
      </div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-8">
        
        {/* Result Image */}
        <div className="rounded-2xl glass p-2 border border-violet-500/30 shadow-[0_0_50px_rgba(124,77,255,0.15)] relative overflow-hidden group">
           <img src={resultUrl} alt="Generated AI Image" className="w-full rounded-xl object-cover" />
           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button 
                onClick={handleHDDownload}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-xl transform hover:scale-105 transition flex items-center gap-2"
              >
                <span>⬇</span> Download HD {userPlan === 'Starter' && '🔒'}
              </button>
           </div>
        </div>

        {/* Actions & Details */}
        <div className="space-y-6">
           <div className="rounded-2xl glass p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4">Actions</h3>
              <button 
                onClick={handleStandardDownload}
                className="w-full py-4 mb-3 rounded-xl border border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400 font-bold shadow-lg transition hover:scale-[1.02]"
              >
                Download Standard
              </button>
              <button 
                onClick={handleHDDownload}
                className="w-full py-4 mb-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg hover:shadow-emerald-500/30 transition hover:scale-[1.02]"
              >
                Download HD {userPlan === 'Starter' && '🔒'}
              </button>
              <button 
                onClick={() => navigate('/history')}
                className="w-full py-3 mb-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-medium transition"
              >
                View in History
              </button>
              <button 
                onClick={() => navigate('/explore')}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-medium transition"
              >
                Try Another Template
              </button>
           </div>

           <div className="rounded-2xl glass p-6 border border-white/10">
              <h4 className="font-semibold text-gray-300 mb-3">Generation Details</h4>
              <ul className="space-y-2 text-sm">
                 <li className="flex justify-between">
                   <span className="text-gray-500">Template</span>
                   <span className="font-medium">{template?.title}</span>
                 </li>
                 <li className="flex justify-between">
                   <span className="text-gray-500">Category</span>
                   <span className="font-medium">{template?.category}</span>
                 </li>
                 <li className="flex justify-between">
                   <span className="text-gray-500">Date</span>
                   <span className="font-medium">{new Date().toLocaleDateString()}</span>
                 </li>
                 <li className="flex justify-between">
                   <span className="text-gray-500">Resolution</span>
                   <span className="font-medium">1024x1024</span>
                 </li>
              </ul>
           </div>
        </div>

      </div>

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        feature={upgradeFeature}
      />
    </div>
  )
}
