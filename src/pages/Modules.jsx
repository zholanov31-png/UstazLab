import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, LayoutGrid, Lock } from 'lucide-react';
import { useProgress } from '../lib/useProgress';
import { courseModules } from '../data/modules';
import { ErrorBox, PageHeader, PageLoading } from '../components/ui';

export default function Modules() {
  const progress = useProgress();
  if (progress.loading) return <PageLoading />;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageHeader
        icon={LayoutGrid}
        title="Курс модульдері"
        subtitle="«Тарихты оқытудың заманауи технологиялары мен инновациялық құзыреттілік» практикумы"
      />
      <ErrorBox error={progress.error} />

      {!progress.canStartModules && (
        <div className="alert alert-info row-between" style={{ marginBottom: 20 }}>
          <span>Модульдерді бастамас бұрын кіріс диагностиканы тапсырыңыз.</span>
          <Link to="/app/assessment/pre" className="btn btn-primary">Диагностикаға өту</Link>
        </div>
      )}

      <div className="stack">
        {courseModules.map((mod) => {
          const done = progress.completedModules.includes(mod.id);
          const open = progress.canStartModules && (done || mod.id === progress.unlockedModuleId);
          return (
            <div key={mod.id} className="card row-between" style={{ opacity: open ? 1 : 0.65 }}>
              <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                {done ? (
                  <CheckCircle2 size={22} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                ) : open ? (
                  <BookOpen size={22} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <Lock size={22} color="var(--muted)" style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <div>
                  <h3 style={{ fontSize: 17 }}>{mod.title}</h3>
                  <p className="muted small">{mod.desc}</p>
                </div>
              </div>
              {done ? (
                <Link to={`/app/modules/${mod.id}`} className="btn btn-secondary">Қайта қарау</Link>
              ) : open ? (
                <Link to={`/app/modules/${mod.id}`} className="btn btn-primary">Бастау</Link>
              ) : (
                <span className="badge">Жабық</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
