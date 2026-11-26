import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode }) {
  const registering = mode === 'register';
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/app" replace />;

  function update(event) {
    setValues(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (registering && (!values.name.trim() || !/^[a-zA-Z0-9_]{3,24}$/.test(values.username))) {
      setError('Add your name and a username (3–24 letters, numbers, or underscores).');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (values.password.length < 8) {
      setError('Your password needs at least 8 characters.');
      return;
    }
    setBusy(true);
    try {
      if (registering) await register(values);
      else await login({ email: values.email, password: values.password });
      navigate('/app', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not connect right now. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <Link to="/" className="brand auth-brand"><span className="brand-mark"><Sparkles size={18} /></span>interlinka</Link>
      <Link to="/" className="auth-back"><ArrowLeft size={15} /> Back to home</Link>
      <div className="auth-shell">
        <div className="auth-aside"><div className="auth-aside-glow" /><span className="eyebrow">A LITTLE MORE CONNECTED</span><h1>{registering ? 'Your story has a place here.' : 'Good to see you again.'}</h1><p>{registering ? 'Join a welcoming community made for the moments, ideas, and people that matter.' : 'Pick up where you left off. Your community is right here.'}</p><div className="auth-quote"><span>✦</span><p>“Connection is why we’re here; it is what gives purpose and meaning to our lives.”</p><small>— Brené Brown</small></div><div className="auth-particles"><i /><i /><i /><i /></div></div>
        <section className="auth-form-side">
          <div className="auth-heading"><span className="eyebrow">{registering ? 'JOIN THE COMMUNITY' : 'WELCOME BACK'}</span><h2>{registering ? 'Create your account' : 'Log in to Interlinka'}</h2><p>{registering ? 'A few details and you’re in.' : 'Your people have been saving you a spot.'}</p></div>
          <form onSubmit={submit} className="auth-form">
            {registering && <>
              <label>Your name<input name="name" value={values.name} onChange={update} placeholder="How should we call you?" maxLength={60} autoComplete="name" required /></label>
              <label>Username<div className="input-prefix"><span>@</span><input name="username" value={values.username} onChange={update} placeholder="yourname" maxLength={24} autoComplete="username" required /></div></label>
            </>}
            <label>Email address<input name="email" type="email" value={values.email} onChange={update} placeholder="you@example.com" autoComplete="email" required /></label>
            <label>Password<div className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} value={values.password} onChange={update} placeholder={registering ? 'At least 8 characters' : 'Your password'} minLength={8} autoComplete={registering ? 'new-password' : 'current-password'} required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(current => !current)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-gradient auth-submit" disabled={busy}>{busy ? 'One moment…' : registering ? 'Create my account' : 'Log in'} <ArrowRight size={17} /></button>
          </form>
          <p className="auth-switch">{registering ? 'Already have a little space here?' : 'New around here?'} <Link to={registering ? '/login' : '/register'}>{registering ? 'Log in' : 'Create an account'}</Link></p>
          <div className="auth-privacy"><span>✦</span> A community, not a competition. Be kind.</div>
        </section>
      </div>
    </main>
  );
}
