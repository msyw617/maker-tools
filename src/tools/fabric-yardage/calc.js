const EIGHTHS = ['', '1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8'];
const upTo = (n, step) => Math.ceil(n * step - 1e-9) / step; // epsilon: 0.8 × 10 must stay 8, not round up to 9

// 1.125 → "1 1/8": shops cut by the eighth of a yard, and a decimal like 1.13 would be misread.
function yards(n) {
  if (!Number.isFinite(n)) return '—';
  const e = Math.round(n * 8);
  const whole = Math.floor(e / 8);
  return [whole || '', EIGHTHS[e % 8]].filter(Boolean).join(' ') || '0';
}

// Identical rectangles laid in rows across the fabric width; piece length runs along the grain
// unless rotating is allowed, in which case the shorter of both layouts wins.
export function compute({ unit, pw, pl, count, fw, rotate, extra }) {
  const layout = (across, along) => {
    const perRow = Math.floor(fw / across);
    return perRow > 0 ? { perRow, len: Math.ceil(count / perRow) * along } : null;
  };
  const opts = [layout(pw, pl), rotate && layout(pl, pw)].filter(Boolean);
  const best = opts.length ? opts.reduce((a, b) => (b.len < a.len ? b : a)) : { perRow: NaN, len: NaN };
  const raw = best.len * (1 + extra / 100);
  const imperial = unit === 'in';
  const length = imperial ? raw / 36 : raw / 100;
  return {
    perRow: best.perRow,
    length,
    buy: imperial ? yards(upTo(length, 8)) : upTo(length, 10),
    ma: upTo(((imperial ? raw * 2.54 : raw) / 90) * 2, 1) / 2, // 1마 = 90 cm, sold by the half
    unit,
    lunit: imperial ? 'yd' : 'm',
  };
}
