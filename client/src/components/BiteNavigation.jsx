import { useEffect, useRef, useState } from 'react'

const destinations = [
  ['HOME', '/'],
  ['EXPLORE', '/explore'],
  ['INTELLIGENCE', '/intelligence'],
  ['SUBSTITUTION', '/substitution'],
  ['RESCUE', '/rescue'],
  ['NUTRITION', '/nutrition'],
  ['GENERATOR', '/generate'],
  ['DISCOVER', '/discover'],
  ['COUNTERFACTUAL', '/compare'],
  ['TASTE LAB', '/taste-lab'],
  ['NOTEBOOK', '/profile'],
  ['METHOD', '/about'],
]

export default function BiteNavigation({ path, onNavigate }) {
  const [bite, setBite] = useState(0)
  const [open, setOpen] = useState(false)
  const navRef = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    let observer
    let frame = 0

    if (path === '/') {
      const scenes = [...document.querySelectorAll('.home-scene')]
      const visible = new Map()

      if ('IntersectionObserver' in window && scenes.length) {
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const index = Number(entry.target.dataset.scene)
            if (entry.isIntersecting) visible.set(index, entry.intersectionRatio)
            else visible.delete(index)
          })

          const current = [...visible.entries()].sort((a, b) => b[1] - a[1])[0]
          if (current) setBite(Math.max(0, Math.min(6, current[0])))
        }, { threshold: [0.2, 0.4, 0.6, 0.8] })

        scenes.forEach((scene) => observer.observe(scene))
      }
    } else {
      const measure = () => {
        frame = 0
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? window.scrollY / max : 0
        setBite(Math.max(0, Math.min(6, Math.floor(progress * 7))))
      }
      const scheduleMeasure = () => {
        if (!frame) frame = requestAnimationFrame(measure)
      }
      measure()
      window.addEventListener('scroll', scheduleMeasure, { passive: true })
      window.addEventListener('resize', scheduleMeasure)

      return () => {
        observer?.disconnect()
        if (frame) cancelAnimationFrame(frame)
        window.removeEventListener('scroll', scheduleMeasure)
        window.removeEventListener('resize', scheduleMeasure)
      }
    }

    return () => {
      observer?.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [path])

  useEffect(() => {
    if (!open) return undefined

    const focusFrame = requestAnimationFrame(() => {
      navRef.current?.querySelector('.destination-menu button')?.focus()
    })
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const handlePointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [open])

  const navigate = (destination) => {
    setOpen(false)
    onNavigate(destination)
  }

  return (
    <aside ref={navRef} className={`bite-nav bite-${bite}${open ? ' is-open' : ''}`}>
      <button
        ref={toggleRef}
        className="burger-stack"
        type="button"
        aria-label={open ? 'Close FlavoLens destinations' : 'Open FlavoLens destinations'}
        aria-expanded={open}
        aria-controls="flavolens-destinations"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="burger-top" aria-hidden="true" />
        <span className="burger-layer sauce" aria-hidden="true" />
        <span className="burger-layer lettuce" aria-hidden="true" />
        <span className="burger-layer tomato" aria-hidden="true" />
        <span className="burger-layer onion" aria-hidden="true" />
        <span className="burger-layer cheese" aria-hidden="true" />
        <span className="burger-layer patty" aria-hidden="true" />
        <span className="burger-layer sauce sauce-bottom" aria-hidden="true" />
        <span className="burger-bottom" aria-hidden="true" />
        <span className="burger-steam" aria-hidden="true">✦</span>
      </button>
      <nav id="flavolens-destinations" className="destination-menu" aria-label="FlavoLens destinations" hidden={!open}>
        <p>FOLLOW THE FLAVOUR</p>
        <div>
          {destinations.map(([label, destination], index) => (
            <button
              key={destination}
              type="button"
              className={path === destination ? 'current' : ''}
              onClick={() => navigate(destination)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setOpen(false)
                  toggleRef.current?.focus()
                }
              }}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  )
}
