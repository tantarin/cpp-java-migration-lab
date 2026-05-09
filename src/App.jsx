import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import GymPage from './pages/GymPage'
import CasePage from './pages/CasePage'

export default function App() {
  return (
    <HashRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gym" element={<GymPage />} />
          <Route path="/gym/:topicId" element={<GymPage />} />
          <Route path="/case" element={<CasePage />} />
          <Route path="/case/:moduleId" element={<CasePage />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
