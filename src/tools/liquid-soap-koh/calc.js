import { OILS } from '../soap-lye-calculator/calc.js';

// KOH SAP = NaOH SAP × 1.403 (molar mass 56.1 ÷ 40.0). Hobby KOH is usually sold about 90% pure,
// so the weighed amount is divided by the purity. Water is set from the lye concentration of the weighed KOH.
const KOH_PER_NAOH = 1.403;

export function compute(v) {
  let oils = 0;
  let koh = 0;
  for (const o of OILS) {
    const w = v[`oil_${o.id}`] || 0;
    oils += w;
    koh += w * o.sap * KOH_PER_NAOH;
  }
  koh = (koh * (1 - v.superfat / 100)) / (v.purity / 100);
  const water = (koh * (100 - v.conc)) / v.conc;
  return { oils, koh, water, batch: oils + koh + water, unit: v.unit };
}
