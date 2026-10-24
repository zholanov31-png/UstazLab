import { createClient } from '@supabase/supabase-js';
import { translate } from '../i18n/LangContext';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

// Supabase қателерін түсінікті хабарламаға айналдыру.
// t берілсе — таңдалған тілде (кіру беті), берілмесе — қазақша.
const ERROR_KEYS = [
  ['invalid login credentials', 'err.credentials'],
  ['email not confirmed', 'err.notConfirmed'],
  ['user already registered', 'err.exists'],
  ['password should be at least', 'err.shortPassword'],
  ['rate limit', 'err.rateLimit'],
  ['duplicate key', 'err.duplicate'],
  ['failed to fetch', 'err.network'],
  ['network', 'err.network'],
];

export function humanizeError(error, t = (key) => translate('kk', key)) {
  if (!error) return '';
  const msg = (error.message || String(error)).toLowerCase();
  const hit = ERROR_KEYS.find(([needle]) => msg.includes(needle));
  if (hit) return t(hit[1]);
  return error.message || t('err.unknown');
}
