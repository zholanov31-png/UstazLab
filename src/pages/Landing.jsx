import { Link } from 'react-router-dom';
import { ArrowRight, Award, CheckCircle, ClipboardCheck, Cpu, LineChart, Sparkles, Target } from 'lucide-react';
import { COMPETENCIES } from '../data/competencies';

const STEPS = [
  { icon: ClipboardCheck, title: '1. Кіріс диагностика', text: '10 педагогикалық жағдаят пен өзін-өзі бағалау арқылы бастапқы деңгей анықталады.' },
  { icon: Target, title: '2. Үш модульдік курс', text: 'Геймификация, цифрлық құралдар және формативті бағалау бойынша практикум мен рефлексия.' },
  { icon: LineChart, title: '3. Шығыс диагностика', text: 'Сол құралмен қайта өлшеп, әр құзырет бойынша нақты өзгерісті көресіз.' },
];

export default function Landing() {
  return (
    <div className="container">
      <div className="row-between" style={{ padding: '20px 0' }}>
        <span className="brand">
          <Sparkles size={26} color="var(--brand)" />
          <span className="brand-name" style={{ fontSize: 24 }}>UstazLab</span>
        </span>
        <Link to="/auth" className="btn btn-secondary">Кіру</Link>
      </div>

      <section className="hero">
        <div className="stack" style={{ gap: 22 }}>
          <span className="badge badge-accent" style={{ alignSelf: 'flex-start' }}>
            <Sparkles size={13} /> Тарихты оқытудың инновациялық әдістері
          </span>
          <h1>
            Болашақ тарих мұғалімдерінің <span>кәсіби құзыреттілігін дамыту</span> моделі
          </h1>
          <p className="muted" style={{ fontSize: 18 }}>
            Инновациялық әдістерді меңгеруге және кәсіби құзыреттің өсуін өлшеуге арналған цифрлық практикум.
          </p>
          <div className="stack-sm">
            <span className="row"><CheckCircle size={18} color="var(--success)" /> Болашақ тарих мұғалімдері (магистранттар)</span>
            <span className="row"><CheckCircle size={18} color="var(--success)" /> Іс-тәжірибедегі тарих педагогтері</span>
          </div>
          <div>
            <Link to="/auth?mode=register" className="btn btn-primary btn-lg">
              Курсты бастау <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <div className="hero-visual stack">
          <div className="small muted" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5 }}>
            Модель өлшейтін 5 құзырет
          </div>
          {COMPETENCIES.map((c, i) => (
            <div key={c.key} className="stat-tile row" style={{ flexWrap: 'nowrap' }}>
              <b style={{ fontSize: 20, minWidth: 28 }}>{i + 1}</b>
              <span style={{ fontWeight: 600 }}>{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid" style={{ paddingBottom: 60 }}>
        {STEPS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card stack-sm">
            <div className="icon-box"><Icon size={24} /></div>
            <h3 style={{ fontSize: 18, marginTop: 8 }}>{title}</h3>
            <p className="muted small">{text}</p>
          </div>
        ))}
        <div className="card stack-sm">
          <div className="icon-box" style={{ color: 'var(--warning)', background: 'var(--warning-soft)' }}><Award size={24} /></div>
          <h3 style={{ fontSize: 18, marginTop: 8 }}>Әдістемелік кітапхана</h3>
          <p className="muted small">Дайын квесттер, тарихи кейстер, деректану тапсырмалары және ғылыми әдебиеттер.</p>
        </div>
        <div className="card stack-sm">
          <div className="icon-box" style={{ color: 'var(--success)', background: 'var(--success-soft)' }}><Cpu size={24} /></div>
          <h3 style={{ fontSize: 18, marginTop: 8 }}>Деректеріңіз сақталады</h3>
          <p className="muted small">Нәтижелер мен рефлексиялар аккаунтыңызда сақталады, кез келген құрылғыдан жалғастыра аласыз.</p>
        </div>
      </section>
    </div>
  );
}
