import { useEffect, useRef } from 'react'

const cursorForRoute = (path) => {
  if (path === '/explore' || path.startsWith('/recipes/')) return '⌕'
  if (path === '/intelligence') return '⚛'
  if (path === '/substitution') return '⇄'
  if (path === '/rescue') return '🔥'
  if (path === '/nutrition') return '❋'
  if (path === '/generate') return '✦'
  if (path === '/discover') return '✺'
  if (path === '/compare') return '↔'
  if (path === '/taste-lab') return '◉'
  if (path === '/profile') return '✎'
  if (path === '/about') return '◌'
  return '✳'
}

export default function FlavorCursor({ path }) {
  const cursorRef = useRef(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const node = cursorRef.current
    if (!finePointer || reducedMotion || !node) return undefined

    let frame = 0
    let pointerX = 0
    let pointerY = 0
    let previousX = 0

    const render = () => {
      frame = 0
      const tilt = Math.max(-14, Math.min(14, (pointerX - previousX) * 0.6))
      node.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) rotate(${tilt}deg)`
      node.style.setProperty('--cursor-trail-x', `${Math.max(-12, Math.min(12, previousX - pointerX))}px`)
      previousX = pointerX
    }
    const move = (event) => {
      if (event.pointerType !== 'mouse') return
      pointerX = event.clientX
      pointerY = event.clientY
      if (!frame) frame = requestAnimationFrame(render)
    }

    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={cursorRef} className={`flavor-cursor cursor-${path.slice(1).replaceAll('/', '-') || 'home'}`} aria-hidden="true">
      <span>{cursorForRoute(path)}</span>
    </div>
  )
}
