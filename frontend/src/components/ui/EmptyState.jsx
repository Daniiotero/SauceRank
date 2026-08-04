import Icon from './Icon'

export default function EmptyState({ icon, title, description, action, style }) {
  return (
    <div className="empty-state" style={style}>
      {icon && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Icon name={icon} size={34} className="text-muted" />
        </div>
      )}
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--text-primary)', marginBottom: description ? 6 : 0 }}>
        {title}
      </p>
      {description && (
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 380, margin: '0 auto' }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 'var(--space-5)' }}>{action}</div>}
    </div>
  )
}
