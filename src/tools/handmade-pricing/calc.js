// Classic craft pricing: cost × 2 = wholesale, wholesale × 2 = retail. Labour is part of cost,
// so profit is what the business keeps after paying the maker's hourly rate.
export function compute({ materials, minutes, rate, overhead, wholesaleX, retailX, feePct, feeFixed }) {
  const labor = (minutes / 60) * rate;
  const cost = materials + labor + (overhead || 0);
  const wholesale = cost * wholesaleX;
  const retail = wholesale * retailX;
  const fees = (retail * (feePct || 0)) / 100 + (feeFixed || 0);
  return { labor, cost, wholesale, retail, fees, profit: retail - fees - cost };
}
