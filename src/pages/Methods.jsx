import { useState } from 'react';
import { Cpu, Target, Users } from 'lucide-react';
import { innovativeMethods } from '../data/content';
import { Modal, PageHeader, VerifyNote } from '../components/ui';

export default function Methods() {
  const [active, setActive] = useState(null);

  return (
    <>
      <PageHeader
        icon={Target}
        color="#8b5cf6"
        title="Инновациялық әдістер зертханасы"
        subtitle="Нақты тарихи материалға негізделген педагогикалық тәсілдер."
      />
      <div className="grid">
        {innovativeMethods.map((m) => (
          <div key={m.id} className="card card-accent stack-sm" style={{ '--stripe': m.color }}>
            <span className="badge" style={{ color: m.color, background: `${m.color}1a`, alignSelf: 'flex-start' }}>{m.category}</span>
            <h3 style={{ fontSize: 18, marginTop: 6 }}>{m.name}</h3>
            <p className="muted small" style={{ flexGrow: 1 }}>{m.desc}</p>
            <button className="btn btn-secondary btn-block" onClick={() => setActive(m)}>
              <Cpu size={18} color={m.color} /> Әдістемені ашу
            </button>
          </div>
        ))}
      </div>

      {active && (
        <Modal onClose={() => setActive(null)}>
          <div className="stack">
            <h3 className="row" style={{ fontSize: 22, paddingRight: 40, flexWrap: 'nowrap' }}>
              <Target color={active.color} size={26} style={{ flexShrink: 0 }} /> {active.name}
            </h3>
            <VerifyNote text={active.verify} />
            <div className="card" style={{ background: 'var(--input)', borderLeft: `4px solid ${active.color}` }}>
              <h4 className="small" style={{ color: active.color, textTransform: 'uppercase', marginBottom: 6 }}>Тарихи негіз</h4>
              <p style={{ fontWeight: 500 }}>{active.fact}</p>
            </div>
            <div className="card">
              <h4 className="small row" style={{ textTransform: 'uppercase', marginBottom: 6 }}>
                <Users size={16} color={active.color} /> Сабақта қолдану алгоритмі
              </h4>
              <p>{active.application}</p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
