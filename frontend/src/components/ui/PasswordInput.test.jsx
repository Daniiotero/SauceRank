import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PasswordInput from './PasswordInput'

describe('PasswordInput', () => {
  test('renderiza el input como password por defecto', () => {
    const { container } = render(<PasswordInput value="clave" onChange={() => {}} />)
    expect(container.querySelector('input')).toHaveAttribute('type', 'password')
  })

  test('oculta y muestra la contrasena al pulsar el toggle', () => {
    const { container } = render(<PasswordInput value="mi-clave" onChange={() => {}} />)
    const input = container.querySelector('input')

    expect(input).toHaveAttribute('type', 'password')

    fireEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))
    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Ocultar contraseña' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Ocultar contraseña' }))
    expect(input).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toHaveAttribute('aria-pressed', 'false')
  })

  test('propaga el valor al input', () => {
    const { container } = render(<PasswordInput value="abc" onChange={() => {}} />)
    expect(container.querySelector('input')).toHaveValue('abc')
  })

  test('no bloquea el pegado de contrasenas', () => {
    const { container } = render(<PasswordInput value="" onChange={() => {}} />)
    const input = container.querySelector('input')
    expect(input).not.toHaveAttribute('onpaste')
    expect(input).not.toHaveAttribute('oncopy')
  })

  test('mantiene las restricciones de longitud', () => {
    const { container } = render(<PasswordInput value="" onChange={() => {}} minLength={8} maxLength={64} />)
    const input = container.querySelector('input')
    expect(input).toHaveAttribute('minlength', '8')
    expect(input).toHaveAttribute('maxlength', '64')
  })
})
