import React from 'react'

export default function Skeleton({className}){
  return <div className={`animate-pulse bg-white/3 ${className}`}></div>
}
