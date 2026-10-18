import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3, BookMarked, Compass, FlaskConical, FolderOpen, GraduationCap, Image as ImageIcon,
  LayoutGrid, LogOut, Menu, Moon, PlayCircle, Sparkles, Sun, Target, Users, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV = [
  { section: 'Зерттеу курсы' },
  { to: '/app', label: 'Дашборд', icon: BarChart3, end: true },
  { to: '/app/modules', label: 'Курс модульдері', icon: LayoutGrid },
  { section: 'Әдістемелік кітапхана' },
  { to: '/app/methodology', label: 'Әдістемелік қоржын', icon: FolderOpen },
  { to: '/app/sources', label: 'Интерактивті деректану', icon: Compass },
  { to: '/app/methods', label: 'Инновациялық әдістер', icon: Target },
  { to: '/app/gamification', label: 'Геймификация және квест', icon: PlayCircle },
  { to: '/app/case-study', label: 'Тарихи кейстер банкі', icon: Users },
  { to: '/app/visuals', label: 'Цифрлық визуализация', icon: ImageIcon },
  { to: '/app/literature', label: 'Ғылыми әдебиеттер', icon: BookMarked },
];

const THEMES = [
  { key: 'light', label: 'Жарық', icon: Sun },
  { key: 'dark', label: 'Қараңғы', icon: Moon },
  { key: 'nomad', label: 'Номад', icon: Compass },
];

export default function Layout() {
  const { profile, isResearcher, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  const roleLabel = { student: 'Магистрант', teacher: 'Мұғалім', researcher: 'Зерттеуші' }[profile?.role] || '';

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="row" style={{ flexWrap: 'nowrap' }}>
            <button className="icon-btn" onClick={() => setMenuOpen(true)} aria-label="Мәзір">
              <Menu size={22} />
            </button>
            <Link to="/app" className="brand">
              <Sparkles size={22} color="var(--brand)" />
              <span className="brand-name">UstazLab</span>
            </Link>
          </div>
          <div className="theme-switch" role="group" aria-label="Тақырып">
            {THEMES.map(({ key, label, icon: Icon }) => (
              <button key={key} className={theme === key ? 'active' : ''} onClick={() => setTheme(key)} title={label}>
                <Icon size={14} /> <span className="theme-label">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {menuOpen && <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <span className="brand">
            <Sparkles size={22} color="var(--brand)" />
            <span className="brand-name">UstazLab</span>
          </span>
          <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Жабу">
            <X size={20} />
          </button>
        </div>

        <div className="card" style={{ padding: 14, marginBottom: 4 }}>
          <div className="row" style={{ flexWrap: 'nowrap' }}>
            <GraduationCap size={20} color="var(--accent)" />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.full_name || 'Пайдаланушы'}</div>
              <div className="small muted">
                {roleLabel}
                {profile?.group_code ? ` · ${profile.group_code}` : ''}
              </div>
            </div>
          </div>
        </div>

        {NAV.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section">{item.section}</div>
          ) : (
            <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
              <item.icon size={19} /> {item.label}
            </NavLink>
          ),
        )}

        {isResearcher && (
          <>
            <div className="nav-section">Зерттеуші</div>
            <NavLink to="/app/research" className="nav-link">
              <FlaskConical size={19} /> Эксперимент деректері
            </NavLink>
          </>
        )}

        <button className="nav-link" onClick={handleSignOut} style={{ marginTop: 'auto', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
          <LogOut size={19} /> Жүйеден шығу
        </button>
      </aside>

      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
