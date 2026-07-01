import React, { useState, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { compositeImage, PROCESSING_STAGES } from '../services/compositeEngine'
import { downloadImage, generateFilename } from '../utils/downloadUtils'
import { useApp } from '../context/AppContext'
import { motion } from 'framer-motion'
import UpgradeModal from '../components/UpgradeModal'

// ─── Daily Challenge Data (auto-rotates every day) ───
const CHALLENGES = [
  {
    id: 'cyberpunk',
    title: 'Cyberpunk Neon Portrait',
    desc: 'Upload your photo and the AI will transform you into a futuristic cyberpunk warrior with neon lights, rain effects, and holographic UI overlays.',
    prompt: 'Cyberpunk portrait, neon glow, rain, holographic HUD, futuristic city, 8k, ultra detailed, blade runner inspired',
    img: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '3.2K',
    category: 'Sci-Fi'
  },
  {
    id: 'royal',
    title: 'Royal King / Queen',
    desc: 'See yourself as royalty — the AI will place you on a grand throne with a gold crown, velvet robes, and a palace backdrop.',
    prompt: 'Royal portrait, gold crown, velvet robes, throne room, oil painting style, majestic, 8k resolution',
    img: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '2.8K',
    category: 'Royal'
  },
  {
    id: 'anime',
    title: 'Anime Hero Transformation',
    desc: 'Turn your photo into a stunning anime character. The AI will recreate you in full Japanese manga style with dramatic poses.',
    prompt: 'Anime character portrait, manga style, dramatic pose, sakura petals, studio ghibli quality, 4k',
    img: 'https://images.pexels.com/photos/7915357/pexels-photo-7915357.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '5.1K',
    category: 'Anime'
  },
  {
    id: 'bollywood',
    title: 'Bollywood Movie Poster',
    desc: 'Become the star of your own Bollywood blockbuster with dramatic lighting, cinematic color grading, and movie title typography.',
    prompt: 'Bollywood movie poster, cinematic lighting, dramatic, film grain, action hero, 8k, professional',
    img: 'https://images.pexels.com/photos/1043902/pexels-photo-1043902.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '4.7K',
    category: 'Cinema'
  },
  {
    id: 'spiritual',
    title: 'Spiritual Meditation Aura',
    desc: 'Generate a peaceful divine portrait with golden aura, lotus flowers, sacred geometry, and cosmic energy flowing around you.',
    prompt: 'Spiritual meditation portrait, golden aura, lotus flowers, sacred geometry, cosmic energy, peaceful, divine light, 8k',
    img: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '1.9K',
    category: 'Spiritual'
  },
  {
    id: 'professional',
    title: 'CEO LinkedIn Headshot',
    desc: 'Get a sharp, clean, professional corporate headshot that looks like it was shot in a studio — perfect for LinkedIn and business profiles.',
    prompt: 'Professional corporate headshot, studio lighting, clean background, business attire, sharp focus, 8k, photorealistic',
    img: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '6.3K',
    category: 'Professional'
  },
  {
    id: 'fantasy',
    title: 'Fantasy Elf Warrior',
    desc: 'Transform into an ethereal elf warrior in an enchanted forest. Complete with pointed ears, glowing armor, and magical effects.',
    prompt: 'Fantasy elf warrior portrait, enchanted forest, glowing armor, magical particles, lord of the rings style, 8k',
    img: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=800',
    joined: '3.5K',
    category: 'Fantasy'
  }
]

function getTodayChallenge() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  return CHALLENGES[dayOfYear % CHALLENGES.length]
}

function getTimeRemaining() {
  const now = new Date()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const diff = tomorrow - now
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { hours, minutes, seconds }
}

export default function Challenge() {
  const challenge = getTodayChallenge()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { addHistory, userPlan, downloadsCount, incrementDownloads } = useApp()

  const [userPhotoUrl, setUserPhotoUrl] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [resultUrl, setResultUrl] = useState(null)
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining())
  const fileInputRef = useRef(null)

  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState('Download Limit Reached')

  const handleStandardDownload = () => {
    if (userPlan === 'Starter' && downloadsCount >= 2) {
      setUpgradeFeature('Download Limit Reached')
      setShowUpgradeModal(true)
      return
    }
    if (userPlan === 'Starter') incrementDownloads()
    downloadImage(resultUrl, generateFilename(`challenge-${challenge.id}`))
  }

  const handleHDDownload = () => {
    if (userPlan === 'Starter') {
      setUpgradeFeature('High-Quality Downloads')
      setShowUpgradeModal(true)
      return
    }
    downloadImage(resultUrl, generateFilename(`challenge-${challenge.id}_HD`))
  }

  // Update countdown every second
  React.useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeRemaining()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleFile = useCallback((file) => {
    if (!file) return
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
      alert('Please log in to join the challenge!')
      navigate('/login')
      return
    }
    if (!userPhotoUrl) {
      alert('Please upload your photo first!')
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setProgressLabel(PROCESSING_STAGES[0].label)

    try {
      const result = await compositeImage({
        userImageSrc: userPhotoUrl,
        templateImageSrc: challenge.img,
        template: {
          id: challenge.id,
          title: challenge.title,
          category: challenge.category,
          tags: [challenge.id],
        },
        selectedOptions: {},
        onProgress: (p, label) => {
          setProgress(p)
          setProgressLabel(label)
        },
      })
      setResultUrl(result)
      addHistory({
        templateId: challenge.id,
        templateTitle: `🏆 Challenge: ${challenge.title}`,
        templateCategory: challenge.category,
        templatePreview: challenge.img,
        resultDataUrl: result,
      })
    } catch (err) {
      console.error(err)
      alert('Generation failed: ' + err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="pt-24 pb-20">
      {/* Hero Banner */}
      <div className="container mb-12">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,77,255,0.2),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.1),transparent_40%)]" />

          <div className="relative z-10 grid lg:grid-cols-2 items-center">
            {/* Left: Challenge Info */}
            <div className="p-8 md:p-12 lg:p-16">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-400/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-violet-300 font-bold">
                  <span className="text-lg">🏆</span> Challenge of the Day
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">{challenge.title}</h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">{challenge.desc}</p>

              {/* Countdown Timer */}
              <div className="mb-8">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Expires in</div>
                <div className="flex gap-4">
                  {[
                    { label: 'Hours', value: String(timeLeft.hours).padStart(2, '0') },
                    { label: 'Min', value: String(timeLeft.minutes).padStart(2, '0') },
                    { label: 'Sec', value: String(timeLeft.seconds).padStart(2, '0') },
                  ].map(item => (
                    <div key={item.label} className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-bold text-white font-mono">
                        {item.value}
                      </div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1 font-bold">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-violet-400 text-lg">👥</span>
                  <span className="font-semibold text-white">{challenge.joined}</span> Joined
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-lg">✨</span>
                  <span className="font-semibold text-white">Free</span> to join
                </div>
              </div>
            </div>

            {/* Right: Challenge Image */}
            <div className="relative h-[30rem] lg:h-[36rem] overflow-hidden">
              <img src={challenge.img} alt={challenge.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-950" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Upload & Generate */}
      <div className="container max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT: How it works + Upload */}
          <div className="space-y-6">
            {/* How this challenge works */}
            <div className="glass rounded-3xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6">How This Challenge Works</h2>
              <div className="space-y-5">
                {[
                  { step: '1', title: 'Upload Your Photo', desc: 'Take a selfie or use any portrait photo you love.' },
                  { step: '2', title: 'AI Applies the Trend', desc: `The AI will automatically apply today's "${challenge.title}" style to your face.` },
                  { step: '3', title: 'Download & Share', desc: 'Download your Ultra-HD result and share it on Instagram, WhatsApp, or anywhere!' },
                ].map(item => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <div className="text-sm text-gray-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Prompt being used */}
            <div className="glass rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">AI Prompt Active</span>
              </div>
              <p className="font-mono text-sm text-gray-400 leading-relaxed">{challenge.prompt}</p>
            </div>
          </div>

          {/* RIGHT: Upload + Result */}
          <div className="space-y-6">
            {/* Upload Area */}
            {!resultUrl && !isGenerating && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6">Your Photo</h2>
                
                {!userPhotoUrl ? (
                  <div
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                      dragOver ? 'border-violet-500 bg-violet-500/10 scale-[1.02]' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <div className="text-5xl mb-4">📸</div>
                    <div className="font-bold text-lg mb-2">Upload Your Face Photo</div>
                    <div className="text-sm text-gray-500">Click or drag & drop • JPG, PNG</div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden border border-white/10">
                      <img src={userPhotoUrl} alt="Your photo" className="w-full h-64 object-cover" />
                    </div>
                    <button onClick={() => setUserPhotoUrl(null)} className="w-full py-3 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 font-semibold transition">
                      Replace Photo
                    </button>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={!userPhotoUrl}
                  className={`w-full py-5 mt-6 rounded-2xl font-bold text-xl transition-all ${
                    userPhotoUrl
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-[0_0_20px_rgba(124,77,255,0.3)] hover:shadow-[0_0_30px_rgba(124,77,255,0.5)] hover:scale-[1.02]'
                      : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  🏆 Join Challenge & Generate
                </button>
              </div>
            )}

            {/* Processing */}
            {isGenerating && (
              <div className="glass rounded-3xl p-12 border border-white/10 text-center space-y-8">
                <div className="relative inline-block">
                  <div className="w-36 h-36 rounded-full border-4 border-white/5 flex items-center justify-center relative overflow-hidden">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-violet-500 border-r-indigo-500"
                    />
                    <div className="absolute inset-2 bg-[#0d0d14] rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">{progress}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Creating Your Challenge Entry...</h3>
                  <p className="text-violet-300 text-lg animate-pulse">{progressLabel}</p>
                </div>
                <div className="max-w-sm mx-auto h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Result */}
            {resultUrl && (
              <div className="glass rounded-3xl p-8 border border-violet-500/30 shadow-[0_0_40px_rgba(124,77,255,0.1)] space-y-6">
                <div className="text-center">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-wider mb-4">
                    🏆 Challenge Complete!
                  </div>
                  <h3 className="text-3xl font-bold">Your Entry is Ready!</h3>
                </div>

                <div className="rounded-2xl overflow-hidden border border-violet-500/20 shadow-2xl">
                  <img src={resultUrl} alt="Challenge Result" className="w-full object-cover" />
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <div className="flex gap-4">
                    <button
                      onClick={handleStandardDownload}
                      className="flex-1 py-4 rounded-xl border border-white/20 hover:bg-white/10 text-white font-bold text-lg transition-all active:scale-[0.98]"
                    >
                      ⬇ Download Standard
                    </button>
                    <button
                      onClick={handleHDDownload}
                      className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all hover:scale-[1.02] flex justify-center items-center gap-2"
                    >
                      ⬇ Download HD {userPlan === 'Starter' && '🔒'}
                    </button>
                  </div>
                  <button
                    onClick={() => { setResultUrl(null); setUserPhotoUrl(null) }}
                    className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition font-semibold"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Past Challenges Gallery */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">More Challenges</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CHALLENGES.filter(c => c.id !== challenge.id).map((c) => (
              <div key={c.id} className="relative group rounded-2xl overflow-hidden border border-white/10 aspect-[3/4] cursor-pointer">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-5">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">{c.category}</span>
                  <h3 className="font-bold text-white mt-1">{c.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{c.joined} joined</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/40">
                  <span className="px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/20">
                    Coming Soon
                  </span>
                </div>
              </div>
            ))}
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
