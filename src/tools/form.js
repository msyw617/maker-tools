// Wires a tool <form>: reads named fields, runs compute(values), writes results into [data-out] elements.
// [data-show="field=a,b"] hides an element unless that field's value is a or b. [data-sign] shows +/-.
export function wire(id, compute) {
  const form = document.getElementById(id);
  const lang = document.documentElement.lang;
  const fmt = (n, sign) =>
    Number.isFinite(n) ? n.toLocaleString(lang, { maximumFractionDigits: 2, signDisplay: sign ? 'exceptZero' : 'auto' }) : '—';
  const read = (el) =>
    el.type === 'checkbox' ? el.checked : el.type === 'number' ? parseFloat(el.value) : isNaN(Number(el.value)) ? el.value : Number(el.value);
  function run() {
    const v = {};
    for (const el of form.elements) if (el.name) v[el.name] = read(el);
    for (const el of form.querySelectorAll('[data-show]')) {
      const [k, vals] = el.dataset.show.split('=');
      el.hidden = !vals.split(',').includes(String(v[k]));
    }
    for (const [k, val] of Object.entries(compute(v)))
      for (const el of form.querySelectorAll(`[data-out="${k}"]`))
        el.textContent = typeof val === 'number' ? fmt(val, el.hasAttribute('data-sign')) : val;
  }
  form.addEventListener('input', run);
  run();
}
