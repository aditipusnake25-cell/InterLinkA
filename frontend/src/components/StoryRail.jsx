import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

function mediaRoot() {
  return import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000';
}

export default function StoryRail({ stories = [], onCreated }) {
  const { user } = useAuth();
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  async function uploadStory(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append('media', file);
    try {
      const response = await api.post('/community/stories', body);
      onCreated(response.data.story);
      setError('');
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || 'Could not upload this story.');
    } finally {
      event.target.value = '';
    }
  }

  return (
    <section className="story-section">
      <div className="section-heading"><div><span className="eyebrow">MOMENTS, IN THE MAKING</span><h2>Stories <span className="live-tag">24h</span></h2></div><span className="subtle-text">{stories.length} in your community</span></div>
      <div className="story-rail glass-card">
        <button className="story-item add-story" onClick={() => inputRef.current?.click()}>
          <span className="story-ring"><Avatar user={user} size="large" /><span className="story-add"><Plus size={15} /></span></span>
          <span>Your story</span>
        </button>
        <input ref={inputRef} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" onChange={uploadStory} />
        {stories.map(story => (
          <button className="story-item" key={story._id} onClick={() => window.open(`${mediaRoot()}${story.mediaUrl}`, '_blank', 'noopener,noreferrer')}>
            <span className="story-ring story-ring-color">
              <span className="story-preview">{story.mediaType === 'video' ? <span className="video-story">▶</span> : <img src={`${mediaRoot()}${story.mediaUrl}`} alt="" />}</span>
            </span>
            <span>@{story.author?.username || 'member'}</span>
          </button>
        ))}
      </div>
      {error && <p className="inline-error">{error}</p>}
    </section>
  );
}
