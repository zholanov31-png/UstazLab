import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Edit3, Info, Send } from 'lucide-react';
import { supabase, humanizeError } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../lib/useProgress';
import { courseModules } from '../data/modules';
import { ErrorBox, PageLoading } from '../components/ui';

const MIN_REFLECTION = 20;

export default function ModuleRun() {
  const { moduleId } = useParams();
  const id = Number(moduleId);
  const mod = courseModules.find((m) => m.id === id);
  const { user } = useAuth();
  const progress = useProgress();
  const navigate = useNavigate();

  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [stage, setStage] = useState('questions'); // questions | reflection
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!mod) return <Navigate to="/app/modules" replace />;
  if (progress.loading) return <PageLoading />;

  const done = progress.completedModules.includes(id);
  const open = progress.canStartModules && (done || id === progress.unlockedModuleId);
  if (!open) return <Navigate to="/app/modules" replace />;

  const question = mod.questions[qIdx];
  const isLast = qIdx === mod.questions.length - 1;

  const choose = async (optionIndex) => {
    if (chosen !== null) return;
    setChosen(optionIndex);
    if (done) return; // қайта қарау кезінде жауап жазылмайды
    // Жауапты сақтау. Қайталанған жағдайда (unique) қатені елемейміз.
    const { error: err } = await supabase.from('module_responses').insert({
      user_id: user.id,
      module_id: id,
      question_index: qIdx,
      option_index: optionIndex,
    });
    if (err && err.code !== '23505') setError(humanizeError(err));
  };

  const next = () => {
    setChosen(null);
    setError('');
    if (isLast) {
      if (done) navigate('/app/modules');
      else setStage('reflection');
    } else {
      setQIdx(qIdx + 1);
    }
  };

  const submitReflection = async () => {
    const text = reflection.trim();
    if (text.length < MIN_REFLECTION) {
      setError(`Рефлексия кемінде ${MIN_REFLECTION} таңбадан тұруы керек.`);
      return;
    }
    setSaving(true);
    setError('');
    const { error: err } = await supabase.from('reflections').insert({ user_id: user.id, module_id: id, text });
    setSaving(false);
    if (err && err.code !== '23505') {
      setError(humanizeError(err));
      return;
    }
    const allDone = courseModules.every((m) => m.id === id || progress.completedModules.includes(m.id));
    navigate(allDone ? '/app' : '/app/modules', { replace: true });
  };

  return (
    <div className="stack" style={{ maxWidth: 780, margin: '0 auto' }}>
      <div className="row-between">
        <Link to="/app/modules" className="small muted">← Модульдерге оралу</Link>
        {done && <span className="badge badge-success">Аяқталған — қайта қарау режимі</span>}
      </div>

      {stage === 'questions' && (
        <div className="card stack">
          <div className="row-between">
            <h2 style={{ fontSize: 20 }}>{mod.title}</h2>
            <span className="badge">Жағдаят {qIdx + 1} / {mod.questions.length}</span>
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.6 }}>{question.scenario}</h3>
          <div className="stack-sm">
            {question.options.map((text, i) => {
              let cls = 'option';
              if (chosen !== null && i === question.best) cls += ' best';
              else if (chosen === i) cls += ' selected';
              return (
                <button key={i} className={cls} disabled={chosen !== null} onClick={() => choose(i)}>
                  {text}
                </button>
              );
            })}
          </div>

          {chosen !== null && (
            <div className="alert alert-success stack-sm">
              <div className="row" style={{ fontWeight: 700 }}>
                <Info size={18} color="var(--success)" />
                {chosen === question.best ? 'Ұсынылатын тәсілмен сәйкес келеді' : 'Ұсынылатын тәсіл жасылмен белгіленді'}
              </div>
              <p className="small">{question.citation}</p>
            </div>
          )}

          <ErrorBox error={error} />

          {chosen !== null && (
            <button className="btn btn-primary" onClick={next} style={{ alignSelf: 'flex-end' }}>
              {isLast ? (done ? 'Аяқтау' : 'Рефлексияға өту') : 'Келесі жағдаят'} <ArrowRight size={18} />
            </button>
          )}
        </div>
      )}

      {stage === 'reflection' && (
        <div className="card stack">
          <div className="row"><div className="icon-box"><Edit3 size={24} /></div><h2 style={{ fontSize: 22 }}>Академиялық рефлексия</h2></div>
          <p style={{ fontWeight: 500 }}>{mod.reflectionQuestion}</p>
          <textarea
            className="textarea"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Өз ойыңызды жазыңыз..."
          />
          <div className="small muted">{reflection.trim().length} таңба (кемінде {MIN_REFLECTION})</div>
          <ErrorBox error={error} />
          <button className="btn btn-primary btn-block" disabled={saving} onClick={submitReflection}>
            {saving ? 'Сақталуда...' : <>Жіберу және жалғастыру <Send size={18} /></>}
          </button>
        </div>
      )}
    </div>
  );
}
