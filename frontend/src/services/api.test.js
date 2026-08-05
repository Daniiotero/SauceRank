import { describe, test, expect, beforeEach } from 'vitest'
import api from './api'

function requestHandler(config) {
  return api.interceptors.request.handlers[0].fulfilled(config)
}

function responseHandler(error) {
  return api.interceptors.response.handlers[0].rejected(error)
}

describe('interceptores de api', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('interceptor de request', () => {
    test('agrega el token Bearer si existe sesion', () => {
      localStorage.setItem('token', 'tok-123')
      const config = requestHandler({ headers: {} })
      expect(config.headers.Authorization).toBe('Bearer tok-123')
    })

    test('no agrega header sin token', () => {
      const config = requestHandler({ headers: {} })
      expect(config.headers.Authorization).toBeUndefined()
    })
  })

  describe('interceptor de response', () => {
    test('deja pasar las respuestas exitosas', () => {
      const response = { data: { ok: true } }
      const passed = api.interceptors.response.handlers[0].fulfilled(response)
      expect(passed).toEqual(response)
    })

    test('limpia la sesion ante un 401 fuera de /auth', async () => {
      localStorage.setItem('token', 'tok-123')
      localStorage.setItem('user', JSON.stringify({ id: 1, username: 'sauce' }))
      const error = { response: { status: 401 }, config: { url: '/votes/top' } }
      await expect(responseHandler(error)).rejects.toEqual(error)
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })

    test('tambien limpia la sesion ante un 403', async () => {
      localStorage.setItem('token', 'tok-123')
      localStorage.setItem('user', JSON.stringify({ id: 1, username: 'sauce' }))
      const error = { response: { status: 403 }, config: { url: '/users' } }
      await expect(responseHandler(error)).rejects.toEqual(error)
      expect(localStorage.getItem('token')).toBeNull()
      expect(localStorage.getItem('user')).toBeNull()
    })

    test('no toca la sesion en errores de /auth', async () => {
      localStorage.setItem('token', 'tok-123')
      localStorage.setItem('user', JSON.stringify({ id: 1, username: 'sauce' }))
      const error = { response: { status: 401 }, config: { url: '/auth/login' } }
      await expect(responseHandler(error)).rejects.toEqual(error)
      expect(localStorage.getItem('token')).toBe('tok-123')
      expect(localStorage.getItem('user')).not.toBeNull()
    })

    test('deja pasar errores sin respuesta de auth', async () => {
      const error = { response: { status: 500 }, config: { url: '/albums' } }
      await expect(responseHandler(error)).rejects.toEqual(error)
      expect(localStorage.getItem('token')).toBeNull()
    })
  })
})
