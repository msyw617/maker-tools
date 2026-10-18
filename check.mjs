// npm test: one hand-worked example per tool (the same numbers the page text quotes).
// Lye and pricing are safety/money paths — keep these green before every deploy.
import assert from 'node:assert/strict';
import { compute as fragrance } from './src/tools/candle-fragrance-load/calc.js';
import { compute as container } from './src/tools/candle-wax-for-container/calc.js';
import { compute as lye } from './src/tools/soap-lye-calculator/calc.js';
import { compute as mold } from './src/tools/resin-mold-volume/calc.js';
import { compute as yarn } from './src/tools/yarn-yardage/calc.js';
import { compute as gauge } from './src/tools/knitting-gauge-converter/calc.js';
import { compute as fabric } from './src/tools/fabric-yardage/calc.js';
import { compute as fdm } from './src/tools/3d-print-cost/calc.js';
import { compute as resinPrint } from './src/tools/resin-print-cost/calc.js';
import { compute as pricing } from './src/tools/handmade-pricing/calc.js';

function check(name, got, want) {
  for (const [k, w] of Object.entries(want)) {
    const g = typeof got[k] === 'number' ? Math.round(got[k] * 100) / 100 : got[k];
    assert.deepEqual(g, w, `${name}.${k}: got ${g}, want ${w}`);
  }
}

check('fragrance', fragrance({ wax: 500, load: 8 }), { fo: 40, total: 540 });

check('container', container({ water: 200, count: 1, load: 8, factor: 0.86 }), { fill: 172, wax: 159.26, fo: 12.74 });
check('container x4', container({ water: 200, count: 4, load: 8, factor: 0.86 }), { total: 688, wax: 637.04 });

const soap = { superfat: 5, conc: 33 };
check('lye olive', lye({ ...soap, oil_olive: 1000 }), { lye: 128.25, water: 260.39, batch: 1388.64 });
check('lye blend', lye({ ...soap, oil_olive: 500, oil_coconut: 300, oil_shea: 200 }), { oils: 1000, lye: 140.6 });
check('lye other ok', lye({ ...soap, other_w: 1000, other_sap: 0.135 }), { lye: 128.25 });
check('lye other no sap', lye({ ...soap, other_w: 100, other_sap: NaN }), { lye: NaN });
check('lye other KOH typed', lye({ ...soap, other_w: 100, other_sap: 0.19 * 1000 }), { lye: NaN });

check('mold rect', mold({ shape: 'rect', unit: 'cm', l: 10, w: 5, h: 2, count: 2, waste: 10, density: 1.1 }), { ml: 100, floz: 3.38, total: 220, grams: 242 });
check('mold cyl in', mold({ shape: 'cyl', unit: 'in', d: 3, h: 2, count: 1, waste: 0, density: 1.1 }), { ml: 231.67 });
check('mold water', mold({ shape: 'water', unit: 'cm', water: 150, count: 1, waste: 0, density: 1 }), { ml: 150 });

check('yarn', yarn({ sw: 10, sh: 10, sweight: 5, kweight: 100, klen: 200, pw: 50, pl: 150, pieces: 1, extra: 10 }), { grams: 412.5, length: 825, skeins: 5 });

check('gauge', gauge({ pg: 20, mg: 22, ps: 100, pr: 28, mr: 30, prow: 120 }), { sts: 110, width: -9.09, rows: 129, length: -6.67 });

const fab = { unit: 'in', pw: 10, pl: 12, count: 9, fw: 44, extra: 10 };
check('fabric grain', fabric({ ...fab, rotate: false }), { perRow: 4, length: 1.1, buy: '1 1/8' });
check('fabric rotate', fabric({ ...fab, rotate: true }), { perRow: 3, buy: '1' });
check('fabric cm', fabric({ unit: 'cm', pw: 25, pl: 30, count: 8, fw: 110, extra: 10, rotate: false }), { perRow: 4, length: 0.66, buy: 0.7, ma: 1 });
check('fabric too wide', fabric({ ...fab, pw: 50, rotate: false }), { perRow: NaN, buy: '—' });

check('fdm', fdm({ grams: 50, spoolPrice: 20, spoolGrams: 1000, hours: 3, watts: 120, kwh: 0.16, printerPrice: 300, lifeHours: 5000, fail: 5 }), { filament: 1, wear: 0.18, total: 1.3 });
check('fdm ko', fdm({ grams: 50, spoolPrice: 25000, spoolGrams: 1000, hours: 3, watts: 120, kwh: 150, printerPrice: 500000, lifeHours: 5000, fail: 5 }), { total: 1688.42 });
check('fdm no printer', fdm({ grams: 50, spoolPrice: 20, spoolGrams: 1000, hours: 3, watts: 120, kwh: 0.16, printerPrice: NaN, lifeHours: 5000, fail: 0 }), { wear: 0, total: 1.06 });

check('resin print', resinPrint({ ml: 30, bottlePrice: 30, bottleMl: 1000, waste: 10, hours: 2, watts: 60, kwh: 0.16, extras: 0.5, fail: 10 }), { resin: 0.99, total: 1.68 });
check('resin print ko', resinPrint({ ml: 30, bottlePrice: 35000, bottleMl: 1000, waste: 10, hours: 2, watts: 60, kwh: 150, extras: 500, fail: 10 }), { resin: 1155, total: 1858.89 });

check('pricing', pricing({ materials: 5, minutes: 30, rate: 20, overhead: 1, wholesaleX: 2, retailX: 2, feePct: 9.5, feeFixed: 0.45 }), { cost: 16, retail: 64, fees: 6.53, profit: 41.47 });
check('pricing ko', pricing({ materials: 5000, minutes: 30, rate: 12000, overhead: 1000, wholesaleX: 2, retailX: 2, feePct: 10, feeFixed: 0 }), { cost: 12000, retail: 48000, profit: 31200 });

console.log('all tool checks passed');
