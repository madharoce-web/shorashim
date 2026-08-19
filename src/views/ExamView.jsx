import { useState, useEffect } from 'react';
import { WORDS, N, sameMeaning } from '../words';
import { shuffle } from '../utils';
import { T } from '../i18n';

/* almacén a nivel de módulo: el examen sobrevive al cambio de pestaña */
let exStore = null;

const initialEx = () => ({ phase: 'setup', qs: [], n: 20, dir: 'he2en', examId: 0 });

export default function ExamView({ active, lang }) {
  const t = T[lang];
  const [ex, setEx] = useState(() => exStore || initialEx());
  const [nStr, setNStr] = useState(String(ex.n));
  const [dir, setDir] = useState(ex.dir);
  useEffect(() => { exStore = ex; }, [ex]);

  const build = () => {
    const n = Math.min(Math.max(parseInt(nStr, 10) || 20, 1), N);
    const idxs = shuffle([...Array(N).keys()]).slice(0, n);
    const qs = idxs.map((w) => {
      const others = [];
      for (let i = 0; i < N; i++) if (i !== w && !sameMeaning(i, w)) others.push(i);
      shuffle(others);
      return { w, opts: shuffle([w, ...others.slice(0, 3)]), sel: null, dk: false };
    });
    setEx({ phase: 'active', qs, n, dir, examId: Date.now() });
  };

  const select = (qi, k) => {
    if (ex.phase !== 'active') return;
    setEx((prev) => {
      const qs = prev.qs.slice();
      const q = qs[qi];
      if (q.dk) return prev;
      qs[qi] = { ...q, sel: q.sel === k ? null : k };
      return { ...prev, qs };
    });
  };

  const dontKnow = (qi) => {
    if (ex.phase !== 'active') return;
    setEx((prev) => {
      const qs = prev.qs.slice();
      qs[qi] = { ...qs[qi], dk: true, sel: null };
      return { ...prev, qs };
    });
  };

  const submit = () => {
    const un = ex.qs.filter((q) => q.sel == null && !q.dk).length;
    if (un && !confirm(t.confirmSubmit(un))) return;
    setEx((prev) => ({ ...prev, phase: 'graded' }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (ex.phase === 'setup') {
    return (
      <>
        <div className="page-head">
          <h1>{t.examTitle}</h1>
          <p>{t.examSub}</p>
        </div>
        <div className="card exam-setup">
          <h2>{t.examSetup}</h2>
          <div className="form-row">
            <label>{t.questions} <span className="hint">{t.maxN(N)}</span></label>
            <input
              type="number" min="1" max={N} value={nStr}
              onChange={(e) => setNStr(e.target.value)}
            />
          </div>
          <div className="form-row">
            <label>{t.answerWith}</label>
            <select value={dir} onChange={(e) => setDir(e.target.value)}>
              <option value="he2en">{t.translationOpt}</option>
              <option value="en2he">{t.termOpt}</option>
            </select>
          </div>
          <button className="btn primary" onClick={build}>{t.createExam}</button>
        </div>
      </>
    );
  }

  const graded = ex.phase === 'graded';
  const he2en = ex.dir === 'he2en';
  const total = ex.qs.length;
  const good = ex.qs.filter((q) => q.sel != null && q.opts[q.sel] === q.w).length;
  const pctScore = Math.round((good / total) * 100);

  return (
    <>
      {graded ? (
        <div className="card score-card">
          <div className="score-num">
            {pctScore}%<br /><small>{t.scoreOf(good, total)}</small>
          </div>
          <div className="score-bars">
            <div className="sbar g">
              <span className="lab">{t.correct}</span>
              <span className="track"><i style={{ width: `${(good / total) * 100}%` }} /></span>
              <span className="val">{good}</span>
            </div>
            <div className="sbar o">
              <span className="lab">{t.incorrect}</span>
              <span className="track"><i style={{ width: `${((total - good) / total) * 100}%` }} /></span>
              <span className="val">{total - good}</span>
            </div>
          </div>
          <button className="btn primary" onClick={() => { setEx((p) => ({ ...p, phase: 'setup' })); }}>
            {t.newExam}
          </button>
        </div>
      ) : (
        <div className="page-head">
          <h1>{t.examTitle}</h1>
          <p>{t.examActiveSub(total)}</p>
        </div>
      )}

      <div>
        {ex.qs.map((q, qi) => {
          const w = WORDS[q.w];
          const ok = q.sel != null && q.opts[q.sel] === q.w;
          return (
            <div
              key={`${ex.examId}-${qi}`}
              className="card exam-q anim"
              style={{ animationDelay: `${Math.min(qi * 40, 320)}ms` }}
            >
              <div className="top">
                <span>{he2en ? t.term : t.defLabel}</span>
                <span>{t.qOf(qi + 1, total)}</span>
              </div>
              {he2en
                ? <div className="qword he">{w.he}</div>
                : <div className="qword">{w[lang]}</div>}
              <div className="qprompt">{t.selectAnswer}</div>
              <div className="opts">
                {q.opts.map((o, k) => {
                  let cls = 'opt';
                  if (graded) {
                    if (o === q.w) cls += ' good';
                    else if (q.sel === k) cls += ' bad';
                    else cls += ' dim';
                  } else if (q.sel === k) cls += ' sel';
                  return (
                    <button
                      key={k}
                      className={cls}
                      disabled={graded || q.dk}
                      onClick={() => select(qi, k)}
                    >
                      <span className="num">{k + 1}</span>
                      {he2en
                        ? <span>{WORDS[o][lang]}</span>
                        : <span className="he">{WORDS[o].he}</span>}
                    </button>
                  );
                })}
              </div>
              {!graded && q.dk && (
                <div className="dk-note">{t.dkNote}</div>
              )}
              {!graded && !q.dk && (
                <div className="qfoot">
                  <button className="linkbtn" onClick={() => dontKnow(qi)}>{t.dontKnow}</button>
                </div>
              )}
              {graded && (
                <div className={`verdict ${ok ? 'good' : 'bad'}`}>
                  {ok ? t.vCorrect : q.dk ? t.vDk : q.sel == null ? t.vBlank : t.vWrong}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!graded && (
        <div className="exam-submit">
          <button className="btn primary" style={{ padding: '16px 44px', fontSize: 17 }} onClick={submit}>
            {t.submit}
          </button>
        </div>
      )}
    </>
  );
}
