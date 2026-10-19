// Жұптастырылған (paired) салыстыру үшін қарапайым статистика.
// Диссертациядағы түпкілікті талдауды SPSS/JASP-та қайталаңыз —
// бұл тек жедел шолуға арналған.

export function mean(xs) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN;
}

export function sd(xs) {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
}

// pre/post жұптары бойынша: n, орташалар, айырма, t, df, Коэннің dz
export function pairedSummary(pairs) {
  const n = pairs.length;
  const pre = pairs.map((p) => p[0]);
  const post = pairs.map((p) => p[1]);
  const diffs = pairs.map((p) => p[1] - p[0]);
  const mDiff = mean(diffs);
  const sDiff = sd(diffs);
  const t = n > 1 && sDiff > 0 ? mDiff / (sDiff / Math.sqrt(n)) : NaN;
  return {
    n,
    meanPre: mean(pre),
    meanPost: mean(post),
    meanDiff: mDiff,
    sdDiff: sDiff,
    t,
    df: n - 1,
    dz: sDiff > 0 ? mDiff / sDiff : NaN,
  };
}

// Стандартты қалыпты үлестірімнің жинақталған функциясы (Abramowitz–Stegun 7.1.26)
function normCdf(z) {
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(z * z) / 2);
  return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
}

// Манн–Уитни U (екі тәуелсіз топ), қалыпты жуықтау + байланыстарға түзету.
// Шағын топтарда (n < 8) p мәні шамамен ғана — қорытындыны JASP-та тексеріңіз.
export function mannWhitney(a, b) {
  const n1 = a.length;
  const n2 = b.length;
  if (n1 < 2 || n2 < 2) return { n1, n2, U: NaN, z: NaN, p: NaN, r: NaN };
  const all = [...a.map((v) => ({ v, g: 0 })), ...b.map((v) => ({ v, g: 1 }))].sort((x, y) => x.v - y.v);
  const ranks = new Array(all.length);
  let tieTerm = 0;
  for (let i = 0; i < all.length; ) {
    let j = i;
    while (j + 1 < all.length && all[j + 1].v === all[i].v) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) ranks[k] = avg;
    const t = j - i + 1;
    tieTerm += t ** 3 - t;
    i = j + 1;
  }
  const R1 = all.reduce((s, x, i) => s + (x.g === 0 ? ranks[i] : 0), 0);
  const U1 = R1 - (n1 * (n1 + 1)) / 2;
  const U = Math.min(U1, n1 * n2 - U1);
  const N = n1 + n2;
  const sigma = Math.sqrt(((n1 * n2) / 12) * (N + 1 - tieTerm / (N * (N - 1))));
  const z = sigma > 0 ? (U1 - (n1 * n2) / 2) / sigma : NaN;
  const p = Number.isFinite(z) ? 2 * (1 - normCdf(Math.abs(z))) : NaN;
  return { n1, n2, U, z, p, r: Number.isFinite(z) ? Math.abs(z) / Math.sqrt(N) : NaN };
}

export const fmt = (x, digits = 1) => (Number.isFinite(x) ? x.toFixed(digits) : '—');

// Excel (қазақ/орыс локалі) дұрыс ашуы үшін: UTF-8 BOM + нүктелі үтір
export function downloadCsv(filename, rows) {
  const escape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = rows.map((r) => r.map(escape).join(';')).join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
