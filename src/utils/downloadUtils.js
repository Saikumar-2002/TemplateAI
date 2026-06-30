/**
 * Download utility — triggers browser download of a data URL or blob URL
 */

export function downloadImage(dataUrl, filename = 'TemplateAI_Image.jpg') {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function generateFilename(templateTitle) {
  const clean = (templateTitle || 'Image')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 40)
  const timestamp = new Date().toISOString().slice(0, 10)
  return `TemplateAI_${clean}_${timestamp}.jpg`
}
