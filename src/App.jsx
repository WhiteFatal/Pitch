import { useState } from 'react'
import './App.css'
import Sidebar from './components/sidebar/sidebar.jsx'
import MainScreen from './components/mainscreen/mainscreen.jsx'

function App() {
  const [activeScreen, setActiveScreen] = useState('games')

  return (
    <div className="app">
      <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} />
      <MainScreen activeScreen={activeScreen} onNavigate={setActiveScreen} />
    </div>
  )
}

export default App
