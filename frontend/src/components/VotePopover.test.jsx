import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import VotePopover from './VotePopover'

describe('VotePopover', () => {
  test('muestra el botón de votar', () => {
    render(<VotePopover />)
    expect(screen.getByRole('button', { name: 'Votar canción' })).toBeInTheDocument()
  })

  test('abre el modal con las estrellas al pulsar el botón', () => {
    render(<VotePopover score={5} />)
    fireEvent.click(screen.getByRole('button', { name: /Cambiar voto/ }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(within(screen.getByRole('dialog')).getByText('5')).toBeInTheDocument()
  })

  test('vota y cierra el modal', () => {
    const onRate = vi.fn()
    render(<VotePopover onRate={onRate} />)
    fireEvent.click(screen.getByRole('button', { name: 'Votar canción' }))
    fireEvent.click(screen.getByRole('radio', { name: '8 de 10' }))
    expect(onRate).toHaveBeenCalledWith(8)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('cierra el modal con la tecla Escape', () => {
    render(<VotePopover score={3} />)
    fireEvent.click(screen.getByRole('button', { name: /Cambiar voto/ }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('deshabilita el botón cuando disabled es true', () => {
    render(<VotePopover disabled />)
    expect(screen.getByRole('button', { name: 'Votar canción' })).toBeDisabled()
  })
})
