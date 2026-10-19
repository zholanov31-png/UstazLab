import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ClipboardList, Edit3, Info, Lightbulb, Send, Sparkles, Target, Trophy,
} from 'lucide-react';
import { supabase, humanizeError } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../lib/useProgress';
import { courseModules } from '../data/modules';
import { COMPETENCIES } from '../data/competencies';
import { XP } from '../data/game';
import { ErrorBox, PageLoading } from '../components/ui';
import { XpToast } from '../components/Game';

const STAGES = [
  { key: 'intro', label: 'Кіріспе' },
  { key: 'theory', label: 'Теория' },
  { key: 'example', label: 'Мысал' },
  { key: 'scenarios', label: 'Жағдаяттар' },
  { key: 'task', label: 'Тапсырма' },
  { key: 'reflection', label: 'Рефлексия' },
];

function shuffledIndexes(n) {
  const a = [...Array(n).keys()];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ModuleRun() {
  const { moduleId } = useParams();
  const id = Number(moduleId);
  const mod = courseModules.find((m) => m.id === id);
  const { user } = useAuth();
  const progress = useProgress();
  const navigate = useNavigate();

  const [stage, setStage] = useState('intro');
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // question_index -> option_index
  const [taskValues, setTaskValues] = useState({});
  const [submittedTask, setSubmittedTask] = useState(null);
  const [reflection, setReflection] = useState('');
  const [savedReflection, setSavedReflection] = useState(null);
  const [extraLoading, setExtraLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // Нұсқалар реті әр сессияда араласады (бастапқы индекс сақталады)
  const optionOrder = useMemo(
    () => (mod?.scenarios || []).map((s) => shuffledIndexes(s.options.length)),
    [mod],
  );

  // Бұрын сақталған жауаптарды, тапсырманы және рефлексияны жүктеу
  useEffect(() => {
    if (!user || !mod?.ready) return;
    let active = true;
    (async () => {
      const [resp, task, refl] = await Promise.all([
        supabase.from('module_responses').select('question_index, option_index').eq('user_id', user.id).eq('module_id', id),
        supabase.from('task_submissions').select('content').eq('user_id', user.id).eq('module_id', id).maybeSingle(),
        supabase.from('reflections').select('text').eq('user_id', user.id).eq('module_id', id).maybeSingle(),
      ]);
      if (!active) return;
      const map = {};
      (resp.data || []).forEach((r) => { map[r.question_index] = r.option_index; });
      setAnswers(map);
      if (task.data) setSubmittedTask(task.data.content);
      if (refl.data) setSavedReflection(refl.data.text);
      setExtraLoading(false);
    })();
    return () => { active = false; };
  }, [user, mod, id]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [stage, qIdx]);

  if (!mod) return <Navigate to="/app/modules" replace />;
  if (progress.loading || (mod.ready && extraLoading)) return <PageLoading />;

  const access = progress.moduleAccess(mod);
  if (!access.open) return <Navigate to="/app/modules" replace />;

  const review = access.done;
  const allAnswered = mod.scenarios.every((_, i) => answers[i] !== undefined);
  const stageIdx = STAGES.findIndex((s) => s.key === stage);
  const canEnter = (key) => {
    if (review) return true;
    if (key === 'task') return allAnswered;
    if (key === 'reflection') return allAnswered && Boolean(submittedTask);
    return true;
  };

  // ---------- Жағдаяттар ----------
  const choose = async (optionIndex) => {
    if (answers[qIdx] !== undefined) return;
    setAnswers((a) => ({ ...a, [qIdx]: optionIndex }));
    const best = mod.scenarios[qIdx].best === optionIndex;
    setToast({ amount: XP.scenario + (best ? XP.bestBonus : 0), label: best ? 'дәл таңдау!' : 'жауап үшін' });
    const { error: err } = await supabase.from('module_responses').insert({
      user_id: user.id, module_id: id, question_index: qIdx, option_index: optionIndex,
    });
    if (err && err.code !== '23505') setError(humanizeError(err));
  };

  // ---------- Тапсырма ----------
  const submitTask = async () => {
    const missing = mod.task.fields.find((f) => (taskValues[f.key] || '').trim().length < f.min);
    if (missing) {
      setError(`«${missing.label}» өрісін толығырақ толтырыңыз (кемінде ${missing.min} таңба).`);
      return;
    }
    setSaving(true);
    setError('');
    const content = Object.fromEntries(mod.task.fields.map((f) => [f.key, taskValues[f.key].trim()]));
    const { error: err } = await supabase.from('task_submissions').insert({ user_id: user.id, module_id: id, content });
    setSaving(false);
    if (err && err.code !== '23505') return setError(humanizeError(err));
    setSubmittedTask(content);
    setToast({ amount: XP.task, label: 'практикалық тапсырма' });
    setStage('reflection');
  };

  // ---------- Рефлексия ----------
  const submitReflection = async () => {
    const text = reflection.trim();
    if (text.length < mod.reflection.min) {
      setError(`Рефлексия кемінде ${mod.reflection.min} таңбадан тұруы керек.`);
      return;
    }
    setSaving(true);
    setError('');
    const { error: err } = await supabase.from('reflections').insert({ user_id: user.id, module_id: id, text });
    setSaving(false);
    if (err && err.code !== '23505') return setError(humanizeError(err));
    setSavedReflection(text);
    await progress.reload();
    setStage('done');
  };

  const goto = (key) => { if (canEnter(key)) { setError(''); setStage(key); } };
  const next = () => goto(STAGES[stageIdx + 1]?.key);
  const prev = () => goto(STAGES[stageIdx - 1]?.key);

  // ---------- Аяқталу экраны ----------
  if (stage === 'done') {
    const bestCount = mod.scenarios.filter((s, i) => answers[i] === s.best).length;
    const moduleXp = mod.scenarios.length * XP.scenario + bestCount * XP.bestBonus + XP.task + XP.reflection;
    return (
      <div className="card stack center" style={{ maxWidth: 600, margin: '0 auto', padding: 36 }}>
        <div className="badge-icon big" style={{ margin: '0 auto' }}><Trophy size={40} /></div>
        <h2>Станция аяқталды!</h2>
        <p className="muted">Сіз <b>«{mod.badge.name}»</b> бейджін алдыңыз.</p>
        <div className="row" style={{ justifyContent: 'center', fontSize: 22, fontWeight: 800, color: 'var(--warning)' }}>
          <Sparkles size={22} /> +{moduleXp} XP
        </div>
        <p className="small muted">Жағдаяттарда ұсынылатын нұсқа: {bestCount} / {mod.scenarios.length}</p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate(progress.allModulesDone ? '/app' : '/app/modules')}>
            {progress.allModulesDone ? 'Дашбордқа өту' : 'Келесі станцияға'} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const q = mod.scenarios[qIdx];
  const chosen = answers[qIdx];

  return (
    <div className="stack" style={{ maxWidth: 820, margin: '0 auto' }}>
      {toast && <XpToast amount={toast.amount} label={toast.label} />}

      <div className="row-between">
        <Link to="/app/modules" className="small muted">← Ұстаздың жолына оралу</Link>
        {review && <span className="badge badge-success">Аяқталған — қайта қарау</span>}
        {access.preview && !review && <span className="badge badge-warning">Зерттеуші: алдын ала қарау</span>}
      </div>

      <div className="stack-sm">
        <h2 style={{ fontSize: 22 }}>{mod.title}</h2>
        <div className="stepper">
          {STAGES.map((s, i) => (
            <button
              key={s.key}
              className={`step ${s.key === stage ? 'active' : ''} ${i < stageIdx ? 'past' : ''}`}
              disabled={!canEnter(s.key)}
              onClick={() => goto(s.key)}
            >
              <span className="step-num">{i + 1}</span>
              <span className="step-label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Кіріспе ---------- */}
      {stage === 'intro' && (
        <div className="card stack">
          <p style={{ fontSize: 17 }}>{mod.desc}.</p>
          <div className="row" style={{ gap: 6 }}>
            {mod.competencies.map((c) => (
              <span key={c} className="badge badge-accent">{COMPETENCIES.find((x) => x.key === c)?.label}</span>
            ))}
            {mod.duration && <span className="badge">{mod.duration}</span>}
          </div>
          <h3 className="row" style={{ fontSize: 16 }}><Target size={18} color="var(--accent)" /> Модульден кейін сіз:</h3>
          <ul className="stack-sm" style={{ margin: 0, paddingLeft: 20 }}>
            {mod.goals.map((g) => <li key={g}>{g}</li>)}
          </ul>
          <div className="alert alert-info small">
            Станцияда 6 кезең бар. Әр жағдаят үшін <b>+{XP.scenario} XP</b> (ұсынылатын нұсқа үшін тағы <b>+{XP.bestBonus}</b>),
            практикалық тапсырма — <b>+{XP.task} XP</b>, рефлексия — <b>+{XP.reflection} XP</b> және «{mod.badge.name}» бейджі.
          </div>
        </div>
      )}

      {/* ---------- Теория ---------- */}
      {stage === 'theory' && (
        <div className="stack">
          {mod.theory.map((sec) => (
            <div key={sec.title} className="card stack theory">
              <h3 className="row" style={{ fontSize: 18, flexWrap: 'nowrap' }}><BookOpen size={20} color="var(--accent)" style={{ flexShrink: 0 }} /> {sec.title}</h3>
              {sec.body?.map((p, i) => <p key={i}>{p}</p>)}
              {sec.list && (
                <ul className="stack-sm" style={{ margin: 0, paddingLeft: 20 }}>
                  {sec.list.map(([term, text]) => <li key={term}><b>{term}</b> — {text}</li>)}
                </ul>
              )}
              {sec.table && (
                <div className="table-wrap">
                  <table className="wrap">
                    <thead><tr>{sec.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                    <tbody>{sec.table.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{i === 0 ? <b>{c}</b> : c}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              )}
              {sec.note && (
                <div className="alert alert-warning row small" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                  <Lightbulb size={16} style={{ flexShrink: 0, marginTop: 2 }} /> <span>{sec.note}</span>
                </div>
              )}
              {sec.sources && <p className="small muted">Дереккөздер: {sec.sources.join('; ')}.</p>}
            </div>
          ))}
        </div>
      )}

      {/* ---------- Мысал ---------- */}
      {stage === 'example' && (
        <div className="card stack">
          <div>
            <span className="badge badge-accent">Сабақтағы қолдану мысалы</span>
            <h3 style={{ fontSize: 20, marginTop: 8 }}>{mod.example.title}</h3>
            <p className="small muted">{mod.example.meta}</p>
          </div>
          <p><b>Оқу мақсаты:</b> {mod.example.objective}</p>
          <p><b>Сюжет:</b> {mod.example.story}</p>
          <div className="stack-sm">
            {mod.example.stages.map((s) => (
              <div key={s.title} className="example-stage">
                <p style={{ fontWeight: 700 }}>{s.title}</p>
                <p className="small">{s.text}</p>
              </div>
            ))}
          </div>
          <p><b>Ұпай беру:</b> {mod.example.scoring}</p>
          <p className="muted">{mod.example.reflection}</p>
        </div>
      )}

      {/* ---------- Жағдаяттар ---------- */}
      {stage === 'scenarios' && (
        <div className="card stack">
          <div className="row-between">
            <span className="badge">Жағдаят {qIdx + 1} / {mod.scenarios.length}</span>
            <div className="row" style={{ gap: 4 }}>
              {mod.scenarios.map((_, i) => (
                <button key={i} className={`dot ${i === qIdx ? 'active' : ''} ${answers[i] !== undefined ? 'answered' : ''}`} onClick={() => setQIdx(i)} aria-label={`${i + 1}-жағдаят`} />
              ))}
            </div>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.6 }}>{q.scenario}</h3>
          <div className="stack-sm">
            {optionOrder[qIdx].map((orig) => {
              let cls = 'option';
              if (chosen !== undefined && orig === q.best) cls += ' best';
              else if (chosen === orig) cls += ' selected';
              return (
                <button key={orig} className={cls} disabled={chosen !== undefined} onClick={() => choose(orig)}>
                  {q.options[orig]}
                </button>
              );
            })}
          </div>
          {chosen !== undefined && (
            <div className="alert alert-success stack-sm">
              <div className="row" style={{ fontWeight: 700 }}>
                <Info size={18} color="var(--success)" />
                {chosen === q.best ? 'Ұсынылатын тәсілмен сәйкес келеді' : 'Ұсынылатын тәсіл жасылмен белгіленді'}
              </div>
              <p className="small">{q.feedback}</p>
            </div>
          )}
          <div className="row-between">
            <button className="btn btn-secondary" disabled={qIdx === 0} onClick={() => setQIdx(qIdx - 1)}><ArrowLeft size={18} /> Алдыңғы</button>
            {qIdx < mod.scenarios.length - 1 ? (
              <button className="btn btn-primary" disabled={chosen === undefined} onClick={() => setQIdx(qIdx + 1)}>Келесі <ArrowRight size={18} /></button>
            ) : (
              <button className="btn btn-primary" disabled={!allAnswered} onClick={() => goto('task')}>Тапсырмаға өту <ArrowRight size={18} /></button>
            )}
          </div>
        </div>
      )}

      {/* ---------- Практикалық тапсырма ---------- */}
      {stage === 'task' && (
        <div className="card stack">
          <div className="row"><div className="icon-box"><ClipboardList size={24} /></div><h3 style={{ fontSize: 20 }}>{mod.task.title}</h3></div>
          <p>{mod.task.intro}</p>
          {submittedTask ? (
            <>
              <div className="alert alert-success row small"><CheckCircle2 size={16} /> Тапсырма жіберілген.</div>
              {mod.task.fields.map((f) => (
                <div key={f.key} className="field">
                  <label>{f.label}</label>
                  <div className="submitted">{submittedTask[f.key]}</div>
                </div>
              ))}
            </>
          ) : (
            <>
              {mod.task.fields.map((f) => {
                const len = (taskValues[f.key] || '').trim().length;
                return (
                  <div key={f.key} className="field">
                    <label htmlFor={f.key}>{f.label}</label>
                    {f.rows === 1 ? (
                      <input id={f.key} className="input" value={taskValues[f.key] || ''} placeholder={f.placeholder}
                        onChange={(e) => setTaskValues((v) => ({ ...v, [f.key]: e.target.value }))} />
                    ) : (
                      <textarea id={f.key} className="textarea" style={{ minHeight: f.rows * 28 + 30 }} value={taskValues[f.key] || ''} placeholder={f.placeholder}
                        onChange={(e) => setTaskValues((v) => ({ ...v, [f.key]: e.target.value }))} />
                    )}
                    <div className="small" style={{ marginTop: 4, color: len >= f.min ? 'var(--success)' : 'var(--muted)' }}>{len} / {f.min}+ таңба</div>
                  </div>
                );
              })}
              <ErrorBox error={error} />
              <button className="btn btn-primary btn-block" disabled={saving} onClick={submitTask}>
                {saving ? 'Сақталуда...' : <>Тапсырманы жіберу (+{XP.task} XP) <Send size={18} /></>}
              </button>
            </>
          )}
        </div>
      )}

      {/* ---------- Рефлексия ---------- */}
      {stage === 'reflection' && (
        <div className="card stack">
          <div className="row"><div className="icon-box"><Edit3 size={24} /></div><h3 style={{ fontSize: 20 }}>Академиялық рефлексия</h3></div>
          <p style={{ fontWeight: 500 }}>{mod.reflection.question}</p>
          {savedReflection ? (
            <div className="submitted">{savedReflection}</div>
          ) : (
            <>
              <textarea className="textarea" value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="Өз ойыңызды жазыңыз..." />
              <div className="small" style={{ color: reflection.trim().length >= mod.reflection.min ? 'var(--success)' : 'var(--muted)' }}>
                {reflection.trim().length} / {mod.reflection.min}+ таңба
              </div>
              <ErrorBox error={error} />
              <button className="btn btn-success btn-block" disabled={saving} onClick={submitReflection}>
                {saving ? 'Сақталуда...' : <>Станцияны аяқтау (+{XP.reflection} XP) <Trophy size={18} /></>}
              </button>
            </>
          )}
        </div>
      )}

      {stage !== 'scenarios' && stage !== 'task' && !(stage === 'reflection' && !savedReflection) && (
        <div className="row-between">
          <button className="btn btn-secondary" disabled={stageIdx === 0} onClick={prev}><ArrowLeft size={18} /> Артқа</button>
          {stageIdx < STAGES.length - 1 && (
            <button className="btn btn-primary" disabled={!canEnter(STAGES[stageIdx + 1].key)} onClick={next}>
              {STAGES[stageIdx + 1].label} <ArrowRight size={18} />
            </button>
          )}
        </div>
      )}
      {stage === 'task' && submittedTask && (
        <div className="row-between">
          <button className="btn btn-secondary" onClick={prev}><ArrowLeft size={18} /> Артқа</button>
          <button className="btn btn-primary" onClick={next}>Рефлексия <ArrowRight size={18} /></button>
        </div>
      )}
    </div>
  );
}
