import { Download, FileText, FolderOpen } from 'lucide-react';
import { methodologyFiles } from '../data/content';
import { PageHeader } from '../components/ui';

export default function Methodology() {
  return (
    <>
      <PageHeader
        icon={FolderOpen}
        color="#8b5cf6"
        title="Әдістемелік қоржын"
        subtitle="Тарих мұғаліміне арналған ҚМЖ, КТЖ және БЖБ үлгілері."
      />
      <div className="grid">
        {methodologyFiles.map((file) => (
          <div key={file.id} className="card stack-sm" style={{ borderTop: `4px solid ${file.color}` }}>
            <div className="row-between">
              <span className="badge" style={{ color: file.color, background: `${file.color}1a` }}>{file.type}</span>
              <span className="small muted row" style={{ gap: 4 }}><FileText size={14} /> {file.format}</span>
            </div>
            <h3 style={{ fontSize: 17, marginTop: 6 }}>{file.title}</h3>
            <div className="row" style={{ gap: 6 }}>
              <span className="badge">{file.grade}</span>
              <span className="badge">{file.subject}</span>
            </div>
            <p className="muted small" style={{ flexGrow: 1 }}>{file.desc}</p>
            {file.fileUrl ? (
              <a href={file.fileUrl} className="btn btn-secondary btn-block" download>
                <Download size={18} color={file.color} /> Жүктеп алу
              </a>
            ) : (
              <button className="btn btn-secondary btn-block" disabled>Файл дайындалуда</button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
