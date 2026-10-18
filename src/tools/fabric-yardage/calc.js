import { fabricLength } from '../sewing.js';

// Identical rectangles laid in rows across the fabric width; piece length runs along the grain
// unless rotating is allowed, in which case the shorter of both layouts wins.
export function compute({ unit, pw, pl, count, fw, rotate, extra }) {
  const layout = (across, along) => {
    const perRow = Math.floor(fw / across);
    return perRow > 0 ? { perRow, len: Math.ceil(count / perRow) * along } : null;
  };
  const opts = [layout(pw, pl), rotate && layout(pl, pw)].filter(Boolean);
  const best = opts.length ? opts.reduce((a, b) => (b.len < a.len ? b : a)) : { perRow: NaN, len: NaN };
  return { perRow: best.perRow, unit, ...fabricLength(best.len * (1 + extra / 100), unit === 'in') };
}
