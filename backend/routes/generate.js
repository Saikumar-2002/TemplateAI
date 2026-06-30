const express = require('express')
const router = express.Router()
const promptBuilder = require('../services/promptBuilder')
const llmService = require('../services/llmService')
const imageService = require('../services/imageService')
const path = require('path')
const fs = require('fs')

// POST /api/generate
// body: { templateId, options: { ... }, image?: dataUrl }
router.post('/', async (req,res)=>{
  try{
    const { templateId, options, image } = req.body
    // load templates
    const dataPath = path.join(__dirname, '..', '..', 'src', 'data', 'templates.json')
    const templates = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    const template = templates.find(t => String(t.id) === String(templateId))
    if(!template) return res.status(404).json({error:'Template not found'})

    // Build hidden prompt
    const basePrompt = promptBuilder.build(template, options)

    // Optionally refine via LLM (mock or real)
    const refinedPrompt = await llmService.refinePrompt(basePrompt, {template, options})

    // Generate image via image service (mock or real). Pass original uploaded image if any
    const result = await imageService.generateImage({prompt: refinedPrompt, image})

    // Save metadata (in future we'd persist to DB). For now return result.
    res.json({ok:true, prompt: '<<hidden>>', result})
  }catch(err){
    console.error(err)
    res.status(500).json({error: 'Generation failed', details: err.message})
  }
})

module.exports = router
