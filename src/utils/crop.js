// Utility to crop image using canvas and return dataURL

export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0){
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const maxSize = Math.max(image.width, image.height)
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.save()
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate(rotation * Math.PI / 180)
  ctx.translate(-canvas.width / 2, -canvas.height / 2)

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  ctx.restore()

  return canvas.toDataURL('image/jpeg', 0.92)
}

function createImage(url){
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = () => resolve(image)
    image.onerror = error => reject(error)
    image.src = url
  })
}
