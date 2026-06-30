import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar(){
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  return (
    <nav className="fixed w-full z-50 bg-[#06060a]/80 backdrop-blur-xl border-b border-white/10">
      <div className="container h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Template<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">AI</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <Link to="/explore" className="hover:text-white transition">Explore</Link>
            <Link to="/collections" className="hover:text-white transition">Collections</Link>
            {currentUser && <Link to="/history" className="hover:text-white transition">History</Link>}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {!currentUser ? (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-white transition hidden md:block">Log In</Link>
              <Link to="/signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition">Sign Up</Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-sm font-medium hover:text-white transition hidden md:block">Dashboard</Link>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-sm font-bold shadow-lg cursor-pointer" title={currentUser.email}>
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U')}
              </div>
              <button onClick={handleLogout} className="text-sm font-medium text-gray-400 hover:text-white transition">Log Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
