import { fabricLength } from '../sewing.js';

// Backing = quilt top + extra on every side. Panels are sewn together; each seam uses 2 × seam allowance of width.
// Seams can run along the quilt's length or across it; the cheaper layout is what to buy.
export function compute({ unit, qw, ql, extra, fw, seam }) {
  const imperial = unit === 'in';
  const W = qw + 2 * extra;
  const L = ql + 2 * extra;
  const loss = 2 * seam;
  const panels = (span) => (span <= fw ? 1 : fw > loss ? Math.ceil((span - loss) / (fw - loss)) : NaN);
  const lengthwise = panels(W) * L;
  const crosswise = panels(L) * W;
  return {
    W,
    L,
    lengthwise: fabricLength(lengthwise, imperial).length,
    crosswise: fabricLength(crosswise, imperial).length,
    unit,
    ...fabricLength(Math.min(lengthwise, crosswise), imperial),
  };
}
