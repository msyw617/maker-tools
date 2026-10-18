import { fabricLength } from '../sewing.js';

// Waist radius r = waist ÷ (2π × fraction of a circle); the waist is cut one seam allowance inside r.
// Bounding piece for cutting in one piece: full and 3/4 circles need a 2R square, a half 2R × R, a quarter R × R.
export function compute({ unit, waist, length, type, sa, hem, fw }) {
  const r = waist / (2 * Math.PI * type);
  const R = r + length + hem;
  const [a, b] = [type >= 0.75 ? 2 * R : R, type >= 0.5 ? 2 * R : R].sort((x, y) => x - y);
  const raw = fw >= b ? a : fw >= a ? b : NaN; // NaN: wider than the fabric, so it needs panels
  return { r, cutR: r - sa, R, pieceA: a, pieceB: b, unit, ...fabricLength(raw, unit === 'in') };
}
