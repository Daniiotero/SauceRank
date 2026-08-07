import { Link } from 'react-router-dom'
import SongList from './SongList'
import EmptyState from './ui/EmptyState'
import Icon from './ui/Icon'

export default function TopAlbums({ albums }) {
  if (!albums || albums.length === 0) {
    return (
      <EmptyState
        icon="music"
        title="Aún no hay votos en discos"
        description="Sé el primero en votar y aparecerá el top de discos de la comunidad."
      />
    )
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <SongList>
        {albums.map(album => (
          <SongList.Row key={album.albumId} rank={album.rank}>
            <SongList.Rank rank={album.rank} />
            <Link
              to={`/album/${album.albumId}`}
              style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, textDecoration: 'none' }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: 'var(--surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--accent)'
                }}
              >
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={`Portada de ${album.albumName}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  album.albumName.charAt(0)
                )}
              </div>
              <SongList.Info title={album.albumName} subtitle={String(album.albumYear)} />
            </Link>
            <SongList.Action>
              <span className="vote-count">
                <span className="vote-avg" title="Media de los votos del disco">
                  <Icon name="star" size={13} />
                  {album.averageScore.toFixed(1)}
                </span>
                <span className="vote-total">
                  {album.voteCount} voto{album.voteCount !== 1 ? 's' : ''}
                </span>
              </span>
            </SongList.Action>
          </SongList.Row>
        ))}
      </SongList>
    </div>
  )
}
