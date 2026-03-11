import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import './App.css'
import Sidebar from './components/sidebar/sidebar.jsx'
import MainScreen from './components/mainscreen/mainscreen.jsx'
import Login from './components/login/Login.jsx'


async function ensureUserDoc(firebaseUser) {
  const userRef  = doc(db, 'users', firebaseUser.uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    // First time this user logs in — create their document
    const parts     = (firebaseUser.displayName || '').trim().split(' ')
    const firstName = parts[0] || ''
    const lastName  = parts.slice(1).join(' ') || ''

    await setDoc(userRef, {
      firstName,
      lastName,
      nickname:      '',
      email:         firebaseUser.email || '',
      photoURL:      firebaseUser.photoURL || '',
      role:          'player',
      gamesPlayed:   0,
      starsReceived: 0,
      createdAt:     serverTimestamp(),
    })
  }
}

function App() {
  const [user, setUser]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [activeScreen, setActiveScreen] = useState('games')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await ensureUserDoc(firebaseUser)
      }
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) return null
  if (!user) return <Login />

  return (
    <div className="app">
      <Sidebar
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        user={user} />
      <MainScreen
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        user={user} />
    </div>
  )
}

export default App
