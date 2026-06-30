import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import TemplateDetail from './pages/TemplateDetail'
import Upload from './pages/Upload'
import Generate from './pages/Generate'
import Explore from './pages/Explore'
import Favorites from './pages/Favorites'
import Collections from './pages/Collections'
import History from './pages/History'
import Settings from './pages/Settings'
import About from './pages/About'
import Contact from './pages/Contact'
import Help from './pages/Help'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Challenge from './pages/Challenge'
import Layout from './layouts/Layout'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="explore" element={<Explore />} />
        <Route path="collections" element={<Collections />} />
        <Route path="templates/:id" element={<TemplateDetail />} />
        
        {/* Protected Routes */}
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="generate" element={<ProtectedRoute><Generate /></ProtectedRoute>} />
        <Route path="favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="challenge" element={<ProtectedRoute><Challenge /></ProtectedRoute>} />
        
        <Route path="upload" element={<Upload />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="help" element={<Help />} />
      </Route>
    </Routes>
  )
}
