import { Save } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, getErrorMessage, imageUrl } from '../api/client.js';
import ImageUpload from '../components/ImageUpload.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProfilePage() {
  const { user, syncUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, bio: user.bio || '', avatar: user.avatar || '' });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSaving(true);
      const { data } = await api.put('/auth/profile', form);
      syncUser(data);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="container-page py-8">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-normal text-leaf">Profile</p>
        <h1 className="font-serif text-4xl font-bold">Your public identity</h1>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-5 rounded-md border border-line bg-white p-5 shadow-sm lg:grid-cols-[220px_1fr]">
        <div>
          <img src={imageUrl(form.avatar)} alt="" className="h-44 w-44 rounded-md object-cover" />
          <div className="mt-3">
            <ImageUpload label="Upload avatar" value={form.avatar} onChange={(url) => setForm((current) => ({ ...current, avatar: url }))} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input id="name" className="field" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <label className="label mt-4" htmlFor="bio">
            Bio
          </label>
          <textarea id="bio" className="field min-h-32" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} />
          <button className="btn-primary mt-5" disabled={saving}>
            <Save size={18} />
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </div>
      </form>
    </section>
  );
}
