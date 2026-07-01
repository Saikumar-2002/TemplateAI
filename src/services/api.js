export const API_BASE = import.meta.env.VITE_API_BASE || 'https://templateai-kkh8.onrender.com'

export async function generateImage({templateId, options, image}){
  const body = { templateId, options, image }
  const res = await fetch(`${API_BASE}/api/generate`,{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if(!res.ok){
    const txt = await res.text()
    throw new Error(txt)
  }
  return res.json()
}

export async function fetchTemplates(){
  const res = await fetch(`${API_BASE}/api/templates`)
  if(!res.ok) throw new Error('Failed to load templates')
  return res.json()
}
