import Link from 'next/link'

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <div className="post-card-image">
        {post.image_url && (
          <img 
            src={post.image_url} 
            alt={post.title} 
          />
        )}
      </div>
      
      <div className="post-card-content">
        <div className="label-mono post-card-date">
          {new Date(post.created_at).toLocaleDateString()}
        </div>
        <h3 className="post-card-title">{post.title}</h3>
        
        {post.summary && (
          <div className="post-card-summary">
            <p className="label-mono summary-badge">AI INSIGHT</p>
            <p className="summary-text">
              {post.summary.substring(0, 160)}...
            </p>
          </div>
        )}

        <div className="post-card-footer">
          <Link href={`/blog/${post.id}`} className="button button-primary" style={{ width: '100%' }}>
            Explore Article
          </Link>
        </div>
      </div>
    </article>
  )
}
