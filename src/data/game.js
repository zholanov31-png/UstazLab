// =====================================================================
// ОЙЫН МЕХАНИКАСЫ (DGBL): тәжірибе ұпайы (XP), деңгейлер, бейдждер
// ---------------------------------------------------------------------
// XP тек белсенділік үшін беріледі. Диагностиканың (pre/post) балы
// XP-ге ӘСЕР ЕТПЕЙДІ — өлшеу құралы ойыннан тәуелсіз болуы керек.
// =====================================================================
import { courseModules } from './modules';

export const XP = {
  pre: 50,          // кіріс диагностиканы тапсыру
  post: 50,         // шығыс диагностиканы тапсыру
  scenario: 10,     // жағдаятқа жауап беру
  bestBonus: 5,     // ұсынылатын нұсқаны таңдау
  task: 60,         // практикалық тапсырма
  reflection: 40,   // рефлексия
};

export const LEVELS = [
  { min: 0, name: 'Жас ұстаз' },
  { min: 150, name: 'Ізденуші' },
  { min: 350, name: 'Әдіскер' },
  { min: 600, name: 'Шебер ұстаз' },
  { min: 900, name: 'Жаңашыл ұстаз' },
];

export function levelFor(xp) {
  let idx = 0;
  LEVELS.forEach((l, i) => { if (xp >= l.min) idx = i; });
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1] || null;
  const progress = next ? (xp - current.min) / (next.min - current.min) : 1;
  return { index: idx + 1, ...current, next, progress };
}

// Барлық бейдждер (иконкалар Dashboard-та беріледі)
export const BADGES = [
  { key: 'start', name: 'Алғашқы қадам', desc: 'Кіріс диагностиканы тапсырдыңыз' },
  ...courseModules.map((m) => ({ key: m.badge.key, name: m.badge.name, desc: `${m.method} модулін аяқтадыңыз` })),
  { key: 'sharp', name: 'Дәл көз', desc: 'Бір модульдің барлық жағдаятында ұсынылатын нұсқаны таңдадыңыз' },
  { key: 'finish', name: 'Жол соңы', desc: 'Шығыс диагностиканы тапсырып, курсты аяқтадыңыз' },
];

// responses: [{ module_id, question_index, option_index }]
// submissions, reflections: [module_id, ...]
export function computeGame({ pre, post, responses, submissions, reflections }) {
  let xp = 0;
  if (pre) xp += XP.pre;
  if (post) xp += XP.post;

  const earned = new Set();
  if (pre) earned.add('start');
  if (post) earned.add('finish');

  for (const mod of courseModules) {
    if (!mod.ready) continue;
    const own = responses.filter((r) => r.module_id === mod.id);
    let bestCount = 0;
    for (const r of own) {
      xp += XP.scenario;
      if (mod.scenarios[r.question_index]?.best === r.option_index) {
        xp += XP.bestBonus;
        bestCount++;
      }
    }
    if (bestCount > 0 && bestCount === mod.scenarios.length) earned.add('sharp');
    if (submissions.includes(mod.id)) xp += XP.task;
    if (reflections.includes(mod.id)) {
      xp += XP.reflection;
      earned.add(mod.badge.key);
    }
  }

  return { xp, level: levelFor(xp), badges: BADGES.map((b) => ({ ...b, earned: earned.has(b.key) })) };
}
