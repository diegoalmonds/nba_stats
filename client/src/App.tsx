import { Routes, Route } from 'react-router'
import './App.css'
import Player from './pages/Player'
// import { Button } from "@/components/ui/button"

function App() {

  return (
    <Routes>
      <Route path='/' element={<Player />}/>
    </Routes>
  )
}

export default App
