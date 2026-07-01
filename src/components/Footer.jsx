import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#06060a] pt-16 pb-8">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              Template<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">AI</span>
            </Link>
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              The fastest way to hop on social media trends. One click AI transformations directly in your browser.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://x.com/SaiKumar891714" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-violet-600 transition text-lg">𝕏</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-600 transition text-lg">IG</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition text-lg">FB</a>
              <a href="https://www.linkedin.com/in/saikumar1002" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition text-lg">in</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Product</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/explore" className="hover:text-violet-400 transition">Explore Templates</Link></li>
              <li><Link to="/collections" className="hover:text-violet-400 transition">Collections</Link></li>
              <li><a href="#pricing" className="hover:text-violet-400 transition">Pricing Plans</a></li>
              <li><Link to="/history" className="hover:text-violet-400 transition">Your History</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/help" className="hover:text-violet-400 transition">Help Center & FAQ</Link></li>
              <li><Link to="/about" className="hover:text-violet-400 transition">About Us</Link></li>
              <li><a href="#" className="hover:text-violet-400 transition">Blog & Trends</a></li>
              <li><Link to="/contact" className="hover:text-violet-400 transition">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-violet-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-violet-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-violet-400 transition">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>© {new Date().getFullYear()} TemplateAI Inc. All rights reserved.</div>
          <div className="flex gap-4">
            <span>Made with ❤️ by SKY</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
