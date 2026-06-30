/**
 * Client-side Canvas Compositing Engine
 * Simulates "AI generation" by compositing the user's photo with a template's style.
 * Uses Canvas API for blending, color grading, and effects — no backend required.
 */

// ─── Style Effect Presets ───────────────────────────────────────────
const CATEGORY_EFFECTS = {
  'Movie Posters': { brightness: 1.1, contrast: 1.3, saturate: 1.2, hueRotate: 0, overlay: 'rgba(20,10,40,0.35)', vignette: 0.7, grain: 0.15 },
  'LinkedIn':      { brightness: 1.05, contrast: 1.05, saturate: 0.95, hueRotate: 0, overlay: 'rgba(240,240,255,0.08)', vignette: 0.2, grain: 0.02 },
  'Wedding':       { brightness: 1.15, contrast: 1.0, saturate: 0.85, hueRotate: -10, overlay: 'rgba(255,230,200,0.18)', vignette: 0.35, grain: 0.08 },
  'Gaming':        { brightness: 1.1, contrast: 1.4, saturate: 1.4, hueRotate: 15, overlay: 'rgba(0,255,180,0.12)', vignette: 0.6, grain: 0.1 },
  'Royal':         { brightness: 1.0, contrast: 1.2, saturate: 1.1, hueRotate: -5, overlay: 'rgba(180,140,50,0.22)', vignette: 0.55, grain: 0.12 },
  'Fantasy':       { brightness: 1.15, contrast: 1.25, saturate: 1.35, hueRotate: 20, overlay: 'rgba(80,0,160,0.2)', vignette: 0.5, grain: 0.18 },
  'Travel':        { brightness: 1.2, contrast: 1.1, saturate: 1.25, hueRotate: 5, overlay: 'rgba(255,200,100,0.1)', vignette: 0.3, grain: 0.05 },
  'Instagram':     { brightness: 1.1, contrast: 1.15, saturate: 1.2, hueRotate: 0, overlay: 'rgba(255,180,220,0.1)', vignette: 0.25, grain: 0.04 },
  'New Today':     { brightness: 1.1, contrast: 1.2, saturate: 1.15, hueRotate: 10, overlay: 'rgba(100,50,255,0.15)', vignette: 0.4, grain: 0.08 },
}

const OPTION_MODIFIERS = {
  'Noir':          { brightness: 0.85, contrast: 1.5, saturate: 0.2 },
  'Dark':          { brightness: 0.8, contrast: 1.3, saturate: 0.6 },
  'Gritty':        { brightness: 0.9, contrast: 1.4, saturate: 0.5, grain: 0.25 },
  'Neon':          { brightness: 1.1, saturate: 1.6, hueRotate: 30 },
  'Neon Pink':     { brightness: 1.1, saturate: 1.5, hueRotate: -20, overlay: 'rgba(255,0,120,0.15)' },
  'Cyan':          { brightness: 1.1, saturate: 1.4, hueRotate: 40, overlay: 'rgba(0,255,255,0.1)' },
  'Purple':        { brightness: 1.05, saturate: 1.3, hueRotate: -30, overlay: 'rgba(120,0,255,0.12)' },
  'Warm':          { brightness: 1.1, hueRotate: -15, overlay: 'rgba(255,180,80,0.12)' },
  'Cool':          { brightness: 1.05, hueRotate: 20, overlay: 'rgba(80,140,255,0.12)' },
  'Monochrome':    { saturate: 0.0 },
  'Low-key':       { brightness: 0.75, contrast: 1.4, vignette: 0.8 },
  'High-key':      { brightness: 1.3, contrast: 0.9 },
  'Cinematic':     { brightness: 0.95, contrast: 1.25, saturate: 1.1, vignette: 0.6, overlay: 'rgba(10,20,40,0.15)' },
  'Soft':          { brightness: 1.15, contrast: 0.9, saturate: 0.9 },
  'Studio':        { brightness: 1.1, contrast: 1.1, saturate: 1.0, vignette: 0.15 },
  'Film':          { brightness: 1.05, contrast: 1.15, saturate: 0.85, grain: 0.2, overlay: 'rgba(200,180,140,0.08)' },
  'Gloss':         { brightness: 1.15, contrast: 1.2, saturate: 1.2 },
  'Matte':         { brightness: 1.0, contrast: 0.95, saturate: 0.8 },
  'Sunset':        { brightness: 1.15, hueRotate: -20, overlay: 'rgba(255,120,40,0.18)' },
  'Twilight':      { brightness: 0.85, hueRotate: 25, overlay: 'rgba(40,20,80,0.2)' },
  'Vintage':       { brightness: 1.05, contrast: 1.1, saturate: 0.7, grain: 0.2, overlay: 'rgba(180,140,80,0.12)' },
  'Synthwave':     { brightness: 1.1, contrast: 1.3, saturate: 1.5, hueRotate: -25, overlay: 'rgba(255,0,150,0.12)' },
  'Rain':          { brightness: 0.85, contrast: 1.2, saturate: 0.8, overlay: 'rgba(50,60,80,0.2)' },
  'Fog':           { brightness: 1.1, contrast: 0.85, saturate: 0.7, overlay: 'rgba(200,210,220,0.2)' },
  'Night':         { brightness: 0.7, contrast: 1.3, saturate: 0.8, overlay: 'rgba(10,10,40,0.3)' },
  'Dawn':          { brightness: 1.1, hueRotate: -10, overlay: 'rgba(255,180,120,0.15)' },
  'Dusk':          { brightness: 0.9, hueRotate: 15, overlay: 'rgba(120,60,160,0.15)' },
  'Vibrant':       { brightness: 1.1, saturate: 1.4 },
  'Muted':         { brightness: 1.0, saturate: 0.6 },
  'Desaturated':   { saturate: 0.3 },
  'High Contrast': { contrast: 1.6, brightness: 0.95 },
  'Gold':          { hueRotate: -15, overlay: 'rgba(200,170,50,0.15)' },
  'Silver':        { saturate: 0.3, brightness: 1.1, overlay: 'rgba(200,210,220,0.12)' },
  'Ivory':         { brightness: 1.15, saturate: 0.85, overlay: 'rgba(255,250,230,0.12)' },
  'Blush':         { hueRotate: -10, overlay: 'rgba(255,180,190,0.15)' },
}

// ─── Processing Stages ──────────────────────────────────────────────
export const PROCESSING_STAGES = [
  { label: 'Analyzing face structure...', duration: 800 },
  { label: 'Mapping facial landmarks...', duration: 600 },
  { label: 'Applying template style...', duration: 1000 },
  { label: 'Color grading & effects...', duration: 700 },
  { label: 'Final rendering...', duration: 900 },
]

// ─── Helper: Load Image ─────────────────────────────────────────────
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(new Error('Failed to load image: ' + src))
    img.src = src
  })
}

// ─── Helper: Draw vignette ──────────────────────────────────────────
function drawVignette(ctx, w, h, intensity) {
  if (intensity <= 0) return
  const gradient = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.75)
  gradient.addColorStop(0, 'rgba(0,0,0,0)')
  gradient.addColorStop(1, `rgba(0,0,0,${intensity})`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)
}

// ─── Helper: Draw grain ─────────────────────────────────────────────
function drawGrain(ctx, w, h, intensity) {
  if (intensity <= 0) return
  const imageData = ctx.getImageData(0, 0, w, h)
  const pixels = imageData.data
  const strength = intensity * 60
  for (let i = 0; i < pixels.length; i += 4) {
    const noise = (Math.random() - 0.5) * strength
    pixels[i] += noise
    pixels[i + 1] += noise
    pixels[i + 2] += noise
  }
  ctx.putImageData(imageData, 0, 0)
}

// ─── Helper: Draw color overlay ─────────────────────────────────────
function drawOverlay(ctx, w, h, color) {
  if (!color) return
  ctx.fillStyle = color
  ctx.fillRect(0, 0, w, h)
}

// ─── Helper: Add template name watermark ────────────────────────────
function drawWatermark(ctx, w, h, text) {
  ctx.save()
  ctx.font = `bold ${Math.max(16, w * 0.035)}px Inter, system-ui, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.shadowColor = 'rgba(0,0,0,0.8)'
  ctx.shadowBlur = 8
  ctx.textAlign = 'center'
  ctx.fillText(text, w / 2, h - 30)
  ctx.restore()
}

// ─── Main Compositing Function ──────────────────────────────────────
export async function compositeImage({
  userImageSrc,
  templateImageSrc,
  template,
  selectedOptions = {},
  outputWidth = 1024,
  quality = 'high',
  onProgress = () => {},
}) {
  const qualityMultiplier = quality === 'high' ? 1 : quality === 'medium' ? 0.75 : 0.5
  const finalWidth = Math.round(outputWidth * qualityMultiplier)

  // Stage 1: Load images
  onProgress(0, PROCESSING_STAGES[0].label)
  
  let userImg, templateImg
  try {
    // Try loading both, but template image may fail (cross-origin)
    const results = await Promise.allSettled([
      loadImage(userImageSrc),
      loadImage(templateImageSrc),
    ])
    userImg = results[0].status === 'fulfilled' ? results[0].value : null
    templateImg = results[1].status === 'fulfilled' ? results[1].value : null
  } catch {
    // fallback
  }

  if (!userImg) throw new Error('Could not load your photo.')

  await delay(PROCESSING_STAGES[0].duration)
  onProgress(20, PROCESSING_STAGES[1].label)

  // Stage 2: Setup canvas
  const aspectRatio = userImg.height / userImg.width
  const finalHeight = Math.round(finalWidth * Math.max(aspectRatio, 1.2))

  const canvas = document.createElement('canvas')
  canvas.width = finalWidth
  canvas.height = finalHeight
  const ctx = canvas.getContext('2d')

  await delay(PROCESSING_STAGES[1].duration)
  onProgress(40, PROCESSING_STAGES[2].label)

  // Stage 3: Draw user image as base, scaled to fill
  const userAspect = userImg.width / userImg.height
  const canvasAspect = finalWidth / finalHeight
  let sx = 0, sy = 0, sw = userImg.width, sh = userImg.height
  if (userAspect > canvasAspect) {
    sw = userImg.height * canvasAspect
    sx = (userImg.width - sw) / 2
  } else {
    sh = userImg.width / canvasAspect
    sy = (userImg.height - sh) / 2
  }
  ctx.drawImage(userImg, sx, sy, sw, sh, 0, 0, finalWidth, finalHeight)

  await delay(PROCESSING_STAGES[2].duration)
  onProgress(60, PROCESSING_STAGES[3].label)

  // Stage 4: Apply category-based effects
  const category = template?.category || 'Movie Posters'
  const baseEffect = { ...CATEGORY_EFFECTS[category] || CATEGORY_EFFECTS['Movie Posters'] }

  // Apply option-based modifiers
  Object.values(selectedOptions).forEach(val => {
    const mod = OPTION_MODIFIERS[val]
    if (mod) {
      if (mod.brightness) baseEffect.brightness = (baseEffect.brightness || 1) * mod.brightness
      if (mod.contrast) baseEffect.contrast = (baseEffect.contrast || 1) * mod.contrast
      if (mod.saturate !== undefined) baseEffect.saturate = mod.saturate
      if (mod.hueRotate) baseEffect.hueRotate = (baseEffect.hueRotate || 0) + mod.hueRotate
      if (mod.overlay) baseEffect.overlay = mod.overlay
      if (mod.vignette) baseEffect.vignette = mod.vignette
      if (mod.grain) baseEffect.grain = mod.grain
    }
  })

  // Apply CSS filter equivalent via canvas
  const filterStr = [
    `brightness(${baseEffect.brightness || 1})`,
    `contrast(${baseEffect.contrast || 1})`,
    `saturate(${baseEffect.saturate || 1})`,
    `hue-rotate(${baseEffect.hueRotate || 0}deg)`,
  ].join(' ')

  // Re-draw with filter
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = finalWidth
  tempCanvas.height = finalHeight
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.filter = filterStr
  tempCtx.drawImage(canvas, 0, 0)

  // Copy back
  ctx.clearRect(0, 0, finalWidth, finalHeight)
  ctx.drawImage(tempCanvas, 0, 0)

  // Draw overlay
  drawOverlay(ctx, finalWidth, finalHeight, baseEffect.overlay)

  // Draw vignette
  drawVignette(ctx, finalWidth, finalHeight, baseEffect.vignette || 0)

  await delay(PROCESSING_STAGES[3].duration)
  onProgress(80, PROCESSING_STAGES[4].label)

  // Stage 5: Add grain and watermark
  drawGrain(ctx, finalWidth, finalHeight, baseEffect.grain || 0)
  drawWatermark(ctx, finalWidth, finalHeight, template?.title || 'TemplateAI')

  await delay(PROCESSING_STAGES[4].duration)
  onProgress(100, 'Complete!')

  // Return data URL
  return canvas.toDataURL('image/jpeg', 0.92)
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}

export default compositeImage
