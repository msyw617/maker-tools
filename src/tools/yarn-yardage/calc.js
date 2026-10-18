// Swatch method: project area ÷ swatch area tells how many swatches' worth of yarn the project uses.
export function compute({ sw, sh, sweight, kweight, klen, pw, pl, pieces, extra, dunit, lunit }) {
  const ratio = (pw * pl * pieces) / (sw * sh);
  const grams = ratio * sweight * (1 + extra / 100);
  const length = (grams / kweight) * klen;
  return { length, grams, skeins: Math.ceil(length / klen), dunit, lunit };
}
