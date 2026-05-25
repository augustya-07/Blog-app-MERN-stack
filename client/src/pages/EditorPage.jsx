import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { api, getErrorMessage } from '../api/client.js';
import PostForm from '../components/PostForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function EditorPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;
      try {
        const { data } = await api.get(`/posts/id/${id}`);
        setPost(data);
      } catch (error) {
        toast.error(getErrorMessage(error));
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id, navigate]);

  async function handleSubmit(payload) {
    try {
      setSubmitting(true);
      const { data } = id
        ? await api.put(`/posts/${id}`, payload)
        : await api.post('/posts', payload);
      toast.success(id ? 'Post updated' : 'Post published');
      navigate(`/posts/${data.slug}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container-page py-8">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-coral">Editor</p>
        <h1 className="font-serif text-4xl font-bold">{id ? 'Edit post' : 'Write a new post'}</h1>
      </div>
      {loading ? (
        <p className="text-sm text-ink/60">Loading editor...</p>
      ) : (
        <PostForm initialPost={post} onSubmit={handleSubmit} submitting={submitting} isAdmin={user.role === 'admin'} />
      )}
    </section>
  );
}
