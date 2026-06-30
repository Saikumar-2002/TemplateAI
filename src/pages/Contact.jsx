import React, { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'

// ─── EmailJS Configuration ───
// To set this up:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add a Gmail service (connect your saikumarkalva10@gmail.com)
// 3. Create an email template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
// 4. Replace the IDs below with your actual IDs from the EmailJS dashboard
const EMAILJS_SERVICE_ID = 'service_m00x54k'
const EMAILJS_TEMPLATE_ID = 'template_le4p1lr'
const EMAILJS_PUBLIC_KEY = 'yEq5j3dMdIM1xVXea'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      )
      setSent(true)
      formRef.current.reset()
      setTimeout(() => setSent(false), 5000)
    } catch (err) {
      console.error('EmailJS Error:', err)
      setError('Failed to send message. Please try again or email us directly at saikumarkalva10@gmail.com')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="pt-24 pb-20 container max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-gray-400 mt-2">Have a question or need support? We're here to help.</p>
      </div>

      <div className="glass rounded-3xl p-8 border border-white/10">
        {sent ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold">Message Sent!</h3>
            <p className="text-gray-400 mt-2">We'll get back to you as soon as possible.</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                <input name="from_name" required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                <input name="from_email" required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Subject</label>
              <input name="subject" required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition" placeholder="How can we help?" />
            </div>
            {/* Hidden field to set the recipient email */}
            <input type="hidden" name="to_email" value="saikumarkalva10@gmail.com" />
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Message</label>
              <textarea name="message" required rows="5" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition resize-none" placeholder="Your message here..."></textarea>
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
