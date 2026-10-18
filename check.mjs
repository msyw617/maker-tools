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

// Batch 2
import { compute as soapMold } from './src/tools/soap-mold-oil/calc.js';
import { compute as backing } from './src/tools/quilt-backing/calc.js';
import { compute as binding } from './src/tools/quilt-binding/calc.js';
import { compute as eo } from './src/tools/essential-oil-dilution/calc.js';
import { compute as epoxy } from './src/tools/epoxy-table/calc.js';
import { compute as macrame } from './src/tools/macrame-cord-length/calc.js';
import { compute as pottery } from './src/tools/pottery-shrinkage/calc.js';
import { compute as skirt } from './src/tools/circle-skirt/calc.js';
import { compute as bias } from './src/tools/bias-binding/calc.js';
import { compute as koh } from './src/tools/liquid-soap-koh/calc.js';

check('soap mold in', soapMold({ unit: 'in', shape: 'rect', l: 12, w: 3.5, h: 2.5, count: 1, adjust: 100 }), { vol: 105, total: 42 });
check('soap mold cm', soapMold({ unit: 'cm', shape: 'rect', l: 30, w: 9, h: 6, count: 2, adjust: 100 }), { perMold: 1121.04, total: 2242.07 });

check('backing', backing({ unit: 'in', qw: 60, ql: 80, extra: 4, fw: 42, seam: 0.5 }), { W: 68, L: 88, buy: '5' });
check('backing wide', backing({ unit: 'in', qw: 60, ql: 80, extra: 4, fw: 108, seam: 0.5 }), { crosswise: 1.89, buy: '2' });
check('backing cm', backing({ unit: 'cm', qw: 150, ql: 200, extra: 10, fw: 110, seam: 1.5 }), { buy: 4.4, ma: 5 });

check('binding', binding({ unit: 'in', qw: 60, ql: 80, strip: 2.5, fw: 42, join: 'diagonal', extra: 10 }), { total: 290, strips: 8, buy: '5/8' });
check('binding straight', binding({ unit: 'in', qw: 60, ql: 80, strip: 2.5, fw: 42, join: 'straight', extra: 10 }), { strips: 7, buy: '1/2' });

check('eo', eo({ unit: 'ml', amount: 30, pct: 2, dpm: 20 }), { drops: 12, eo: 0.6 });

check('epoxy', epoxy({ unit: 'in', shape: 'rect', l: 60, w: 36, depth: 0.125, waste: 0, ra: 1, rb: 1, maxPour: 0.125 }), { total: 1.17, pours: 1 });
check('epoxy deep', epoxy({ unit: 'in', shape: 'rect', l: 60, w: 36, depth: 1, waste: 10, ra: 2, rb: 1, maxPour: 0.25 }), { partA: 6.86, partB: 3.43, pours: 4 });
check('epoxy cm', epoxy({ unit: 'cm', shape: 'rect', l: 150, w: 90, depth: 0.3, waste: 0, ra: 1, rb: 1, maxPour: 0.3 }), { total: 4.05 });

check('macrame', macrame({ unit: 'cm', finished: 60, fringe: 15, density: 5, folded: true, count: 12, extra: 10, roll: 100 }), { cut: 693, total: 83.16, rolls: 1 });

check('pottery', pottery({ mode: 'toFired', size: 10, s: 12, tileWet: 10, tileFired: 8.8 }), { result: 8.8, measured: 12 });
check('pottery back', pottery({ mode: 'toWet', size: 10, s: 12, tileWet: NaN, tileFired: NaN }), { result: 11.36, measured: NaN });

check('skirt', skirt({ unit: 'cm', waist: 70, length: 60, type: 1, sa: 1.5, hem: 2.5, fw: 150 }), { r: 11.14, cutR: 9.64, R: 73.64, buy: 1.5 });
check('skirt half', skirt({ unit: 'in', waist: 28, length: 22, type: 0.5, sa: 0.625, hem: 1, fw: 44 }), { pieceA: 31.91, pieceB: 63.83, buy: '1 7/8' });
check('skirt too wide', skirt({ unit: 'in', waist: 28, length: 40, type: 1, sa: 0.625, hem: 1, fw: 60 }), { buy: '—' });

check('bias', bias({ unit: 'in', need: 290, strip: 2.5, extra: 10, fw: 42 }), { side: 28.5, yieldLen: 324.9, buy: '7/8' });

check('koh', koh({ unit: 'g', oil_olive: 1000, superfat: 3, purity: 90, conc: 25 }), { koh: 204.14, water: 612.41 });
check('koh blend', koh({ unit: 'g', oil_olive: 400, oil_coconut: 300, oil_castor: 150, oil_sunflower: 150, superfat: 3, purity: 90, conc: 25 }), { oils: 1000, koh: 224.55 });

console.log('all tool checks passed');
