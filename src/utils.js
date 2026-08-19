export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function load(k, d) {
  try {
    const v = JSON.parse(localStorage.getItem(k));
    return v == null ? d : v;
  } catch (e) {
    return d;
  }
}

export function save(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) { /* sin almacenamiento disponible */ }
}

export const stripNikud = (s) => s.replace(/[֑-ׇ]/g, '');
