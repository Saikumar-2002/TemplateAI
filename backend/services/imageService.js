const fetch = require('node-fetch')

async function generateImage({prompt, image}){
  // If IMAGE_PROVIDER=openai and OPENAI_API_KEY provided, call OpenAI Images API
  if(process.env.IMAGE_PROVIDER === 'openai' && process.env.OPENAI_API_KEY){
    // Use OpenAI Images API (generations)
    const body = {
      model: 'dall-e-2',
      prompt,
      n: 1,
      size: '512x512'
    }

    const res = await fetch('https://api.openai.com/v1/images/generations',{
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if(!res.ok){
      const txt = await res.text()
      throw new Error('OpenAI Image API error: ' + txt)
    }

    const json = await res.json()
    // response may include data[0].url or data[0].b64_json
    const d = json.data && json.data[0]
    if(d.url) return { provider: 'openai', url: d.url, raw: json }
    if(d.b64_json) return { provider: 'openai', b64: d.b64_json, raw: json }
  }

  // If IMAGE_API_URL and IMAGE_API_KEY provided for other providers, forward request
  if(process.env.IMAGE_API_URL && process.env.IMAGE_API_KEY){
    const res = await fetch(process.env.IMAGE_API_URL,{
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.IMAGE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({prompt, image})
    })

    if(!res.ok){
      const txt = await res.text()
      throw new Error('Image API error: ' + txt)
    }

    const json = await res.json()
    return { provider: 'external', data: json }
  }

  // Mock: return a generated image URL (picsum) and echo prompt length
  const mockUrl = `https://picsum.photos/seed/generated${Math.floor(Math.random()*10000)}/1024/1024`
  return { provider: 'mock', url: mockUrl, promptPreviewLength: prompt.length }
}

module.exports = { generateImage }
