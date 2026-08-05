import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TopChart from './TopChart'

const songs = [
  {
    songId: 1,
    rank: 1,
    title: 'Kemba Walker',
    albumName: '3MEN2 KBRN',
    featuredArtists: null,
    averageScore: 9.2,
    voteCount: 10
  },
  {
    songId: 2,
    rank: 2,
    title: 'Mbappe',
    albumName: 'Sauce Boyz 2',
    featuredArtists: 'Future',
    averageScore: 8.5,
    voteCount: 1
  }
]

describe('TopChart', () => {
  test('muestra empty state cuando no hay canciones', () => {
    render(<TopChart songs={[]} />)
    expect(screen.getByText('Aun no hay votos')).toBeInTheDocument()
    expect(screen.getByText(/se el primero en votar/i)).toBeInTheDocument()
  })

  test('renderiza las canciones con su media', () => {
    render(<TopChart songs={songs} />)
    expect(screen.getByText('Kemba Walker')).toBeInTheDocument()
    expect(screen.getByText('9.2')).toBeInTheDocument()
  })

  test('muestra el numero de votos en singular y plural', () => {
    render(<TopChart songs={songs} />)
    expect(screen.getByText('10 votos')).toBeInTheDocument()
    expect(screen.getByText('1 voto')).toBeInTheDocument()
  })

  test('muestra los artistas invitados en el subtitulo', () => {
    render(<TopChart songs={songs} />)
    expect(screen.getByText('Sauce Boyz 2 · ft. Future')).toBeInTheDocument()
  })

  test('no muestra artista invitado cuando no existe', () => {
    render(<TopChart songs={songs} />)
    expect(screen.getByText('3MEN2 KBRN')).toBeInTheDocument()
  })
})
