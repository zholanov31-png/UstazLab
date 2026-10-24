import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, ClipboardCheck, Compass, Gamepad2, LineChart, MessagesSquare,
  Sparkles, Star, Target, Trophy,
} from 'lucide-react';
import { COMPETENCIES } from '../data/competencies';
import { courseModules } from '../data/modules';

// Станциялардың қысқа сипаттамасы (әдістің мәні — тарихи факт емес)
const STATION_TEXT = {
  1: 'Тарихи тақырып бойынша нақты өнім жасайтын сабақ жобасын құрастыру.',
  2: 'Нақты педагогикалық жағдаятты талдап, шешімді дәлелдеу.',
  3: 'Теорияны үйде, талқылау мен тапсырманы сабақта өткізу.',
  4: 'Ойын элементтері мен квест арқылы тарихи ойлауды дамыту.',
  5: 'Тарихи оқиғаны цифрлық әңгіме мен визуализация арқылы баяндау.',
};

const FLOW = [
  { icon: ClipboardCheck, title: 'Кіріс диагностика', text: 'Педагогикалық жағдаяттар мен өзін-өзі бағалау арқылы бастапқы деңгей анықталады.' },
  { icon: Target, title: '«Ұстаздың жолы»: 5 станция', text: 'Әр станция: теория, мысал, жағдаят, практикалық тапсырма және рефлексия.' },
  { icon: LineChart, title: 'Шығыс диагностика', text: 'Сол құралмен қайта өлшеп, әр құзырет бойынша нақты өзгерісті көресіз.' },
];

const CHIP_ICONS = [Sparkles, BookOpen, Compass, MessagesSquare, Target];

export default function Landing() {
  return (
    <div className="container landing">
      <nav className="l-nav">
        <span className="brand">
          <span className="brand-mark"><Sparkles size={17} /></span>
          <span className="brand-name">UstazLab</span>
        </span>
        <div className="l-nav-links">
          <a href="#stations">Станциялар</a>
          <a href="#flow">Қалай өтеді</a>
          <a href="#competencies">Құзыреттер</a>
        </div>
        <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
          <Link to="/auth" className="btn btn-ghost">Кіру</Link>
          <Link to="/auth?mode=register" className="btn btn-dark">Бастау</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="stack" style={{ gap: 22 }}>
          <span className="eyebrow"><b>DGBL</b> Тарихты оқытудың инновациялық әдістері</span>
          <h1>
            Болашақ тарих педагогінің <span className="grad-text">кәсіби құзыреттілігін</span> дамыту
          </h1>
          <p className="hero-lead">
            Бес инновациялық әдісті ойын форматында меңгеруге және кәсіби құзыреттің өсуін өлшеуге арналған цифрлық практикум.
          </p>
          <div className="row">
            <Link to="/auth?mode=register" className="btn btn-primary btn-lg">
              Курсты бастау <ArrowRight size={20} />
            </Link>
            <a href="#stations" className="btn btn-secondary btn-lg">Толығырақ</a>
          </div>
          <div className="hero-meta">
            <div><strong>5</strong><span>инновациялық әдіс</span></div>
            <div><strong>5</strong><span>өлшенетін құзырет</span></div>
            <div><strong>pre / post</strong><span>диагностика</span></div>
          </div>
        </div>

        <div className="scene" aria-hidden="true">
          <div className="scene-glow" />
          <div className="ring ring-3" />
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <div className="orb"><Trophy size={44} strokeWidth={1.6} /></div>
          {COMPETENCIES.slice(0, 4).map((c, i) => {
            const Icon = CHIP_ICONS[i];
            return (
              <div key={c.key} className={`chip chip-${i + 1}`}>
                <i><Icon size={14} /></i>{c.short}
              </div>
            );
          })}
          <div className="chip chip-5 xp"><i><Star size={14} /></i>+20 XP</div>
        </div>
      </section>

      <section id="stations" className="l-section">
        <div className="l-section-head">
          <div className="kicker">Курс құрылымы</div>
          <h2>«Ұстаздың жолы» — бес станция</h2>
          <p>Әр станция диссертациядағы бір инновациялық әдіске арналған. Станциядан өткен сайын XP, деңгей және бейдж жинайсыз.</p>
        </div>
        <div className="station-grid">
          {courseModules.map((m) => (
            <div key={m.id} className="card station">
              <span className="station-num">0{m.id}</span>
              <h3>{m.method}</h3>
              <p>{STATION_TEXT[m.id]}</p>
              {m.ready
                ? <span className="badge badge-success">Ашық</span>
                : <span className="badge">Дайындалуда</span>}
            </div>
          ))}
        </div>
      </section>

      <section id="flow" className="l-section">
        <div className="l-section-head">
          <div className="kicker">Эксперимент барысы</div>
          <h2>Үш кезең — бір нәтиже</h2>
        </div>
        <div className="flow">
          {FLOW.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="card">
              <div className="icon-box"><Icon size={22} /></div>
              <div className="small muted" style={{ fontWeight: 700 }}>{i + 1}-кезең</div>
              <h3 style={{ fontSize: 19 }}>{title}</h3>
              <p className="muted small">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="competencies" className="l-section">
        <div className="l-section-head">
          <div className="kicker">Не өлшенеді</div>
          <h2>Кәсіби құзыреттің бес құрамдасы</h2>
        </div>
        <div className="comp-row">
          {COMPETENCIES.map((c, i) => (
            <span key={c.key} className="comp-pill"><b>0{i + 1}</b>{c.label}</span>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <h2>Бастауға дайынсыз ба?</h2>
        <p>Тіркеліп, кіріс диагностикадан өтіңіз — нәтижелеріңіз аккаунтыңызда сақталады.</p>
        <Link to="/auth?mode=register" className="btn btn-lg">
          <Gamepad2 size={20} /> Курсты бастау
        </Link>
      </section>

      <footer className="l-footer">
        <span>UstazLab · ОҚПУ · 7M01601</span>
        <span>Тарих пәнін оқытудың инновациялық әдістері</span>
      </footer>
    </div>
  );
}
