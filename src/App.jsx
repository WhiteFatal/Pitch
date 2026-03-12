import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore'
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
  const [user, setUser]                   = useState(null)
  const [loading, setLoading]             = useState(true)
  const [activeScreen, setActiveScreen]   = useState('games')
  const [notifications, setNotifications] = useState([])
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showIOSBanner, setShowIOSBanner] = useState(() => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isStandalone = window.navigator.standalone === true
    return isIOS && !isStandalone
  })

  // Capture Android install prompt
  useEffect(() => {
    function handleBeforeInstallPrompt(e) {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  async function handleAndroidInstall() {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstallPrompt(null)
  }

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

  // Fetch notifications once on login
  useEffect(() => {
    if (!user?.uid) return

    async function fetchNotifications() {
      try {
        const q    = query(collection(db, 'notifications'), where('userId', '==', user.uid))
        const snap = await getDocs(q)
        const docs = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
        setNotifications(docs)
      } catch (err) {
        console.error('Error fetching notifications:', err)
      }
    }

    fetchNotifications()
  }, [user?.uid])

  // Update a notification's read state in local notifications array
  function handleMarkRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  // Mark all notifications as read in local notifications array
  function handleMarkAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  if (loading) return null

  const hasUnread = notifications.some(n => !n.read)

  const installBanners = (
    <>
      {installPrompt && (
        <div className="install-banner">
          <span>📲 Install PITCH as an app</span>
          <button className="install-banner-btn" onClick={handleAndroidInstall}>Install</button>
          <button className="install-banner-close" onClick={() => setInstallPrompt(null)}>✕</button>
        </div>
      )}
      {showIOSBanner && (
        <div className="install-banner">
          <span>📲 Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> to install</span>
          <button className="install-banner-close" onClick={() => setShowIOSBanner(false)}>✕</button>
        </div>
      )}
    </>
  )

  if (!user) return (
    <>
      <Login />
      {installBanners}
    </>
  )

  return (
    <div className="app">
      <Sidebar
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        hasUnread={hasUnread} />
      <MainScreen
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        user={user}
        hasUnread={hasUnread}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead} />
    </div>
  )
}

export default App
