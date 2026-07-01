const express = require('express')
const router = express.Router()
const imageService = require('../services/imageService')
const promptBuilder = require('../services/promptBuilder')
const llmService = require('../services/llmService')
const path = require('path')
const fs = require('fs')

// POST /api/generate
// body: { prompt } — direct prompt from the frontend
// OR:  { templateId, options, image } — legacy form
router.post('/', async (req, res) => {
  try {
    const { prompt, templateId, options, image } = req.body

    let finalPrompt = prompt

    // If no direct prompt provided, build it from templateId + options
    if (!finalPrompt && templateId) {
      const dataPath = path.join(__dirname, '..', '..', 'src', 'data', 'templates.json')
      const templates = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      const template = templates.find(t => String(t.id) === String(templateId))
      if (!template) return res.status(404).json({ error: 'Template not found' })

      finalPrompt = promptBuilder.build(template, options || {})
    }

    if (!finalPrompt) {
      return res.status(400).json({ error: 'No prompt provided' })
    }

    // Optionally refine via LLM (mock by default unless LLM_MODE is set)
    const refinedPrompt = await llmService.refinePrompt(finalPrompt, {})

    // DALL-E 2 has a 1000 character prompt limit
    const truncatedPrompt = refinedPrompt.substring(0, 1000)

    // Generate image via OpenAI
    const result = await imageService.generateImage({ prompt: truncatedPrompt, image })

    res.json({ ok: true, prompt: '<<hidden>>', result })
  } catch (err) {
    console.error('Generate error:', err)
    res.status(500).json({ error: 'Generation failed', details: err.message })
  }
})

module.exports = router
