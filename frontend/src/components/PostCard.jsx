import { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

function timeAgo(value) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

function mediaUrl(url) {
  const root = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000';
  return `${root}${url}`;
}

export default function PostCard({ post, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
  const comments = post.comments || [];
  const liked = post.likes?.some(id => String(id) === String(user?.id || user?._id));
  const mine = String(post.author?._id || post.author?.id) === String(user?.id || user?._id);

  async function toggleLike() {
    setActionError('');
    try {
      const response = await api.post(`/posts/${post._id}/like`);
      onUpdate?.({ ...post, likes: response.data.likes });
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Could not update your like.');
    }
  }

  async function addComment(event) {
    event.preventDefault();
    if (!comment.trim() || busy) return;
    setBusy(true);
    try {
      const response = await api.post(`/posts/${post._id}/comments`, { text: comment });
      onUpdate?.({ ...post, comments: [...comments, response.data.comment] });
      setComment('');
      setActionError('');
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Could not add your comment.');
    } finally {
      setBusy(false);
    }
  }

  async function deletePost() {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setActionError('');
    try {
      await api.delete(`/posts/${post._id}`);
      onDelete?.(post._id);
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || 'Could not delete this post.');
    }
  }

  const author = post.author || {};
  return (
    <article className="post-card glass-card">
      <div className="post-header">
        <Avatar user={author} />
        <div className="post-author"><strong>{author.name || 'Community member'}</strong><span>@{author.username || 'member'} · {timeAgo(post.createdAt)}</span></div>
        {mine && <button className="icon-button" aria-label="Delete post" title="Delete post" onClick={deletePost}><MoreHorizontal size={20} /></button>}
      </div>
      {post.caption && <p className="post-caption">{post.caption}</p>}
      {post.mediaUrl && (
        <div className="post-media">
          {post.mediaType === 'video'
            ? <video src={mediaUrl(post.mediaUrl)} controls />
            : <img src={mediaUrl(post.mediaUrl)} alt={post.caption || 'Shared by the community'} />}
        </div>
      )}
      <div className="post-actions">
        <button className={`post-action${liked ? ' liked' : ''}`} onClick={toggleLike} aria-label={liked ? 'Unlike post' : 'Like post'}>
          <Heart size={19} fill={liked ? 'currentColor' : 'none'} /><span>{post.likes?.length || 0}</span>
        </button>
        <span className="post-action"><MessageCircle size={18} /><span>{comments.length}</span></span>
        <span className="post-time">{timeAgo(post.createdAt)}</span>
      </div>
      {comments.length > 0 && (
        <div className="comment-list">
          {comments.slice(-3).map(item => (
            <p key={item._id}><strong>@{item.author?.username || 'member'}</strong> {item.text}</p>
          ))}
        </div>
      )}
      {actionError && <p className="inline-error post-action-error">{actionError}</p>}
      <form className="comment-form" onSubmit={addComment}>
        <input aria-label="Write a comment" placeholder="Leave a little kindness…" value={comment} onChange={event => setComment(event.target.value)} maxLength={500} />
        <button aria-label="Post comment" disabled={!comment.trim() || busy}><Send size={17} /></button>
      </form>
    </article>
  );
}
