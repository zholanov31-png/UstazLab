import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container center" style={{ padding: '100px 16px' }}>
      <h1 style={{ fontSize: 56, fontWeight: 900, color: 'var(--accent)' }}>404</h1>
      <p className="muted" style={{ margin: '12px 0 24px' }}>Мұндай бет табылмады.</p>
      <Link to="/" className="btn btn-primary">Басты бетке оралу</Link>
    </div>
  );
}
