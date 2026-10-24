import { Link } from 'react-router-dom';
import {
  Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip,
} from 'recharts';
import {
  Award, BarChart3, CheckCircle2, ClipboardCheck, Circle, LayoutGrid, Lock, TrendingUp, Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { chartColors, useTheme } from '../context/ThemeContext';
import { useProgress } from '../lib/useProgress';
import { COMPETENCIES } from '../data/competencies';
import { courseModules } from '../data/modules';
import { ErrorBox, PageLoading, PageHeader } from '../components/ui';
import { BadgeGrid, LevelBar } from '../components/Game';

function Step({ done, locked, title, text, action }) {
  const Icon = done ? CheckCircle2 : locked ? Lock : Circle;
  const color = done ? 'var(--success)' : locked ? 'var(--muted)' : 'var(--accent)';
  return (
    <div className="card row-between" style={{ opacity: locked ? 0.65 : 1 }}>
      <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
        <Icon size={24} color={color} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <h3 style={{ fontSize: 17 }}>{title}</h3>
          <p className="muted small" style={{ marginTop: 2 }}>{text}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  const { theme } = useTheme();
  const progress = useProgress();
  const colors = chartColors[theme];

  if (progress.loading) return <PageLoading />;

  const { pre, post, completedModules } = progress;
  const chartData = COMPETENCIES.map((c) => ({
    skill: c.short,
    pre: pre?.scores?.[c.key] ?? 0,
    post: post?.scores?.[c.key] ?? null,
  }));

  const avg = (scores) =>
    scores ? Math.round(COMPETENCIES.reduce((s, c) => s + (scores[c.key] ?? 0), 0) / COMPETENCIES.length) : null;
  const preAvg = avg(pre?.scores);
  const postAvg = avg(post?.scores);
  const growth = preAvg !== null && postAvg !== null ? postAvg - preAvg : null;

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div style={{ marginBottom: -24 }}>
        <PageHeader
          icon={Sparkles}
          title={`Қош келдіңіз, ${profile?.full_name?.split(' ')[0] || 'әріптес'}!`}
          subtitle="Курс үш кезеңнен тұрады. Нәтижеңіз әр кезеңнен кейін сақталады."
        />
      </div>

      <ErrorBox error={progress.error} />

      <LevelBar game={progress.game} />

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card row" style={{ flexWrap: 'nowrap' }}>
          <div className="icon-box"><ClipboardCheck size={24} /></div>
          <div>
            <div className="small muted">Бастапқы деңгей</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{preAvg !== null ? `${preAvg} / 100` : '—'}</div>
          </div>
        </div>
        <div className="card row" style={{ flexWrap: 'nowrap' }}>
          <div className="icon-box" style={{ color: 'var(--success)', background: 'var(--success-soft)' }}><TrendingUp size={24} /></div>
          <div>
            <div className="small muted">Өзгеріс (pre → post)</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>
              {growth !== null ? `${growth > 0 ? '+' : ''}${growth} балл` : '—'}
            </div>
          </div>
        </div>
        <div className="card row" style={{ flexWrap: 'nowrap' }}>
          <div className="icon-box" style={{ color: 'var(--warning)', background: 'var(--warning-soft)' }}><Award size={24} /></div>
          <div>
            <div className="small muted">Модульдер</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{completedModules.length} / {courseModules.length}</div>
          </div>
        </div>
      </div>

      {progress.isControl ? (
        <div className="stack">
          <div className="alert alert-info">
            Сіз <b>бақылау тобындасыз</b> ({progress.groupCode}). Сіздің қатысуыңыз зерттеу үшін өте маңызды:
            нәтижелеріңіз эксперимент тобымен салыстырылады. Шығыс диагностикадан кейін барлық курс модульдері сізге де ашылады.
          </div>
          <Step
            done={Boolean(pre)}
            title="1-кезең: Кіріс диагностика"
            text="10 жағдаят + 5 өзін-өзі бағалау сұрағы, шамамен 15 минут. Тек бір рет тапсырылады."
            action={!pre && <Link to="/app/assessment/pre" className="btn btn-primary">Бастау</Link>}
          />
          <Step
            done={Boolean(post)}
            locked={!progress.canTakePost && !post}
            title="2-кезең: Шығыс диагностика"
            text={progress.canTakePost || post
              ? 'Диагностика ашық. Кіріс диагностикадағы құралмен қайта өлшеу.'
              : 'Зерттеуші ашқан күні қолжетімді болады. Әзірге әдеттегі сабақтарыңызды жалғастырыңыз.'}
            action={progress.canTakePost && <Link to="/app/assessment/post" className="btn btn-success">Бастау</Link>}
          />
          <Step
            done={progress.allModulesDone}
            locked={!progress.canStartModules}
            title="3-кезең: Курс модульдері (бонус)"
            text="Шығыс диагностикадан кейін ашылады."
            action={progress.canStartModules && !progress.allModulesDone && (
              <Link to="/app/modules" className="btn btn-primary"><LayoutGrid size={18} /> Ашу</Link>
            )}
          />
        </div>
      ) : (
      <div className="stack">
        <Step
          done={Boolean(pre)}
          title="1-кезең: Кіріс диагностика"
          text="10 жағдаят + 5 өзін-өзі бағалау сұрағы, шамамен 15 минут. Тек бір рет тапсырылады."
          action={!pre && <Link to="/app/assessment/pre" className="btn btn-primary">Бастау</Link>}
        />
        <Step
          done={progress.allModulesDone}
          locked={!pre}
          title="2-кезең: Курс модульдері"
          text={`«Ұстаздың жолы»: 5 станция — теория, жағдаяттар, практикалық тапсырма және рефлексия. Аяқталды: ${completedModules.length} / ${courseModules.length}.`}
          action={pre && !progress.allModulesDone && (
            <Link to="/app/modules" className="btn btn-primary"><LayoutGrid size={18} /> Жалғастыру</Link>
          )}
        />
        <Step
          done={Boolean(post)}
          locked={!progress.canTakePost && !post}
          title="3-кезең: Шығыс диагностика"
          text="Кіріс диагностикадағы құралмен қайта өлшеу. Барлық модуль аяқталған соң ашылады."
          action={progress.canTakePost && <Link to="/app/assessment/post" className="btn btn-success">Бастау</Link>}
        />
      </div>
      )}

      <BadgeGrid badges={progress.game.badges} />

      {pre && (
        <div className="card">
          <h3 className="row" style={{ fontSize: 18, marginBottom: 12 }}>
            <BarChart3 size={22} color="var(--accent)" /> Құзыреттер профилі
          </h3>
          <div style={{ width: '100%', height: 380 }}>
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                <PolarGrid stroke={colors.grid} />
                <PolarAngleAxis dataKey="skill" stroke={colors.axis} tick={{ fontSize: 12, fontWeight: 600, fill: colors.axis }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={colors.grid} tick={{ fill: colors.axis, fontSize: 10 }} />
                <Radar name="Кіріс (pre)" dataKey="pre" stroke={colors.pre} fill={colors.pre} fillOpacity={0.25} />
                {post && <Radar name="Шығыс (post)" dataKey="post" stroke={colors.post} fill={colors.post} fillOpacity={0.35} />}
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {!post && (
            <p className="small muted center">Шығыс диагностикадан кейін екінші қабат пайда болып, өзгерісті көресіз.</p>
          )}
        </div>
      )}
    </div>
  );
}
