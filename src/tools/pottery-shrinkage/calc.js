// Linear shrinkage: fired = wet × (1 − s). Working backwards, the size to make = target ÷ (1 − s).
// A test tile marked wet and measured after firing gives the clay body's own rate.
export function compute({ mode, size, s, tileWet, tileFired, unit }) {
  const k = 1 - s / 100;
  const toFired = mode === 'toFired';
  return {
    result: toFired ? size * k : size / k,
    scale: (toFired ? k : 1 / k) * 100,
    measured: tileWet > 0 && tileFired > 0 ? ((tileWet - tileFired) / tileWet) * 100 : NaN,
    unit,
  };
}
