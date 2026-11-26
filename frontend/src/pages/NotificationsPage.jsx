import { useEffect, useState } from 'react';
import { Bell, Heart, MessageCircle, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Avatar from '../components/Avatar';

const labels = {
  like: { icon: Heart, text: 'liked your post' },
  comment: { icon: MessageCircle, text: 'commented on your post' },
  follow: { icon: UserRound, text: 'started following you' }
};

function ago(value) {
  const minutes = Math.floor((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    api.get('/notifications')
      .then(response => {
        setNotifications(response.data.notifications);
        api.patch('/notifications/read')
          .then(() => setNotifications(current => current.map(notification => ({ ...notification, read: true }))))
          .catch(requestError => setError(requestError.response?.data?.message || 'Could not mark notifications as read.'));
      })
      .catch(requestError => setError(requestError.response?.data?.message || 'Could not load notifications.'));
  }, []);

  return <div className="page-content notifications-page"><div className="page-heading"><span className="eyebrow">LITTLE SIGNS YOU’RE CONNECTED</span><h1>Your <span>notifications.</span></h1><p>Kind words, new connections, and the moments people shared with you.</p></div>
    {error && <p className="inline-error">{error}</p>}
    <div className="notification-list">{notifications.map(notification => {
      const detail = labels[notification.type] || labels.follow;
      const Icon = detail.icon;
      return <article className={`notification-card glass-card${notification.read ? '' : ' unread'}`} key={notification._id}><Avatar user={notification.actor} size="small" /><span className="notification-copy"><strong>{notification.actor?.name || 'Someone'} <small>@{notification.actor?.username || 'member'}</small></strong><span><Icon size={14} /> {detail.text}</span></span><time>{ago(notification.createdAt)}</time>{notification.post && <span className="notification-post">{notification.post.caption || 'View post'}</span>}<Link className="notification-profile-link" to={`/profile/${notification.actor?.username || ''}`} aria-label="View profile" /></article>;
    })}</div>
    {!notifications.length && !error && <div className="empty-state"><span className="empty-icon"><Bell size={22} /></span><h3>It’s quiet—in a good way.</h3><p>When someone connects with you, you’ll find it here.</p></div>}
  </div>;
}
