import { LogIn } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      await login(form);
      toast.success('Welcome back');
      navigate(location.state?.from || '/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-page grid min-h-[calc(100vh-4rem)] place-items-center py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-md border border-line bg-white p-6 shadow-soft">
        <h1 className="font-serif text-3xl font-bold">Sign in</h1>
        <p className="mt-2 text-sm text-ink/65">Continue writing, reading, and joining the conversation.</p>
        <label className="label mt-6" htmlFor="email">
          Email
        </label>
        <input id="email" type="email" className="field" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <label className="label mt-4" htmlFor="password">
          Password
        </label>
        <input id="password" type="password" className="field" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <button className="btn-primary mt-6 w-full" disabled={loading}>
          <LogIn size={18} />
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="mt-4 text-center text-sm text-ink/65">
          New here? <Link className="font-semibold text-leaf" to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
}
