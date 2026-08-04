export default function PageHeader({ eyebrow, title, description, align = 'left', children }) {
  return (
    <header
      className="page-enter"
      style={{
        marginBottom: 'var(--space-6)',
        textAlign: align,
        ...(align === 'center' ? { maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' } : {})
      }}
    >
      {eyebrow && (
        <p className="eyebrow" style={{ marginBottom: 'var(--space-2)' }}>
          {eyebrow}
        </p>
      )}
      <h1
        className="display"
        style={{
          fontSize: 'clamp(30px, 6vw, 46px)',
          marginBottom: description ? 'var(--space-3)' : 0,
          lineHeight: 1.05
        }}
      >
        {title}
      </h1>
      {description && (
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
          {description}
        </p>
      )}
      {children}
    </header>
  )
}
