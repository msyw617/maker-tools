// Gauges are counts over the same width (10 cm or 4 in), so units cancel out.
export function compute({ pg, mg, ps, pr, mr, prow }) {
  return {
    sts: Math.round((ps * mg) / pg),
    width: (pg / mg - 1) * 100,
    rows: Math.round((prow * mr) / pr),
    length: (pr / mr - 1) * 100,
  };
}
