import { ShieldCheck, Trash2, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api, getErrorMessage } from '../api/client.js';

export default function AdminPage() {
  const [stats, setStats] = useState({ users: 0, posts: 0, comments: 0 });
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadAdmin();
  }, []);

  async function loadAdmin() {
    try {
      const [statsRes, usersRes, postsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/posts')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function updateRole(id, role) {
    try {
      const { data } = await api.put(`/admin/users/${id}/role`, { role });
      setUsers((current) => current.map((user) => (user._id === id ? data : user)));
      toast.success('Role updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function deleteUser(id) {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((current) => current.filter((user) => user._id !== id));
      toast.success('User deleted');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  async function deletePost(id) {
    if (!confirm('Delete this post?')) return;
    try {
      await api.delete(`/admin/posts/${id}`);
      setPosts((current) => current.filter((post) => post._id !== id));
      toast.success('Post deleted');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <section className="container-page py-8">
      <div className="mb-6">
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-normal text-gold">
          <ShieldCheck size={17} />
          Admin
        </p>
        <h1 className="font-serif text-4xl font-bold">Publication controls</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="rounded-md border border-line bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-normal text-ink/50">{key}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-md border border-line bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-line p-5">
            <UsersRound size={20} />
            <h2 className="text-xl font-bold">Users</h2>
          </div>
          <div className="divide-y divide-line">
            {users.map((user) => (
              <div key={user._id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-ink/55">{user.email}</p>
                </div>
                <select className="field sm:w-32" value={user.role} onChange={(event) => updateRole(user._id, event.target.value)}>
                  <option value="user">user</option>
                  <option value="author">author</option>
                  <option value="admin">admin</option>
                </select>
                <button className="btn-danger px-3" title="Delete user" onClick={() => deleteUser(user._id)}>
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-line bg-white shadow-sm">
          <div className="border-b border-line p-5">
            <h2 className="text-xl font-bold">Posts</h2>
          </div>
          <div className="divide-y divide-line">
            {posts.map((post) => (
              <div key={post._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{post.title}</p>
                  <p className="text-sm text-ink/55">By {post.author?.name || 'Unknown'} · {post.comments?.length || 0} comments</p>
                </div>
                <button className="btn-danger px-3" title="Delete post" onClick={() => deletePost(post._id)}>
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
