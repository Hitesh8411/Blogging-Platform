import Link from 'next/link'

export default function PostCard({ post }) {
  return (
    <article style={{ 
      background: '#ffffff', 
      borderRadius: '16px', 
      overflow: 'hidden', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      transition: 'transform 0.2s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ height: '240px', overflow: 'hidden' }}>
        <img 
          src={post.image_url} 
          alt={post.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      
      <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="label-mono" style={{ marginBottom: '0.75rem', color: '#666' }}>
          {new Date(post.created_at).toLocaleDateString()}
        </div>
        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', lineHeight: 1.2 }}>{post.title}</h3>
        
        {/* AI Summary (Requirement 5.3) */}
        {post.summary && (
          <div style={{ 
            background: 'var(--glass-dark)', 
            padding: '1.25rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            borderLeft: '4px solid #000'
          }}>
            <p className="label-mono" style={{ fontSize: '0.7rem', marginBottom: '0.5rem', fontWeight: 700 }}>AI SUMMARY</p>
            <p style={{ fontSize: '0.95rem', margin: 0, fontStyle: 'italic', color: '#333' }}>
              {post.summary.substring(0, 250)}...
            </p>
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          <Link href={`/blog/${post.id}`} className="button button-outline" style={{ width: '100%' }}>
            Read Full Post
          </Link>
        </div>
      </div>
    </article>
  )
}
