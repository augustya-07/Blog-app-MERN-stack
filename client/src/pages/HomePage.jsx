import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client.js';
import EmptyState from '../components/EmptyState.jsx';
import PostCard from '../components/PostCard.jsx';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', category: '', tag: '' });

  useEffect(() => {
    const input = document.getElementById('post-search');
    if (searchParams.get('focus') === 'search') input?.focus();
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/posts', { params: filters });
        setPosts(data.posts);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [filters]);

  const featured = posts.find((post) => post.featured) || posts[0];
  const regularPosts = featured ? posts.filter((post) => post._id !== featured._id) : posts;
  const categories = useMemo(() => [...new Set(posts.map((post) => post.category).filter(Boolean))], [posts]);

  return (
    <section className="container-page py-8 sm:py-10">
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-coral">Latest stories</p>
          <h1 className="mt-2 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
            Read sharp ideas from writers, builders, and curious people.
          </h1>
        </div>
        <div className="rounded-md border border-line bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 text-ink/45" size={18} />
            <input
              id="post-search"
              className="field pl-10"
              placeholder="Search posts"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <select
              className="field"
              value={filters.category}
              onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-3 text-ink/45" size={18} />
              <input
                className="field pl-10"
                placeholder="Tag"
                value={filters.tag}
                onChange={(event) => setFilters((current) => ({ ...current, tag: event.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="rounded-md border border-line bg-white p-8 text-sm text-ink/60">Loading posts...</div>}
      {error && <div className="rounded-md border border-coral/30 bg-coral/10 p-4 text-sm font-semibold text-coral">{error}</div>}
      {!loading && !error && posts.length === 0 && <EmptyState title="No posts found" />}

      {!loading && !error && featured && (
        <>
          <PostCard post={featured} featured />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {regularPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
