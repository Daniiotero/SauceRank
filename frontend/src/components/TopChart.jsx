import SongList from './SongList'
import EmptyState from './ui/EmptyState'
import Icon from './ui/Icon'

export default function TopChart({ songs }) {
  if (!songs || songs.length === 0) {
    return (
      <EmptyState
        icon="trophy"
        title="Aun no hay votos"
        description="Se el primero en votar y aparecera en el top de la comunidad."
      />
    )
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <SongList>
        {songs.map(song => (
          <SongList.Row key={song.songId} rank={song.rank}>
            <SongList.Rank rank={song.rank} />
            <SongList.Info
              title={song.title}
              subtitle={[
                song.albumName,
                song.featuredArtists ? `ft. ${song.featuredArtists}` : null
              ].filter(Boolean).join(' · ')}
            />
            <SongList.Action>
              <span className="vote-count">
                <span className="vote-avg" title="Media de todos los votos">
                  <Icon name="star" size={13} />
                  {song.averageScore.toFixed(1)}
                </span>
                <span className="vote-total">
                  {song.voteCount} voto{song.voteCount !== 1 ? 's' : ''}
                </span>
              </span>
            </SongList.Action>
          </SongList.Row>
        ))}
      </SongList>
    </div>
  )
}
