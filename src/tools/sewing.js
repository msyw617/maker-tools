// Shop-style rounding shared by the sewing and quilting tools.
const EIGHTHS = ['', '1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8'];

// Round up to the next 1/step; the epsilon keeps 0.8 × 10 at 8 instead of drifting to 9.
export const upTo = (n, step) => Math.ceil(n * step - 1e-9) / step;

// 1.125 → "1 1/8": shops cut by the eighth of a yard, and a decimal like 1.13 would be misread.
export function yards(n) {
  if (!Number.isFinite(n)) return '—';
  const e = Math.round(n * 8);
  const whole = Math.floor(e / 8);
  return [whole || '', EIGHTHS[e % 8]].filter(Boolean).join(' ') || '0';
}

// A raw fabric length in inches (imperial) or cm → exact length, what to buy, and Korean 마 (90 cm, sold by the half).
export function fabricLength(raw, imperial) {
  const length = imperial ? raw / 36 : raw / 100;
  return {
    length,
    buy: imperial ? yards(upTo(length, 8)) : upTo(length, 10),
    ma: upTo(((imperial ? raw * 2.54 : raw) / 90) * 2, 1) / 2,
    lunit: imperial ? 'yd' : 'm',
  };
}
