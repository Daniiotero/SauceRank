import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import StarRating from './StarRating'
import Icon from './ui/Icon'

export default function VotePopover({ score = 0, onRate, disabled }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  const handleRate = (value) => {
    onRate(value)
    setOpen(false)
  }

  return (
    <>
      <div className="vote-mobile">
        <button
          type="button"
          className={`star-btn${score > 0 ? ' filled' : ''}`}
          aria-label={score > 0 ? `Cambiar voto: ${score} de 10` : 'Votar canción'}
          aria-haspopup="dialog"
          disabled={disabled}
          onClick={() => setOpen(true)}
          style={{ border: '1px solid var(--border-strong)', width: 36, height: 36 }}
        >
          <Icon name="star" size={15} />
        </button>
        <span className="vote-mobile-score">{score > 0 ? score : '\u00A0'}</span>
      </div>

      {open &&
        createPortal(
          <div className="vote-modal-backdrop" onClick={() => setOpen(false)}>
            <div
              className="vote-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Puntuar canción"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="vote-modal-header">
                <span className="vote-modal-title">Tu puntuación</span>
                <button
                  type="button"
                  className="star-btn"
                  aria-label="Cerrar"
                  onClick={() => setOpen(false)}
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
              <StarRating score={score} onRate={handleRate} disabled={disabled} />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
