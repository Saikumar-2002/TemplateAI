import React, { createContext, useContext, useState, useEffect } from 'react'

const UploadContext = createContext(null)

export function UploadProvider({children}){
  const [image, setImage] = useState(()=>{
    try{
      const raw = localStorage.getItem('templateai.upload')
      return raw ? JSON.parse(raw) : null
    }catch(e){ return null }
  })

  useEffect(()=>{
    try{
      if(image) localStorage.setItem('templateai.upload', JSON.stringify(image))
      else localStorage.removeItem('templateai.upload')
    }catch(e){}
  },[image])

  return (
    <UploadContext.Provider value={{image, setImage}}>
      {children}
    </UploadContext.Provider>
  )
}

export function useUpload(){
  return useContext(UploadContext)
}

export default UploadContext
