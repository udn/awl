import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Beranda from './pages/Beranda'
import Peta from './pages/Peta'
import Monitoring from './pages/Monitoring'
import Komparasi from './pages/Komparasi'
import Info from './pages/Info'
import Analisa from './pages/Analisa'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/beranda" replace />} />
        <Route path="/beranda" element={<Beranda />} />
        <Route path="/peta" element={<Peta />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/komparasi" element={<Komparasi />} />
        <Route path="/info" element={<Info />} />
        <Route path="/analisa" element={<Analisa />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
