import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      await register(form);
      toast.success('Account created');
      navigate('/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-page grid min-h-[calc(100vh-4rem)] place-items-center py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-md border border-line bg-white p-6 shadow-soft">
        <h1 className="font-serif text-3xl font-bold">Join Inkspire</h1>
        <p className="mt-2 text-sm text-ink/65">Create a reader account. Admins can promote readers to authors.</p>
        <label className="label mt-6" htmlFor="name">
          Name
        </label>
        <input id="name" className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <label className="label mt-4" htmlFor="email">
          Email
        </label>
        <input id="email" type="email" className="field" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <label className="label mt-4" htmlFor="password">
          Password
        </label>
        <input id="password" type="password" minLength="8" className="field" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <button className="btn-primary mt-6 w-full" disabled={loading}>
          <UserPlus size={18} />
          {loading ? 'Creating...' : 'Create account'}
        </button>
        <p className="mt-4 text-center text-sm text-ink/65">
          Already registered? <Link className="font-semibold text-leaf" to="/login">Sign in</Link>
        </p>
      </form>
    </section>
  );
}
