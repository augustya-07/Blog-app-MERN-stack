import { Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { imageUrl } from '../api/client.js';

export default function PostCard({ post, featured = false }) {
  return (
    <article className={`overflow-hidden rounded-md border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft ${featured ? 'lg:grid lg:grid-cols-[1.15fr_0.85fr]' : ''}`}>
      <Link to={`/posts/${post.slug}`} className="block">
        <img
          src={imageUrl(post.coverImage)}
          alt={post.title}
          className={`w-full object-cover ${featured ? 'h-72 lg:h-full' : 'h-52'}`}
        />
      </Link>
      <div className="flex h-full flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-normal text-leaf">
          <span>{post.category}</span>
          {post.featured && <span className="rounded-sm bg-gold/10 px-2 py-1 text-gold">Featured</span>}
        </div>
        <Link to={`/posts/${post.slug}`} className="mt-3 block">
          <h2 className={`${featured ? 'text-3xl' : 'text-xl'} font-serif font-bold leading-tight`}>
            {post.title}
          </h2>
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/70">{post.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-sm bg-paper px-2 py-1 text-xs font-semibold text-ink/65">
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-5 text-sm text-ink/60">
          <span>By {post.author?.name || 'Unknown'}</span>
          <span className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Heart size={16} />
              {post.likeCount ?? post.likes?.length ?? 0}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle size={16} />
              {post.commentCount ?? post.comments?.length ?? 0}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
