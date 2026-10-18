const ML_PER_FLOZ = 29.57353;

// Dilution % is measured against the carrier volume: the basis of the common "12 drops per 30 ml = 2%" charts.
export function compute({ unit, amount, pct, dpm }) {
  const ml = amount * (unit === 'floz' ? ML_PER_FLOZ : 1);
  const eo = (ml * pct) / 100;
  return { drops: Math.round(eo * dpm), eo, ml };
}
