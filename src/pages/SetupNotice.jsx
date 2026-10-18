export default function SetupNotice() {
  return (
    <div className="container" style={{ maxWidth: 640, padding: '60px 16px' }}>
      <div className="card stack">
        <h2>Supabase қосылмаған</h2>
        <p className="muted">
          Сайт жұмыс істеуі үшін жоба түбіріндегі <code>.env</code> файлына Supabase кілттерін қосыңыз,
          ал Vercel-де оларды Settings → Environment Variables бөліміне енгізіңіз.
        </p>
        <pre className="card" style={{ padding: 14, overflowX: 'auto', fontSize: 13, background: 'var(--input)' }}>
{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...`}
        </pre>
        <p className="small muted">Кілттер: Supabase → Project Settings → API.</p>
      </div>
    </div>
  );
}
