import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import LeftSidebar from './components/LeftSidebar'
import PostFeed from './components/PostFeed'
import Profile from './pages/Profile'
import './style.css'

// Main App component - imports and renders other components
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ProtectedRoute>
          <div className="app">
            <Header />
            <div className="app-layout">
              <LeftSidebar />
              <main className="app-main">
                <Routes>
                  <Route path="/" element={<PostFeed />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
            </div>
          </div>
        </ProtectedRoute>
      </AuthProvider>
    </Router>
  )
}

export default App

