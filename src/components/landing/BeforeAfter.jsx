import React, { useMemo, useState } from 'react'

export default function BeforeAfter() {
  const [split, setSplit] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const updateSplit = (clientX, rect) => {
    const next = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    setSplit(next)
  }

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
    const rect = event.currentTarget.getBoundingClientRect()
    updateSplit(event.clientX, rect)
  }

  const handlePointerMove = (event) => {
    if (!isDragging) return
    const rect = event.currentTarget.getBoundingClientRect()
    updateSplit(event.clientX, rect)
  }

  const handlePointerUp = (event) => {
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const comparisonLabel = useMemo(() => {
    return `${Math.round(split)}% before` 
  }, [split])

  return (
    <section className="pt-12">
      <div className="container-before">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-2xl font-semibold text-white">Before Vs After</h3>
            <p className="mt-1 text-sm text-slate-400">Drag the divider to compare the transformation.</p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-slate-200 backdrop-blur-sm">
            {comparisonLabel}
          </div>
        </div>

        <div className="glass-strong rounded-[1.75rem] p-4">
          <div
            className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900/80 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            style={{ touchAction: 'none', cursor: 'ew-resize' }}
            role="slider"
            aria-label="Before and after comparison"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(split)}
          >
            <img src="/images/before.png" alt="Before image" className="absolute inset-0 h-full w-full object-cover" />

            <div className="absolute inset-y-0 left-0 overflow-hidden" >
              <img src="/images/after.png" alt="After image" className="absolute inset-0 h-full w-full object-cover" />
            </div>

            <div className="pointer-events-none absolute inset-y-0" style={{ left: `${split}%` }}>
              <div className="h-full w-[2px] bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.45)]" />
              <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-950/70 text-white shadow-lg">
                <span className="text-lg">↔</span>
              </div>
            </div>

            <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-slate-950/70 px-3 py-1 text-sm font-medium text-slate-100 backdrop-blur-sm">
              Before
            </div>
            <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-slate-950/70 px-3 py-1 text-sm font-medium text-slate-100 backdrop-blur-sm">
              After
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
