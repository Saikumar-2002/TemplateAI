import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar(){
  const { currentUser, logout } = useAuth()
  const { userPlan } = useApp()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
              
              <div className="relative" ref={dropdownRef}>
                <div 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-sm font-bold shadow-lg cursor-pointer hover:ring-2 hover:ring-violet-400 hover:ring-offset-2 hover:ring-offset-[#06060a] transition-all" 
                  title={currentUser.email}
                >
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U')}
                </div>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <div className="font-bold text-white truncate">{currentUser.displayName || 'User'}</div>
                        <div className="text-xs text-gray-400 truncate">{currentUser.email}</div>
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-semibold">
                          <span className={`w-1.5 h-1.5 rounded-full ${userPlan !== 'Starter' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-gray-400'}`}></span>
                          {userPlan} Plan
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <Link 
                          to="/history" 
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          My Generations
                        </Link>
                        <a 
                          href="#pricing"
                          onClick={() => {
                            setDropdownOpen(false)
                            if (window.location.pathname !== '/') navigate('/#pricing')
                          }}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          Manage Subscription
                        </a>
                      </div>
                      
                      <div className="border-t border-white/10 pt-1">
                        <button 
                          onClick={() => {
                            setDropdownOpen(false)
                            handleLogout()
                          }} 
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors font-medium"
                        >
                          Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
