/**
 * AI Image Generation Engine (OpenAI DALL-E 3)
 * Calls /api/generate which proxies securely to OpenAI via the backend.
 */

export const PROCESSING_STAGES = [
  { label: 'Connecting to AI Engine...', duration: 2000 },
  { label: 'Analyzing prompt parameters...', duration: 2500 },
  { label: 'Generating your image (this may take 15 seconds)...', duration: 10000 },
  { label: 'Finalizing rendering...', duration: 2000 },
]

export async function compositeImage({
  userImageSrcs = [],
  templateImageSrc,
  template,
  selectedOptions = {},
  activePrompt,
  onProgress = () => {},
}) {
  onProgress(5, PROCESSING_STAGES[0].label)

  // Keep the progress bar moving while waiting for OpenAI
  let currentProgress = 5
  const progressInterval = setInterval(() => {
    currentProgress += Math.floor(Math.random() * 3) + 1
    if (currentProgress > 93) currentProgress = 93

    let label = PROCESSING_STAGES[1].label
    if (currentProgress > 30) label = PROCESSING_STAGES[2].label
    if (currentProgress > 80) label = PROCESSING_STAGES[3].label

    onProgress(currentProgress, label)
  }, 1000)

  try {
      debugger

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: activePrompt })
    })

    clearInterval(progressInterval)

    if (!response.ok) {
      let errMsg = 'Failed to generate image'
      try {
        const err = await response.json()
        errMsg = err.error || errMsg
      } catch (_) {}
      throw new Error(errMsg)
    }

    const data = await response.json()
    onProgress(100, 'Complete!')
    return data.result?.url || data.url
  } catch (err) {
    clearInterval(progressInterval)
    throw err
  }
}
