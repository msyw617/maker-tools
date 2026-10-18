// Fill weight = water weight × wax density factor. Fragrance shares that fill, so it is split out, not added on top.
export function compute({ water, count, load, factor, unit }) {
  const fill = water * factor;
  const total = fill * count;
  const wax = total / (1 + load / 100);
  return { fill, wax, fo: total - wax, total, unit };
}
