'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else window.location.href = '/'
    setLoading(false)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    if (error) setMessage(error.message)
    else setMessage('Check your email for the confirmation link!')
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-dark)' }}>
      <div style={{ background: '#ffffff', padding: '3rem', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Login or Join</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="label-mono">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@company.com"
              required
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="label-mono">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </div>
          
          {message && <p style={{ fontSize: '0.875rem', color: '#ff0000', marginTop: '0.5rem' }}>{message}</p>}

          <button type="submit" disabled={loading} className="button button-primary" style={{ marginTop: '1rem' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          
          <button type="button" onClick={handleSignup} disabled={loading} className="button button-outline">
            Create Account
          </button>
        </form>
      </div>
    </main>
  )
}
