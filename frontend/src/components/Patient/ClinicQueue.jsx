import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { clinicAPI, tokenAPI } from '../../services/api'
import { connectWebSocket, disconnectWebSocket } from '../../services/websocket'
import { getUserId, logout } from '../../utils/auth'

function ClinicQueue() {
  const { clinicId } = useParams()
  const navigate = useNavigate()
  const [clinic, setClinic] = useState(null)
  const [queue, setQueue] = useState([])
  const [myToken, setMyToken] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ patientName: '', patientAge: '', appointmentDate: '', appointmentTime: '' })
  const [timeMin, setTimeMin] = useState('')
  const [timeMax, setTimeMax] = useState('')
  const [timeStep, setTimeStep] = useState(900)
  const today = new Date().toISOString().split('T')[0]
  useEffect(() => {
    loadClinic()
    loadQueue()
    loadMyToken()

    connectWebSocket(clinicId, () => {
      loadQueue()
      loadMyToken()
    })

    return () => disconnectWebSocket()
  }, [clinicId])

  const to24Hour = (timeStr) => {
    if (!timeStr) return ''
    const t = timeStr.trim()
    const ampmMatch = t.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i)
    if (ampmMatch) {
      let hour = parseInt(ampmMatch[1], 10)
      const minute = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0
      const ampm = ampmMatch[3].toUpperCase()
      if (ampm === 'AM') {
        if (hour === 12) hour = 0
      } else {
        if (hour !== 12) hour += 12
      }
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }

    const hmMatch = t.match(/^(\d{1,2})(?::(\d{2}))?$/)
    if (hmMatch) {
      const hour = parseInt(hmMatch[1], 10)
      const minute = hmMatch[2] ? hmMatch[2] : '00'
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }

    return ''
  }

  const loadClinic = async () => {
    try {
      const response = await clinicAPI.getById(clinicId)
      setClinic(response.data)

      const timing = response.data?.timing
      if (timing) {
        const parts = timing.split('-').map((s) => s.trim())
        if (parts.length >= 2) {
          const start = to24Hour(parts[0])
          const end = to24Hour(parts[1])
          if (start && end) {
            setTimeMin(start)
            setTimeMax(end)
          }
        }
      }

      setTimeStep(response.data?.avgTimePerPatient ? response.data.avgTimePerPatient * 60 : 900)
    } catch (err) {
      console.error('Failed to load clinic', err)
    }
  }

  const loadQueue = async () => {
    try {
      const response = await tokenAPI.getQueue(clinicId)
      setQueue(response.data)
    } catch (err) {
      console.error('Failed to load queue', err)
    }
  }

  const loadMyToken = async () => {
    try {
      const response = await tokenAPI.getMyToken(clinicId)
      setMyToken(response.data)
    } catch (err) {
      console.error('Failed to load my token', err)
    }
  }

  const handleBookToken = async (e) => {
    e.preventDefault()

    // Client-side validation: ensure chosen time is within clinic timing
    console.log('Validating time:', formData.appointmentTime, timeMin, timeMax)
    if (timeMin && timeMax) {
      const t = formData.appointmentTime
      if (!t || t < timeMin || t > timeMax) {
        alert(`Please choose a time between ${timeMin} and ${timeMax}`)
        return
      }
    }

    try {
      await tokenAPI.book(clinicId, formData)
      setShowModal(false)
      setFormData({ patientName: '', patientAge: '', appointmentDate: '', appointmentTime: '' })
      loadQueue()
      loadMyToken()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to book token')
    }
  }

  const handleCancelToken = async () => {
    if (window.confirm('Are you sure you want to cancel your token?')) {
      try {
        await tokenAPI.cancel(myToken.id)
        loadQueue()
        loadMyToken()
      } catch (err) {
        alert('Failed to cancel token')
      }
    }
  }

  return (
    <div>
      <div className="container" style={{marginTop: 12}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2>Clinic Queue</h2>
          <div>
            <button className="btn btn--secondary" onClick={() => navigate('/')}>Back</button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="queue-container">
          {/* Clinic Info */}
          <div className="queue-section card">
            <h3>Clinic Information</h3>
            {clinic && (
              <>
                <p><strong>Name:</strong> {clinic.name}</p>
                <p><strong>Doctor:</strong> {clinic.doctorName}</p>
                <p><strong>Specialization:</strong> {clinic.specialization}</p>
                <p><strong>Timing:</strong> {clinic.timing}</p>
                <p><strong>Address:</strong> {clinic.address}</p>
                <p><strong>Avg Time:</strong> {clinic.avgTimePerPatient} min/patient</p>
              </>
            )}
          </div>

          {/* Live Queue */}
          <div className="queue-section card">
            <h3>Live Queue</h3>
            {queue.length === 0 ? (
              <p>No patients in queue</p>
            ) : (
              queue.map((token) => (
                <div
                  key={token.id}
                  className={`token-item ${token.status} ${token.isOwn ? 'own' : ''}`}
                >
                  <div>
                    <strong>Token {token.tokenNumber}</strong>: {token.status}
                  </div>
                  {token.isOwn && (
                    <div>
                      <p>Name: {token.patientName}</p>
                      <p>Age: {token.patientAge}</p>
                    </div>
                  )}
                  {token.isOwn && token.estimatedTimeMinutes > 0 && (
                    <div>Estimated wait: {token.estimatedTimeMinutes} min</div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Booking Section */}
          <div className="queue-section card">
            <h3>Your Token</h3>
            {myToken ? (
              <div>
                <div className="token-item own">
                  <strong>Token {myToken.tokenNumber}</strong>
                  <p>Name: {myToken.patientName}</p>
                  <p>Age: {myToken.patientAge}</p>
                  <p>Status: {myToken.status}</p>
                  {myToken.estimatedTimeMinutes > 0 && (
                    <p>Wait: {myToken.estimatedTimeMinutes} min</p>
                  )}
                </div>
                <button className="btn btn-danger" onClick={handleCancelToken}>
                  Cancel Token
                </button>
              </div>
            ) : (
              <button
                className="btn btn--primary"
                onClick={() => {
                  setFormData({ ...formData, appointmentDate: today, appointmentTime: timeMin || '' })
                  setShowModal(true)
                }}
              >
                Book Token
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content card">
            <h3>Book Token</h3>
            <form onSubmit={handleBookToken}>
              <div className="form-field">
                <label>Patient Name</label>
                <input
                  className="input"
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Patient Age</label>
                <input
                  className="input"
                  type="number"
                  value={formData.patientAge}
                  onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>Appointment Date</label>
                <input
                  className="input"
                  type="date"
                  min={today}
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-field">
                <label>Appointment Time</label>
                <input
                  className="input"
                  type="time"
                  min={timeMin}
                  max={timeMax}
                  step={timeStep}
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  required
                />
                {timeMin && timeMax && (
                  <small style={{display: 'block', marginTop: 6}}>Allowed: {timeMin} - {timeMax}</small>
                )}
              </div>
              <div style={{display: 'flex', gap: 10}}>
                <button type="submit" className="btn btn--primary">Submit</button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClinicQueue