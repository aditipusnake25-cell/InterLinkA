import { useRef, useState } from 'react';
import { ImagePlus, Send } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

export default function PostComposer({ onCreated }) {
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const fileInput = useRef(null);

  async function submit(event) {
    event.preventDefault();
    if (!caption.trim() && !file) return;
    const body = new FormData();
    body.append('caption', caption);
    if (file) body.append('media', file);
    setBusy(true);
    setError('');
    try {
      const response = await api.post('/posts', body);
      onCreated(response.data.post);
      setCaption('');
      setFile(null);
      if (fileInput.current) fileInput.current.value = '';
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Your post could not be shared. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="composer glass-card" id="composer" onSubmit={submit}>
      <div className="composer-top"><Avatar user={user} /><textarea aria-label="Write a post" placeholder="What would you like to share with your community?" value={caption} onChange={event => setCaption(event.target.value)} maxLength={2000} rows="2" /></div>
      {file && <div className="selected-file">{file.name}<button type="button" onClick={() => { setFile(null); fileInput.current.value = ''; }}>Remove</button></div>}
      {error && <p className="inline-error">{error}</p>}
      <div className="composer-bottom">
        <input ref={fileInput} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" onChange={event => setFile(event.target.files?.[0] || null)} />
        <button className="composer-attach" type="button" onClick={() => fileInput.current?.click()}><ImagePlus size={18} /> Photo or video</button>
        <button className="button button-gradient button-small" disabled={busy || (!caption.trim() && !file)}><span>{busy ? 'Sharing…' : 'Share post'}</span><Send size={15} /></button>
      </div>
    </form>
  );
}
