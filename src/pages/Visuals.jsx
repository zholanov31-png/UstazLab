import { useState } from 'react';
import { BookMarked, Image as ImageIcon } from 'lucide-react';
import { visualIdeas } from '../data/content';
import { Modal, PageHeader } from '../components/ui';

export default function Visuals() {
  const [active, setActive] = useState(null);

  return (
    <>
      <PageHeader
        icon={ImageIcon}
        color="#ef4444"
        title="Цифрлық визуализация"
        subtitle="Статикалық тарихи деректі цифрлық құралдармен «жандандыру» идеялары."
      />
      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        Бұл бөлімде әр жәдігер бойынша сабақ идеясы берілген. Нақты 3D/AI материалдар кейін қосылады.
      </div>
      <div className="grid">
        {visualIdeas.map((v) => (
          <div key={v.id} className="card card-accent stack-sm" style={{ '--stripe': v.color }}>
            <span className="badge" style={{ color: v.color, background: `${v.color}1a`, alignSelf: 'flex-start' }}>{v.category}</span>
            <h3 style={{ fontSize: 18, marginTop: 6 }}>{v.name}</h3>
            <p className="muted small" style={{ flexGrow: 1 }}>{v.source}</p>
            <button className="btn btn-secondary btn-block" onClick={() => setActive(v)}>
              «Бұрын» және «қазір» салыстыру
            </button>
          </div>
        ))}
      </div>

      {active && (
        <Modal onClose={() => setActive(null)}>
          <div className="stack">
            <h3 style={{ fontSize: 22, paddingRight: 40 }}>{active.name}</h3>
            <div className="row" style={{ flexWrap: 'nowrap', alignItems: 'flex-start', background: 'var(--input)', padding: 14, borderRadius: 12 }}>
              <BookMarked size={18} color={active.color} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div className="small muted" style={{ fontWeight: 700, textTransform: 'uppercase' }}>Тарихи дерек</div>
                <p style={{ fontWeight: 600 }}>{active.source}</p>
              </div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
              <div className="card" style={{ background: 'var(--input)', borderLeft: '4px solid var(--muted)' }}>
                <h4 className="small muted" style={{ textTransform: 'uppercase', marginBottom: 6 }}>Дәстүрлі ұсыну</h4>
                <p className="small">{active.script}</p>
              </div>
              <div className="card" style={{ background: `${active.color}14`, borderLeft: `4px solid ${active.color}` }}>
                <h4 className="small" style={{ color: active.color, textTransform: 'uppercase', marginBottom: 6 }}>Цифрлық тәсіл</h4>
                <p className="small">{active.remake}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
