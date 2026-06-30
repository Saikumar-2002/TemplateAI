const fetch = require('node-fetch')

async function refinePrompt(prompt, ctx={}){
  // If OPENAI_API_KEY is not provided, return mock refinement
  if(!process.env.OPENAI_API_KEY || process.env.LLM_MODE === 'mock'){
    // simple mock: append a reminder to emphasize subject's face and style
    return prompt + ' Emphasize the uploaded subject, keep subject recognition and likeness intact. Use cinematic lighting.'
  }

  // Placeholder: call OpenAI or other LLM to refine the prompt
  // This implementation is intentionally minimal; user must provide OPENAI_API_KEY
  const body = {
    model: process.env.LLM_MODEL || 'gpt-4o-mini',
    messages: [{role:'system', content: 'You are a helpful assistant that refines image generation prompts.'},{role:'user', content: prompt}],
    temperature: 0.7,
    max_tokens: 300
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions',{
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if(!res.ok){
    const txt = await res.text()
    throw new Error('LLM error: ' + txt)
  }

  const json = await res.json()
  const refined = json.choices?.[0]?.message?.content || prompt
  return refined
}

module.exports = { refinePrompt }
