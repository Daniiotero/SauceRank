import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import DiscographyPage from './pages/DiscographyPage'
import AlbumPage from './pages/AlbumPage'
import TopChartPage from './pages/TopChartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserSearchPage from './pages/UserSearchPage'
import UserProfilePage from './pages/UserProfilePage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="container" style={{ textAlign: 'center', marginTop: 60 }}>
      <div className="skeleton" style={{ width: 200, height: 20, margin: '0 auto' }} />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <div className="container">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<DiscographyPage />} />
            <Route path="/album/:id" element={<ProtectedRoute><AlbumPage /></ProtectedRoute>} />
            <Route path="/top" element={<TopChartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/users" element={<ProtectedRoute><UserSearchPage /></ProtectedRoute>} />
            <Route path="/users/:id" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '24px 20px',
        borderTop: '1px solid var(--border)',
        fontSize: 13,
        color: 'var(--text-muted)'
      }}>
        SauceRank &middot; Eladio Carrion Discography
      </footer>
    </div>
  )
}
