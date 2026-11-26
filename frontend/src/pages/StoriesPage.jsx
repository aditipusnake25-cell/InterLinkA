import { useEffect, useState } from 'react';
import { Camera, Clock3, Sparkles } from 'lucide-react';
import api from '../services/api';
import StoryRail from '../components/StoryRail';

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/community/stories')
      .then(response => setStories(response.data.stories))
      .catch(requestError => setError(requestError.response?.data?.message || 'Could not load stories.'));
  }, []);
  return <div className="page-content"><div className="page-heading"><span className="eyebrow">A MOMENT, BEFORE IT MOVES ON</span><h1>Stories, <span>in the moment.</span></h1><p>Little peeks into everyday life. Here for a day, remembered a little longer.</p></div><div className="story-info-row"><div><Camera size={18} /><span>Share a photo or video with your community.</span></div><div><Clock3 size={18} /><span>Stories automatically disappear after 24 hours.</span></div></div><StoryRail stories={stories} onCreated={story => setStories(current => [story, ...current])} />{error && <p className="inline-error">{error}</p>}{!stories.length && !error && <div className="empty-state"><span className="empty-icon"><Sparkles size={22} /></span><h3>A fresh start, for a little while.</h3><p>Your community hasn’t shared a story yet. Add the first glimpse.</p></div>}</div>;
}
