import { upTo, fabricLength } from '../sewing.js';

// Continuous bias: a square of side S yields about S² ÷ strip width of bias strip.
// The square is rounded up to the next 1/2 in or whole cm so it can be cut with a ruler.
export function compute({ unit, need, strip, extra, fw }) {
  const imperial = unit === 'in';
  const side = upTo(Math.sqrt(need * (1 + extra / 100) * strip), imperial ? 2 : 1);
  return { side, yieldLen: (side * side) / strip, unit, ...fabricLength(side <= fw ? side : NaN, imperial) };
}
