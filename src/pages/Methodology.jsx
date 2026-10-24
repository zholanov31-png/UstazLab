import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Download, FileText, FolderOpen } from 'lucide-react';
import { methodologyFiles } from '../data/content';
import { PageHeader } from '../components/ui';

export default function Methodology() {
  return (
    <>
      <PageHeader
        icon={FolderOpen}
        color="#8b5cf6"
        title="Әдістемелік қоржын"
        subtitle="Авторлық сабақ жоспарлары және курс барысында студенттер жасаған сабақ жобалары."
      />
      <div className="grid">
        {methodologyFiles.map((file) => (
          <div key={file.id} className={`card card-accent stack-sm ${file.soon ? 'card-soon' : ''}`} style={{ '--stripe': file.color }}>
            <div className="row-between">
              <span className="badge" style={{ color: file.color, background: `${file.color}1a` }}>{file.type}</span>
              <span className="small muted row" style={{ gap: 4, marginRight: 18 }}><FileText size={14} /> {file.format}</span>
            </div>
            <h3 style={{ fontSize: 17, marginTop: 6 }}>{file.title}</h3>
            <div className="row" style={{ gap: 6 }}>
              <span className="badge">{file.grade}</span>
              <span className="badge">{file.subject}</span>
            </div>
            <p className="muted small" style={{ flexGrow: 1 }}>{file.desc}</p>
            {file.link && (
              <Link to={file.link} className="btn btn-secondary btn-block">
                {file.linkLabel} <ArrowRight size={18} color={file.color} />
              </Link>
            )}
            {file.fileUrl && (
              <a href={file.fileUrl} className="btn btn-secondary btn-block" download>
                <Download size={18} color={file.color} /> Жүктеп алу
              </a>
            )}
            {file.soon && (
              <div className="small muted row" style={{ gap: 6, justifyContent: 'center', padding: '10px 0' }}>
                <Clock size={15} /> {file.soon}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
