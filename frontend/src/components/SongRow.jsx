import SpotifyPreview from './SpotifyPreview'

export default function SongRow({ song, onVote, onUnvote, disabled }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 0',
      borderBottom: '1px solid #222'
    }}>
      <span style={{ width: 30, textAlign: 'center', color: '#666', fontWeight: 600, fontSize: 14 }}>
        {song.trackNumber}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>{song.title}</div>
        {song.featuredArtists && (
          <div style={{ fontSize: 13, color: '#888' }}>ft. {song.featuredArtists}</div>
        )}
      </div>
      <div style={{ fontSize: 13, color: '#666', whiteSpace: 'nowrap' }}>
        {song.voteCount} voto{song.voteCount !== 1 ? 's' : ''}
      </div>
      <SpotifyPreview spotifyTrackId={song.spotifyTrackId} />
      {song.votedByCurrentUser ? (
        <button
          className="btn btn-danger"
          onClick={() => onUnvote(song.id)}
          disabled={disabled}
          style={{ padding: '6px 14px', fontSize: 12, whiteSpace: 'nowrap' }}
        >
          Quitar voto
        </button>
      ) : (
        <button
          className="btn btn-primary"
          onClick={() => onVote(song.id)}
          disabled={disabled}
          style={{ padding: '6px 14px', fontSize: 12, whiteSpace: 'nowrap' }}
        >
          Votar
        </button>
      )}
    </div>
  )
}
