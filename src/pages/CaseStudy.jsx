import { useState } from 'react';
import { Users } from 'lucide-react';
import { historicalDilemmas } from '../data/content';
import { Accordion, PageHeader } from '../components/ui';

export default function CaseStudy() {
  const [openId, setOpenId] = useState(null);
  const [selected, setSelected] = useState({});

  return (
    <>
      <PageHeader
        icon={Users}
        color="#ef4444"
        title="Тарихи кейстер банкі"
        subtitle="Оқушыны тарихи тұлғаның орнына қойып, сыни ойлауды дамытатын дилеммалар."
      />
      <div className="stack">
        {historicalDilemmas.map((d) => (
          <Accordion
            key={d.id}
            open={openId === d.id}
            onToggle={() => setOpenId(openId === d.id ? null : d.id)}
            header={
              <div className="stack-sm">
                <div className="row" style={{ gap: 6 }}>
                  <span className="badge" style={{ color: d.color, background: `${d.color}1f` }}>{d.grade}</span>
                  <span className="badge">{d.subject}</span>
                </div>
                <h4 style={{ fontSize: 17 }}>{d.title}</h4>
              </div>
            }
          >
            <div className="stack" style={{ paddingTop: 18 }}>
              {[['1. Жағдай', d.situation], ['2. Мәселе', d.problem]].map(([label, text]) => (
                <div key={label} className="tint-box" style={{ '--stripe': d.color }}>
                  <h5 className="small" style={{ color: d.color, textTransform: 'uppercase', margin: '0 0 6px' }}>{label}</h5>
                  <p>{text}</p>
                </div>
              ))}
              <h5 className="small" style={{ color: d.color, textTransform: 'uppercase', margin: 0 }}>3. Таңдау нұсқалары (сынып дауыс береді)</h5>
              <div className="stack-sm">
                {d.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`option ${selected[d.id] === i ? 'selected' : ''}`}
                    onClick={() => setSelected((s) => ({ ...s, [d.id]: i }))}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="card" style={{ background: 'var(--bg)' }}>
                <h5 className="small" style={{ textTransform: 'uppercase', margin: '0 0 8px' }}>4. Мұғалімге арналған бағыттаушы сұрақтар</h5>
                <ul style={{ margin: 0, paddingLeft: 18 }} className="stack-sm">
                  {d.guidingQuestions.map((q) => (
                    <li key={q} className="small muted">{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Accordion>
        ))}
      </div>
    </>
  );
}
