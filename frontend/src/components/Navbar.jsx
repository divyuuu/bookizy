import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { logout } from '../utils/auth'

function Navbar({ title = 'Doctor Appointment System', tabs = [], activeTab, onSelect }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={logo} alt="Logo" className="logo" />
        <h1>{title}</h1>
        {tabs && tabs.length > 0 && (
          <div className="nav-tabs">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`nav-tab-button ${activeTab === t.key ? 'active' : ''}`}
                onClick={() => onSelect && onSelect(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Navbar
