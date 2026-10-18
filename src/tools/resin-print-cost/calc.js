// Cost of one *successful* resin print; consumables (IPA, gloves, FEP, LCD share) are a flat per-print amount.
export function compute({ ml, bottlePrice, bottleMl, waste, hours, watts, kwh, extras, fail }) {
  const resin = (ml * (1 + (waste || 0) / 100) * bottlePrice) / bottleMl;
  const power = ((hours * watts) / 1000) * kwh;
  const keep = 1 - (fail || 0) / 100;
  return { resin, power, total: keep > 0 ? (resin + power + (extras || 0)) / keep : NaN };
}
