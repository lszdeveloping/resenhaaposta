import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import MyBets from './pages/MyBets'
import Ranking from './pages/Ranking'

export default function App() {
  const { user } = useAuth()

  if (!user) return <Login />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MyBets />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
