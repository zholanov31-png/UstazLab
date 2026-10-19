import { useEffect, useMemo, useState } from 'react';
import { Download, FlaskConical, RefreshCw, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { COMPETENCIES } from '../data/competencies';
import { assessmentItems, ASSESSMENT_VERSION, selfRatingItems } from '../data/assessment';
import { courseModules } from '../data/modules';
import { downloadCsv, fmt, mannWhitney, mean, pairedSummary } from '../lib/stats';
import { isControlGroup } from '../lib/useProgress';
import { ErrorBox, PageHeader, PageLoading } from '../components/ui';

const ROLE = { student: 'Магистрант', teacher: 'Мұғалім', researcher: 'Зерттеуші' };
const avgScore = (scores) =>
  scores ? COMPETENCIES.reduce((s, c) => s + (scores[c.key] ?? 0), 0) / COMPETENCIES.length : null;
const today = () => new Date().toISOString().slice(0, 10);

export default function Research() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [group, setGroup] = useState('ALL');

  const load = async () => {
    setError(null);
    setData(null);
    const [p, a, r, g] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at'),
      supabase.from('assessment_attempts').select('*'),
      supabase.from('reflections').select('*').order('created_at'),
      supabase.from('group_settings').select('*'),
    ]);
    const err = p.error || a.error || r.error || g.error;
    if (err) return setError(err);
    setData({ profiles: p.data, attempts: a.data, reflections: r.data, settings: g.data });
  };

  const togglePost = async (code, open) => {
    const { error: err } = await supabase
      .from('group_settings')
      .upsert({ group_code: code, post_open: open, updated_at: new Date().toISOString() });
    if (err) return setError(err);
    load();
  };

  useEffect(() => { load(); }, []);

  const participants = useMemo(() => {
    if (!data) return [];
    return data.profiles
      .filter((p) => p.role !== 'researcher')
      .map((p) => {
        const pre = data.attempts.find((x) => x.user_id === p.id && x.kind === 'pre') || null;
        const post = data.attempts.find((x) => x.user_id === p.id && x.kind === 'post') || null;
        const modules = data.reflections.filter((x) => x.user_id === p.id).length;
        return { ...p, pre, post, modules };
      });
  }, [data]);

  const groups = useMemo(
    () => [...new Set(participants.map((p) => p.group_code || '—'))].sort(),
    [participants],
  );

  const filtered = group === 'ALL' ? participants : participants.filter((p) => (p.group_code || '—') === group);
  const paired = filtered.filter((p) => p.pre && p.post);

  const stats = useMemo(() => {
    const rows = COMPETENCIES.map((c) => ({
      label: c.label,
      ...pairedSummary(paired.map((p) => [p.pre.scores[c.key], p.post.scores[c.key]])),
    }));
    rows.push({
      label: 'Жалпы (орташа)',
      ...pairedSummary(paired.map((p) => [avgScore(p.pre.scores), avgScore(p.post.scores)])),
      total: true,
    });
    return rows;
  }, [paired]);

  // EXP пен CTRL салыстыру: бастапқы теңдік және өсімдер айырмасы
  const between = useMemo(() => {
    const done = participants.filter((p) => p.pre && p.post && p.group_code);
    const exp = done.filter((p) => !isControlGroup(p.group_code));
    const ctrl = done.filter((p) => isControlGroup(p.group_code));
    const preOf = (list) => list.map((p) => avgScore(p.pre.scores));
    const gainOf = (list) => list.map((p) => avgScore(p.post.scores) - avgScore(p.pre.scores));
    return {
      exp, ctrl,
      baseline: { e: mean(preOf(exp)), c: mean(preOf(ctrl)), test: mannWhitney(preOf(exp), preOf(ctrl)) },
      gain: { e: mean(gainOf(exp)), c: mean(gainOf(ctrl)), test: mannWhitney(gainOf(exp), gainOf(ctrl)) },
    };
  }, [participants]);

  if (error) return <ErrorBox error={error} />;
  if (!data) return <PageLoading />;

  const postOpenFor = (code) => Boolean(data.settings.find((s) => s.group_code === code)?.post_open);

  // ---------- CSV экспорттары ----------
  const exportScores = () => {
    const header = ['id', 'аты-жөні', 'рөлі', 'топ', 'модуль саны'];
    for (const kind of ['pre', 'post']) {
      COMPETENCIES.forEach((c) => header.push(`${kind}_${c.key}`));
      selfRatingItems.forEach((s) => header.push(`${kind}_self_${s.competency}`));
      header.push(`${kind}_орташа`, `${kind}_ұзақтығы_сек`, `${kind}_күні`);
    }
    const rows = filtered.map((p) => {
      const row = [p.id, p.full_name, ROLE[p.role], p.group_code || '', p.modules];
      for (const att of [p.pre, p.post]) {
        COMPETENCIES.forEach((c) => row.push(att?.scores?.[c.key] ?? ''));
        selfRatingItems.forEach((s) => row.push(att?.self_ratings?.[s.competency] ?? ''));
        const a = avgScore(att?.scores);
        row.push(a === null ? '' : a.toFixed(1), att?.duration_sec ?? '', att?.completed_at?.slice(0, 10) ?? '');
      }
      return row;
    });
    downloadCsv(`ustazlab_nәтижелер_${group}_${today()}.csv`, [header, ...rows]);
  };

  // Әр сұраққа берілген жауаптың балы — Кронбах альфасы мен сұрақ талдауы үшін
  const exportItems = () => {
    const header = ['id', 'топ', 'кезең', ...assessmentItems.map((i) => `${i.id}_${i.competency}`)];
    const rows = [];
    for (const p of filtered) {
      for (const att of [p.pre, p.post].filter(Boolean)) {
        rows.push([
          p.id,
          p.group_code || '',
          att.kind,
          ...assessmentItems.map((it) => it.options.find((o) => o.id === att.answers[it.id])?.score ?? ''),
        ]);
      }
    }
    downloadCsv(`ustazlab_сұрақтар_${group}_${today()}.csv`, [header, ...rows]);
  };

  const exportReflections = () => {
    const ids = new Set(filtered.map((p) => p.id));
    const byId = Object.fromEntries(filtered.map((p) => [p.id, p]));
    const rows = data.reflections
      .filter((r) => ids.has(r.user_id))
      .map((r) => [
        r.user_id,
        byId[r.user_id]?.full_name,
        byId[r.user_id]?.group_code || '',
        courseModules.find((m) => m.id === r.module_id)?.title ?? r.module_id,
        r.text,
        r.created_at.slice(0, 10),
      ]);
    downloadCsv(`ustazlab_рефлексиялар_${group}_${today()}.csv`, [['id', 'аты-жөні', 'топ', 'модуль', 'мәтін', 'күні'], ...rows]);
  };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <PageHeader icon={FlaskConical} title="Эксперимент деректері" subtitle={`Бағалау құралының нұсқасы: ${ASSESSMENT_VERSION}`}>
        <button className="btn btn-secondary" onClick={load}><RefreshCw size={16} /> Жаңарту</button>
      </PageHeader>

      <div className="card row-between">
        <div className="row">
          <Users size={20} color="var(--accent)" />
          <b>Топ:</b>
          <select className="input" style={{ width: 'auto', padding: '8px 12px' }} value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="ALL">Барлығы</option>
            {groups.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="row small muted">
          <span>Қатысушы: <b>{filtered.length}</b></span>
          <span>Pre: <b>{filtered.filter((p) => p.pre).length}</b></span>
          <span>Post: <b>{filtered.filter((p) => p.post).length}</b></span>
        </div>
      </div>

      <div className="card stack">
        <h3 style={{ fontSize: 18 }}>Топтарды басқару</h3>
        <p className="small muted">
          Коды <b>CTRL</b> деп басталатын топтар — бақылау тобы: модульдерді көрмейді, шығыс диагностиканы сіз ашқанда тапсырады.
          Қалған топтар — эксперимент тобы: шығыс диагностика 5 модульден кейін өздігінен ашылады.
        </p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Топ</th><th>Түрі</th><th>Қатысушы</th><th>Шығыс диагностика</th></tr></thead>
            <tbody>
              {groups.filter((g) => g !== '—').map((g) => {
                const ctrl = isControlGroup(g);
                const open = postOpenFor(g);
                return (
                  <tr key={g}>
                    <td><b>{g}</b></td>
                    <td>{ctrl ? 'Бақылау' : 'Эксперимент'}</td>
                    <td>{participants.filter((p) => p.group_code === g).length}</td>
                    <td>
                      {ctrl ? (
                        <button className={`btn ${open ? 'btn-secondary' : 'btn-success'}`} style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => togglePost(g, !open)}>
                          {open ? 'Ашық — жабу' : 'Жабық — ашу'}
                        </button>
                      ) : (
                        <span className="small muted">Модульдерден кейін</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {groups.filter((g) => g !== '—').length === 0 && (
                <tr><td colSpan={4} className="muted center">Әзірге топ коды бар қатысушы жоқ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card stack">
        <h3 style={{ fontSize: 18 }}>Эксперимент тобы мен бақылау тобын салыстыру</h3>
        {between.exp.length < 2 || between.ctrl.length < 2 ? (
          <p className="muted">Салыстыру үшін әр топта кемінде 2 қатысушы екі диагностиканы да тапсыруы керек.
            Қазір: эксперимент — {between.exp.length}, бақылау — {between.ctrl.length}.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Көрсеткіш</th><th>EXP (n={between.exp.length})</th><th>CTRL (n={between.ctrl.length})</th><th>U</th><th>z</th><th>p</th><th>r</th></tr></thead>
              <tbody>
                {[['Кіріс деңгей (бастапқы теңдік)', between.baseline], ['Өсім (post − pre)', between.gain]].map(([label, s]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>{fmt(s.e)}</td>
                    <td>{fmt(s.c)}</td>
                    <td>{fmt(s.test.U, 1)}</td>
                    <td>{fmt(s.test.z, 2)}</td>
                    <td style={{ fontWeight: 700, color: s.test.p < 0.05 ? 'var(--success)' : undefined }}>{fmt(s.test.p, 3)}</td>
                    <td>{fmt(s.test.r, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="small muted">
          Дұрыс нәтиже: <b>кіріс деңгейде</b> p ≥ 0,05 (топтар басында тең), <b>өсімде</b> p &lt; 0,05 (эксперимент тобы айтарлықтай көбірек өсті).
          r — эффект мөлшері (0,1 әлсіз · 0,3 орташа · 0,5 күшті). Қорытынды мәндерді JASP-та тексеріңіз.
        </p>
      </div>

      <div className="card stack">
        <h3 style={{ fontSize: 18 }}>Pre → Post салыстыру (жұптастырылған, n = {paired.length})</h3>
        {paired.length < 2 ? (
          <p className="muted">Статистика үшін кемінде 2 қатысушы екі диагностиканы да тапсыруы керек.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Құзырет</th><th>Pre M</th><th>Post M</th><th>Айырма</th><th>SD айырма</th><th>t (df)</th><th>Cohen dz</th></tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.label} style={s.total ? { fontWeight: 700 } : undefined}>
                    <td>{s.label}</td>
                    <td>{fmt(s.meanPre)}</td>
                    <td>{fmt(s.meanPost)}</td>
                    <td style={{ color: s.meanDiff > 0 ? 'var(--success)' : undefined }}>{s.meanDiff > 0 ? '+' : ''}{fmt(s.meanDiff)}</td>
                    <td>{fmt(s.sdDiff)}</td>
                    <td>{fmt(s.t, 2)} ({s.df})</td>
                    <td>{fmt(s.dz, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="small muted">
          Бұл — жедел шолу. Диссертациядағы қорытынды талдауды экспортталған деректермен SPSS немесе JASP-та жасаңыз
          (шағын іріктемеде Вилкоксон критерийі сенімдірек). Бақылау тобы болса, топтарды осы жерден бөлек сүзіп салыстырыңыз.
        </p>
      </div>

      <div className="card stack">
        <h3 style={{ fontSize: 18 }}>Деректерді экспорттау (Excel/SPSS)</h3>
        <div className="row">
          <button className="btn btn-primary" onClick={exportScores}><Download size={18} /> Құзырет балдары</button>
          <button className="btn btn-secondary" onClick={exportItems}><Download size={18} /> Сұрақтар бойынша</button>
          <button className="btn btn-secondary" onClick={exportReflections}><Download size={18} /> Рефлексиялар</button>
        </div>
      </div>

      <div className="card stack">
        <h3 style={{ fontSize: 18 }}>Қатысушылар</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Аты-жөні</th><th>Рөлі</th><th>Топ</th><th>Pre</th><th>Модуль</th><th>Post</th><th>Өзгеріс</th></tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const pre = avgScore(p.pre?.scores);
                const post = avgScore(p.post?.scores);
                return (
                  <tr key={p.id}>
                    <td>{p.full_name || '—'}</td>
                    <td>{ROLE[p.role]}</td>
                    <td>{p.group_code || '—'}</td>
                    <td>{pre === null ? '—' : fmt(pre)}</td>
                    <td>{p.modules} / {courseModules.length}</td>
                    <td>{post === null ? '—' : fmt(post)}</td>
                    <td>{pre !== null && post !== null ? `${post - pre > 0 ? '+' : ''}${fmt(post - pre)}` : '—'}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="muted center">Әзірге қатысушы жоқ</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
