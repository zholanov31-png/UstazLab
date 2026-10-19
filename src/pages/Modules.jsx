import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Eye, LayoutGrid, Lock, PlayCircle } from 'lucide-react';
import { useProgress } from '../lib/useProgress';
import { courseModules } from '../data/modules';
import { COMPETENCIES } from '../data/competencies';
import { ErrorBox, PageHeader, PageLoading } from '../components/ui';
import { LevelBar } from '../components/Game';

const short = (key) => COMPETENCIES.find((c) => c.key === key)?.short ?? key;

export default function Modules() {
  const progress = useProgress();
  if (progress.loading) return <PageLoading />;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <PageHeader
        icon={LayoutGrid}
        title="Ұстаздың жолы"
        subtitle="Инновациялық әдістердің бес станциясы. Әр станцияда теория, мысал, жағдаяттар, практикалық тапсырма және рефлексия бар."
      />
      <ErrorBox error={progress.error} />

      <div style={{ marginBottom: 20 }}>
        <LevelBar game={progress.game} compact />
      </div>

      {!progress.canStartModules && progress.isControl && (
        <div className="alert alert-info" style={{ marginBottom: 20 }}>
          Сіз бақылау тобындасыз. Курс модульдері шығыс диагностикадан кейін ашылады.
        </div>
      )}
      {!progress.canStartModules && !progress.isControl && (
        <div className="alert alert-info row-between" style={{ marginBottom: 20 }}>
          <span>Модульдерді бастамас бұрын кіріс диагностиканы тапсырыңыз.</span>
          <Link to="/app/assessment/pre" className="btn btn-primary">Диагностикаға өту</Link>
        </div>
      )}

      <div className="journey">
        {courseModules.map((mod) => {
          const access = progress.moduleAccess(mod);
          const state = access.done ? 'done' : access.open ? 'open' : 'locked';
          return (
            <div key={mod.id} className={`journey-step ${state}`}>
              <div className="journey-node">
                {access.done ? <CheckCircle2 size={22} /> : access.open ? <PlayCircle size={22} /> : mod.ready ? <Lock size={20} /> : <Clock size={20} />}
              </div>
              <div className="card journey-card">
                <div className="row-between" style={{ alignItems: 'flex-start' }}>
                  <div className="stack-sm" style={{ flex: 1, minWidth: 220 }}>
                    <div className="row" style={{ gap: 6 }}>
                      <span className="badge badge-accent">{mod.id}-станция · {mod.method}</span>
                      {mod.competencies.map((c) => <span key={c} className="badge">{short(c)}</span>)}
                    </div>
                    <h3 style={{ fontSize: 17 }}>{mod.title}</h3>
                    <p className="muted small">{mod.desc}</p>
                    {mod.duration && <p className="small muted row" style={{ gap: 4 }}><Clock size={14} /> {mod.duration}</p>}
                  </div>
                  <div>
                    {!mod.ready ? (
                      <span className="badge">Дайындалуда</span>
                    ) : access.open ? (
                      <Link to={`/app/modules/${mod.id}`} className={`btn ${access.done ? 'btn-secondary' : 'btn-primary'}`}>
                        {access.preview && !access.done ? <><Eye size={16} /> Алдын ала қарау</> : access.done ? 'Қайта қарау' : 'Бастау'}
                      </Link>
                    ) : (
                      <span className="badge">Жабық</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
