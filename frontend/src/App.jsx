import { Routes, Route, Navigate } from 'react-router-dom'
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
  if (loading) return <div className="container" style={{textAlign:'center',marginTop:50}}>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<DiscographyPage />} />
          <Route path="/album/:id" element={<ProtectedRoute><AlbumPage /></ProtectedRoute>} />
          <Route path="/top" element={<TopChartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/users" element={<ProtectedRoute><UserSearchPage /></ProtectedRoute>} />
          <Route path="/users/:id" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  )
}
