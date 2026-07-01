import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import templates from '../data/templates.json'
import CustomizationPanel from '../components/CustomizationPanel'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { compositeImage, PROCESSING_STAGES } from '../services/compositeEngine'
import { downloadImage, generateFilename } from '../utils/downloadUtils'
import ImageEditor from '../components/ImageEditor'
import { motion, AnimatePresence } from 'framer-motion'
import UpgradeModal from '../components/UpgradeModal'

export default function TemplateDetail() {
  const { id } = useParams()
  const t = templates.find(x => String(x.id) === String(id)) || templates[0]
  const navigate = useNavigate()
  const { addHistory, isFavorite, toggleFavorite, userPlan, downloadsCount, incrementDownloads } = useApp()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState('Download Limit Reached')

  const [selectedOptions, setSelectedOptions] = useState(() => {
    const init = {}
    ;(t.options || []).forEach(o => (init[o.name] = o.values[0]))
    return init
  })

  const [activePrompt, setActivePrompt] = useState('')

  useEffect(() => {
    if (t) {
      const opts = Object.entries(selectedOptions).map(([k,v]) => `${k}: ${v}`).join(', ')
      setActivePrompt(`Masterpiece portrait, highly detailed, ${t.category}, style of ${t.title}, tags: ${t.tags?.join(', ')}. Customization: ${opts}. Use uploaded subject face maintaining exact likeness, realistic lighting, 8k resolution.`)
    }
  }, [t, selectedOptions])

  const [userPhoto, setUserPhoto] = useState(null)
  const [userPhotoUrl, setUserPhotoUrl] = useState(null)
  const [editing, setEditing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [resultUrl, setResultUrl] = useState(null)

  const fav = isFavorite(t.id)
  const { currentUser } = useAuth()

  const handleFile = useCallback((file) => {
    if (!file) return
    setUserPhoto(file)
    const reader = new FileReader()
    reader.onload = () => setUserPhotoUrl(reader.result)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer?.files?.[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }, [handleFile])

  const handleGenerate = async () => {
    if (!currentUser) {
      alert("Please log in to generate trends!")
      navigate('/login')
      return
    }
    
    if (!userPhotoUrl) {
      alert("Please upload a photo first!")
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setProgressLabel(PROCESSING_STAGES[0].label)

    try {
      const result = await compositeImage({
        userImageSrc: userPhotoUrl,
        templateImageSrc: t.preview,
        template: t,
        selectedOptions,
        onProgress: (p, label) => {
          setProgress(p)
          setProgressLabel(label)
        },
      })
      setResultUrl(result)
      addHistory({
        templateId: t.id,
        templateTitle: t.title,
        templateCategory: t.category,
        templatePreview: t.preview,
        resultDataUrl: result,
      })
    } catch (err) {
      console.error(err)
      alert('Generation failed: ' + err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStandardDownload = () => {
    if (userPlan === 'Starter' && downloadsCount >= 2) {
      setUpgradeFeature('Download Limit Reached')
      setShowUpgradeModal(true)
      return
    }
    if (userPlan === 'Starter') incrementDownloads()
    downloadImage(resultUrl, generateFilename(t.title))
  }

  const handleHDDownload = () => {
    if (userPlan === 'Starter') {
      setUpgradeFeature('High-Quality Downloads')
      setShowUpgradeModal(true)
      return
    }
    downloadImage(resultUrl, generateFilename(t.title + '_HD'))
  }

  return (
    <div className="pt-24 pb-20 container grid lg:grid-cols-3 gap-8 max-w-7xl">
      {/* LEFT COLUMN: Template info & Result */}
      <div className="lg:col-span-2 space-y-6">
        
        {!resultUrl && !isGenerating && (
          <div className="rounded-3xl overflow-hidden glass border border-white/10 relative shadow-2xl">
             <img src={t.preview} alt={t.title} className="w-full max-h-[600px] object-cover" />
             <button
                onClick={() => toggleFavorite(t.id)}
                className={`absolute top-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-xl transition backdrop-blur-md ${
                  fav ? 'bg-pink-500 text-white' : 'bg-black/50 text-white/70 hover:bg-black/80 border border-white/20'
                }`}
              >
                {fav ? '♥' : '♡'}
              </button>
             <div className="p-8">
               <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-sm font-bold uppercase tracking-wider">
                    {t.category}
                  </span>
                  <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider border border-white/10 px-4 py-1.5 rounded-full bg-white/5">
                    ⏱ ~{t.estTime}s Generation
                  </span>
               </div>
               <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
               <p className="text-gray-400 text-lg leading-relaxed mb-6">{t.description}</p>
               
               <div className="flex flex-wrap gap-2 mb-8">
                  {(t.tags || []).map(tag => (
                    <span key={tag} className="text-gray-500 font-medium text-sm">
                      #{tag}
                    </span>
                  ))}
               </div>

               {/* Automated Prompt Display */}
               <div className="p-6 rounded-2xl bg-black/50 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Active AI Prompt</span>
                  </div>
                  <p className="font-mono text-gray-400 text-sm leading-relaxed">
                    {activePrompt}
                  </p>
               </div>
             </div>
          </div>
        )}

        {/* Processing State */}
        {isGenerating && (
           <div className="rounded-3xl glass border border-white/10 p-16 text-center space-y-10 shadow-2xl">
             <div className="relative inline-block">
                <div className="w-48 h-48 rounded-full border-4 border-white/5 flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-violet-500 border-r-indigo-500"
                  />
                  <div className="absolute inset-2 bg-[#0d0d14] rounded-full flex items-center justify-center">
                    <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">{progress}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold mb-3">Executing Trend Prompt...</h3>
                <p className="text-violet-300 animate-pulse text-xl">{progressLabel}</p>
              </div>

              <div className="max-w-xl mx-auto bg-black/50 border border-white/10 rounded-xl p-6 text-left">
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-3">Engine Input</div>
                  <div className="font-mono text-emerald-400 leading-relaxed overflow-hidden">
                    {activePrompt}
                  </div>
              </div>
           </div>
        )}

        {/* Result State */}
        {resultUrl && (
          <div className="rounded-3xl glass border border-violet-500/30 p-8 space-y-8 shadow-[0_0_50px_rgba(124,77,255,0.15)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-emerald-400">✨</span> Generation Complete
              </h2>
              <button onClick={() => setResultUrl(null)} className="text-gray-400 hover:text-white font-medium transition px-4 py-2 bg-white/5 rounded-lg">
                ← Back to original
              </button>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
               <img src={resultUrl} alt="Result" className="w-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                  <div className="text-sm text-white/50 font-mono mb-2">PROMPT APPLIED:</div>
                  <div className="text-white/90 font-mono line-clamp-3">{activePrompt}</div>
               </div>
            </div>
            
             <div className="flex flex-col gap-3">
               <div className="flex gap-4">
                 <button 
                    onClick={handleStandardDownload}
                    className="flex-1 py-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold text-lg transition-all active:scale-[0.98]"
                 >
                   ⬇ Download Standard
                 </button>
                 <button 
                    onClick={handleHDDownload}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                 >
                   ⬇ Download HD {userPlan === 'Starter' && '🔒'}
                 </button>
               </div>
               <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition font-semibold text-lg"
               >
                 Go to Dashboard
               </button>
             </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Controls */}
      <div className="space-y-6">
        
        {/* Upload Card */}
        <div className="glass p-8 rounded-3xl border border-white/10 shadow-xl">
           <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
             <h3 className="text-xl font-bold">1. Your Photo</h3>
             <span className="text-xs font-bold text-gray-500 uppercase">Required</span>
           </div>
           
           {!userPhotoUrl ? (
             <div
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                  dragOver ? 'border-violet-500 bg-violet-500/10 scale-[1.02]' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div className="text-5xl mb-4">📸</div>
                <div className="font-bold text-lg mb-2">Upload Face Photo</div>
                <div className="text-sm text-gray-500">Click or drag & drop</div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
             </div>
           ) : (
             <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-white/10 group">
                   <img src={userPhotoUrl} alt="Uploaded" className="w-full h-56 object-cover" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                      <button onClick={() => setEditing(true)} className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg font-semibold text-sm transition">Crop</button>
                   </div>
                </div>
                <button onClick={() => setUserPhotoUrl(null)} className="w-full py-3 border border-white/10 text-gray-400 hover:bg-white/5 rounded-xl font-semibold transition">
                  Replace Photo
                </button>
             </div>
           )}
        </div>

        {/* Customization */}
        <div className="glass p-8 rounded-3xl border border-white/10 shadow-xl">
           <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
             <h3 className="text-xl font-bold">2. Customize</h3>
             <span className="text-xs font-bold text-gray-500 uppercase">Optional</span>
           </div>
           <CustomizationPanel options={t.options} values={selectedOptions} onChange={(name, value)=>{
            setSelectedOptions(prev => ({...prev, [name]: value}))
          }} />
        </div>

        {/* Action */}
        <button
           onClick={handleGenerate}
           disabled={!userPhotoUrl || isGenerating}
           className={`w-full py-5 rounded-2xl font-bold text-xl transition-all shadow-xl ${
             userPhotoUrl && !isGenerating
               ? 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-[0_0_20px_rgba(124,77,255,0.3)] hover:shadow-[0_0_30px_rgba(124,77,255,0.5)] hover:scale-[1.02]'
               : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
           }`}
        >
           {isGenerating ? 'Executing Prompt...' : 'Generate AI Trend ✨'}
        </button>

      </div>

      {/* Editor Modal */}
      {editing && userPhotoUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
          <div className="bg-[#0d0d14] rounded-3xl p-8 w-full max-w-3xl border border-white/10 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Crop Photo</h3>
            <ImageEditor
              imageSrc={userPhotoUrl}
              onComplete={(d) => { setUserPhotoUrl(d); setEditing(false) }}
              onCancel={() => setEditing(false)}
            />
          </div>
        </div>
      )}

      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        feature={upgradeFeature}
      />
    </div>
  )
}
