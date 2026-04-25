import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { updateUserRole } from '@/actions/admin'
import { deletePost } from '@/actions/posts'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // 1. Authenticate & Verify Admin Role
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'Admin') {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'red' }}>Access Denied</h1>
        <p>You must be an administrator to view this module.</p>
        <Link href="/" className="button button-primary" style={{ mt: '2rem' }}>Return Home</Link>
      </div>
    )
  }

  // 2. Fetch all data using the service role client (bypasses RLS limits on profiles)
  const adminClient = createAdminClient()
  
  const { data: users } = await adminClient
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: posts } = await adminClient
    .from('posts')
    .select('*, profiles:author_id(name, email)')
    .order('created_at', { ascending: false })

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5', padding: '3rem 0' }}>
      <div className="container">
        <header style={{ marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>Admin Control</h1>
          <p className="label-mono">Manage Content & Creators</p>
        </header>

        {/* User Management Section */}
        <section style={{ background: '#fff', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Community Users</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #000' }}>
                  <th style={{ padding: '1rem', fontWeight: 900 }}>Email</th>
                  <th style={{ padding: '1rem', fontWeight: 900 }}>Joined</th>
                  <th style={{ padding: '1rem', fontWeight: 900 }}>Current Role</th>
                  <th style={{ padding: '1rem', fontWeight: 900 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>{u.email}</td>
                    <td style={{ padding: '1rem', color: '#666' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className="label-mono" style={{ background: 'var(--glass-dark)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <form action={async (formData) => {
                        'use server'
                        const newRole = formData.get('role')
                        await updateUserRole(u.id, newRole)
                      }} style={{ display: 'flex', gap: '0.5rem' }}>
                        <select name="role" defaultValue={u.role} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}>
                          <option value="Viewer">Viewer</option>
                          <option value="Author">Author</option>
                          <option value="Admin">Admin</option>
                        </select>
                        <button type="submit" className="button button-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Update</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Content Moderation Section */}
        <section style={{ background: '#000', color: '#fff', padding: '3rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#fff' }}>Content Moderation</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#ccc' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
                  <th style={{ padding: '1rem', color: '#fff', fontWeight: 900 }}>Title</th>
                  <th style={{ padding: '1rem', color: '#fff', fontWeight: 900 }}>Author</th>
                  <th style={{ padding: '1rem', color: '#fff', fontWeight: 900 }}>Date</th>
                  <th style={{ padding: '1rem', color: '#fff', fontWeight: 900 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts?.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ padding: '1rem', color: '#fff' }}>{p.title}</td>
                    <td style={{ padding: '1rem' }}>{p.profiles?.email || 'Unknown'}</td>
                    <td style={{ padding: '1rem' }}>{new Date(p.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href={`/blog/${p.id}/edit`} className="button button-white" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Edit</Link>
                        <form action={async () => {
                          'use server'
                          await deletePost(p.id)
                        }}>
                          <button type="submit" className="button" style={{ background: '#ff3333', color: '#fff', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!posts || posts.length === 0) && (
                  <tr>
                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No posts on the platform yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  )
}
