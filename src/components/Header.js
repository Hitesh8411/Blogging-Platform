import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/actions/auth'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userRole = null
  let displayName = ''

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, name')
      .eq('id', user.id)
      .single()

    if (profile) {
      userRole = profile.role
      // Fallback to email chunk if name is empty
      displayName = profile.name ? profile.name : user.email.split('@')[0]
    }
  }

  return (
    <nav className="container header-nav" style={{ padding: '1.5rem 0' }}>
      <Link href="/" className="logo">HIVON.</Link>
      
      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link href="/blog" className="label-mono" style={{ fontSize: '0.95rem', letterSpacing: '1px' }}>Blog</Link>
        
        {user ? (
          <>
            {userRole === 'Admin' && (
              <Link href="/admin" className="label-mono" style={{ color: '#ff3366', fontSize: '0.95rem', letterSpacing: '1px', fontWeight: 'bold' }}>Admin Control</Link>
            )}
            
            {userRole !== 'Admin' && (
              <div 
                className="button button-secondary" 
                style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem', border: '1px solid #ddd', cursor: 'default' }}
              >
                <span className="label-mono" style={{ fontWeight: 'normal', color: '#666', letterSpacing: '1px' }}>
                  Hi, <span style={{ color: '#000', fontWeight: 'bold' }}>{displayName}</span>
                </span>
              </div>
            )}
            
            <form action={signOut} style={{ display: 'flex', marginLeft: '1rem' }}>
              <button 
                type="submit" 
                className="button button-secondary"
                style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem', border: '1px solid #ddd' }}
              >
                Logout
              </button>
            </form>
          </>
        ) : (
          <Link href="/login" className="button button-primary" style={{ fontSize: '1rem', padding: '0.8rem 1.8rem' }}>Login</Link>
        )}
      </div>
    </nav>
  )
}
