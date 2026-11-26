import { useEffect, useState } from 'react';
import { Camera, Check, Edit3, MapPin, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';

export default function ProfilePage() {
  const { username } = useParams();
  const { user: signedInUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const viewingOwnProfile = !username || username.toLowerCase() === signedInUser?.username?.toLowerCase();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [counts, setCounts] = useState({ followerCount: 0, followingCount: 0 });
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({ name: '', bio: '' });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadProfile() {
    try {
      const response = await api.get(`/users/${username || signedInUser.username}`);
      setProfile(response.data.user);
      setPosts(response.data.posts);
      setCounts({ followerCount: response.data.followerCount, followingCount: response.data.followingCount });
      setValues({ name: response.data.user.name, bio: response.data.user.bio || '' });
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load this profile.');
    }
  }

  useEffect(() => { if (signedInUser) loadProfile(); }, [username, signedInUser?.username]);

  async function saveProfile(event) {
    event.preventDefault();
    if (!values.name.trim()) return setError('Your name cannot be empty.');
    setBusy(true);
    setError('');
    const body = new FormData();
    body.append('name', values.name);
    body.append('bio', values.bio);
    if (photo) body.append('profilePicture', photo);
    try {
      const response = await api.patch('/users/me', body);
      setProfile(response.data.user);
      updateUser(response.data.user);
      setEditing(false);
      setPhoto(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save your profile.');
    } finally {
      setBusy(false);
    }
  }

  async function toggleFollow() {
    try {
      const response = await api.post(`/users/${profile._id}/follow`);
      setProfile(current => ({ ...current, isFollowing: response.data.isFollowing }));
      setCounts(current => ({ ...current, followerCount: current.followerCount + (response.data.isFollowing ? 1 : -1) }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not update your follow.');
    }
  }

  return (
    <div className="page-content profile-page">
      {error && <p className="inline-error">{error}</p>}
      {profile && <>
        <section className="profile-hero glass-card"><div className="profile-cover"><span className="profile-cover-glow" /></div><div className="profile-details"><Avatar user={profile} size="profile" /><div className="profile-heading"><h1>{profile.name}</h1><span>@{profile.username}</span></div>{viewingOwnProfile ? <button className="button button-outline button-small profile-edit-button" onClick={() => setEditing(current => !current)}>{editing ? <><X size={15} /> Close</> : <><Edit3 size={15} /> Edit profile</>}</button> : <button className={`button button-small profile-edit-button ${profile.isFollowing ? 'button-outline' : 'button-gradient'}`} onClick={toggleFollow}>{profile.isFollowing ? 'Following' : 'Follow'}</button>}
          <p className="profile-bio">{profile.bio || 'A new chapter begins here.'}</p><div className="profile-meta"><span><MapPin size={14} /> Making a little space for connection</span><span><strong>{posts.length}</strong> posts</span><span><strong>{counts.followerCount}</strong> followers</span><span><strong>{counts.followingCount}</strong> following</span></div>
        </div></section>
        {editing && viewingOwnProfile && <form className="profile-edit-form glass-card" onSubmit={saveProfile}><div className="section-heading"><div><span className="eyebrow">MAKE IT YOURS</span><h2>Edit your profile</h2></div></div><label>Name<input value={values.name} onChange={event => setValues(current => ({ ...current, name: event.target.value }))} maxLength={60} required /></label><label>Bio<textarea value={values.bio} onChange={event => setValues(current => ({ ...current, bio: event.target.value }))} maxLength={180} rows="3" placeholder="A little about you…" /></label><label className="photo-upload-label"><Camera size={16} /> {photo ? photo.name : 'Choose a profile photo'}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setPhoto(event.target.files?.[0] || null)} /></label><button className="button button-gradient button-small" disabled={busy}><Check size={15} /> {busy ? 'Saving…' : 'Save changes'}</button></form>}
        <div className="section-heading profile-post-heading"><div><span className="eyebrow">LITTLE PIECES OF LIFE</span><h2>{viewingOwnProfile ? 'Your posts' : `${profile.name.split(' ')[0]}’s posts`}</h2></div></div>
        <div className="post-list">{posts.map(post => <PostCard key={post._id} post={post} onUpdate={updated => setPosts(items => items.map(item => item._id === updated._id ? updated : item))} onDelete={id => setPosts(items => items.filter(item => item._id !== id))} />)}</div>
        {!posts.length && <div className="empty-state"><p>This is where the stories will live. Start with one today.</p>{viewingOwnProfile && <button className="button button-outline" onClick={() => navigate('/app#composer')}>Share your first post</button>}</div>}
      </>}
    </div>
  );
}
