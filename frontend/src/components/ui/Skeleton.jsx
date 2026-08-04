export function Skeleton({ width, height, circle, style, className = '' }) {
  return (
    <div
      className={`skeleton${circle ? ' skeleton-circle' : ''}${className ? ` ${className}` : ''}`}
      style={{ width: width ?? '100%', height: height ?? 14, ...style }}
    />
  )
}

export function SkeletonText({ width = '80%', short }) {
  return <Skeleton width={short ? '50%' : width} height={14} className="skeleton-text" />
}

export function AlbumGridSkeleton({ count = 10 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 'var(--space-5)'
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton height="auto" style={{ aspectRatio: '1/1', borderRadius: 'var(--radius-md)' }} />
          <div style={{ padding: '14px 6px 0' }}>
            <SkeletonText width="60%" />
            <SkeletonText width="35%" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SongListSkeleton({ count = 6 }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px' }}
        >
          <Skeleton width={26} height={18} />
          <div style={{ flex: 1 }}>
            <SkeletonText width="55%" />
            <SkeletonText width="30%" />
          </div>
          <Skeleton width={90} height={26} circle />
        </div>
      ))}
    </div>
  )
}
