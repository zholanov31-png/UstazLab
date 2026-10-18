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
