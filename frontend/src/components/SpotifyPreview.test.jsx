import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SpotifyPreview from './SpotifyPreview'

describe('SpotifyPreview', () => {
  test('no renderiza nada sin un track id', () => {
    const { container } = render(<SpotifyPreview spotifyTrackId={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  test('abre el embed de Spotify al pulsar el boton', () => {
    render(<SpotifyPreview spotifyTrackId="abc123" />)
    fireEvent.click(screen.getByRole('button', { name: /escuchar preview en spotify/i }))
    const iframe = screen.getByTitle('Preview de Spotify')
    expect(iframe).toHaveAttribute('src', 'https://open.spotify.com/embed/track/abc123?utm_source=generator')
  })

  test('cierra el embed al pulsar el boton de nuevo', () => {
    render(<SpotifyPreview spotifyTrackId="abc123" />)
    fireEvent.click(screen.getByRole('button', { name: /escuchar preview en spotify/i }))
    expect(screen.getByTitle('Preview de Spotify')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /cerrar preview de spotify/i }))
    expect(screen.queryByTitle('Preview de Spotify')).not.toBeInTheDocument()
  })

  test('cierra el embed con la tecla Escape', () => {
    render(<SpotifyPreview spotifyTrackId="abc123" />)
    fireEvent.click(screen.getByRole('button', { name: /escuchar preview en spotify/i }))
    expect(screen.getByTitle('Preview de Spotify')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByTitle('Preview de Spotify')).not.toBeInTheDocument()
  })

  test('tiene un boton de cierre dentro del popup', () => {
    render(<SpotifyPreview spotifyTrackId="abc123" />)
    fireEvent.click(screen.getByRole('button', { name: /escuchar preview en spotify/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(screen.queryByTitle('Preview de Spotify')).not.toBeInTheDocument()
  })
})
