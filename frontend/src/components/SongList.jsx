import { createContext, useContext } from 'react'

const SongListContext = createContext(null)

function SongList({ children, ...rest }) {
  return (
    <SongListContext.Provider value={{}}>
      <div {...rest}>{children}</div>
    </SongListContext.Provider>
  )
}

function Row({ children, rank, ...rest }) {
  const isPodium = rank != null && rank <= 3
  return (
    <div className={`song-row${isPodium ? ' podium' : ''}`} {...rest}>
      {children}
    </div>
  )
}

function TrackNumber({ children }) {
  return <span className="track-number">{children}</span>
}

function Rank({ rank }) {
  return <span className={`rank-badge${rank <= 3 ? ' podium' : ''}`}>{rank}</span>
}

function Info({ title, subtitle }) {
  return (
    <div className="song-info">
      <div className="song-title">{title}</div>
      {subtitle && <div className="song-sub">{subtitle}</div>}
    </div>
  )
}

function Action({ children }) {
  return (
    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
      {children}
    </div>
  )
}

function useSongList() {
  return useContext(SongListContext)
}

SongList.Row = Row
SongList.TrackNumber = TrackNumber
SongList.Rank = Rank
SongList.Info = Info
SongList.Action = Action

export { Row, TrackNumber, Rank, Info, Action, useSongList }
export default SongList
