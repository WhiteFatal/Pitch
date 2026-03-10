import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import './profile.css'
import { displayName } from '../../../utils'

export default function ProfileScreen({ active, user }) {

  const [form, setForm] = useState({
    firstName: '',
    nickname:  '',
    lastName:  '',
    email:     user?.email || '',
  })

  const [stats, setStats] = useState({
    gamesPlayed:   0,
    starsReceived: 0,
    createdAt:     null,
  })

  const [loading, setLoading] = useState(true)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!user) return

    async function fetchProfile() {
      try {
        const userRef  = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          const data = userSnap.data()
          setForm({
            firstName: data.firstName || '',
            nickname:  data.nickname  || '',
            lastName:  data.lastName  || '',
            email:     user.email     || '',
          })
          // Single source of truth — all stats from users document
          setStats({
            gamesPlayed:   data.gamesPlayed   || 0,
            starsReceived: data.starsReceived || 0,
            createdAt:     data.createdAt     || null,
          })
        } else {
          // First time — no Firestore doc yet, fall back to Google name
          const parts     = (user.displayName || '').trim().split(' ')
          const firstName = parts[0] || ''
          const lastName  = parts.slice(1).join(' ') || ''
          setForm(prev => ({ ...prev, firstName, lastName }))
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError('Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    setError(null)
    try {
      const userRef = doc(db, 'users', user.uid)
      await setDoc(userRef, {
        firstName: form.firstName,
        nickname:  form.nickname,
        lastName:  form.lastName,
        email:     user.email,
        photoURL:  user.photoURL || '',
      }, { merge: true })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Error saving profile:', err)
      setError('Failed to save. Please try again.')
    }
  }

  const photoURL = user?.photoURL || null
  const initials = ((form.firstName[0] || '') + (form.lastName[0] || '')).toUpperCase()

  const since = stats.createdAt
    ? stats.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null

  const avg = stats.gamesPlayed > 0
    ? (stats.starsReceived / stats.gamesPlayed).toFixed(1)
    : '0.0'

  if (loading) return (
    <div className={`content screen ${active ? 'active' : ''}`} id="screen-profile">
      <div className="page-header" style={{marginBottom: '28px'}}>
        <div>
          <div className="page-title">MY PROFILE</div>
          <div className="page-subtitle">Your stats &amp; account details</div>
        </div>
      </div>
      <div style={{color: 'var(--muted)', padding: '40px', textAlign: 'center'}}>Loading profile...</div>
    </div>
  )

  return (
    <div className={`content screen ${active ? 'active' : ''}`} id="screen-profile">

      <div className="page-header" style={{marginBottom: '28px'}}>
        <div>
          <div className="page-title">MY PROFILE</div>
          <div className="page-subtitle">Your stats &amp; account details</div>
        </div>
      </div>

      <div className="profile-hero">
        {photoURL
          ? <img src={photoURL} className="profile-avatar-lg-photo" alt={user.displayName} />
          : <div className="profile-avatar-lg">{initials}</div>
        }
        <div>
          <div className="profile-name">{displayName(form.firstName, form.nickname, form.lastName)}</div>
          <div className="profile-email">{form.email}</div>
        </div>
      </div>

      <div className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="profile-stat-val">{stats.gamesPlayed}</div>
          <div className="profile-stat-label">Games Played</div>
          <div className="profile-stat-sub">{since ? `Since ${since}` : '—'}</div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-val" style={{color: 'var(--gold)'}}>★ {stats.starsReceived}</div>
          <div className="profile-stat-label">Stars Received</div>
          <div className="profile-stat-sub">Avg {avg} per game</div>
        </div>
      </div>

      <div className="profile-form">
        <div className="profile-form-title">Edit Profile</div>

        {error && (
          <div style={{color: 'var(--red)', fontSize: '13px', marginBottom: '16px'}}>{error}</div>
        )}

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
          <label className="profile-label">Email <span style={{color: 'var(--muted)', fontWeight: 400}}>— from Google</span></label>
          <input
            className="profile-input"
            type="email"
            name="email"
            value={form.email}
            disabled
          />
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

    </div>
  )
}
