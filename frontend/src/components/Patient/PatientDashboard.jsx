import React, { useState } from 'react'
import Navbar from '../Navbar'
import ClinicList from './ClinicList'
import MyBookings from './MyBookings'
import Profile from './Profile'

function PatientDashboard() {
  const [active, setActive] = useState('clinics') // 'clinics'|'bookings'|'profile'

  return (
    <div>
      <Navbar
        tabs={[
          { key: 'clinics', label: 'Available clinics' },
          { key: 'bookings', label: 'My bookings' },
          { key: 'profile', label: 'Profile' }
        ]}
        activeTab={active}
        onSelect={(k) => setActive(k)}
      />

      <div className="container">
        <div className="tab-content">
          {active === 'clinics' && <ClinicList />}
          {active === 'bookings' && <MyBookings />}
          {active === 'profile' && <Profile />}
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
