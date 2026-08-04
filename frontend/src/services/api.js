import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if ((error.response?.status === 401 || error.response?.status === 403) &&
        !error.config.url?.startsWith('/auth/')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  check: () => api.get('/check-token')
}

export const albumApi = {
  getAll: () => api.get('/albums'),
  getById: (id) => api.get(`/albums/${id}`)
}

export const voteApi = {
  vote: (songId, score) => api.post('/votes', { songId, score }),
  unvote: (songId) => api.delete(`/votes/${songId}`),
  getTop: () => api.get('/votes/top'),
  check: (songId) => api.get(`/votes/check/${songId}`)
}

export const userApi = {
  search: (query) => api.get(`/users/search?q=${query}`),
  getProfile: (username) => api.get(`/users/${username}`)
}

export default api
