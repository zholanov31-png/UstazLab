import { useState } from 'react';
import { BookOpen, Compass, Target } from 'lucide-react';
import { historicalSources } from '../data/content';
import { Modal, PageHeader, VerifyNote } from '../components/ui';

export default function Sources() {
  const [active, setActive] = useState(null);

  return (
    <>
      <PageHeader
        icon={Compass}
        color="#f59e0b"
        title="Интерактивті деректану"
        subtitle="Тарихи деректерді сабақта зерттеу нысаны ретінде қолдану әдістемесі."
      />
      <div className="grid">
        {historicalSources.map((src) => (
          <div key={src.id} className="card card-accent stack-sm" style={{ '--stripe': src.color }}>
            <div className="row-between">
              <span className="badge" style={{ color: src.color, background: `${src.color}1a` }}>{src.category}</span>
              <span className="badge" style={{ color: '#fff', background: src.color }}>{src.tag}</span>
            </div>
            <h3 style={{ fontSize: 18, marginTop: 6 }}>{src.name}</h3>
            <p className="muted small" style={{ flexGrow: 1 }}>{src.desc}</p>
            <button className="btn btn-secondary btn-block" onClick={() => setActive(src)}>
              <BookOpen size={18} color={src.color} /> Әдістемені көру
            </button>
          </div>
        ))}
      </div>

      {active && (
        <Modal onClose={() => setActive(null)}>
          <div className="stack">
            <h3 className="row" style={{ fontSize: 22, paddingRight: 40, flexWrap: 'nowrap' }}>
              <Compass color={active.color} size={26} style={{ flexShrink: 0 }} /> {active.name}
            </h3>
            <VerifyNote text={active.verify} />
            <div className="card" style={{ background: 'var(--input)', borderLeft: `4px solid ${active.color}` }}>
              <h4 className="small" style={{ color: active.color, textTransform: 'uppercase', marginBottom: 6 }}>Педагогикалық тәсіл</h4>
              <p>{active.pedagogy}</p>
            </div>
            <div className="card">
              <h4 className="small row" style={{ textTransform: 'uppercase', marginBottom: 6 }}>
                <Target size={16} color="var(--success)" /> Оқушыларға арналған тапсырма
              </h4>
              <p style={{ fontStyle: 'italic' }}>{active.task}</p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
