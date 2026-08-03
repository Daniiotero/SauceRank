import { useState, useRef, useEffect } from 'react'

export default function SpotifyPreview({ spotifyTrackId }) {
  const [open, setOpen] = useState(false)
  const popupRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  if (!spotifyTrackId) return null

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid var(--border-light)',
          background: 'linear-gradient(180deg, #1e1e22, #141416)',
          color: 'var(--accent)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          transition: 'all .15s'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #7cc4dc, #6eb8d0)'; e.currentTarget.style.color = '#08080a'; e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.boxShadow = '0 0 12px var(--accent-glow)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(180deg, #1e1e22, #141416)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
        title="Escuchar en Spotify"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.14-1.38 9.48-.66 13.08 1.56.36.24.48.84.239 1.26zm.12-3.36c-3.84-2.28-10.14-2.52-13.8-1.38-.54.18-1.14-.12-1.32-.66-.18-.541.12-1.141.66-1.321 4.2-1.38 10.92-1.08 15.18 1.56.48.3.66 1.02.36 1.5-.301.36-.959.48-1.08.301z"/>
        </svg>
      </button>
      {open && (
        <div
          ref={popupRef}
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            zIndex: 10,
            marginTop: 8,
            width: 300,
            maxWidth: '80vw',
            background: '#0e0e10',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-lg)',
            padding: 8
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                fontSize: 18,
                lineHeight: 1,
                padding: '0 2px'
              }}
              title="Cerrar"
            >
              &times;
            </button>
          </div>
          <iframe
            src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="encrypted-media; clipboard-write"
            style={{ borderRadius: 'var(--radius-sm)' }}
            title="Spotify"
          />
        </div>
      )}
    </div>
  )
}