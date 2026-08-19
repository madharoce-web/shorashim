import { T } from '../i18n';
import {
  PRONOUNS, PARTICLES, POSSESSIVES, PLURALS, PAST_MARKS, FUTURE_MARKS, VERBS,
} from '../grammar';

/* Tabla de referencia: pronombres, prefijos, sufijos, marcas de persona
   y la conjugación completa de un verbo regular. */
export default function GrammarView({ lang }) {
  const t = T[lang];
  const groups = [
    ['pronouns', PRONOUNS, 'g'],
    ['particles', PARTICLES, 'a'],
    ['possessives', POSSESSIVES, 'b'],
    ['plurals', PLURALS, 'c'],
    ['past', PAST_MARKS, 'd'],
    ['future', FUTURE_MARKS, 'e'],
  ];
  const v = VERBS[0];

  return (
    <>
      <div className="page-head">
        <h1>{t.grTitle}</h1>
        <p>{t.grSub}</p>
      </div>

      {groups.map(([key, rows, tone]) => (
        <div className="gr-group" key={key}>
          <h3>{t.grGroups[key]}</h3>
          <div className="gr-table">
            {rows.map((r, i) => (
              <div
                className={`gr-row ${tone}`}
                key={i}
                style={{ animationDelay: `${Math.min(i * 20, 200)}ms` }}
              >
                <span className="m">{r[lang]}</span>
                <span className="h he">{r.he}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="gr-group">
        <h3>{t.grGroups.verbs} — {v.base} ({v[lang]})</h3>
        {['past', 'present', 'future'].map((tense) => (
          <div key={tense} className="gr-sub">
            <h4>{t.grTenses[tense]}</h4>
            <div className="gr-table">
              {Object.keys(v[tense]).map((k) => (
                <div className="gr-row f" key={k}>
                  <span className="m">{tense === 'present' ? t.grForms[k] : t.grPersons[k]}</span>
                  <span className="h he">{v[tense][k]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
