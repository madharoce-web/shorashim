import { useState, useEffect, useRef, useMemo } from 'react';
import { WORDS } from '../words';
import { load, save, stripNikud, speak } from '../utils';
import { SoundIcon, StarIcon, StarFillIcon, SearchIcon } from '../icons';
import { T } from '../i18n';

export default function ListView({ active, lang }) {
  const [q, setQ] = useState('');
  const [onlyStars, setOnlyStars] = useState(false);
  const [stars, setStars] = useState(() => new Set(load('shx_stars', [])));
  const [anim, setAnim] = useState(true);
  const [animKey, setAnimKey] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (active) {
      setAnim(true);
      setAnimKey((k) => k + 1);
      if (inputRef.current) inputRef.current.focus();
    }
  }, [active, onlyStars]);

  const toggleStar = (i) => {
    setStars((prev) => {
      const s = new Set(prev);
      if (s.has(i)) s.delete(i); else s.add(i);
      save('shx_stars', [...s]);
      return s;
    });
  };

  const items = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const qHe = stripNikud(ql);
    return WORDS.map((w, i) => ({ w, i })).filter(({ w, i }) => {
      if (onlyStars && !stars.has(i)) return false;
      if (!ql) return true;
      return w.en.toLowerCase().includes(ql)
        || w.es.toLowerCase().includes(ql)
        || w.fr.toLowerCase().includes(ql)
        || stripNikud(w.he).includes(qHe);
    });
  }, [q, onlyStars, stars]);

  return (
    <>
      <div className="page-head">
        <h1>{T[lang].listTitle(WORDS.length)}</h1>
        <p>{T[lang].listSub}</p>
      </div>
      <div className="list-tools">
        <div className="search">
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            placeholder={T[lang].searchPh}
            value={q}
            onChange={(e) => { setQ(e.target.value); setAnim(false); }}
          />
        </div>
        <button
          className={`chip${onlyStars ? ' on' : ''}`}
          onClick={() => setOnlyStars((v) => !v)}
        >
          {T[lang].starred(stars.size)}
        </button>
      </div>
      <div className="wordlist" key={animKey}>
        {items.length === 0 && <div className="list-empty">{T[lang].noResults}</div>}
        {items.map(({ w, i }, k) => (
          <div
            key={i}
            className={`card wrow${anim ? ' anim' : ''}`}
            style={anim ? { animationDelay: `${Math.min(k * 22, 330)}ms` } : undefined}
          >
            <div className="he">{w.he}</div>
            <div className="en">{w[lang]}</div>
            <div className="acts">
              <button className="ibtn" title={T[lang].listen} onClick={() => speak(w.he)}>
                <SoundIcon />
              </button>
              <button
                className={`ibtn star${stars.has(i) ? ' on' : ''}`}
                title={T[lang].star}
                onClick={() => toggleStar(i)}
              >
                {stars.has(i) ? <StarFillIcon /> : <StarIcon />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
