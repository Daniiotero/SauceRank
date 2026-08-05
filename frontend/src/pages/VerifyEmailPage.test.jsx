import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import VerifyEmailPage from './VerifyEmailPage'

vi.mock('../services/api', () => ({
  authApi: {
    verify: vi.fn()
  }
}))

import { authApi } from '../services/api'

function renderAt(url) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <VerifyEmailPage />
    </MemoryRouter>
  )
}

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('muestra exito cuando el token es valido', async () => {
    authApi.verify.mockResolvedValue({ data: { message: 'activada' } })
    renderAt('/verify-email?token=abc123')
    await waitFor(() => expect(screen.getByText('Cuenta activada')).toBeInTheDocument())
    expect(authApi.verify).toHaveBeenCalledWith('abc123')
  })

  test('muestra error cuando el token es invalido', async () => {
    authApi.verify.mockRejectedValue(new Error('invalido'))
    renderAt('/verify-email?token=bad')
    await waitFor(() => expect(screen.getByText('Enlace inválido o expirado')).toBeInTheDocument())
  })

  test('muestra error si falta el token', async () => {
    renderAt('/verify-email')
    await waitFor(() => expect(screen.getByText('Enlace inválido o expirado')).toBeInTheDocument())
    expect(authApi.verify).not.toHaveBeenCalled()
  })
})
