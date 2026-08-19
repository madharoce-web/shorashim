import { useState, useEffect, useRef } from 'react';
import { WORDS, N } from '../words';
import { load, save, shuffle } from '../utils';
import {
  XIcon, CheckIcon, UndoIcon, ShufIcon,
  RestartIcon, ArrowLIcon, ArrowRIcon, FullIcon,
} from '../icons';
import { T } from '../i18n';

function fcDefault() {
  return { order: [...Array(N).keys()], pos: 0, track: true, known: [], learning: [], history: [] };
}
function loadFC() {
  const v = load('shx_fc', null);
  if (!v || !Array.isArray(v.order) || !v.order.length || v.order.some((i) => i >= N)) return fcDefault();
  return v;
}

export default function CardsView({ active, lang, showToast }) {
  const t = T[lang];
  const [fc, setFC] = useState(loadFC);
  const [flipped, setFlipped] = useState(false);
  const [hintVisible, setHintVisible] = useState(() => !load('shx_hint', false));
  const animRef = useRef('');   // clase de deslizamiento para la próxima ficha
  const verRef = useRef(0);     // fuerza el remontaje de la ficha (repite la animación)

  const total = fc.order.length;

  const update = (next, animCls) => {
    animRef.current = animCls || '';
    verRef.current++;
    setFlipped(false);
    setFC(next);
    save('shx_fc', next);
  };

  const mark = (known) => {
    if (fc.pos >= total) return;
    const idx = fc.order[fc.pos];
    update({
      ...fc,
      history: [...fc.history, { pos: fc.pos, known }],
      known: known ? [...fc.known, idx] : fc.known,
      learning: known ? fc.learning : [...fc.learning, idx],
      pos: fc.pos + 1,
    }, 'in-r');
  };

  const nav = (d) => {
    const pos = Math.min(Math.max(fc.pos + d, 0), total - 1);
    if (pos === fc.pos) return;
    update({ ...fc, pos }, d > 0 ? 'in-r' : 'in-l');
  };

  const undo = () => {
    if (!fc.history.length) return;
    const h = fc.history[fc.history.length - 1];
    update({
      ...fc,
      history: fc.history.slice(0, -1),
      known: h.known ? fc.known.slice(0, -1) : fc.known,
      learning: h.known ? fc.learning : fc.learning.slice(0, -1),
      pos: h.pos,
    }, 'in-l');
  };

  const shuffleDeck = () => {
    update({ ...fc, order: shuffle(fc.order.slice()), pos: 0, known: [], learning: [], history: [] }, 'in-r');
    showToast(t.shuffled);
  };

  const restart = () => {
    update({ order: [...Array(N).keys()], pos: 0, track: fc.track, known: [], learning: [], history: [] }, 'in-r');
    showToast(t.restarted);
  };

  const reviewHard = () => {
    update({ order: shuffle(fc.learning.slice()), pos: 0, track: true, known: [], learning: [], history: [] }, 'in-r');
  };

  const toggleTrack = () => {
    const next = { ...fc, track: !fc.track };
    setFC(next);
    save('shx_fc', next);
  };

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  const dismissHint = () => {
    setHintVisible(false);
    save('shx_hint', true);
  };

  /* teclado: espacio voltea, flechas marcan o navegan */
  const handlersRef = useRef({});
  handlersRef.current = { active, track: fc.track, mark, nav };
  useEffect(() => {
    const h = (e) => {
      const s = handlersRef.current;
      if (!s.active) return;
      if (e.target.matches('input,select,textarea')) return;
      if (e.code === 'Space') { e.preventDefault(); setFlipped((f) => !f); }
      else if (e.code === 'ArrowLeft') { e.preventDefault(); s.track ? s.mark(false) : s.nav(-1); }
      else if (e.code === 'ArrowRight') { e.preventDefault(); s.track ? s.mark(true) : s.nav(1); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  if (fc.pos >= total) {
    return (
      <div className="card fc-summary">
        <h2>{t.roundDone}</h2>
        <p className="sub">{t.reviewedAll(total)}</p>
        <div className="stat-row">
          <div className="stat g"><span>{t.know}</span><span className="n">{fc.known.length}</span></div>
          <div className="stat o"><span>{t.stillLearning}</span><span className="n">{fc.learning.length}</span></div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {fc.learning.length > 0 && (
            <button className="btn primary" onClick={reviewHard}>
              {t.reviewHard(fc.learning.length)}
            </button>
          )}
          <button className="btn ghost" onClick={restart}>{t.restartAll}</button>
        </div>
      </div>
    );
  }

  const w = WORDS[fc.order[fc.pos]];

  return (
    <div className="fc-stage">
      <div
        key={verRef.current}
        className={`fc-card ${animRef.current}`}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className={`fc-inner${flipped ? ' flipped' : ''}`}>
          <div className="fc-face front">
            <span className="label">{t.term}</span>
            <div className="fc-word he">{w.he}</div>
          </div>
          <div className="fc-face back">
            <span className="label">{t.definition}</span>
            <div className="fc-def">{w[lang]}</div>
          </div>
        </div>
      </div>

      {hintVisible && (
        <div className="fc-hintbar">
          <span>⌨️</span><span><b>{t.shortcut}</b></span>
          <span>{t.press} <b>{t.spaceBar}</b> {t.flipRest}</span>
          <button className="close" title={t.close} onClick={dismissHint}>×</button>
        </div>
      )}

      <div className="fc-bottom">
        <button className="fc-track" title={t.trackProgress} onClick={toggleTrack}>
          <span className={`switch${fc.track ? ' on' : ''}`}></span> {t.trackProgress}
        </button>
        <div className="fc-center">
          {fc.track ? (
            <>
              <button className="big-round no" title={`${t.stillLearning} (←)`} onClick={() => mark(false)}>
                <XIcon />
                {fc.learning.length > 0 && <span className="pill-count o">{fc.learning.length}</span>}
              </button>
              <div className="fc-count">{fc.pos + 1} / {total}</div>
              <button className="big-round yes" title={`${t.know} (→)`} onClick={() => mark(true)}>
                <CheckIcon />
                {fc.known.length > 0 && <span className="pill-count g">{fc.known.length}</span>}
              </button>
            </>
          ) : (
            <>
              <button className="big-round nav" title={`${t.prev} (←)`} onClick={() => nav(-1)}><ArrowLIcon /></button>
              <div className="fc-count">{fc.pos + 1} / {total}</div>
              <button className="big-round nav" title={`${t.next} (→)`} onClick={() => nav(1)}><ArrowRIcon /></button>
            </>
          )}
        </div>
        <div className="fc-right">
          <button className="ibtn" title={t.undo} disabled={!fc.history.length} onClick={undo}><UndoIcon /></button>
          <button className="ibtn" title={t.shuffle} onClick={shuffleDeck}><ShufIcon /></button>
          <button className="ibtn" title={t.restartFull} onClick={restart}><RestartIcon /></button>
          <button className="ibtn" title={t.fullscreen} onClick={toggleFull}><FullIcon /></button>
        </div>
      </div>
    </div>
  );
}
