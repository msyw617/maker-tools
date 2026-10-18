const CM3_PER_IN3 = 16.387064;
const G_PER_OZ = 28.349523;
// Soapmakers' rule of thumb: 0.40 oz of oils fills one cubic inch of mold once lye and water are added (≈ 0.69 g/cm³).
const OZ_PER_IN3 = 0.4;

export function compute({ unit, shape, l, w, h, d, count, adjust }) {
  const imperial = unit === 'in';
  const vol = shape === 'cyl' ? Math.PI * (d / 2) ** 2 * h : l * w * h;
  const k = imperial ? OZ_PER_IN3 : (OZ_PER_IN3 * G_PER_OZ) / CM3_PER_IN3;
  const perMold = vol * k * (adjust / 100);
  return {
    vol,
    perMold,
    total: perMold * count,
    dunit: imperial ? 'in' : 'cm',
    vunit: imperial ? 'in³' : 'cm³',
    wunit: imperial ? 'oz' : 'g',
  };
}
