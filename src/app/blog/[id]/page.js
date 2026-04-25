import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CommentsSection from '@/components/CommentsSection'
import { deletePost } from '@/actions/posts'

export default async function PostDetail({ params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('posts')
    .select('*, profiles:author_id(name, role)')
    .eq('id', id)
    .single()

  if (error || !post) notFound()

  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles(name)')
    .eq('post_id', id)
    .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()
  
  let userRole = 'Viewer'
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile) userRole = profile.role
  }

  const isOwner = user?.id === post.author_id
  const isAdmin = userRole === 'Admin'
  const canEdit = isOwner || isAdmin

  const deletePostWithId = deletePost.bind(null, id)

  return (
    <main style={{ minHeight: '100vh', padding: '6rem 0' }}>
      <article className="container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link href="/blog" className="label-mono">← Back to Blog</Link>
          {canEdit && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href={`/blog/${id}/edit`} className="button button-outline" style={{ fontSize: '0.875rem' }}>Edit Post</Link>
              <form action={deletePostWithId}>
                <button type="submit" className="button" style={{ background: '#fff0f0', color: '#ff0000', fontSize: '0.875rem' }}>Delete</button>
              </form>
            </div>
          )}
        </div>
        
        <header style={{ marginBottom: '3rem' }}>
          <div className="label-mono" style={{ color: '#666', marginBottom: '1rem' }}>
            {new Date(post.created_at).toLocaleDateString()} • {post.profiles?.name}
          </div>
          <h1 style={{ fontSize: '4rem', lineHeight: 1.1, marginBottom: '2rem' }}>{post.title}</h1>
          <div style={{ borderRadius: '16px', overflow: 'hidden', height: '400px' }}>
            <img src={post.image_url} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </header>

        {post.summary && (
          <div style={{ background: 'var(--glass-dark)', padding: '2rem', borderRadius: '12px', marginBottom: '3rem', borderLeft: '4px solid #000' }}>
            <p className="label-mono" style={{ fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 700 }}>💡 AI Insight</p>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, fontStyle: 'italic', color: '#333' }}>{post.summary}</p>
          </div>
        )}

        <section style={{ fontSize: '1.25rem', lineHeight: 1.8, marginBottom: '4rem' }}>
          {post.body.split('\n').map((para, i) => <p key={i}>{para}</p>)}
        </section>

        <CommentsSection postId={post.id} initialComments={comments} user={user} />
      </article>
    </main>
  )
}
