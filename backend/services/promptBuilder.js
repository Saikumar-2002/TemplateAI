// Simple prompt builder: converts template metadata and selected options into a hidden prompt

function build(template, options){
  const title = template.title
  const category = template.category
  const descriptors = template.tags ? template.tags.join(', ') : ''
  const optionPairs = Object.entries(options || {}).map(([k,v]) => `${k}: ${Array.isArray(v)?v.join(', '):v}`).join('; ')

  const prompt = `Create an image in the style of "${title}" (${category}). Descriptors: ${descriptors}. User selections: ${optionPairs}. Produce a high-resolution, photorealistic image, honoring the selected options.`
  return prompt
}

module.exports = { build }
