export default function TopChart({ songs }) {
  if (!songs || songs.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ color: 'var(--text-dim)' }}>
          Aun no hay votos. Se el primero en votar!
        </p>
      </div>
    )
  }

  return (
    <div>
      {songs.map((song, index) => {
        const inPodium = song.rank <= 3
        return (
          <div
            key={song.songId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 16px',
              marginBottom: 2,
              transition: 'background .15s',
              background: inPodium ? 'linear-gradient(135deg, rgba(110,184,208,0.06), transparent)' : 'transparent',
            }}
            onMouseEnter={e => e.currentTarget.style.background = inPodium ? 'linear-gradient(135deg, rgba(110,184,208,0.08), transparent)' : 'var(--hover)'}
            onMouseLeave={e => e.currentTarget.style.background = inPodium ? 'linear-gradient(135deg, rgba(110,184,208,0.06), transparent)' : 'transparent'}
          >
            <span style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0,
              background: inPodium ? 'linear-gradient(180deg, #7cc4dc, #6eb8d0)' : 'linear-gradient(180deg, #1e1e22, #141416)',
              color: inPodium ? '#08080a' : 'var(--text-dim)',
              boxShadow: inPodium ? 'inset 0 1px 0 rgba(255,255,255,0.2), 0 0 8px var(--accent-glow)' : 'inset 0 1px 0 rgba(255,255,255,0.04)'
            }}>
              {song.rank}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 500,
                fontSize: 15,
                color: inPodium ? 'var(--text)' : 'var(--text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {song.title}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                {song.albumName}
                {song.featuredArtists && ` · ft. ${song.featuredArtists}`}
              </div>
            </div>
            <span style={{
              color: inPodium ? 'var(--accent)' : 'var(--text-dim)',
              fontWeight: inPodium ? 600 : 500,
              fontSize: 13,
              fontVariantNumeric: 'tabular-nums'
            }}>
              {song.voteCount} voto{song.voteCount !== 1 ? 's' : ''}
            </span>
          </div>
        )
      })}
    </div>
  )
}