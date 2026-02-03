import React, { useEffect, useState } from 'react'
import { clinicAPI, tokenAPI } from '../../services/api'

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    try {
      setLoading(true)
      const res = await clinicAPI.getAll()
      const clinics = res.data || []

      const promises = clinics.map(async (c) => {
        try {
          const tokenRes = await tokenAPI.getMyToken(c.id)
          return tokenRes.data ? { clinic: c, token: tokenRes.data } : null
        } catch (err) {
          return null
        }
      })

      const results = await Promise.all(promises)
      setBookings(results.filter(Boolean))
    } catch (err) {
      console.error('Failed to load bookings', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (tokenId) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await tokenAPI.cancel(tokenId)
      loadBookings()
    } catch (err) {
      alert('Failed to cancel booking')
    }
  }

  if (loading) return <p>Loading your bookings...</p>

  return (
    <div>
      <h2>My bookings</h2>
      {bookings.length === 0 ? (
        <p>You have no active bookings.</p>
      ) : (
        bookings.map(({ clinic, token }) => (
          <div key={token.id} className="card clinic-card" style={{ marginBottom: '12px' }}>
            <h3>{clinic.name}</h3>
            <p><strong>Doctor:</strong> {clinic.doctorName}</p>
            <p><strong>Token:</strong> {token.tokenNumber}</p>
            <p><strong>Status:</strong> {token.status}</p>
            {token.estimatedTimeMinutes !== undefined && (
              <p><strong>Est. wait:</strong> {token.estimatedTimeMinutes} min</p>
            )}
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-danger">Cancel</button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default MyBookings
