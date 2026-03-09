import { useState } from 'react'
import './profile.css'
import { displayName } from '../../../utils'

export default function ProfileScreen({ active }) {

  // TODO: replace with real data from Firebase
  const stats = {
    games: 19,
    stars: 74,
    avg: 3.9,
    since: 'Jan 2026'
  }

  // Editable form fields — will be loaded from and saved to Firebase
  const [form, setForm] = useState({
    firstName: 'Alex',
    nickname: 'Gunner',   // optional
    lastName: 'Kowalski',
    email: 'alex@pitchup.ge',
    // TODO: add more fields as Firebase profile grows (phone, position, etc.)
  })

  const [saved, setSaved] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSave() {
    // TODO: save form to Firebase when connected
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={`content screen ${active ? 'active' : ''}`} id="screen-profile">

      <div className="page-header" style={{marginBottom: '28px'}}>
        <div>
          <div className="page-title">MY PROFILE</div>
          <div className="page-subtitle">Your stats &amp; account details</div>
        </div>
      </div>

      <div className="profile-hero">
        <div className="profile-avatar-lg">AK</div>
        <div>
          <div className="profile-name">{displayName(form.firstName, form.nickname, form.lastName)}</div>
          <div className="profile-email">{form.email}</div>
        </div>
      </div>

      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="profile-stat-val">{stats.games}</div>
          <div className="profile-stat-label">Games Played</div>
          <div className="profile-stat-sub">Since {stats.since}</div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-val" style={{color: 'var(--gold)'}}>&#9733; {stats.stars}</div>
          <div className="profile-stat-label">Stars Received</div>
          <div className="profile-stat-sub">Avg {stats.avg} per game</div>
        </div>
      </div>

      <div className="profile-form">
        <div className="profile-form-title">Edit Profile</div>
        <div className="profile-field">
          <label className="profile-label">First Name</label>
          <input
            className="profile-input"
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="profile-field">
          <label className="profile-label">Nickname <span style={{color: 'var(--muted)', fontWeight: 400}}>— optional</span></label>
          <input
            className="profile-input"
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            placeholder='e.g. "Gunner"'
          />
        </div>
        <div className="profile-field">
          <label className="profile-label">Last Name</label>
          <input
            className="profile-input"
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="profile-field">
          <label className="profile-label">Email</label>
          <input
            className="profile-input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

    </div>
  )
}
