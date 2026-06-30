import React from 'react'

export default function CustomizationPanel({options, values = {}, onChange}){
  return (
    <aside className="w-full md:w-80 glass p-4 rounded-xl">
      <h4 className="font-semibold mb-3">Customize</h4>
      {(options || []).map((opt, idx) => (
        <div key={idx} className="mb-3">
          <div className="text-sm font-medium">{opt.name}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {opt.values.map(v => {
              const selected = values[opt.name] === v
              return (
                <button key={v} onClick={() => onChange && onChange(opt.name, v)} className={`px-3 py-1 rounded-md ${selected? 'bg-indigo-600 text-white' : 'bg-white/6'}`}>
                  {v}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </aside>
  )
}
