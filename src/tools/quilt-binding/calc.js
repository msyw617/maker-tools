import { fabricLength } from '../sewing.js';

// Straight-grain binding cut across the fabric width. A diagonal join uses about one strip width of each strip;
// a straight join uses two 1/4 in seam allowances (about 0.5 in, or 1.3 cm).
export function compute({ unit, qw, ql, strip, fw, join, extra }) {
  const imperial = unit === 'in';
  const total = 2 * (qw + ql) + extra;
  const usable = fw - (join === 'diagonal' ? strip : imperial ? 0.5 : 1.3);
  const strips = usable > 0 ? Math.ceil(total / usable) : NaN;
  return { total, strips, unit, ...fabricLength(strips * strip, imperial) };
}
