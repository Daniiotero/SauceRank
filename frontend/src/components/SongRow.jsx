import SpotifyPreview from './SpotifyPreview'
import StarRating from './StarRating'

export default function SongRow({ song, onVote, loading, disabled }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 16px',
      borderBottom: '1px solid var(--border)',
      transition: 'background .15s'
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{
        width: 24,
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontWeight: 500,
        fontSize: 14,
        fontVariantNumeric: 'tabular-nums'
      }}>
        {song.trackNumber}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 500,
          fontSize: 15,
          color: 'var(--text)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {song.title}
        </div>
        {song.featuredArtists && (
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 1 }}>
            ft. {song.featuredArtists}
          </div>
        )}
      </div>
      <SpotifyPreview spotifyTrackId={song.spotifyTrackId} />
      {disabled ? null : (
        <StarRating
          score={song.votedByCurrentUser ? song.userScore : 0}
          onRate={score => onVote(song.id, score)}
          disabled={loading}
          size={15}
        />
      )}
    </div>
  )
}
