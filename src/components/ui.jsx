import { useEffect } from 'react';
import { ChevronRight, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function PageLoading() {
  return (
    <div className="page-loading">
      <div className="spinner" />
    </div>
  );
}

// Әр беттің басындағы шыны панель (басты беттегі суретпен біркелкі стиль)
export function PageHeader({ icon: Icon, color, title, subtitle, children }) {
  return (
    <div className="page-hero">
      <img className="page-hero-img" src="/img/hero-glass.webp" alt="" aria-hidden="true" />
      <div className="page-hero-body">
        {Icon && (
          <div className="icon-box icon-grad" style={color ? { '--c': color } : undefined}>
            <Icon size={26} />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {children && <div className="page-hero-actions">{children}</div>}
    </div>
  );
}

export function Modal({ onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close" onClick={onClose} aria-label="Жабу">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

export function Accordion({ open, onToggle, header, children }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <button className="accordion-head" onClick={onToggle} aria-expanded={open}>
        <div>{header}</div>
        <ChevronRight size={20} className={`chevron ${open ? 'open' : ''}`} />
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}

// Тексерілмеген фактінің белгісі — тек зерттеушіге көрінеді
export function VerifyNote({ text }) {
  const { isResearcher } = useAuth();
  if (!text || !isResearcher) return null;
  return (
    <div className="alert alert-warning small row" style={{ gap: 8, alignItems: 'flex-start', flexWrap: 'nowrap' }}>
      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
      <span><b>Тексеру қажет:</b> {text}</span>
    </div>
  );
}

export function ErrorBox({ error }) {
  if (!error) return null;
  return <div className="alert alert-error">{typeof error === 'string' ? error : error.message}</div>;
}
