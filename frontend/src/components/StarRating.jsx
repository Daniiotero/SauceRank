export default function StarRating({ score, onRate, disabled, size = 16 }) {
  const stars = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      opacity: disabled ? 0.5 : 1
    }}>
      {stars.map(n => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onRate(n)}
          onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1.15)' }}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          style={{
            width: size,
            height: size,
            border: 'none',
            background: 'none',
            cursor: disabled ? 'default' : 'pointer',
            padding: 0,
            transition: 'transform .1s',
            color: n <= score ? 'var(--accent)' : 'var(--border-light)',
            filter: n <= score ? 'drop-shadow(0 0 3px var(--accent-glow))' : 'none'
          }}
          title={`${n} estrella${n !== 1 ? 's' : ''}`}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      ))}
      <span style={{
        marginLeft: 4,
        fontSize: size * 0.8,
        color: 'var(--text-dim)',
        fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
        minWidth: 28,
        textAlign: 'center'
      }}>
        {score}/10
      </span>
    </div>
  )
}
