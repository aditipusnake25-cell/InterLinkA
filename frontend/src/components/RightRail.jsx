import { useEffect, useState } from 'react';
import { ArrowUpRight, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Avatar from './Avatar';

const quotes = [
  'The smallest act of kindness is worth more than the grandest intention.',
  'Alone we can do so little; together we can do so much.',
  'Your story is still unfolding. Keep turning the page.'
];

export default function RightRail() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([api.get('/users'), api.get('/posts')])
      .then(([userResponse, postResponse]) => {
        setUsers(userResponse.data.users.slice(0, 4));
        const popularPosts = [...postResponse.data.posts]
          .sort((first, second) => (second.likes?.length || 0) - (first.likes?.length || 0))
          .slice(0, 2);
        setPosts(popularPosts);
      })
      .catch(requestError => setError(requestError.response?.data?.message || 'Could not load community suggestions.'));
  }, []);

  async function follow(userId) {
    const response = await api.post(`/users/${userId}/follow`);
    setUsers(current => current.map(user => user._id === userId ? { ...user, isFollowing: response.data.isFollowing } : user));
  }

  return (
    <aside className="right-rail">
      <section className="right-card suggested-card">
        <div className="right-card-title"><div><span className="eyebrow">FIND YOUR PEOPLE</span><h3>Suggested for you</h3></div><Link to="/explore" aria-label="Explore users"><ArrowUpRight size={17} /></Link></div>
        {users.map(user => (
          <div className="suggested-user" key={user._id}>
            <Avatar user={user} size="small" />
            <span className="suggested-user-copy"><strong>{user.name}</strong><small>@{user.username}</small></span>
            <button className={`follow-mini${user.isFollowing ? ' following' : ''}`} onClick={() => follow(user._id)}>{user.isFollowing ? 'Following' : 'Follow'}</button>
          </div>
        ))}
        {!users.length && <p className="subtle-text">New faces are on their way.</p>}
      </section>
      {error && <p className="inline-error">{error}</p>}
      <section className="right-card trending-card">
        <div className="right-card-title"><div><span className="eyebrow">MAKING THE ROUNDS</span><h3>Community favorites</h3></div><TrendingUp size={16} className="soft-icon" /></div>
        {posts.map(post => (
          <Link className="trending-post" to="/explore" key={post._id}>
            <span className="trending-post-copy"><strong>{post.caption || 'A moment shared with the community'}</strong><small>@{post.author?.username || 'member'}</small></span>
            <span className="trending-likes"><Heart size={12} /> {post.likes?.length || 0}</span>
          </Link>
        ))}
        {!posts.length && <p className="subtle-text">The next favorite could be yours.</p>}
      </section>
      <section className="quote-card">
        <div className="quote-icon"><Sparkles size={17} /></div>
        <span className="eyebrow">A THOUGHT TO CARRY</span>
        <blockquote>“{quotes[new Date().getDate() % quotes.length]}”</blockquote>
        <span className="quote-byline"><TrendingUp size={13} /> A little inspiration, every day</span>
      </section>
      <div className="rail-footer"><span>Interlinka</span><span>Made for meaningful moments.</span></div>
    </aside>
  );
}
