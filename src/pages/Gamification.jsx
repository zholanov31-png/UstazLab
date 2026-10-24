import { useState } from 'react';
import { Award, Minus, PlayCircle, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { questScenarios } from '../data/content';
import { Accordion, PageHeader, VerifyNote } from '../components/ui';

const STORAGE_KEY = 'ustazlab-leaderboard';
const DEFAULT_TEAMS = [
  { id: 1, name: '1-топ', points: 0 },
  { id: 2, name: '2-топ', points: 0 },
  { id: 3, name: '3-топ', points: 0 },
];

function loadTeams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_TEAMS;
  } catch {
    return DEFAULT_TEAMS;
  }
}

export default function Gamification() {
  const [teams, setTeamsState] = useState(loadTeams);
  const [newName, setNewName] = useState('');
  const [openId, setOpenId] = useState(null);

  // Көшбасшылар тақтасы мұғалімнің браузерінде сақталады (бет жаңарса да жоғалмайды)
  const setTeams = (updater) =>
    setTeamsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage жабық */ }
      return next;
    });

  const addTeam = () => {
    if (!newName.trim()) return;
    setTeams((t) => [...t, { id: Date.now(), name: newName.trim(), points: 0 }]);
    setNewName('');
  };
  const changePoints = (id, delta) =>
    setTeams((t) => t.map((x) => (x.id === id ? { ...x, points: Math.max(0, x.points + delta) } : x)));

  const sorted = [...teams].sort((a, b) => b.points - a.points);

  return (
    <>
      <PageHeader
        icon={PlayCircle}
        color="#3b82f6"
        title="Геймификация және квест"
        subtitle="Сабақта бірден қолдануға дайын рөлдік квесттер мен көшбасшылар тақтасы."
      />

      <div className="card stack" style={{ marginBottom: 28 }}>
        <div className="row-between">
          <h3 className="row" style={{ fontSize: 17 }}><Award size={20} color="var(--warning)" /> Көшбасшылар тақтасы</h3>
          <button className="btn btn-ghost small" onClick={() => setTeams((t) => t.map((x) => ({ ...x, points: 0 })))}>
            <RotateCcw size={16} /> Ұпайларды нөлдеу
          </button>
        </div>
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <input
            className="input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTeam()}
            placeholder="Жаңа топтың атауы..."
          />
          <button className="btn btn-primary" onClick={addTeam}>Қосу</button>
        </div>
        <div className="stack-sm">
          {sorted.map((team, idx) => (
            <div key={team.id} className="row" style={{ flexWrap: 'nowrap', padding: '10px 14px', borderRadius: 10, background: 'var(--input)' }}>
              <b style={{ minWidth: 24, color: idx === 0 && team.points > 0 ? 'var(--warning)' : 'var(--muted)' }}>{idx + 1}</b>
              <span style={{ flex: 1, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{team.name}</span>
              <b style={{ fontSize: 18, color: 'var(--accent)', minWidth: 36, textAlign: 'right' }}>{team.points}</b>
              <button className="icon-btn" onClick={() => changePoints(team.id, 1)} aria-label="Ұпай қосу" style={{ color: 'var(--success)' }}><Plus size={16} /></button>
              <button className="icon-btn" onClick={() => changePoints(team.id, -1)} aria-label="Ұпай азайту" style={{ color: 'var(--danger)' }}><Minus size={16} /></button>
              <button className="icon-btn" onClick={() => setTeams((t) => t.filter((x) => x.id !== team.id))} aria-label="Топты өшіру"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ fontSize: 17, marginBottom: 14 }}>Дайын квест-сценарийлер</h3>
      <div className="stack">
        {questScenarios.map((q) => (
          <Accordion
            key={q.id}
            open={openId === q.id}
            onToggle={() => setOpenId(openId === q.id ? null : q.id)}
            header={
              <div className="stack-sm">
                <div className="row" style={{ gap: 6 }}>
                  <span className="badge" style={{ color: q.color, background: `${q.color}1f` }}>{q.grade}</span>
                  <span className="badge">{q.subject}</span>
                </div>
                <h4 style={{ fontSize: 17 }}>{q.title}</h4>
                <p className="muted small">{q.desc}</p>
              </div>
            }
          >
            <div className="stack" style={{ paddingTop: 18 }}>
              <VerifyNote text={q.verify} />
              <h5 className="small" style={{ color: q.color, textTransform: 'uppercase', margin: 0 }}>Рөлдік карталар</h5>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {q.roles.map((r) => (
                  <div key={r.name} className="tint-box" style={{ '--stripe': q.color }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{r.name}</p>
                    <p className="small muted">{r.desc}</p>
                  </div>
                ))}
              </div>
              <h5 className="small" style={{ color: q.color, textTransform: 'uppercase', margin: 0 }}>Квест-хаттар</h5>
              <div className="stack-sm">
                {q.quest.map((step, i) => (
                  <div key={i} className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', background: 'var(--bg)', padding: 14, borderRadius: 10 }}>
                    <b style={{ color: q.color }}>{i + 1}</b>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{step.title}</p>
                      <p className="small muted">{step.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Accordion>
        ))}
      </div>
    </>
  );
}
