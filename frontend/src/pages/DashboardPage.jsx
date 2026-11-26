import { useEffect, useState } from 'react';
import { ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';
import PostComposer from '../components/PostComposer';
import RightRail from '../components/RightRail';
import StoryRail from '../components/StoryRail';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadFeed() {
    setLoading(true);
    setError('');
    try {
      const [postResponse, storyResponse] = await Promise.all([api.get('/posts'), api.get('/community/stories')]);
      setPosts(postResponse.data.posts);
      setStories(storyResponse.data.stories);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load your community feed.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadFeed(); }, []);

  return (
    <div className="dashboard-grid">
      <div className="feed-column">
        <div className="welcome-strip"><div><span className="eyebrow">YOUR COMMUNITY, RIGHT HERE</span><h1>A good day to connect, <span>{user?.name?.split(' ')[0] || 'friend'}.</span></h1><p>There’s always a story worth sharing.</p></div><div className="welcome-spark"><Sparkles size={25} /></div></div>
        <StoryRail stories={stories} onCreated={story => setStories(current => [story, ...current])} />
        <PostComposer onCreated={post => setPosts(current => [post, ...current])} />
        <div className="section-heading feed-heading"><div><span className="eyebrow">FROM YOUR COMMUNITY</span><h2>The latest stories</h2></div><button className="text-button" onClick={loadFeed}><RefreshCw size={14} /> Refresh</button></div>
        {loading && <div className="loading-inline"><span className="spinner" /> Finding your people’s posts…</div>}
        {error && <div className="empty-state"><p>{error}</p><button className="button button-outline" onClick={loadFeed}>Try again</button></div>}
        {!loading && !error && !posts.length && <div className="empty-state"><span className="empty-icon"><Sparkles size={22} /></span><h3>Your feed is a fresh page.</h3><p>Share a moment or explore the community to find your people.</p><Link className="button button-outline" to="/explore">Explore the community <ArrowRight size={15} /></Link></div>}
        <div className="post-list">{posts.map(post => <PostCard key={post._id} post={post} onUpdate={updated => setPosts(items => items.map(item => item._id === updated._id ? updated : item))} onDelete={id => setPosts(items => items.filter(item => item._id !== id))} />)}</div>
      </div>
      <RightRail />
    </div>
  );
}
