// Cost of one *successful* print: failed attempts are spread over the good ones (÷ success rate).
export function compute({ grams, spoolPrice, spoolGrams, hours, watts, kwh, printerPrice, lifeHours, fail }) {
  const filament = (grams * spoolPrice) / spoolGrams;
  const power = ((hours * watts) / 1000) * kwh;
  const wear = printerPrice > 0 ? (hours * printerPrice) / lifeHours : 0;
  const keep = 1 - (fail || 0) / 100;
  return { filament, power, wear, total: keep > 0 ? (filament + power + wear) / keep : NaN };
}
