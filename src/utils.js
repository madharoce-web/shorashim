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

/* audio (hebreo, si el sistema tiene voz he-IL) */
let heVoice = null;
function pickVoice() {
  try {
    const vs = speechSynthesis.getVoices();
    heVoice = vs.find((v) => (v.lang || '').toLowerCase().startsWith('he')) || null;
  } catch (e) { /* sin voces */ }
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}

export function speak(text) {
  if (!('speechSynthesis' in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'he-IL';
    if (heVoice) u.voice = heVoice;
    u.rate = 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) { /* ignorar */ }
}
