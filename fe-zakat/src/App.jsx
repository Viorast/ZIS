import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Homepage from './pages/Homepage.jsx'
import Register from './pages/Register.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<Homepage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
