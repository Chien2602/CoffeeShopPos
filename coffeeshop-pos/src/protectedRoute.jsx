import { Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = sessionStorage.getItem('authToken')
    if (!token) {
      setIsAuthenticated(false)
      navigate('/login')
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [navigate])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return isAuthenticated ? children : null
}

export default ProtectedRoute