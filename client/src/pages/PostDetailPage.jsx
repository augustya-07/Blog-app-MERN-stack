import { Heart, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { api, getErrorMessage, imageUrl } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function PostDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editBody, setEditBody] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const { data } = await api.get(`/posts/${slug}`);
        setPost(data);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  const liked = useMemo(() => post?.likes?.some((id) => id === user?._id), [post, user]);

  async function toggleLike() {
    if (!user) {
      toast.error('Sign in to like posts');
      return;
    }

    try {
      const { data } = await api.post(`/posts/${post._id}/like`);
      setPost((current) => ({
        ...current,
        likes: data.liked
          ? [...current.likes, user._id]
          : current.likes.filter((id) => id !== user._id),
        likeCount: data.likeCount
      }));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function addComment(event) {
    event.preventDefault();
    if (!user) {
      toast.error('Sign in to comment');
      return;
    }

    try {
      const { data } = await api.post(`/posts/${post._id}/comments`, { body: comment });
      setPost((current) => ({ ...current, comments: [...current.comments, data] }));
      setComment('');
      toast.success('Comment posted');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function updateComment(event) {
    event.preventDefault();
    try {
      const { data } = await api.put(`/posts/${post._id}/comments/${editingComment}`, { body: editBody });
      setPost((current) => ({
        ...current,
        comments: current.comments.map((item) => (item._id === editingComment ? { ...item, body: data.body } : item))
      }));
      setEditingComment(null);
      setEditBody('');
      toast.success('Comment updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function deleteComment(commentId) {
    if (!confirm('Delete this comment?')) return;
    try {
      await api.delete(`/posts/${post._id}/comments/${commentId}`);
      setPost((current) => ({ ...current, comments: current.comments.filter((item) => item._id !== commentId) }));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  if (loading) return <div className="container-page py-12 text-sm text-ink/60">Loading story...</div>;
  if (!post) return <div className="container-page py-12 text-sm text-ink/60">Post not found.</div>;

  const canEditPost = user && (user.role === 'admin' || post.author?._id === user._id);

  return (
    <article className="pb-12">
      <div className="container-page py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-leaf">
            <span>{post.category}</span>
            <span className="text-ink/30">/</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-6xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-8 text-ink/70">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
            <div className="text-sm text-ink/65">
              By <span className="font-semibold text-ink">{post.author?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {canEditPost && (
                <Link to={`/editor/${post._id}`} className="btn-secondary px-3" title="Edit post">
                  <Pencil size={17} />
                </Link>
              )}
              <button onClick={toggleLike} className={liked ? 'btn-primary' : 'btn-secondary'}>
                <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                {post.likeCount ?? post.likes?.length ?? 0}
              </button>
            </div>
          </div>
        </div>
      </div>

      <img src={imageUrl(post.coverImage)} alt={post.title} className="h-[46vh] min-h-72 w-full object-cover" />

      <div className="container-page mt-10">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-lg max-w-none whitespace-pre-line font-serif leading-8 text-ink">
            {post.content}
          </div>

          <section className="mt-12 border-t border-line pt-8">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <MessageCircle size={22} />
              Comments
            </h2>
            <form onSubmit={addComment} className="mt-5">
              <textarea
                className="field min-h-28"
                placeholder={user ? 'Share your thoughts' : 'Sign in to comment'}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                disabled={!user}
                required
              />
              <button className="btn-primary mt-3" disabled={!user}>
                Post comment
              </button>
            </form>

            <div className="mt-6 space-y-4">
              {post.comments?.map((item) => {
                const canModify = user && (user.role === 'admin' || item.author?._id === user._id);
                return (
                  <div key={item._id} className="rounded-md border border-line bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.author?.name || 'Deleted user'}</p>
                        <p className="text-xs text-ink/50">{new Date(item.createdAt).toLocaleString()}</p>
                      </div>
                      {canModify && (
                        <div className="flex gap-2">
                          <button
                            className="btn-secondary px-3 py-2"
                            title="Edit comment"
                            onClick={() => {
                              setEditingComment(item._id);
                              setEditBody(item.body);
                            }}
                          >
                            <Pencil size={15} />
                          </button>
                          <button className="btn-danger px-3 py-2" title="Delete comment" onClick={() => deleteComment(item._id)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                    {editingComment === item._id ? (
                      <form onSubmit={updateComment} className="mt-3">
                        <textarea className="field min-h-24" value={editBody} onChange={(event) => setEditBody(event.target.value)} required />
                        <div className="mt-2 flex gap-2">
                          <button className="btn-primary">Save</button>
                          <button type="button" className="btn-secondary" onClick={() => setEditingComment(null)}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-ink/75">{item.body}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
