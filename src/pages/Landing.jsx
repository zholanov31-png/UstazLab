import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, ClipboardCheck, Compass, Gamepad2, LineChart, MessagesSquare,
  Sparkles, Star, Target, Trophy,
} from 'lucide-react';
import { COMPETENCIES } from '../data/competencies';
import { courseModules } from '../data/modules';
import { LangSwitch, useLang } from '../i18n/LangContext';

// Мәтіндер src/i18n/strings.js файлында (қазақша / орысша / ағылшынша)
const FLOW_ICONS = [ClipboardCheck, Target, LineChart];

const CHIP_ICONS = [Sparkles, BookOpen, Compass, MessagesSquare, Target];

// Станция мұқабалары (AI арқылы жасалған сәндік суреттер, Canva).
// 4 және 5 үшін сурет әлі жоқ — уақытша шыны белгіше көрсетіледі.
const STATION_IMG = {
  1: '/img/station-1.webp',
  2: '/img/station-2.webp',
  3: '/img/station-3.webp',
};
const STATION_ICON = { 4: Trophy, 5: BookOpen };

export default function Landing() {
  const { t } = useLang();
  return (
    <div className="container landing">
      <nav className="l-nav">
        <span className="brand">
          <span className="brand-mark"><Sparkles size={17} /></span>
          <span className="brand-name">UstazLab</span>
        </span>
        <div className="l-nav-links">
          <a href="#stations">{t('landing.nav.stations')}</a>
          <a href="#flow">{t('landing.nav.flow')}</a>
          <a href="#competencies">{t('landing.nav.competencies')}</a>
        </div>
        <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }}>
          <LangSwitch />
          <Link to="/auth" className="btn btn-ghost l-signin">{t('common.signIn')}</Link>
          <Link to="/auth?mode=register" className="btn btn-dark">{t('common.start')}</Link>
        </div>
      </nav>

      <section className="hero-panel">
        <img className="hero-bg" src="/img/hero-glass.webp" alt="" width="1600" height="899" />
        <div className="hero-veil" />
        <div className="hero">
          <div className="stack hero-copy" style={{ gap: 22 }}>
            <span className="eyebrow"><b>DGBL</b> {t('landing.eyebrow')}</span>
            <h1>
              {t('landing.h1.before')}<span className="grad-text">{t('landing.h1.accent')}</span>{t('landing.h1.after')}
            </h1>
            <p className="hero-lead">{t('landing.lead')}</p>
            <div className="row">
              <Link to="/auth?mode=register" className="btn btn-primary btn-lg">
                {t('common.startCourse')} <ArrowRight size={20} />
              </Link>
              <a href="#stations" className="btn btn-secondary btn-lg">{t('common.more')}</a>
            </div>
            <div className="hero-meta">
              <div><strong>5</strong><span>{t('landing.meta.methods')}</span></div>
              <div><strong>5</strong><span>{t('landing.meta.competencies')}</span></div>
              <div><strong>pre / post</strong><span>{t('landing.meta.diagnostics')}</span></div>
            </div>
          </div>

          <div className="scene" aria-hidden="true">
            {COMPETENCIES.slice(0, 4).map((c, i) => {
              const Icon = CHIP_ICONS[i];
              return (
                <div key={c.key} className={`chip chip-${i + 1}`}>
                  <i><Icon size={14} /></i>{t(`comp.${c.key}.short`)}
                </div>
              );
            })}
            <div className="chip chip-5 xp"><i><Star size={14} /></i>+20 XP</div>
          </div>
        </div>
      </section>

      <section id="stations" className="l-section">
        <div className="l-section-head">
          <div className="kicker">{t('landing.stations.kicker')}</div>
          <h2>{t('landing.stations.title')}</h2>
          <p>{t('landing.stations.lead')}</p>
        </div>
        <div className="station-grid">
          {courseModules.map((m) => (
            <div key={m.id} className="card station">
              <div className="station-cover">
                {STATION_IMG[m.id]
                  ? <img src={STATION_IMG[m.id]} alt="" width="640" height="640" loading="lazy" />
                  : <div className="station-cover-fallback">{(() => { const I = STATION_ICON[m.id]; return <I size={56} strokeWidth={1.4} />; })()}</div>}
                <span className="station-num">0{m.id}</span>
              </div>
              <h3>{t(`station.${m.id}.method`)}</h3>
              <p>{t(`station.${m.id}.text`)}</p>
              {m.ready
                ? <span className="badge badge-success">{t('common.open')}</span>
                : <span className="badge">{t('common.inProgress')}</span>}
            </div>
          ))}
        </div>
      </section>

      <section id="flow" className="l-section">
        <div className="l-section-head">
          <div className="kicker">{t('landing.flow.kicker')}</div>
          <h2>{t('landing.flow.title')}</h2>
        </div>
        <div className="flow">
          {FLOW_ICONS.map((Icon, i) => (
            <div key={i} className="card">
              <div className="icon-box"><Icon size={22} /></div>
              <div className="small muted" style={{ fontWeight: 700 }}>{t('landing.flow.step', { n: i + 1 })}</div>
              <h3 style={{ fontSize: 19 }}>{t(`landing.flow.${i + 1}.title`)}</h3>
              <p className="muted small">{t(`landing.flow.${i + 1}.text`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="competencies" className="l-section">
        <div className="l-section-head">
          <div className="kicker">{t('landing.comp.kicker')}</div>
          <h2>{t('landing.comp.title')}</h2>
        </div>
        <div className="comp-row">
          {COMPETENCIES.map((c, i) => (
            <span key={c.key} className="comp-pill"><b>0{i + 1}</b>{t(`comp.${c.key}`)}</span>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <h2>{t('landing.cta.title')}</h2>
        <p>{t('landing.cta.text')}</p>
        <Link to="/auth?mode=register" className="btn btn-lg">
          <Gamepad2 size={20} /> {t('common.startCourse')}
        </Link>
      </section>

      <footer className="l-footer">
        <span>UstazLab · ОҚПУ · 7M01601</span>
        <span>{t('landing.footer.topic')}</span>
      </footer>
    </div>
  );
}
