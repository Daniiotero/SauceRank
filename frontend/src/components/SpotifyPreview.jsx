import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Icon from './ui/Icon'

const MOBILE_QUERY = '(max-width: 768px)'

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
  const popupRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  if (!spotifyTrackId) return null

  const popup = (
    <div ref={popupRef} className="spotify-popup">
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

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        className="star-btn"
        aria-label={open ? 'Cerrar preview de Spotify' : 'Escuchar preview en Spotify'}
        aria-expanded={open}
        style={{ border: '1px solid var(--border-strong)', width: 36, height: 36 }}
      >
        <Icon name="spotify" size={15} />
      </button>
      {open &&
        (isMobile
          ? createPortal(
              <div
                className="spotify-overlay"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setOpen(false)
                }}
              >
                {popup}
              </div>,
              document.body,
            )
          : popup)}
    </div>
  )
}
