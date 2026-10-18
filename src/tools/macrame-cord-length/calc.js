// Per-strand rule of thumb: 4× the finished length for open work, 5× for tight knots, 6× for complex knots,
// plus the fringe. Cords folded over a dowel or ring are cut double. Lengths in cm or in; totals in m or yd.
export function compute({ unit, finished, fringe, density, folded, count, extra, roll }) {
  const imperial = unit === 'in';
  const cut = (finished * density + (fringe || 0)) * (folded ? 2 : 1) * (1 + extra / 100);
  const total = (cut * count) / (imperial ? 36 : 100);
  return { cut, total, rolls: roll > 0 ? Math.ceil(total / roll - 1e-9) : NaN, unit, lunit: imperial ? 'yd' : 'm' };
}
