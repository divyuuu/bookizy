import React, { useState } from 'react'
import { getUser, setUser } from '../../utils/auth'

function Profile() {
  const [userState, setUserState] = useState(getUser())
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: userState?.name || '',
    phone: userState?.phone || '',
    email: userState?.email || '',
    photo: userState?.photo || null,
  })

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    const updatedUser = { ...userState, name: formData.name, phone: formData.phone, email: formData.email, photo: formData.photo }
    setUser(updatedUser)
    setUserState(updatedUser)
    setEditing(false)
  }

  const handleCancel = () => {
    setFormData({ name: userState?.name || '', phone: userState?.phone || '', email: userState?.email || '', photo: userState?.photo || null })
    setEditing(false)
  }

  return (
    <div>
      <h2>Profile</h2>
      {userState ? (
        <div className="card profile-card">
          <div className="profile-avatar">
            {userState.photo ? (
              <img src={userState.photo} alt="Profile" />
            ) : (
              <div className="avatar-placeholder">{userState.name ? userState.name[0].toUpperCase() : '?'}</div>
            )}
          </div>

          <div className="profile-info">
            <p><strong>Name:</strong> {userState.name || userState.email}</p>
            <p><strong>Phone:</strong> {userState.phone || 'Not provided'}</p>
            <p><strong>Email:</strong> {userState.email || ''}</p>
          </div>

          <div className="edit-actions">
            <button className="btn btn--secondary" onClick={() => { setEditing(true); setFormData({ name: userState?.name || '', phone: userState?.phone || '', email: userState?.email || '', photo: userState?.photo || null }) }}>Edit Profile</button>
          </div>

          {editing && (
            <div className="modal">
              <div className="modal-content profile-edit-modal card">
                <h3>Edit Profile</h3>

                <div className="form-field">
                  <label>Name</label>
                  <input className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="form-field">
                  <label>Phone</label>
                  <input className="input" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>

                <div className="form-field">
                  <label>Email</label>
                  <input type="email" className="input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>

                <div className="form-field">
                  <label>Photo</label>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} />
                  {formData.photo && <img src={formData.photo} alt="Preview" className="edit-photo-preview" />}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: 12 }}>
                  <button className="btn btn--primary" onClick={handleSave}>Save</button>
                  <button className="btn btn--secondary" onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  )
}

export default Profile
