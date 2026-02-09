import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import PostFeed from './components/PostFeed'
import './style.css'

// Main App component - imports and renders other components
const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="app">
          <Header />
          <main className="app-main">
            <PostFeed />
          </main>
        </div>
      </ProtectedRoute>
    </AuthProvider>
  )
}

export default App

