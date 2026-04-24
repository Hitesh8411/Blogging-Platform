import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { updatePost } from '@/actions/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function EditPostPage({ params }) {
  const { id } = params
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

  const { data: post, error } = await supabase.from('posts').select('*').eq('id', id).single()
  if (error || !post) notFound()

  // Permission check
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (post.author_id !== user.id && profile.role !== 'Admin') {
    return <div className="container section"><h1>Unauthorized</h1></div>
  }

  const updatePostWithId = updatePost.bind(null, id)

  return (
    <main style={{ minHeight: '100vh', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link href={`/blog/${id}`} className="label-mono" style={{ marginBottom: '2rem', display: 'block' }}>← Back to Post</Link>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Edit Post</h1>
        
        <form action={updatePostWithId} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="label-mono">Post Title</label>
            <input 
              name="title"
              defaultValue={post.title}
              type="text" 
              required
              style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1.5rem', fontWeight: 500 }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="label-mono">Featured Image URL</label>
            <input 
              name="image_url"
              defaultValue={post.image_url}
              type="url" 
              required
              style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="label-mono">Body Content</label>
            <textarea 
              name="body"
              defaultValue={post.body}
              required
              rows={12}
              style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1.125rem', lineHeight: 1.6 }}
            />
          </div>

          <button type="submit" className="button button-primary" style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>
            Update Post & Regenerate Summary
          </button>
        </form>
      </div>
    </main>
  )
}
