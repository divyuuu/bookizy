import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clinicAPI } from '../../services/api'
function ClinicList() {
  const [clinics, setClinics] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    loadClinics()
  }, [])

  const loadClinics = async () => {
    try {
      const response = await clinicAPI.getAll()
      setClinics(response.data)
    } catch (err) {
      console.error('Failed to load clinics', err)
    }
  }

  return (
    <div>
      <div className="container">
        <h1>Available Clinics</h1>
        <div className="clinic-grid">
          {clinics.map((clinic) => (
            <div key={clinic.id} className="card clinic-card">
              <h3>{clinic.name}</h3>
              <p><strong>Doctor:</strong> {clinic.doctorName}</p>
              <p><strong>Specialization:</strong> {clinic.specialization}</p>
              <p><strong>Timing:</strong> {clinic.timing}</p>
              <p><strong>Address:</strong> {clinic.address}</p>
              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 12}}>
                <button
                  className="btn btn--primary"
                  onClick={() => navigate(`/clinic/${clinic.id}`)}
                >
                  Book Token
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClinicList