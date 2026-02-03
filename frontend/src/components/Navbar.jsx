import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { logout } from '../utils/auth'
import './Navbar.css'

function Navbar({ title = 'Doctor Appointment System', tabs = [], activeTab, onSelect }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand" onClick={() => navigate('/') }>
          <img src={logo} alt="Logo" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-title">{title}</span>
          </div>
        </div>

        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main navigation">
          <ul>
            {tabs && tabs.length > 0 && tabs.map((t) => (
              <li key={t.key}>
                <button
                  className={`nav-link ${activeTab === t.key ? 'active' : ''}`}
                  onClick={() => { onSelect && onSelect(t.key); setOpen(false) }}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <button className="btn btn-primary" onClick={handleLogout}>Logout</button>

          <button
            className="hamburger mobile-only"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
