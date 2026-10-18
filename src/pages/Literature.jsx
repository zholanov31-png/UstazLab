import { AlertTriangle, BookMarked } from 'lucide-react';
import { literatureList } from '../data/literature';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/ui';

export default function Literature() {
  const { isResearcher } = useAuth();
  const toCheck = literatureList.filter((l) => l.status === 'check').length;

  return (
    <>
      <PageHeader
        icon={BookMarked}
        color="#f59e0b"
        title="Ғылыми әдебиеттер"
        subtitle="Платформаның әдіснамалық негізін құрайтын дереккөздер."
      />
      {isResearcher && toCheck > 0 && (
        <div className="alert alert-warning row" style={{ marginBottom: 20, flexWrap: 'nowrap', alignItems: 'flex-start' }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            <b>{toCheck} дереккөз</b> тексерілмеген (сары белгі). Авторы, атауы мен жылын Google Scholar немесе кітапхана каталогы арқылы тексеріп,
            <code> src/data/literature.js</code> файлында статусын жаңартыңыз. Бұл белгіні тек сіз көресіз.
          </span>
        </div>
      )}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {literatureList.map((lit) => (
          <div
            key={lit.id}
            className="card stack-sm"
            style={isResearcher && lit.status === 'check' ? { borderColor: 'var(--warning)' } : undefined}
          >
            <div className="row" style={{ flexWrap: 'nowrap' }}>
              <div className="icon-box" style={{ width: 40, height: 40, color: 'var(--warning)', background: 'var(--warning-soft)' }}>
                <BookMarked size={20} />
              </div>
              <h3 style={{ fontSize: 15 }}>{lit.author}</h3>
            </div>
            <p style={{ fontStyle: 'italic', flexGrow: 1 }} className="small">{lit.title}</p>
            <p className="small muted" style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
              <b>Маңызы:</b> {lit.desc}
            </p>
            {isResearcher && lit.status === 'check' && <span className="badge badge-warning" style={{ alignSelf: 'flex-start' }}>Тексеру қажет</span>}
          </div>
        ))}
      </div>
    </>
  );
}
