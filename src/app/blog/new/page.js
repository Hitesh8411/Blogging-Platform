'use client'

import { useState } from 'react'
import { createPost } from '@/actions/posts'
import Link from 'next/link'

export default function NewPostPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(formData) {
    setLoading(true)
    setError(null)
    try {
      await createPost(formData)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link href="/blog" className="label-mono" style={{ marginBottom: '2rem', display: 'block' }}>← Back to Blog</Link>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Create New Post</h1>
        
        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="label-mono">Post Title</label>
            <input 
              name="title"
              type="text" 
              required
              placeholder="Enter an engaging title..."
              style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1.5rem', fontWeight: 500 }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="label-mono">Featured Image URL</label>
            <input 
              name="image_url"
              type="url" 
              required
              placeholder="https://images.unsplash.com/..."
              style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="label-mono">Body Content</label>
            <textarea 
              name="body"
              required
              placeholder="Start writing your story..."
              rows={12}
              style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1.125rem', lineHeight: 1.6, resize: 'vertical' }}
            />
          </div>

          {error && <div style={{ color: '#ff0000', padding: '1rem', background: '#fff0f0', borderRadius: '8px' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
            <button 
              type="submit" 
              disabled={loading}
              className="button button-primary" 
              style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}
            >
              {loading ? 'Generating AI Summary...' : 'Publish Post'}
            </button>
            {loading && <span className="label-mono">Hang tight, we're crafting your summary...</span>}
          </div>
        </form>
      </div>
    </main>
  )
}
