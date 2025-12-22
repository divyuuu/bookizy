import React from 'react'
import { getUser } from '../../utils/auth'

function Profile() {
  const user = getUser()

  return (
    <div>
      <h2>Profile</h2>
      {user ? (
        <div className="clinic-card">
          <p><strong>Name:</strong> {user.name || user.email}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  )
}

export default Profile
