import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { imageUrl } from '../api/client.js';
import ImageUpload from './ImageUpload.jsx';

const emptyPost = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: '',
  tags: '',
  featured: false
};

export default function PostForm({ initialPost, onSubmit, submitting, isAdmin }) {
  const [form, setForm] = useState(() => ({
    ...emptyPost,
    ...initialPost,
    tags: Array.isArray(initialPost?.tags) ? initialPost.tags.join(', ') : initialPost?.tags || ''
  }));

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-md border border-line bg-white p-5 shadow-sm">
          <label className="label" htmlFor="title">
            Title
          </label>
          <input id="title" className="field" value={form.title} onChange={(event) => setField('title', event.target.value)} required />

          <label className="label mt-4" htmlFor="excerpt">
            Excerpt
          </label>
          <textarea id="excerpt" className="field min-h-24" value={form.excerpt} onChange={(event) => setField('excerpt', event.target.value)} required />

          <label className="label mt-4" htmlFor="content">
            Content
          </label>
          <textarea id="content" className="field min-h-80 font-serif text-lg leading-8" value={form.content} onChange={(event) => setField('content', event.target.value)} required />
        </div>

        <aside className="rounded-md border border-line bg-white p-5 shadow-sm">
          <label className="label" htmlFor="category">
            Category
          </label>
          <input id="category" className="field" value={form.category} onChange={(event) => setField('category', event.target.value)} required />

          <label className="label mt-4" htmlFor="tags">
            Tags
          </label>
          <input id="tags" className="field" placeholder="writing, tech, design" value={form.tags} onChange={(event) => setField('tags', event.target.value)} />

          <label className="label mt-4" htmlFor="coverImage">
            Cover image URL
          </label>
          <input id="coverImage" className="field" value={form.coverImage} onChange={(event) => setField('coverImage', event.target.value)} />

          <div className="mt-3">
            <ImageUpload label="Upload cover" value={form.coverImage} onChange={(url) => setField('coverImage', url)} />
          </div>

          {form.coverImage && (
            <img src={imageUrl(form.coverImage)} alt="" className="mt-4 h-40 w-full rounded-md object-cover" />
          )}

          {isAdmin && (
            <label className="mt-4 flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setField('featured', event.target.checked)}
                className="h-4 w-4 rounded border-line text-leaf"
              />
              Featured post
            </label>
          )}
        </aside>
      </div>

      <button className="btn-primary w-full sm:w-fit" disabled={submitting}>
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {initialPost?._id ? 'Update post' : 'Publish post'}
      </button>
    </form>
  );
}
