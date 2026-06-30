import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { motion } from 'framer-motion'
import getCroppedImg from '../utils/crop'

export default function ImageEditor({imageSrc, onComplete, onCancel}){
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleDone = async ()=>{
    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels, rotation)
    onComplete && onComplete(cropped)
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="w-full h-[70vh] flex flex-col">
      <div className="relative flex-1 bg-black">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1">
          <label className="text-sm">Zoom</label>
          <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={e=>setZoom(Number(e.target.value))} />
        </div>
        <div className="w-48">
          <label className="text-sm">Rotate</label>
          <input type="range" min="0" max="360" step="1" value={rotation} onChange={e=>setRotation(Number(e.target.value))} />
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-3 py-2 border rounded">Cancel</button>
          <button onClick={handleDone} className="px-3 py-2 bg-indigo-600 rounded">Apply</button>
        </div>
      </div>
    </motion.div>
  )
}
