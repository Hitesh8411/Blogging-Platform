import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import PostCard from '@/components/PostCard'

export default async function BlogPage({ searchParams }) {
  const query = searchParams?.q || ''
  const page = parseInt(searchParams?.page) || 1
  const pageSize = 6
  
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // 1. Check user role for "Create Post" visibility
  const { data: { user } } = await supabase.auth.getUser()
  let userRole = 'Viewer'
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile) userRole = profile.role
  }

  // 2. Build Query
  let dbQuery = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  dbQuery = dbQuery.range(from, to)

  const { data: posts, count, error } = await dbQuery

  const totalPages = Math.ceil((count || 0) / pageSize)

  return (
    <main style={{ minHeight: '100vh', background: '#fcfcfc' }}>
      {/* Header Area */}
      <div style={{ background: '#000', color: '#fff', padding: '6rem 0 4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div className="label-mono" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>Hivon Automations</div>
              <h1 style={{ fontSize: '4rem', color: '#fff' }}>The Blog.</h1>
            </div>
            
            {(userRole === 'Admin' || userRole === 'Author') && (
              <Link href="/blog/new" className="button" style={{ background: '#fff', color: '#000', marginBottom: '1rem' }}>
                + Create New Post
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-2rem' }}>
        {/* Search Bar */}
        <div style={{ background: '#fff', padding: '1rem', borderRadius: '50px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', gap: '1rem', width: '100%', maxWidth: '600px' }}>
          <form style={{ display: 'flex', width: '100%' }}>
            <input 
              name="q"
              defaultValue={query}
              placeholder="Search posts by title..."
              style={{ flex: 1, border: 'none', padding: '0 1.5rem', fontSize: '1rem', outline: 'none' }}
            />
            <button type="submit" className="button button-primary">Search</button>
          </form>
        </div>

        {/* Post Grid */}
        <div style={{ padding: '4rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
          {posts?.map(post => (
            <PostCard key={post.id} post={post} />
          ))}

          {(!posts || posts.length === 0) && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
              <h3 style={{ fontSize: '2rem' }}>No posts found.</h3>
              <p>Try a different search query or start writing!</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', paddingBottom: '6rem' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link 
                key={p} 
                href={`/blog?q=${query}&page=${p}`}
                className={`button ${p === page ? 'button-primary' : 'button-secondary'}`}
                style={{ width: '50px', height: '50px', padding: 0 }}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
