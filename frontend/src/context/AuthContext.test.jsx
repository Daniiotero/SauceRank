import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

vi.mock('../services/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    check: vi.fn()
  }
}))

import { authApi } from '../services/api'

function Consumer() {
  const { user, login, register, logout } = useAuth()
  const doLogin = () => login('sauce', 'pass').catch(() => {})
  const doRegister = () => register('sauce', 'a@b.c', 'pass').catch(() => {})
  return (
    <div>
      <span data-testid="username">{user ? user.username : 'anon'}</span>
      <button onClick={doLogin}>login</button>
      <button onClick={doRegister}>register</button>
      <button onClick={logout}>logout</button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  )
}

const userData = { token: 'tok-123', userId: 1, username: 'sauce' }

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  test('empieza sin usuario y sin sesion almacenada', async () => {
    renderWithProvider()
    await waitFor(() => expect(screen.getByTestId('username')).toHaveTextContent('anon'))
    expect(localStorage.getItem('token')).toBeNull()
  })

  test('login guarda el token y el usuario', async () => {
    authApi.login.mockResolvedValue({ data: userData })
    renderWithProvider()
    fireEvent.click(screen.getByText('login'))
    await waitFor(() => expect(screen.getByTestId('username')).toHaveTextContent('sauce'))
    expect(localStorage.getItem('token')).toBe('tok-123')
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 1, username: 'sauce' })
  })

  test('register guarda el token y el usuario', async () => {
    authApi.register.mockResolvedValue({ data: userData })
    renderWithProvider()
    fireEvent.click(screen.getByText('register'))
    await waitFor(() => expect(screen.getByTestId('username')).toHaveTextContent('sauce'))
    expect(localStorage.getItem('token')).toBe('tok-123')
  })

  test('login lanza error si la respuesta no trae token', async () => {
    authApi.login.mockResolvedValue({ data: null })
    renderWithProvider()
    fireEvent.click(screen.getByText('login'))
    await waitFor(() => expect(screen.getByTestId('username')).toHaveTextContent('anon'))
    expect(localStorage.getItem('token')).toBeNull()
  })

  test('register lanza error si la respuesta no trae token', async () => {
    authApi.register.mockResolvedValue({ data: null })
    renderWithProvider()
    fireEvent.click(screen.getByText('register'))
    await waitFor(() => expect(screen.getByTestId('username')).toHaveTextContent('anon'))
    expect(localStorage.getItem('token')).toBeNull()
  })

  test('logout limpia el estado y el localStorage', async () => {
    authApi.login.mockResolvedValue({ data: userData })
    renderWithProvider()
    fireEvent.click(screen.getByText('login'))
    await waitFor(() => expect(screen.getByTestId('username')).toHaveTextContent('sauce'))
    fireEvent.click(screen.getByText('logout'))
    expect(screen.getByTestId('username')).toHaveTextContent('anon')
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  test('restaura la sesion desde localStorage', async () => {
    localStorage.setItem('token', 'tok-123')
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'sauce' }))
    authApi.check.mockResolvedValue({})
    renderWithProvider()
    await waitFor(() => expect(screen.getByTestId('username')).toHaveTextContent('sauce'))
    expect(authApi.check).toHaveBeenCalled()
  })

  test('limpia la sesion si el token expiro', async () => {
    localStorage.setItem('token', 'bad-token')
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'sauce' }))
    authApi.check.mockRejectedValue(new Error('expirado'))
    renderWithProvider()
    await waitFor(() => expect(screen.getByTestId('username')).toHaveTextContent('anon'))
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })
})
