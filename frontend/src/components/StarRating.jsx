export default function StarRating({ score = 0, onRate, disabled, size = 18 }) {
  const stars = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div
      className="star-rating"
      data-disabled={disabled}
      role="radiogroup"
      aria-label="Puntuación del 1 al 10"
    >
      {stars.map(n => {
        const filled = n <= score
        return (
          <button
            key={n}
            type="button"
            className={`star-btn${filled ? ' filled' : ''}`}
            role="radio"
            aria-checked={filled}
            aria-label={`${n} de 10`}
            title={`${n} estrella${n !== 1 ? 's' : ''}`}
            disabled={disabled}
            onClick={() => !disabled && onRate(n)}
            style={{ fontSize: size }}
          >
            <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        )
      })}
      <span className="star-score" aria-live="polite">
        {score}
      </span>
    </div>
  )
}
