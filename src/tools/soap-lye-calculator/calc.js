// NaOH SAP = grams of NaOH per gram of oil. Only oils where the From Nature With Love table
// (KOH SAP ÷ 1402.5) and SoapCalc agree within ~0.003 are listed; superfat covers that spread.
export const OILS = [
  { id: 'olive', sap: 0.135, en: 'Olive oil', ko: '올리브 오일' },
  { id: 'coconut', sap: 0.183, en: 'Coconut oil (76°F)', ko: '코코넛 오일' },
  { id: 'palm', sap: 0.141, en: 'Palm oil', ko: '팜 오일' },
  { id: 'shea', sap: 0.128, en: 'Shea butter', ko: '시어버터' },
  { id: 'cocoa', sap: 0.138, en: 'Cocoa butter', ko: '코코아버터' },
  { id: 'castor', sap: 0.129, en: 'Castor oil', ko: '피마자(캐스터) 오일' },
  { id: 'almond', sap: 0.136, en: 'Sweet almond oil', ko: '스위트아몬드 오일' },
  { id: 'avocado', sap: 0.133, en: 'Avocado oil', ko: '아보카도 오일' },
  { id: 'sunflower', sap: 0.135, en: 'Sunflower oil', ko: '해바라기씨 오일' },
  { id: 'canola', sap: 0.124, en: 'Canola (rapeseed) oil', ko: '카놀라(유채) 오일' },
  { id: 'hemp', sap: 0.136, en: 'Hemp seed oil', ko: '햄프씨드 오일' },
  { id: 'mango', sap: 0.137, en: 'Mango butter', ko: '망고버터' },
  { id: 'lard', sap: 0.138, en: 'Lard', ko: '라드(돼지기름)' },
  { id: 'tallow', sap: 0.14, en: 'Beef tallow', ko: '우지(소기름)' },
];

export function compute(v) {
  let oils = 0;
  let lye = 0;
  for (const o of OILS) {
    const w = v[`oil_${o.id}`] || 0;
    oils += w;
    lye += w * o.sap;
  }
  const ow = v.other_w || 0;
  const os = v.other_sap;
  // An "other" oil without a plausible NaOH SAP (KOH value or mg/g typed by mistake) would understate lye: refuse.
  if (ow > 0 && !(os > 0.03 && os < 0.3)) lye = NaN;
  oils += ow;
  lye = (lye + ow * (os || 0)) * (1 - v.superfat / 100);
  const water = (lye * (100 - v.conc)) / v.conc;
  return { oils, lye, water, batch: oils + lye + water, unit: v.unit };
}
