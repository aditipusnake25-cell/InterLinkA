import { useEffect, useState } from 'react';
import { ArrowUpRight, Feather, Heart, Quote, Send, Sparkles } from 'lucide-react';
import api from '../services/api';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';

const pageDetails = {
  experiences: {
    endpoint: '/community/experiences', key: 'experiences', field: 'text',
    eyebrow: 'THE EVERYDAY IS WORTH SHARING', title: 'Daily experiences,', accent: 'told by you.',
    description: 'A small win, a new thought, something that made you smile—there’s room for it here.',
    placeholder: 'What did today feel like?', button: 'Share experience', icon: Feather, limit: 1000
  },
  motivation: {
    endpoint: '/community/motivation', key: 'thoughts', field: 'text',
    eyebrow: 'LEAVE A LITTLE LIGHT ON', title: 'Motivation,', accent: 'passed around.',
    description: 'Share the words that keep you going. Someone might need them today.',
    placeholder: 'A thought, a quote, a few words of encouragement…', button: 'Share a thought', icon: Quote, limit: 500
  }
};

function timeAgo(value) {
  const hours = Math.floor((Date.now() - new Date(value).getTime()) / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function CommunityTextPage({ type }) {
  const details = pageDetails[type];
  const Icon = details.icon;
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(details.endpoint)
      .then(response => setItems(response.data[details.key]))
      .catch(requestError => setError(requestError.response?.data?.message || 'Could not load community posts.'));
  }, [details.endpoint, details.key]);

  async function submit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError('');
    try {
      const response = await api.post(details.endpoint, { [details.field]: text });
      setItems(current => [response.data[type === 'experiences' ? 'experience' : 'thought'], ...current]);
      setText('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not share your words.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`page-content words-page words-${type}`}>
      <div className="page-heading"><span className="eyebrow">{details.eyebrow}</span><h1>{details.title}<br /><span>{details.accent}</span></h1><p>{details.description}</p></div>
      <form className="words-composer glass-card" onSubmit={submit}><div className="words-composer-icon"><Icon size={20} /></div><div className="words-composer-content"><label htmlFor="community-thought">{type === 'experiences' ? 'A moment from your day' : 'Something to pass along'}</label><textarea id="community-thought" value={text} onChange={event => setText(event.target.value)} placeholder={details.placeholder} maxLength={details.limit} rows="3" /><div className="words-composer-bottom"><span>{text.length}/{details.limit}</span><button className="button button-gradient button-small" disabled={busy || !text.trim()}>{busy ? 'Sharing…' : details.button} <Send size={14} /></button></div></div></form>
      {error && <p className="inline-error">{error}</p>}
      <div className="section-heading words-feed-heading"><div><span className="eyebrow">FROM AROUND YOUR COMMUNITY</span><h2>{type === 'experiences' ? 'Everyday, together' : 'Words worth keeping'}</h2></div><Sparkles size={18} className="soft-icon" /></div>
      <div className="words-list">{items.map(item => <article className="word-card glass-card" key={item._id}><div className="word-card-top"><Avatar user={item.author} size="small" /><span><strong>{item.author?.name || 'Community member'}</strong><small>@{item.author?.username || 'member'} · {timeAgo(item.createdAt)}</small></span><ArrowUpRight size={16} className="word-link-icon" /></div><p>{item.text}</p>{type === 'motivation' && <span className="word-card-bottom"><Heart size={13} /> A little encouragement, shared with care</span>}</article>)}</div>
      {!items.length && !error && <div className="empty-state"><span className="empty-icon"><Icon size={22} /></span><h3>There’s room for your words.</h3><p>Start a conversation by sharing a little something today.</p><Avatar user={user} size="small" /></div>}
    </div>
  );
}
