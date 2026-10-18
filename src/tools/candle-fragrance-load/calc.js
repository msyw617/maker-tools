export function compute({ wax, load, unit }) {
  const fo = wax * (load / 100);
  return { fo, total: wax + fo, unit };
}
