import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AlbumCard from './AlbumCard'

const album = {
  id: 1,
  name: 'Sauce Boyz',
  year: 2020,
  type: 'ALBUM',
  coverUrl: '/covers/portadaSauceBoyz2.png'
}

function renderCard() {
  return render(
    <MemoryRouter>
      <AlbumCard album={album} />
    </MemoryRouter>
  )
}

describe('AlbumCard', () => {
  test('renderiza el nombre, el año y el tipo del album', () => {
    renderCard()
    expect(screen.getByText('Sauce Boyz')).toBeInTheDocument()
    expect(screen.getByText('2020 · Álbum')).toBeInTheDocument()
  })

  test('enlaza a la pagina del album', () => {
    renderCard()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/album/1')
  })

  test('muestra el placeholder mientras la portada no carga', () => {
    renderCard()
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  test('oculta el placeholder cuando la portada carga', () => {
    renderCard()
    const img = screen.getByAltText('Portada de Sauce Boyz')
    fireEvent.load(img)
    expect(screen.queryByText('Cargando...')).not.toBeInTheDocument()
  })

  test('no muestra imagen si el album no tiene portada', () => {
    const { container } = render(
      <MemoryRouter>
        <AlbumCard album={{ ...album, coverUrl: null }} />
      </MemoryRouter>
    )
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})
