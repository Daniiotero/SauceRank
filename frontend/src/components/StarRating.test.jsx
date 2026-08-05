import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StarRating from './StarRating'

describe('StarRating', () => {
  test('renderiza 10 estrellas', () => {
    render(<StarRating score={0} />)
    expect(screen.getAllByRole('radio')).toHaveLength(10)
  })

  test('muestra el puntaje actual', () => {
    render(<StarRating score={7} />)
    expect(screen.getByText('7/10')).toBeInTheDocument()
  })

  test('marca como seleccionadas las estrellas hasta el puntaje', () => {
    render(<StarRating score={4} />)
    expect(screen.getByRole('radio', { name: '4 de 10' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: '5 de 10' })).toHaveAttribute('aria-checked', 'false')
  })

  test('llama a onRate con el valor de la estrella pulsada', () => {
    const onRate = vi.fn()
    render(<StarRating score={0} onRate={onRate} />)
    fireEvent.click(screen.getByRole('radio', { name: '8 de 10' }))
    expect(onRate).toHaveBeenCalledWith(8)
  })

  test('no llama a onRate si está deshabilitado', () => {
    const onRate = vi.fn()
    render(<StarRating score={0} onRate={onRate} disabled />)
    fireEvent.click(screen.getByRole('radio', { name: '5 de 10' }))
    expect(onRate).not.toHaveBeenCalled()
  })

  test('deshabilita los botones cuando disabled es true', () => {
    render(<StarRating score={3} disabled />)
    expect(screen.getByRole('radio', { name: '3 de 10' })).toBeDisabled()
  })
})
