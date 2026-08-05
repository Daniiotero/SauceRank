import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SongList from './SongList'

describe('SongList', () => {
  test('Row agrega la clase podium para los primeros 3 puestos', () => {
    const { container } = render(
      <SongList>
        <SongList.Row rank={2}>contenido</SongList.Row>
      </SongList>
    )
    expect(container.querySelector('.song-row')).toHaveClass('podium')
  })

  test('Row sin rank no tiene clase podium', () => {
    const { container } = render(
      <SongList>
        <SongList.Row>contenido</SongList.Row>
      </SongList>
    )
    expect(container.querySelector('.song-row')).not.toHaveClass('podium')
  })

  test('Row con rank mayor a 3 no tiene clase podium', () => {
    const { container } = render(
      <SongList>
        <SongList.Row rank={4}>contenido</SongList.Row>
      </SongList>
    )
    expect(container.querySelector('.song-row')).not.toHaveClass('podium')
  })

  test('Rank badge marca podium para los primeros 3 puestos', () => {
    const { container } = render(
      <SongList>
        <SongList.Rank rank={3} />
      </SongList>
    )
    expect(container.querySelector('.rank-badge')).toHaveClass('podium')
  })

  test('Rank badge no marca podium por encima del puesto 3', () => {
    const { container } = render(
      <SongList>
        <SongList.Rank rank={4} />
      </SongList>
    )
    expect(container.querySelector('.rank-badge')).not.toHaveClass('podium')
  })

  test('Info renderiza el titulo y el subtitulo', () => {
    render(
      <SongList>
        <SongList.Info title="Mbappe" subtitle="ft. Future" />
      </SongList>
    )
    expect(screen.getByText('Mbappe')).toBeInTheDocument()
    expect(screen.getByText('ft. Future')).toBeInTheDocument()
  })

  test('Info no renderiza subtitulo cuando no se provee', () => {
    render(
      <SongList>
        <SongList.Info title="Kemba Walker" />
      </SongList>
    )
    expect(screen.queryByText('ft. Future')).not.toBeInTheDocument()
  })

  test('TrackNumber renderiza el numero de pista', () => {
    render(
      <SongList>
        <SongList.TrackNumber>3</SongList.TrackNumber>
      </SongList>
    )
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
