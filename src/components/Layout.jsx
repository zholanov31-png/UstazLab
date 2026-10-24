import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3, BookMarked, Compass, FlaskConical, FolderOpen, GraduationCap, Image as ImageIcon,
  LayoutGrid, LogOut, Menu, Moon, PlayCircle, Sparkles, Sun, Target, Users, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LangSwitch, useLang } from '../i18n/LangContext';

// Мәзір атаулары src/i18n/strings.js-те (nav.*)
const NAV = [
  { section: 'nav.course' },
  { to: '/app', label: 'nav.dashboard', icon: BarChart3, end: true },
  { to: '/app/modules', label: 'nav.modules', icon: LayoutGrid },
  { section: 'nav.library' },
  { to: '/app/methodology', label: 'nav.methodology', icon: FolderOpen },
  { to: '/app/sources', label: 'nav.sources', icon: Compass },
  { to: '/app/methods', label: 'nav.methods', icon: Target },
  { to: '/app/gamification', label: 'nav.gamification', icon: PlayCircle },
  { to: '/app/case-study', label: 'nav.caseStudy', icon: Users },
  { to: '/app/visuals', label: 'nav.visuals', icon: ImageIcon },
  { to: '/app/literature', label: 'nav.literature', icon: BookMarked },
];

const THEMES = [
  { key: 'light', icon: Sun },
  { key: 'dark', icon: Moon },
  { key: 'nomad', icon: Compass },
];

export default function Layout() {
  const { profile, isResearcher, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { lang, t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  const roleLabel = profile?.role ? t(`role.${profile.role}`) : '';

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="row" style={{ flexWrap: 'nowrap' }}>
            <button className="icon-btn" onClick={() => setMenuOpen(true)} aria-label={t('nav.menu')}>
              <Menu size={22} />
            </button>
            <Link to="/app" className="brand">
              <span className="brand-mark"><Sparkles size={17} /></span>
              <span className="brand-name">UstazLab</span>
            </Link>
          </div>
          <div className="row" style={{ gap: 8, flexWrap: 'nowrap' }}>
            <LangSwitch />
            <div className="theme-switch" role="group" aria-label={t('theme.group')}>
              {THEMES.map(({ key, icon: Icon }) => (
                <button key={key} className={theme === key ? 'active' : ''} onClick={() => setTheme(key)} title={t(`theme.${key}`)}>
                  <Icon size={14} /> <span className="theme-label">{t(`theme.${key}`)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {menuOpen && <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <span className="brand">
            <span className="brand-mark"><Sparkles size={17} /></span>
            <span className="brand-name">UstazLab</span>
          </span>
          <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label={t('nav.close')}>
            <X size={20} />
          </button>
        </div>

        <div className="card" style={{ padding: 14, marginBottom: 4 }}>
          <div className="row" style={{ flexWrap: 'nowrap' }}>
            <GraduationCap size={20} color="var(--accent)" />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.full_name || t('nav.user')}</div>
              <div className="small muted">
                {roleLabel}
                {profile?.group_code ? ` · ${profile.group_code}` : ''}
              </div>
            </div>
          </div>
        </div>

        {NAV.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section">{t(item.section)}</div>
          ) : (
            <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
              <item.icon size={19} /> {t(item.label)}
            </NavLink>
          ),
        )}

        {lang !== 'kk' && <div className="lang-note">{t('common.contentKkOnly')}</div>}

        {isResearcher && (
          <>
            <div className="nav-section">{t('nav.researcher')}</div>
            <NavLink to="/app/research" className="nav-link">
              <FlaskConical size={19} /> {t('nav.research')}
            </NavLink>
          </>
        )}

        <button className="nav-link" onClick={handleSignOut} style={{ marginTop: 'auto', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
          <LogOut size={19} /> {t('nav.signOut')}
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
