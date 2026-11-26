export default function Avatar({ user, size = 'medium', className = '' }) {
  const label = user?.name || user?.username || 'Community member';
  return (
    <span className={`avatar avatar-${size} ${className}`} aria-label={label}>
      {user?.profilePicture
        ? <img src={`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000'}${user.profilePicture}`} alt="" />
        : <span>{label.slice(0, 1).toUpperCase()}</span>}
    </span>
  );
}
