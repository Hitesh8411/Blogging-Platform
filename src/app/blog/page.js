import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import PostCard from '@/components/PostCard'

export default async function BlogPage({ searchParams }) {
  const resolvedParams = await searchParams
  const query = resolvedParams?.q || ''
  const page = parseInt(resolvedParams?.page) || 1
  const pageSize = 7 // 1 featured + 6 grid
  
  const supabase = await createClient()

  // 1. Check user context
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

  const { data: posts, count } = await dbQuery
  const totalPages = Math.ceil((count || 0) / pageSize)

  const featuredPost = posts?.[0]
  const gridPosts = posts?.slice(1)

  return (
    <main style={{ minHeight: '100vh', background: '#fcfcfc' }}>
      {/* Header Area */}
      <div className="hero-gradient" style={{ padding: '8rem 0 6rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div className="label-mono" style={{ color: 'rgba(0,0,0,0.5)', marginBottom: '1rem' }}>Hivon Automations</div>
              <h1 style={{ fontSize: '5rem', color: '#000', margin: 0 }}>The Feed.</h1>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              {(userRole === 'Admin' || userRole === 'Author') && (
                <Link href="/blog/new" className="button button-primary" style={{ padding: '1.25rem 2.5rem' }}>
                  Create Post
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 10 }}>
        {/* Search Bar */}
        <div style={{ background: '#fff', padding: '0.75rem', borderRadius: '50px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', display: 'flex', gap: '1rem', width: '100%', maxWidth: '700px' }}>

          <form style={{ display: 'flex', width: '100%' }}>
            <input 
              name="q"
              defaultValue={query}
              placeholder="Search concepts, titles, insights..."
              style={{ flex: 1, border: 'none', padding: '0 2rem', fontSize: '1.1rem', outline: 'none' }}
            />
            <button type="submit" className="button button-primary">Search</button>
          </form>
        </div>

        {/* Featured Post */}
        {featuredPost && !query && page === 1 && (
          <section style={{ marginTop: '5rem' }}>
            <div className="label-mono" style={{ marginBottom: '2rem' }}>Latest Insight</div>
            <Link href={`/blog/${featuredPost.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="post-card" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', minHeight: '500px' }}>
                <div className="post-card-image" style={{ height: 'auto' }}>
                  <img src={featuredPost.image_url} alt={featuredPost.title} />
                </div>
                <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="label-mono" style={{ marginBottom: '1.5rem', color: '#888' }}>Featured Post</div>
                  <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>{featuredPost.title}</h2>
                  <div className="post-card-summary" style={{ background: 'rgba(0,0,0,0.03)', borderLeft: '8px solid #000' }}>
                     <p className="label-mono" style={{ fontSize: '0.7rem', fontWeight: 900 }}>AI ANALYTIC</p>
                     <p style={{ fontSize: '1.1rem', color: '#333' }}>{featuredPost.summary}</p>
                  </div>
                  <span className="button button-primary" style={{ alignSelf: 'flex-start' }}>Read Full Analysis</span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Post Grid */}
        <div style={{ padding: '6rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '4rem' }}>
          {(query || page > 1 ? posts : gridPosts)?.map(post => (
            <PostCard key={post.id} post={post} />
          ))}

          {(!posts || posts.length === 0) && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '8rem' }}>
              <h3 style={{ fontSize: '3rem' }}>Blank Canvas.</h3>
              <p style={{ fontSize: '1.2rem', opacity: 0.6 }}>No insights match your current search.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', paddingBottom: '10rem' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link 
                key={p} 
                href={`/blog?q=${query}&page=${p}`}
                className={`button ${p === page ? 'button-primary' : 'button-secondary'}`}
                style={{ width: '60px', height: '60px', padding: 0 }}
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
