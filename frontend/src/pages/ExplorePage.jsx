import { useEffect, useState } from 'react';
import { Search, Sparkles, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';

export default function ExplorePage() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  async function loadUsers(search = '') {
    try {
      const response = await api.get('/users', { params: search ? { q: search } : {} });
      setUsers(response.data.users);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not find community members.');
    }
  }

  useEffect(() => {
    loadUsers();
    api.get('/posts').then(response => setPosts(response.data.posts)).catch(requestError => setError(requestError.response?.data?.message || 'Could not load posts.'));
  }, []);

  async function search(event) {
    event.preventDefault();
    await loadUsers(query.trim());
  }

  async function follow(userId) {
    try {
      const response = await api.post(`/users/${userId}/follow`);
      setUsers(current => current.map(user => user._id === userId ? { ...user, isFollowing: response.data.isFollowing } : user));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update your follow.');
    }
  }

  return (
    <div className="page-content explore-page">
      <div className="page-heading"><span className="eyebrow">GOOD THINGS HAPPEN WHEN WE MEET</span><h1>Explore <span>your community.</span></h1><p>Find new perspectives, kindred spirits, and stories worth stopping for.</p></div>
      <form className="search-bar glass-card" onSubmit={search}><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Find people by name or username…" aria-label="Search users" /><button className="button button-gradient button-small">Search</button></form>
      {error && <p className="inline-error">{error}</p>}
      <section className="explore-people"><div className="section-heading"><div><span className="eyebrow">POTENTIAL NEW FRIENDS</span><h2>People to know</h2></div><span className="subtle-text">{users.length} people</span></div>
        <div className="people-grid">{users.map(person => <article className="person-card glass-card" key={person._id}><div className="person-cover" /><Avatar user={person} size="large" /><Link to={`/profile/${person.username}`} className="person-name">{person.name}</Link><span className="person-handle">@{person.username}</span><p>{person.bio || 'Here to share a little more of life.'}</p><button className={`button ${person.isFollowing ? 'button-outline' : 'button-gradient'} button-small`} onClick={() => follow(person._id)}>{person.isFollowing ? 'Following' : 'Follow'}</button></article>)}</div>
        {!users.length && <div className="empty-state"><UserRound size={23} /><p>No people found yet. Try another name.</p></div>}
      </section>
      <section className="explore-posts"><div className="section-heading"><div><span className="eyebrow">OPEN DISCOVERY</span><h2>Stories from everywhere</h2></div><Sparkles size={18} className="soft-icon" /></div><div className="post-list">{posts.map(post => <PostCard key={post._id} post={post} onUpdate={updated => setPosts(items => items.map(item => item._id === updated._id ? updated : item))} onDelete={id => setPosts(items => items.filter(item => item._id !== id))} />)}</div>{!posts.length && <div className="empty-state"><p>No posts yet—be the first to share something.</p></div>}</section>
    </div>
  );
}
