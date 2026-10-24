import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { LANGS, STRINGS } from './strings';

const LangContext = createContext(null);
const STORAGE_KEY = 'ustazlab-lang';
const KEYS = LANGS.map((l) => l.key);

function readStoredLang() {
  try {
    const l = localStorage.getItem(STORAGE_KEY);
    return KEYS.includes(l) ? l : 'kk';
  } catch {
    return 'kk';
  }
}

// Аударма жоқ болса — қазақшасы, ол да жоқ болса — кілттің өзі көрсетіледі.
export function translate(lang, key, vars) {
  let s = STRINGS[lang]?.[key] ?? STRINGS.kk[key] ?? key;
  if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.replace(`{${k}}`, v); });
  return s;
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* жеке терезеде storage жабық болуы мүмкін */
    }
  }, [lang]);

  const t = useCallback((key, vars) => translate(lang, key, vars), [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

// Тіл ауыстырғыш: ҚАЗ · РУС · ENG
export function LangSwitch() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="lang-switch" role="group" aria-label={t('common.language')}>
      {LANGS.map((l) => (
        <button
          key={l.key}
          type="button"
          className={lang === l.key ? 'active' : ''}
          onClick={() => setLang(l.key)}
          title={l.name}
          aria-pressed={lang === l.key}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
