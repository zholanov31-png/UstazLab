import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { humanizeError } from '../lib/supabase';
import { LangSwitch, useLang } from '../i18n/LangContext';

export default function AuthPage() {
  const [params] = useSearchParams();
  const [isRegister, setIsRegister] = useState(params.get('mode') === 'register');
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: '', groupCode: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);
  const { signIn, signUp } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (isRegister) {
      if (!form.role) return setError(t('auth.err.role'));
      if (form.fullName.trim().length < 3) return setError(t('auth.err.name'));
      if (form.password.length < 6) return setError(t('auth.err.password'));
    }

    setBusy(true);
    const { data, error: err } = isRegister ? await signUp(form) : await signIn(form.email, form.password);
    setBusy(false);

    if (err) return setError(humanizeError(err, t));

    if (isRegister && !data.session) {
      setInfo(t('auth.confirmSent'));
      setIsRegister(false);
      return;
    }
    navigate('/app', { replace: true });
  };

  const RoleCard = ({ value, icon: Icon, label }) => (
    <button
      type="button"
      onClick={() => setForm((f) => ({ ...f, role: value }))}
      className={`option center ${form.role === value ? 'selected' : ''}`}
      style={{ padding: 14 }}
    >
      <Icon size={26} color={form.role === value ? 'var(--accent)' : 'var(--muted)'} style={{ display: 'block', margin: '0 auto 6px' }} />
      <span style={{ fontWeight: 600, fontSize: 14 }}>{label}</span>
    </button>
  );

  return (
    <div className="container" style={{ maxWidth: 480, padding: '48px 16px' }}>
      <div className="card stack" style={{ padding: 32, boxShadow: 'var(--shadow)' }}>
        <div className="center stack-sm">
          <Link to="/" className="brand" style={{ justifyContent: 'center' }}>
            <span className="brand-mark" style={{ width: 38, height: 38, borderRadius: 12 }}><Sparkles size={21} /></span>
            <span className="brand-name" style={{ fontSize: 28 }}>UstazLab</span>
          </Link>
          <p className="muted">{isRegister ? t('auth.titleRegister') : t('auth.titleLogin')}</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}><LangSwitch /></div>
        </div>

        {info && <div className="alert alert-success">{info}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="stack">
          {isRegister && (
            <>
              <div className="field">
                <label>{t('auth.role')}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <RoleCard value="student" icon={GraduationCap} label={t('role.student')} />
                  <RoleCard value="teacher" icon={BookOpen} label={t('role.teacher')} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="fullName">{t('auth.fullName')}</label>
                <input id="fullName" className="input" value={form.fullName} onChange={set('fullName')} placeholder={t('auth.fullNamePh')} autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="groupCode">{t('auth.group')}</label>
                <input id="groupCode" className="input" value={form.groupCode} onChange={set('groupCode')} placeholder={t('auth.groupPh')} />
                <p className="small muted" style={{ marginTop: 6 }}>{t('auth.groupHint')}</p>
              </div>
            </>
          )}
          <div className="field">
            <label htmlFor="email">{t('auth.email')}</label>
            <input id="email" type="email" required className="input" value={form.email} onChange={set('email')} placeholder="example@mail.com" autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">{t('auth.password')}</label>
            <input id="password" type="password" required className="input" value={form.password} onChange={set('password')} placeholder={t('auth.passwordPh')} autoComplete={isRegister ? 'new-password' : 'current-password'} />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? t('auth.wait') : isRegister ? t('auth.register') : t('auth.login')} {!busy && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="center small muted">
          {isRegister ? t('auth.haveAccount') : t('auth.noAccount')}
          <button
            type="button"
            className="btn-ghost"
            style={{ border: 'none', background: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            onClick={() => { setIsRegister(!isRegister); setError(''); setInfo(''); }}
          >
            {isRegister ? t('auth.login') : t('auth.register')}
          </button>
        </p>
      </div>
    </div>
  );
}
