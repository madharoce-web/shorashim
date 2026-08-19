import { useState, useEffect, useRef, useMemo } from 'react';
import { WORDS, N, sameMeaning } from '../words';
import { load, save, shuffle } from '../utils';
import { T } from '../i18n';

const ROUND = 7;
const RECAP_EVERY = 20;

function loadLDATA() {
  let d = load('shx_learn', null);
  if (!d || typeof d !== 'object' || Array.isArray(d) || !d.levels) {
    /* migración desde el formato antiguo (mapa plano de niveles) */
    d = { levels: (d && typeof d === 'object' && !Array.isArray(d)) ? d : {}, wrong: {}, qcount: 0 };
  }
  d.wrong = d.wrong || {};
  d.qcount = d.qcount || 0;
  return d;
}

function failedPool(d) {
  return Object.keys(d.wrong).map(Number)
    .filter((i) => i >= 0 && i < N && d.wrong[i] > 0)
    .sort((a, b) => d.wrong[b] - d.wrong[a]);
}

/* almacenes a nivel de módulo: la ronda sobrevive al cambio de pestaña */
let lrStore = null;
let prevMastered = null;

const idleLR = () => ({ phase: 'idle', round: [], qi: 0, hits: 0, cur: null, recap: false, roundId: 0 });

function buildQ(round, qi, recap, roundId, hits) {
  const w = round[qi];
  const others = [];
  for (let i = 0; i < N; i++) if (i !== w && !sameMeaning(i, w)) others.push(i);
  shuffle(others);
  const opts = shuffle([w, ...others.slice(0, 3)]);
  return { phase: 'question', round, qi, hits, recap, roundId, cur: { w, opts, chosen: null, state: 'ask' } };
}

export default function LearnView({ active, lang }) {
  const t = T[lang];
  const [ld, setLD] = useState(loadLDATA);
  const [lr, setLR] = useState(() => lrStore || idleLR());
  const ldRef = useRef(ld); ldRef.current = ld;
  const lrRef = useRef(lr); lrRef.current = lr;
  useEffect(() => { lrStore = lr; }, [lr]);

  const saveLD = (next) => { setLD(next); save('shx_learn', next); };

  const mastered = useMemo(() => {
    let c = 0;
    for (let i = 0; i < N; i++) if ((ld.levels[i] || 0) >= 2) c++;
    return c;
  }, [ld]);
  const pct = useMemo(() => {
    let s = 0;
    for (let i = 0; i < N; i++) s += Math.min(ld.levels[i] || 0, 2);
    return s / (2 * N);
  }, [ld]);
  const pop = prevMastered != null && mastered > prevMastered;
  useEffect(() => { prevMastered = mastered; }, [mastered]);

  function startRound() {
    let d = ldRef.current;
    /* cada ~20 preguntas: ronda de repaso con las más falladas */
    if (d.qcount >= RECAP_EVERY) {
      d = { ...d, qcount: 0 };
      saveLD(d);
      const failed = failedPool(d);
      if (failed.length) {
        setLR(buildQ(failed.slice(0, ROUND), 0, true, Date.now(), 0));
        return;
      }
    }
    /* ronda normal: mezcla términos ya vistos (nivel 1) con nuevos */
    const news = [], rev = [];
    for (let i = 0; i < N; i++) {
      const lvl = d.levels[i] || 0;
      if (lvl === 0) news.push(i); else if (lvl === 1) rev.push(i);
    }
    if (!news.length && !rev.length) {
      setLR((l) => ({ ...l, phase: 'done' }));
      return;
    }
    shuffle(news); shuffle(rev);
    const round = rev.slice(0, 4);
    round.push(...news.slice(0, ROUND - round.length));
    if (round.length < ROUND) round.push(...rev.slice(4, 4 + (ROUND - round.length)));
    shuffle(round);
    setLR(buildQ(round, 0, false, Date.now(), 0));
  }

  function nextQ() {
    const l = lrRef.current;
    const qi = l.qi + 1;
    if (qi >= l.round.length) setLR({ ...l, phase: 'roundEnd' });
    else setLR(buildQ(l.round, qi, l.recap, l.roundId, l.hits));
  }

  function answer(k) {
    const l = lrRef.current;
    const cur = l.cur;
    if (!cur || cur.state !== 'ask') return;
    const d = ldRef.current;
    const nd = { ...d, levels: { ...d.levels }, wrong: { ...d.wrong }, qcount: d.qcount + 1 };
    const ok = cur.opts[k] === cur.w;
    if (ok) {
      nd.levels[cur.w] = Math.min((nd.levels[cur.w] || 0) + 1, 2);
      if (nd.wrong[cur.w]) nd.wrong[cur.w]--;
      const ncur = { ...cur, chosen: k, state: 'good' };
      saveLD(nd);
      setLR({ ...l, hits: l.hits + 1, cur: ncur });
      setTimeout(() => { if (lrRef.current.cur === ncur) nextQ(); }, 1000);
    } else {
      nd.levels[cur.w] = 0;
      nd.wrong[cur.w] = (nd.wrong[cur.w] || 0) + 1;
      saveLD(nd);
      setLR({ ...l, cur: { ...cur, chosen: k, state: 'bad' } });
    }
  }

  function dontKnow() {
    const l = lrRef.current;
    const cur = l.cur;
    if (!cur || cur.state !== 'ask') return;
    const d = ldRef.current;
    const nd = { ...d, levels: { ...d.levels }, wrong: { ...d.wrong }, qcount: d.qcount + 1 };
    nd.levels[cur.w] = 0;
    nd.wrong[cur.w] = (nd.wrong[cur.w] || 0) + 1;
    saveLD(nd);
    setLR({ ...l, cur: { ...cur, chosen: -1, state: 'dk' } });
  }

  function resetAll() {
    if (!confirm(t.confirmReset)) return;
    saveLD({ levels: {}, wrong: {}, qcount: 0 });
    setLR(idleLR());
  }

  /* arrancar la primera ronda al entrar */
  useEffect(() => {
    if (active && lrRef.current.phase === 'idle') startRound();
  }, [active]);
  /* si se reinicia el progreso estando activa la vista */
  useEffect(() => {
    if (active && lr.phase === 'idle') startRound();
  }, [lr.phase]);

  /* teclado: 1-4 responde, Enter/Espacio continúa */
  const fnRef = useRef({}); fnRef.current = { active, answer, nextQ, startRound };
  useEffect(() => {
    const h = (e) => {
      const s = fnRef.current;
      if (!s.active) return;
      if (e.target.matches('input,select,textarea')) return;
      const l = lrRef.current;
      if (/^Digit[1-4]$/.test(e.code)) {
        const k = +e.code.slice(5) - 1;
        if (l.cur && l.cur.state === 'ask' && k < l.cur.opts.length) s.answer(k);
      } else if (e.code === 'Enter' || e.code === 'Space') {
        if (l.phase === 'roundEnd') { e.preventDefault(); s.startRound(); }
        else if (l.cur && (l.cur.state === 'bad' || l.cur.state === 'dk')) { e.preventDefault(); s.nextQ(); }
      }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  const segFills = [];
  for (let s = 0; s < 6; s++) segFills.push(Math.min(Math.max(pct * 6 - s, 0), 1) * 100);

  const header = (
    <div className="learn-top">
      <div className={`lbadge g${pop ? ' pop' : ''}`} key={mastered} title={t.masteredTitle}>{mastered}</div>
      <div className="segs">
        {segFills.map((f, s) => (
          <div className="seg" key={s}><i style={{ width: `${f}%` }} /></div>
        ))}
      </div>
      <div className="lbadge t" title={t.totalTitle}>{N}</div>
    </div>
  );

  const resetLink = (
    <div className="learn-reset">
      <button onClick={resetAll}>{t.resetLearn}</button>
    </div>
  );

  if (lr.phase === 'done') {
    return (
      <>
        {header}
        <div className="card learn-end">
          <h2>{t.allMastered(N)}</h2>
          <p>{t.learnDoneText}</p>
          <button className="btn primary" onClick={resetAll}>{t.resetProgress}</button>
        </div>
      </>
    );
  }

  if (lr.phase === 'roundEnd') {
    const recapNext = ld.qcount >= RECAP_EVERY && failedPool(ld).length > 0;
    return (
      <>
        {header}
        <div className="card learn-end">
          <h2>{lr.recap ? t.recapDone : t.roundComplete}</h2>
          <p>
            {t.hitsRound} <b style={{ color: 'var(--green)' }}>{lr.hits}</b> {t.of} {lr.round.length}
            {' · '}{t.masteredTot} <b>{mastered} / {N}</b>
          </p>
          {recapNext && (
            <p style={{ color: 'var(--orange)', fontWeight: 600 }}>
              {t.recapNext}
            </p>
          )}
          <button className="btn primary" onClick={startRound}>{t.cont}</button>
        </div>
        {resetLink}
      </>
    );
  }

  if (!lr.cur) return <>{header}</>;

  const cur = lr.cur;
  const w = WORDS[cur.w];
  const answered = cur.state !== 'ask';

  return (
    <>
      {header}
      <div className="card qcard anim" key={`${lr.roundId}-${lr.qi}`}>
        <div className="qhead">
          {t.term}
          {lr.recap && <span className="recap-chip">{t.recapChip}</span>}
          <span style={{ marginLeft: 'auto' }}>{lr.qi + 1} / {lr.round.length}</span>
        </div>
        <div className="qword he">{w.he}</div>
        {cur.state === 'ask' && <div className="qprompt">{t.selectAnswer}</div>}
        {cur.state === 'good' && <div className="qprompt good">{t.good[cur.w % t.good.length]}</div>}
        {(cur.state === 'bad' || cur.state === 'dk') && (
          <div className="qprompt bad">{t.wrongMsg}</div>
        )}
        <div className="opts">
          {cur.opts.map((o, k) => {
            let cls = 'opt';
            if (answered) {
              if (o === cur.w) cls += ' good';
              else if (k === cur.chosen) cls += ' bad';
              else cls += ' dim';
            }
            return (
              <button key={k} className={cls} disabled={answered} onClick={() => answer(k)}>
                <span className="num">{k + 1}</span>
                <span>{WORDS[o][lang]}</span>
              </button>
            );
          })}
        </div>
        <div className="qfoot">
          {cur.state === 'ask' && (
            <button className="linkbtn" onClick={dontKnow}>{t.dontKnow}</button>
          )}
          {(cur.state === 'bad' || cur.state === 'dk') && (
            <button className="btn primary" onClick={nextQ}>{t.cont}</button>
          )}
        </div>
      </div>
      {resetLink}
    </>
  );
}
