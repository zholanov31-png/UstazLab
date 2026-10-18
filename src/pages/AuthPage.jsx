import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { humanizeError } from '../lib/supabase';

export default function AuthPage() {
  const [params] = useSearchParams();
  const [isRegister, setIsRegister] = useState(params.get('mode') === 'register');
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: '', groupCode: '' });
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (isRegister) {
      if (!form.role) return setError('Мәртебеңізді таңдаңыз: магистрант немесе мұғалім.');
      if (form.fullName.trim().length < 3) return setError('Аты-жөніңізді толық жазыңыз.');
      if (form.password.length < 6) return setError('Құпиясөз кемінде 6 таңбадан тұруы керек.');
    }

    setBusy(true);
    const { data, error: err } = isRegister ? await signUp(form) : await signIn(form.email, form.password);
    setBusy(false);

    if (err) return setError(humanizeError(err));

    if (isRegister && !data.session) {
      setInfo('Тіркелу сәтті! Поштаңызға растау хаты жіберілді. Хаттағы сілтемені басып, содан кейін кіріңіз.');
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
            <Sparkles size={26} color="var(--brand)" />
            <span className="brand-name" style={{ fontSize: 28 }}>UstazLab</span>
          </Link>
          <p className="muted">{isRegister ? 'Жаңа аккаунт жасау' : 'Жеке кабинетке кіру'}</p>
        </div>

        {info && <div className="alert alert-success">{info}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="stack">
          {isRegister && (
            <>
              <div className="field">
                <label>Мәртебеңіз</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <RoleCard value="student" icon={GraduationCap} label="Магистрант" />
                  <RoleCard value="teacher" icon={BookOpen} label="Мұғалім" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="fullName">Аты-жөніңіз</label>
                <input id="fullName" className="input" value={form.fullName} onChange={set('fullName')} placeholder="Мысалы: Асан Үсенов" autoComplete="name" />
              </div>
              <div className="field">
                <label htmlFor="groupCode">Топ коды (міндетті емес)</label>
                <input id="groupCode" className="input" value={form.groupCode} onChange={set('groupCode')} placeholder="Зерттеуші берген код, мысалы: EXP-1" />
              </div>
            </>
          )}
          <div className="field">
            <label htmlFor="email">Электрондық пошта</label>
            <input id="email" type="email" required className="input" value={form.email} onChange={set('email')} placeholder="example@mail.com" autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Құпиясөз</label>
            <input id="password" type="password" required className="input" value={form.password} onChange={set('password')} placeholder="Кемінде 6 таңба" autoComplete={isRegister ? 'new-password' : 'current-password'} />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Күте тұрыңыз...' : isRegister ? 'Тіркелу' : 'Кіру'} {!busy && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="center small muted">
          {isRegister ? 'Аккаунтыңыз бар ма? ' : 'Аккаунтыңыз жоқ па? '}
          <button
            type="button"
            className="btn-ghost"
            style={{ border: 'none', background: 'none', color: 'var(--accent)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            onClick={() => { setIsRegister(!isRegister); setError(''); setInfo(''); }}
          >
            {isRegister ? 'Кіру' : 'Тіркелу'}
          </button>
        </p>
      </div>
    </div>
  );
}
