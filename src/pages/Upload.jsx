import React from 'react'
import UploadCard from '../components/UploadCard'
import { useUpload } from '../context/UploadContext'

export default function Upload(){
  const { image, setImage } = useUpload()

  return (
    <div className="pt-24 container">
      <h2 className="text-2xl font-semibold mb-4">Upload your photo</h2>
      <div className="max-w-2xl">
        <UploadCard initialImage={image?.dataUrl} onChange={(dataUrl,file)=>{
          if(dataUrl) setImage({ dataUrl, name: file?.name || 'uploaded' })
          else setImage(null)
        }} />
        {image && (
          <div className="mt-3 text-sm text-gray-400">Currently uploaded: {image.name} — stored globally.</div>
        )}
      </div>
    </div>
  )
}
