import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;

// Supabase қателерін қазақша түсінікті хабарламаға айналдыру
export function humanizeError(error) {
  if (!error) return '';
  const msg = (error.message || String(error)).toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Пошта немесе құпиясөз қате.';
  if (msg.includes('email not confirmed')) return 'Поштаңызды растаңыз: кіріс жәшігіндегі хаттағы сілтемені басыңыз.';
  if (msg.includes('user already registered')) return 'Бұл поштамен аккаунт бұрыннан бар. «Кіру» бетін қолданыңыз.';
  if (msg.includes('password should be at least')) return 'Құпиясөз кемінде 6 таңбадан тұруы керек.';
  if (msg.includes('rate limit')) return 'Тым көп әрекет. Бірнеше минуттан кейін қайталаңыз.';
  if (msg.includes('duplicate key')) return 'Бұл нәтиже бұрын сақталған.';
  if (msg.includes('failed to fetch') || msg.includes('network')) return 'Интернет байланысын тексеріңіз.';
  return error.message || 'Белгісіз қате орын алды.';
}
