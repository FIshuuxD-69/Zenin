import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import MangaDetailPage from './pages/MangaDetailPage'
import EditPage from './pages/EditPage'

function App() {
  return (
    <div className="min-h-screen bg-background text-textMain selection:bg-primary/30 relative">
      <div className="glow-bg"></div>
      <Navbar />
      <main className="container mx-auto px-4 py-8 relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/manga/:id" element={<MangaDetailPage />} />
          <Route path="/edit/:id" element={<EditPage />} />
        </Routes>
      </main>

      <Toaster position="top-center" />
    </div>
  )
}

export default App
