import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import ImageEditor from './ImageEditor'

export default function UploadCard({onChange, initialImage}){
  const [file, setFile] = useState(null)
  const [dataUrl, setDataUrl] = useState(initialImage || null)

  useEffect(()=>{
    if(onChange) onChange(dataUrl, file)
  },[dataUrl, file])

  function handleFile(e){
    const f = e.target.files && e.target.files[0]
    if(!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = ()=> setDataUrl(reader.result)
    reader.readAsDataURL(f)
  }

  function remove(){
    setFile(null)
    setDataUrl(null)
  }

  const [editing, setEditing] = useState(false)

  function handleEdit(){
    setEditing(true)
  }

  function handleEditComplete(dataUrl){
    setDataUrl(dataUrl)
    setEditing(false)
  }

  return (
    <div className="glass p-4 rounded-xl border border-white/6">
      {!dataUrl ? (
        <div className="text-center py-8">
          <div className="text-lg font-semibold">Drag & Drop or Upload</div>
          <div className="text-sm text-gray-400 mt-2">Support JPG, PNG. Max 10MB</div>
          <div className="mt-4">
            <input type="file" accept="image/*" onChange={handleFile} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <img src={dataUrl} alt="preview" className="w-full h-64 object-cover rounded-md" />
          <div className="flex gap-2">
            <label className="px-3 py-2 bg-white/6 rounded cursor-pointer">
              Replace
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            <button onClick={remove} className="px-3 py-2 bg-white/6 rounded">Remove</button>
            <button onClick={handleEdit} className="px-3 py-2 bg-white/6 rounded">Edit</button>
          </div>
        </div>
      )}
      {editing && (
        <Modal open={editing} onClose={()=>setEditing(false)}>
          <ImageEditor imageSrc={dataUrl} onComplete={(d)=>{handleEditComplete(d); if(onChange) onChange(d,file)}} onCancel={()=>setEditing(false)} />
        </Modal>
      )}
    </div>
  )
}
