import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Icon from './ui/Icon'

const MOBILE_QUERY = '(max-width: 768px)'
const POPUP_HEIGHT = 132

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window.matchMedia !== 'function') return false
    return window.matchMedia(MOBILE_QUERY).matches
  })

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}

export default function SpotifyPreview({ spotifyTrackId }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const buttonRef = useRef(null)
  const popupRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!open) return

    const updatePosition = () => {
      if (isMobile || !buttonRef.current) return
      const rect = buttonRef.current.getBoundingClientRect()
      const width = Math.min(320, window.innerWidth - 16)
      const spaceBelow = window.innerHeight - rect.bottom
      const top = spaceBelow < POPUP_HEIGHT + 16
        ? Math.max(8, rect.top - POPUP_HEIGHT - 8)
        : rect.bottom + 8
      const left = Math.max(
        8,
        Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 8),
      )
      setPos({ top, left, width })
    }

    const handleClick = (e) => {
      if (buttonRef.current && buttonRef.current.contains(e.target)) return
      if (popupRef.current && popupRef.current.contains(e.target)) return
      setOpen(false)
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    updatePosition()
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, isMobile])

  if (!spotifyTrackId) return null

  const popupStyle = isMobile
    ? { position: 'static', width: '100%', maxWidth: 320 }
    : { position: 'fixed', ...pos }

  const popup = (
    <div ref={popupRef} className="spotify-popup" style={popupStyle}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <button
          onClick={() => setOpen(false)}
          className="star-btn"
          aria-label="Cerrar"
          style={{ width: 28, height: 28 }}
        >
          <Icon name="close" size={14} />
        </button>
      </div>
      <iframe
        src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator`}
        width="100%"
        height="80"
        frameBorder="0"
        allow="encrypted-media; clipboard-write"
        style={{ borderRadius: 'var(--radius-sm)' }}
        title="Preview de Spotify"
      />
    </div>
  )

  const mobilePopup = (
    <div
      className="spotify-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false)
      }}
    >
      {popup}
    </div>
  )

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="star-btn"
        aria-label={open ? 'Cerrar preview de Spotify' : 'Escuchar preview en Spotify'}
        aria-expanded={open}
        style={{ border: '1px solid var(--border-strong)', width: 36, height: 36 }}
      >
        <Icon name="spotify" size={15} />
      </button>
      {open && createPortal(isMobile ? mobilePopup : pos ? popup : null, document.body)}
    </div>
  )
}
