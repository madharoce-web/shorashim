import { useState, useEffect, useRef } from 'react';
import ListView from './views/ListView';
import CardsView from './views/CardsView';
import LearnView from './views/LearnView';
import ExamView from './views/ExamView';
import { N } from './words';
import { load, save } from './utils';
import { T } from './i18n';

const TAB_IDS = ['list', 'cards', 'learn', 'exam'];

export default function App() {
  const [view, setView] = useState('list');
  const [lang, setLang] = useState(() => load('shx_lang', 'es'));
  const t = T[lang];
  const [toast, setToast] = useState(null);

  const changeLang = (l) => {
    setLang(l);
    save('shx_lang', l);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const toastTimer = useRef(null);
  const mainRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    /* repetir el fundido de entrada al cambiar de vista */
    const el = mainRef.current && mainRef.current.querySelector('.view.active');
    if (el) {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    }
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <div className="logo he">ש</div>
          <div>
            <div className="t1">Shorashim</div>
            <div className="t2">{t.subtitle(N)}</div>
          </div>
        </div>
        <nav className="tabs">
          {TAB_IDS.map((id) => (
            <button
              key={id}
              className={`tab${view === id ? ' active' : ''}`}
              onClick={() => setView(id)}
            >
              {t.tabs[id]}
            </button>
          ))}
        </nav>
        <div className="lang-switch" title={t.langTitle}>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => changeLang('en')}>EN</button>
          <button className={lang === 'es' ? 'on' : ''} onClick={() => changeLang('es')}>ES</button>
          <button className={lang === 'fr' ? 'on' : ''} onClick={() => changeLang('fr')}>FR</button>
        </div>
      </header>
      <main ref={mainRef}>
        <section className={`view${view === 'list' ? ' active' : ''}`}>
          <ListView active={view === 'list'} lang={lang} />
        </section>
        <section className={`view${view === 'cards' ? ' active' : ''}`}>
          <CardsView active={view === 'cards'} lang={lang} showToast={showToast} />
        </section>
        <section className={`view${view === 'learn' ? ' active' : ''}`}>
          <LearnView active={view === 'learn'} lang={lang} />
        </section>
        <section className={`view${view === 'exam' ? ' active' : ''}`}>
          <ExamView active={view === 'exam'} lang={lang} />
        </section>
      </main>
      <div id="toast" className={toast ? 'show' : ''}>{toast}</div>
    </>
  );
}
