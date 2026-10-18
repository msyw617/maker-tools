const ML_PER_IN3 = 16.387064;
const G_PER_OZ = 28.349523;
const ML_PER_FLOZ = 29.57353; // US fluid ounce

export function compute({ shape, unit, l, w, h, d, water, count, waste, density }) {
  const imperial = unit === 'in';
  const k = imperial ? ML_PER_IN3 : 1;
  const ml =
    shape === 'rect' ? l * w * h * k
    : shape === 'cyl' ? Math.PI * (d / 2) ** 2 * h * k
    : water * (imperial ? G_PER_OZ : 1); // 1 g of water ≈ 1 ml
  const total = ml * count * (1 + waste / 100);
  return {
    ml,
    floz: ml / ML_PER_FLOZ,
    total,
    totalFloz: total / ML_PER_FLOZ,
    grams: total * density,
    dunit: imperial ? 'in' : 'cm',
    wunit: imperial ? 'oz' : 'g',
  };
}
