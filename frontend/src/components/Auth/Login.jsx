import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import { setToken, setUser } from '../../utils/auth'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await authAPI.login(formData)
      setToken(response.data.token)
      setUser(response.data)

      if (response.data.role === 'RECEPTIONIST') {
        navigate('/receptionist/1')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Email</label>
            <input
              className="input"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              className="input"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <div style={{display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8}}>
            <button type="submit" className="btn btn--primary">Login</button>
          </div>
        </form>
        <div className="text-center" style={{marginTop: 12}}>
          <span className="link" onClick={() => navigate('/signup')}>
            Don't have an account? Sign up
          </span>
        </div>
      </div>
    </div>
  )
}

export default Login