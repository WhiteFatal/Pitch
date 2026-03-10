import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import './App.css'
import Sidebar from './components/sidebar/sidebar.jsx'
import MainScreen from './components/mainscreen/mainscreen.jsx'
import Login from './components/login/Login.jsx'


function App() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true) // true while Firebase checks auth state on load
  const [activeScreen, setActiveScreen] = useState('games')

  useEffect(() => {
    // Listen for auth state changes — fires once on load, then on every sign in/out
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe() // cleanup listener on unmount
  }, [])

  // Show nothing while Firebase is checking if user is already logged in
  if (loading) return null

  // Show login screen if not authenticated
  if (!user) return <Login />

  // Show main app if authenticated
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
