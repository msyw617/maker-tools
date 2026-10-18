const ML_PER_IN3 = 16.387064;
const ML_PER_GAL = 3785.411784; // US gallon

// Volume to fill (whole tabletop flood coat, or a river/void) split into part A and B by the kit's volume ratio.
export function compute({ unit, shape, l, w, d, depth, waste, ra, rb, maxPour }) {
  const imperial = unit === 'in';
  const area = shape === 'round' ? Math.PI * (d / 2) ** 2 : l * w;
  const ml = area * depth * (imperial ? ML_PER_IN3 : 1) * (1 + waste / 100);
  const total = imperial ? ml / ML_PER_GAL : ml / 1000; // gallons or litres
  return {
    total,
    other: imperial ? ml / 1000 : ml / ML_PER_GAL,
    partA: (total * ra) / (ra + rb),
    partB: (total * rb) / (ra + rb),
    pours: Math.ceil(depth / maxPour - 1e-9),
    vunit: imperial ? 'gal' : 'L',
    ounit: imperial ? 'L' : 'gal',
    dunit: imperial ? 'in' : 'cm',
  };
}
