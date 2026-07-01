import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { compositeImage, PROCESSING_STAGES } from '../services/compositeEngine'
import { downloadImage, generateFilename } from '../utils/downloadUtils'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import ImageEditor from './ImageEditor'
import UpgradeModal from './UpgradeModal'

const STEPS = ['preview', 'upload', 'processing', 'result']

export default function TemplateModal({ template, open, onClose }) {
  const [step, setStep] = useState('preview')
  const [userPhotos, setUserPhotos] = useState([])
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const init = {}
    ;(template?.options || []).forEach(o => (init[o.name] = o.values[0]))
    return init
  })
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [resultUrl, setResultUrl] = useState(null)
  const [editing, setEditing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  
  // Simulated backend prompt injection
  const [activePrompt, setActivePrompt] = useState('')

  const fileInputRef = useRef(null)
  const { addHistory, toggleFavorite, isFavorite, userPlan, downloadsCount, incrementDownloads } = useApp()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState('Download Limit Reached')

  useEffect(() => {
    if (template) {
      const opts = Object.entries(selectedOptions).map(([k,v]) => `${k}: ${v}`).join(', ')
      // Start with the new dynamic base prompt, or fallback if it doesn't exist
      let prompt = template.basePrompt || `Masterpiece portrait, highly detailed, ${template.category}, style of ${template.title}, tags: ${template.tags?.join(', ')}. `
      prompt += `Customization: ${opts}. Use uploaded subject face maintaining exact likeness, realistic lighting, 8k resolution.`
      setActivePrompt(prompt)
    }
  }, [template, selectedOptions])

  const handleFile = useCallback((file, index = 0) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setUserPhotos(prev => {
        const newArr = [...prev]
        newArr[index] = { file, url: reader.result }
        return newArr
      })
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e, index = 0) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer?.files?.[0]
    if (file && file.type.startsWith('image/')) handleFile(file, index)
  }, [handleFile])

  const handleGenerate = useCallback(async () => {
    if (!currentUser) {
      alert("Please log in to generate trends!")
      navigate('/login')
      return
    }
    
    // Check if we have enough photos
    const reqPhotos = template.requiredPhotos || 1
    if (userPhotos.length < reqPhotos || userPhotos.some(p => !p)) {
      alert(`Please upload all ${reqPhotos} required photo(s).`)
      return
    }

    setStep('processing')
    setProgress(0)
    setProgressLabel(PROCESSING_STAGES[0].label)

    try {
      const result = await compositeImage({
        userImageSrcs: userPhotos.map(p => p.url),
        templateImageSrc: template.preview,
        template,
        selectedOptions,
        onProgress: (p, label) => {
          setProgress(p)
          setProgressLabel(label)
        },
      })
      setResultUrl(result)
      addHistory({
        templateId: template.id,
        templateTitle: template.title,
        templateCategory: template.category,
        templatePreview: template.preview,
        resultDataUrl: result,
      })
      setStep('result')
    } catch (err) {
      console.error(err)
      alert('Generation failed: ' + err.message)
      setStep('upload')
    }
  }, [userPhotos, template, selectedOptions, addHistory])

  const handleStandardDownload = useCallback(() => {
    if (!resultUrl) return
    if (userPlan === 'Starter' && downloadsCount >= 2) {
      setUpgradeFeature('Download Limit Reached')
      setShowUpgradeModal(true)
      return
    }
    if (userPlan === 'Starter') incrementDownloads()
    downloadImage(resultUrl, generateFilename(template.title))
  }, [resultUrl, template, userPlan, downloadsCount, incrementDownloads])

  const handleHDDownload = useCallback(() => {
    if (!resultUrl) return
    if (userPlan === 'Starter') {
      setUpgradeFeature('High-Quality Downloads')
      setShowUpgradeModal(true)
      return
    }
    downloadImage(resultUrl, generateFilename(template.title + '_HD'))
  }, [resultUrl, template, userPlan])

  const resetModal = useCallback(() => {
    setStep('preview')
    setUserPhotos([])
    setResultUrl(null)
    setProgress(0)
  }, [])

  const handleClose = useCallback(() => {
    resetModal()
    onClose?.()
  }, [onClose, resetModal])

  if (!open || !template) return null

  const fav = isFavorite(template.id)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0d14] shadow-2xl hide-scrollbar"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition text-lg"
          >
            ✕
          </button>

          {/* Step indicator */}
          <div className="px-8 pt-6 pb-4 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      STEPS.indexOf(step) >= i
                        ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/20'
                        : 'bg-black/50 border border-white/10 text-gray-500'
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 rounded-full ${
                        STEPS.indexOf(step) > i ? 'bg-gradient-to-r from-violet-500 to-indigo-500' : 'bg-white/10'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium px-1 uppercase tracking-wider">
              <span>Preview</span>
              <span>Upload</span>
              <span>Process</span>
              <span>Result</span>
            </div>
          </div>

          <div className="p-8">
            {/* ─── STEP 1: PREVIEW ─── */}
            {step === 'preview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl group">
                    <img
                      src={template.preview}
                      alt={template.title}
                      className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/${template.id}/600/800` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <button
                      onClick={() => toggleFavorite(template.id)}
                      className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg transition ${
                        fav ? 'bg-pink-500 text-white' : 'bg-black/50 text-white/70 hover:bg-black/70 border border-white/10'
                      }`}
                    >
                      {fav ? '♥' : '♡'}
                    </button>
                  </div>

                  <div className="flex flex-col">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider">
                          {template.category}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                          ⏱ ~{template.estTime}s
                        </span>
                      </div>
                      <h2 className="text-3xl font-bold mb-2">{template.title}</h2>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">{template.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {(template.tags || []).map(tag => (
                        <span key={tag} className="text-gray-500 text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex-1">
                      {/* Customization Options */}
                      {(template.options || []).map(opt => (
                        <div key={opt.name} className="mb-4">
                          <div className="text-sm font-semibold text-gray-300 mb-2">{opt.name}</div>
                          <div className="flex flex-wrap gap-2">
                            {opt.values.map(v => (
                              <button
                                key={v}
                                onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.name]: v }))}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                                  selectedOptions[opt.name] === v
                                    ? 'bg-white text-black shadow-lg shadow-white/10'
                                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                                }`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Backend Prompt Visualization */}
                    <div className="mt-4 p-4 rounded-xl bg-black/50 border border-white/5 mb-6">
                      <div className="text-xs text-violet-400 font-mono mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
                        AI Prompt Configuration
                      </div>
                      <p className="text-xs font-mono text-gray-500 line-clamp-2" title={activePrompt}>
                        {activePrompt}
                      </p>
                    </div>

                    <button
                      onClick={() => setStep('upload')}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(124,77,255,0.3)] hover:shadow-[0_0_30px_rgba(124,77,255,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Use This Template →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 2: UPLOAD ─── */}
            {step === 'upload' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold">Upload Your Photo{template.requiredPhotos > 1 ? 's' : ''}</h3>
                  <p className="text-gray-400 mt-2">
                    For the AI to perfectly map your face to the trend, use a clear forward-facing selfie.
                    {template.requiredPhotos === 2 && " This template requires two subjects (e.g., Bride and Groom)."}
                  </p>
                </div>

                <div className={`grid gap-6 ${template.requiredPhotos === 2 ? 'md:grid-cols-2' : ''}`}>
                  {Array.from({ length: template.requiredPhotos || 1 }).map((_, i) => {
                    const photo = userPhotos[i]
                    return (
                      <div key={i} className="flex-1">
                        {!photo ? (
                          <div
                            className={`h-full border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                              dragOver
                                ? 'border-violet-500 bg-violet-500/10 scale-[1.02]'
                                : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                            }`}
                            onClick={() => {
                              // We need a unique ref for each input, but for simplicity we can just find it
                              document.getElementById(`file-upload-${i}`)?.click()
                            }}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => handleDrop(e, i)}
                          >
                            <div className="text-4xl mb-4">📸</div>
                            <div className="text-lg font-bold">
                              {template.requiredPhotos === 2 ? `Upload Person ${i + 1}` : 'Drag & Drop'}
                            </div>
                            <div className="text-gray-400 text-sm mt-2">or click to browse</div>
                            <input
                              id={`file-upload-${i}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFile(e.target.files?.[0], i)}
                            />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 h-64">
                              <img src={photo.url} alt={`Subject ${i + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/80 text-xs font-semibold backdrop-blur-md border border-white/10">
                                {template.requiredPhotos === 2 ? `Person ${i + 1}` : 'Your Photo'}
                              </div>
                            </div>
                            <div className="flex justify-center">
                              <label className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold text-sm cursor-pointer transition">
                                Replace Photo
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFile(e.target.files?.[0], i)}
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/5 mt-8">
                  <button
                    onClick={() => setStep('preview')}
                    className="px-8 py-4 rounded-xl border border-white/10 font-semibold hover:bg-white/5 transition"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={userPhotos.length < (template.requiredPhotos || 1) || userPhotos.some(p => !p)}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                      userPhotos.length >= (template.requiredPhotos || 1) && !userPhotos.some(p => !p)
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-[0_0_20px_rgba(124,77,255,0.3)] hover:shadow-[0_0_30px_rgba(124,77,255,0.5)] hover:scale-[1.01]'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    ✨ Generate Trend Image
                  </button>
                </div>

                {/* Edit Modal (Crop) - Simplified to just handle the first photo for now if editing is needed */}
                {editing && userPhotos[0] && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
                    <div className="bg-[#0d0d14] rounded-3xl p-6 w-full max-w-3xl border border-white/10 shadow-2xl">
                      <h3 className="text-xl font-bold mb-4">Crop Photo</h3>
                      <ImageEditor
                        imageSrc={userPhotos[0].url}
                        onComplete={(d) => {
                          setUserPhotos(prev => {
                            const arr = [...prev]
                            arr[0] = { ...arr[0], url: d }
                            return arr
                          })
                          setEditing(false)
                        }}
                        onCancel={() => setEditing(false)}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── STEP 3: PROCESSING ─── */}
            {step === 'processing' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center space-y-10">
                <div className="relative inline-block">
                  <div className="w-40 h-40 rounded-full border-4 border-white/5 flex items-center justify-center relative overflow-hidden">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-violet-500 border-r-indigo-500"
                    />
                    <div className="absolute inset-2 bg-[#0d0d14] rounded-full flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">{progress}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">Executing Trend Prompt...</h3>
                  <p className="text-violet-300 text-lg animate-pulse">{progressLabel}</p>
                </div>

                {/* Showing the prompt being processed */}
                <div className="max-w-xl mx-auto bg-black/50 border border-white/10 rounded-xl p-4 text-left">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">AI Engine Prompt</div>
                  <div className="text-sm font-mono text-green-400/80 leading-relaxed overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="h-10 overflow-hidden"
                    >
                      {activePrompt}
                    </motion.div>
                  </div>
                </div>

                <div className="max-w-lg mx-auto">
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── STEP 4: RESULT ─── */}
            {step === 'result' && resultUrl && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-wider mb-4">
                    Trend Generated Successfully
                  </div>
                  <h3 className="text-3xl font-bold">Your AI Image is Ready!</h3>
                </div>

                <div className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden border border-violet-500/30 shadow-[0_0_50px_rgba(124,77,255,0.15)] group">
                  <img src={resultUrl} alt="Generated" className="w-full max-h-[500px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <div className="text-xs text-white/50 font-mono mb-2">PROMPT APPLIED:</div>
                    <div className="text-sm text-white/90 font-mono line-clamp-2">{activePrompt}</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center max-w-2xl mx-auto pt-6 border-t border-white/5">
                  <button
                    onClick={() => {
                      resetModal()
                      setStep('preview')
                    }}
                    className="px-6 py-4 rounded-xl border border-white/10 font-semibold hover:bg-white/5 transition"
                  >
                    New Template
                  </button>
                  <div className="flex flex-col gap-3 flex-1">
                    <button
                      onClick={handleStandardDownload}
                      className="py-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold text-lg transition-all active:scale-[0.98]"
                    >
                      <span>⬇</span> Download Standard
                    </button>
                    <button
                      onClick={handleHDDownload}
                      className="py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <span>⬇</span> Download HD {userPlan === 'Starter' && '🔒'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
        feature={upgradeFeature}
      />
    </AnimatePresence>
  )
}
