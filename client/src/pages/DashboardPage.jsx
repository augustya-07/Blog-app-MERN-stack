import { Edit3, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client.js';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      if (!['author', 'admin'].includes(user.role)) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/posts', { params: { author: user._id, limit: 30 } });
        setPosts(data.posts);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [user]);

  async function removePost(id) {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts((current) => current.filter((post) => post._id !== id));
      toast.success('Post deleted');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <section className="container-page py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-leaf">{user.role}</p>
          <h1 className="font-serif text-4xl font-bold">Welcome, {user.name}</h1>
        </div>
        {['author', 'admin'].includes(user.role) && (
          <Link to="/editor" className="btn-primary">
            <PlusCircle size={18} />
            New post
          </Link>
        )}
      </div>

      {!['author', 'admin'].includes(user.role) ? (
        <div className="mt-8">
          <EmptyState title="Reader dashboard" text="You can comment, like posts, and edit your profile. Ask an admin to promote you to author when you are ready to publish." />
        </div>
      ) : (
        <div className="mt-8 rounded-md border border-line bg-white shadow-sm">
          <div className="border-b border-line p-5">
            <h2 className="text-xl font-bold">Your posts</h2>
          </div>
          {loading && <p className="p-5 text-sm text-ink/60">Loading posts...</p>}
          {!loading && posts.length === 0 && (
            <div className="p-5">
              <EmptyState title="No posts yet" text="Open the editor and publish your first article." />
            </div>
          )}
          <div className="divide-y divide-line">
            {posts.map((post) => (
              <div key={post._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold">{post.title}</h3>
                  <p className="mt-1 text-sm text-ink/60">{post.category} · {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/editor/${post._id}`} className="btn-secondary px-3" title="Edit post">
                    <Edit3 size={17} />
                  </Link>
                  <button onClick={() => removePost(post._id)} className="btn-danger px-3" title="Delete post">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
