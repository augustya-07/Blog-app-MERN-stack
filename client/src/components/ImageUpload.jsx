import { ImagePlus, Loader2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api, getErrorMessage } from '../api/client.js';

export default function ImageUpload({ label = 'Upload image', value, onChange }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const { data } = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onChange(data.url);
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="btn-secondary cursor-pointer">
      {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
      {uploading ? 'Uploading...' : label}
      <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      {value && <span className="sr-only">Current image selected</span>}
    </label>
  );
}
