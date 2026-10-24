import {
  Award, BookOpen, Briefcase, Crosshair, Flag, Gamepad2, Repeat, Scale, Sparkles, Trophy,
} from 'lucide-react';

const BADGE_ICONS = {
  start: Flag,
  m1: Briefcase,
  m2: Scale,
  m3: Repeat,
  m4: Gamepad2,
  m5: BookOpen,
  sharp: Crosshair,
  finish: Trophy,
};

export function LevelBar({ game, compact = false }) {
  const { xp, level } = game;
  return (
    <div className="card level-card">
      <div className="row-between" style={{ flexWrap: 'nowrap' }}>
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <div className="level-badge">{level.index}</div>
          <div>
            <div className="small muted">Деңгей</div>
            <div style={{ fontWeight: 800, fontSize: compact ? 16 : 18 }}>{level.name}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="row" style={{ gap: 4, justifyContent: 'flex-end', fontWeight: 800, fontSize: compact ? 18 : 22, color: 'var(--warning)' }}>
            <Sparkles size={18} /> {xp} XP
          </div>
          {level.next && <div className="small muted">келесі деңгейге: {level.next.min - xp} XP</div>}
        </div>
      </div>
      <div className="progress" style={{ marginTop: 12 }}>
        <div className="xp-fill" style={{ width: `${Math.round(level.progress * 100)}%` }} />
      </div>
    </div>
  );
}

export function BadgeGrid({ badges }) {
  const earnedCount = badges.filter((b) => b.earned).length;
  return (
    <div className="card stack">
      <h3 className="row" style={{ fontSize: 18 }}>
        <Award size={22} color="var(--warning)" /> Бейдждер
        <span className="badge" style={{ marginLeft: 'auto' }}>{earnedCount} / {badges.length}</span>
      </h3>
      <div className="badge-grid">
        {badges.map((b) => {
          const Icon = BADGE_ICONS[b.key] || Award;
          return (
            <div key={b.key} className={`badge-tile ${b.earned ? 'earned' : ''}`} title={b.desc}>
              <div className="badge-icon"><Icon size={22} /></div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{b.name}</div>
              <div className="small muted" style={{ fontSize: 11, lineHeight: 1.35 }}>{b.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function XpToast({ amount, label }) {
  if (!amount) return null;
  return (
    <div className="xp-toast" role="status">
      <Sparkles size={16} /> +{amount} XP <span className="small" style={{ opacity: 0.85 }}>{label}</span>
    </div>
  );
}
