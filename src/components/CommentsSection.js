'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase'

export default function CommentsSection({ postId, initialComments, user }) {
  const [comments, setComments] = useState(initialComments || [])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user) return alert('You must be logged in to comment!')
    if (!newComment.trim()) return

    setLoading(true)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('comments')
      .insert([
        { 
          post_id: postId, 
          user_id: user.id, 
          comment_text: newComment 
        }
      ])
      .select('*, profiles(name)')
      .single()

    if (!error) {
      setComments([data, ...comments])
      setNewComment('')
    }
    setLoading(false)
  }

  return (
    <div style={{ marginTop: '4rem', padding: '4rem 0', borderTop: '1px solid #eee' }}>
      <h3 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Comments ({comments.length})</h3>
      
      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleAddComment} style={{ marginBottom: '3rem', display: 'flex', gap: '1rem' }}>
          <input 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your thoughts..."
            style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: '50px', border: '1px solid #ddd', outline: 'none' }}
          />
          <button type="submit" disabled={loading} className="button button-primary" style={{ padding: '0 2rem' }}>
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div style={{ background: 'var(--glass-dark)', padding: '1.5rem', borderRadius: '12px', marginBottom: '3rem', textAlign: 'center' }}>
          <p>You must <Link href="/login" style={{ fontWeight: 700, textDecoration: 'underline' }}>Login</Link> to leave a comment.</p>
        </div>
      )}

      {/* Comment List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {comments.map(c => (
          <div key={c.id} style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>
              {(c.profiles?.name || 'V').substring(0, 1)}
            </div>
            <div>
              <div className="label-mono" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                {c.profiles?.name || 'Anonymous User'} • {new Date(c.created_at).toLocaleDateString()}
              </div>
              <p style={{ fontSize: '1rem', margin: 0 }}>{c.comment_text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
