import { useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ClipboardCheck, Send } from 'lucide-react';
import { supabase, humanizeError } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../lib/useProgress';
import { assessmentItems, LIKERT, scoreAssessment, selfRatingItems } from '../data/assessment';
import { ErrorBox, PageLoading } from '../components/ui';

const TITLES = { pre: 'Кіріс диагностика', post: 'Шығыс диагностика' };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Assessment() {
  const { kind } = useParams();
  const { user } = useAuth();
  const progress = useProgress();
  const navigate = useNavigate();

  const [stage, setStage] = useState('intro'); // intro | items | self | done
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [ratings, setRatings] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const startedAt = useRef(null);

  // Нұсқалар реті әр сессияда араласады — орналасу жауапқа әсер етпеуі үшін
  const items = useMemo(
    () => assessmentItems.map((it) => ({ ...it, options: shuffle(it.options) })),
    [],
  );

  if (!['pre', 'post'].includes(kind)) return <Navigate to="/app" replace />;
  if (progress.loading) return <PageLoading />;

  const alreadyDone = kind === 'pre' ? progress.pre : progress.post;
  if (alreadyDone && stage !== 'done') {
    return (
      <div className="card stack center" style={{ maxWidth: 560, margin: '0 auto' }}>
        <h2>{TITLES[kind]} тапсырылған</h2>
        <p className="muted">Нәтиже сақталды. Диагностиканы қайта тапсыруға болмайды, әйтпесе салыстыру дұрыс болмайды.</p>
        <Link to="/app" className="btn btn-primary">Дашбордқа оралу</Link>
      </div>
    );
  }
  if (kind === 'post' && !progress.canTakePost && stage !== 'done') {
    return (
      <div className="card stack center" style={{ maxWidth: 560, margin: '0 auto' }}>
        <h2>Шығыс диагностика әлі жабық</h2>
        <p className="muted">
          {progress.isControl
            ? 'Бақылау тобы үшін шығыс диагностиканы зерттеуші белгіленген күні ашады.'
            : 'Алдымен кіріс диагностиканы және барлық курс модульдерін аяқтаңыз.'}
        </p>
        <Link to="/app" className="btn btn-primary">Дашбордқа оралу</Link>
      </div>
    );
  }

  const item = items[idx];
  const answeredCount = Object.keys(answers).length;
  const totalSteps = items.length + 1;
  const stepNow = stage === 'self' ? items.length + 1 : idx + 1;

  const submit = async () => {
    if (selfRatingItems.some((s) => !ratings[s.competency])) {
      setError('Барлық тұжырымды бағалаңыз.');
      return;
    }
    setSaving(true);
    setError('');
    const scores = scoreAssessment(answers);
    const duration = startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : null;
    const { error: err } = await supabase.from('assessment_attempts').insert({
      user_id: user.id,
      kind,
      answers,
      self_ratings: ratings,
      scores,
      duration_sec: duration,
    });
    setSaving(false);
    if (err) {
      setError(humanizeError(err));
      return;
    }
    setStage('done');
  };

  if (stage === 'intro') {
    return (
      <div className="card stack" style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="row"><div className="icon-box"><ClipboardCheck size={26} /></div><h2>{TITLES[kind]}</h2></div>
        <p>Сізге {items.length} педагогикалық жағдаят және {selfRatingItems.length} өзін-өзі бағалау тұжырымы ұсынылады.</p>
        <ul className="muted" style={{ margin: 0, paddingLeft: 20 }}>
          <li>Әр жағдаятта өз тәжірибеңізде <b>шын мәнінде</b> қалай әрекет ететініңізді таңдаңыз.</li>
          <li>Дұрыс немесе бұрыс жауап көрсетілмейді — бұл емтихан емес, өлшеу.</li>
          <li>Диагностика бір рет қана тапсырылады. Шамамен 15 минут.</li>
        </ul>
        <button className="btn btn-primary btn-lg" onClick={() => { startedAt.current = Date.now(); setStage('items'); }}>
          Бастау <ArrowRight size={20} />
        </button>
      </div>
    );
  }

  if (stage === 'done') {
    return (
      <div className="card stack center" style={{ maxWidth: 560, margin: '0 auto' }}>
        <ClipboardCheck size={48} color="var(--success)" style={{ margin: '0 auto' }} />
        <h2>Рақмет! Нәтиже сақталды.</h2>
        <p className="muted">
          {kind === 'pre'
            ? 'Енді курс модульдеріне өтуге болады.'
            : 'Курс толық аяқталды. Дашбордта бастапқы және соңғы нәтижеңізді салыстыра аласыз.'}
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate(kind === 'pre' ? '/app/modules' : '/app', { replace: true })}
        >
          {kind === 'pre' ? 'Модульдерге өту' : 'Нәтижені көру'}
        </button>
      </div>
    );
  }

  return (
    <div className="stack" style={{ maxWidth: 760, margin: '0 auto' }}>
      <div className="stack-sm">
        <div className="row-between small muted">
          <span>{TITLES[kind]}</span>
          <span>{stepNow} / {totalSteps}</span>
        </div>
        <div className="progress"><div style={{ width: `${(stepNow / totalSteps) * 100}%` }} /></div>
      </div>

      {stage === 'items' && (
        <div className="card stack">
          <span className="badge">Жағдаят {idx + 1}</span>
          <h3 style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.6 }}>{item.scenario}</h3>
          <div className="stack-sm">
            {item.options.map((opt) => (
              <button
                key={opt.id}
                className={`option ${answers[item.id] === opt.id ? 'selected' : ''}`}
                onClick={() => setAnswers((a) => ({ ...a, [item.id]: opt.id }))}
              >
                {opt.text}
              </button>
            ))}
          </div>
          <div className="row-between">
            <button className="btn btn-secondary" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
              <ArrowLeft size={18} /> Артқа
            </button>
            <button
              className="btn btn-primary"
              disabled={!answers[item.id]}
              onClick={() => (idx < items.length - 1 ? setIdx(idx + 1) : setStage('self'))}
            >
              Келесі <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {stage === 'self' && (
        <div className="card stack">
          <h3 style={{ fontSize: 18 }}>Өзін-өзі бағалау</h3>
          <p className="muted small">Әр тұжырыммен қаншалықты келісетініңізді белгілеңіз.</p>
          {selfRatingItems.map((s) => (
            <div key={s.competency} className="stack-sm" style={{ paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontWeight: 600 }}>{s.text}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                {LIKERT.map((l) => (
                  <button
                    key={l.value}
                    className={`option center ${ratings[s.competency] === l.value ? 'selected' : ''}`}
                    style={{ padding: '10px 4px', fontSize: 12 }}
                    onClick={() => setRatings((r) => ({ ...r, [s.competency]: l.value }))}
                    title={l.label}
                  >
                    <b style={{ display: 'block', fontSize: 16 }}>{l.value}</b>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <ErrorBox error={error} />
          <div className="row-between">
            <button className="btn btn-secondary" onClick={() => { setStage('items'); setIdx(items.length - 1); }}>
              <ArrowLeft size={18} /> Артқа
            </button>
            <button className="btn btn-success" disabled={saving || answeredCount < items.length} onClick={submit}>
              {saving ? 'Сақталуда...' : <>Аяқтау <Send size={18} /></>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
