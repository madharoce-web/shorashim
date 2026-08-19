/* Datos de gramática básica.
   - Partículas (prefijos), sufijos posesivos, plurales y duales.
   - Marcas de persona del pasado y del futuro.
   - Conjugación completa de verbos regulares (pa'al), escrita a mano para
     garantizar que la vocalización es correcta (no se genera por reglas).
   Los verbos y sustantivos son, en su mayoría, palabras del propio vocabulario. */

/* ---------- pronombres personales ---------- */
export const PRONOUNS = [
  { he: 'אֲנִי',      es: 'yo',                  en: 'I',                  fr: 'je / moi' },
  { he: 'אָנֹכִי',    es: 'yo (forma bíblica)',  en: 'I (biblical form)',  fr: 'je (forme biblique)' },
  { he: 'אַתָּה',     es: 'tú (masc.)',          en: 'you (m. sing.)',     fr: 'tu (m.)' },
  { he: 'אַתְּ',      es: 'tú (fem.)',           en: 'you (f. sing.)',     fr: 'tu (f.)' },
  { he: 'הוּא',      es: 'él',                  en: 'he / it',            fr: 'il' },
  { he: 'הִיא',      es: 'ella',                en: 'she / it',           fr: 'elle' },
  { he: 'אֲנַחְנוּ',  es: 'nosotros',            en: 'we',                 fr: 'nous' },
  { he: 'אַתֶּם',     es: 'vosotros (masc.)',    en: 'you (m. pl.)',       fr: 'vous (m.)' },
  { he: 'אַתֶּן',     es: 'vosotras (fem.)',     en: 'you (f. pl.)',       fr: 'vous (f.)' },
  { he: 'הֵם',       es: 'ellos',               en: 'they (m.)',          fr: 'ils' },
  { he: 'הֵן',       es: 'ellas',               en: 'they (f.)',          fr: 'elles' },
];

/* ---------- prefijos (partículas) ---------- */
export const PARTICLES = [
  { he: 'וְ',   es: 'y',                 en: 'and',              fr: 'et' },
  { he: 'הַ',   es: 'el / la / los',     en: 'the',              fr: 'le / la / les' },
  { he: 'בְּ',   es: 'en / con',          en: 'in / with',        fr: 'dans / avec' },
  { he: 'לְ',   es: 'a / para',          en: 'to / for',         fr: 'à / pour' },
  { he: 'מִ',   es: 'de / desde',        en: 'from',             fr: 'de / depuis' },
  { he: 'כְּ',   es: 'como',              en: 'like / as',        fr: 'comme' },
  { he: 'שֶׁ',   es: 'que',               en: 'that',             fr: 'que' },
  { he: 'כְּשֶׁ', es: 'cuando',            en: 'when',             fr: 'quand' },
];

/* ---------- sufijos posesivos / de objeto ---------- */
export const POSSESSIVES = [
  { he: 'ִ־י',   es: 'mi / me',             en: 'my / me',            fr: 'mon / me' },
  { he: '־ךָ',  es: 'tu / te (masc.)',     en: 'your / you (m.)',    fr: 'ton / te (m.)' },
  { he: '־ךְ',  es: 'tu / te (fem.)',      en: 'your / you (f.)',    fr: 'ton / te (f.)' },
  { he: '־וֹ',  es: 'su / lo (de él)',     en: 'his / him',          fr: 'son / le (à lui)' },
  { he: '־הּ',  es: 'su / la (de ella)',   en: 'her / it',           fr: 'sa / la (à elle)' },
  { he: '־נוּ', es: 'nuestro / nos',       en: 'our / us',           fr: 'notre / nous' },
];

/* ---------- plural y dual ---------- */
export const PLURALS = [
  { he: '־ים',  es: 'plural masculino',   en: 'masculine plural',   fr: 'pluriel masculin' },
  { he: '־וֹת', es: 'plural femenino',    en: 'feminine plural',    fr: 'pluriel féminin' },
  { he: '־יִם', es: 'dual (pareja)',      en: 'dual (a pair)',      fr: 'duel (une paire)' },
];

/* ---------- marcas de persona: pasado (sufijos) ---------- */
export const PAST_MARKS = [
  { he: '־תִּי', es: 'yo (pasado)',         en: 'I (past)',           fr: 'je (passé)' },
  { he: '־תָּ',  es: 'tú, masc. (pasado)',  en: 'you, m. (past)',     fr: 'tu, m. (passé)' },
  { he: '־תְּ',  es: 'tú, fem. (pasado)',   en: 'you, f. (past)',     fr: 'tu, f. (passé)' },
  { he: '—',    es: 'él (pasado)',         en: 'he (past)',          fr: 'il (passé)' },
  { he: '־ָה',  es: 'ella (pasado)',       en: 'she (past)',         fr: 'elle (passé)' },
  { he: '־נוּ', es: 'nosotros (pasado)',   en: 'we (past)',          fr: 'nous (passé)' },
  { he: '־וּ',  es: 'ellos (pasado)',      en: 'they (past)',        fr: 'ils (passé)' },
];

/* ---------- marcas de persona: futuro (prefijos) ---------- */
export const FUTURE_MARKS = [
  { he: 'אֶ־',       es: 'yo (futuro)',        en: 'I (future)',        fr: 'je (futur)' },
  { he: 'תִּ־',       es: 'tú / ella (futuro)', en: 'you / she (future)',fr: 'tu / elle (futur)' },
  { he: 'יִ־',       es: 'él (futuro)',        en: 'he (future)',       fr: 'il (futur)' },
  { he: 'נִ־',       es: 'nosotros (futuro)',  en: 'we (future)',       fr: 'nous (futur)' },
  { he: 'יִ־ ... ־וּ', es: 'ellos (futuro)',     en: 'they (future)',     fr: 'ils (futur)' },
  { he: 'תִּ־ ... ־וּ', es: 'vosotros (futuro)', en: 'you pl. (future)',  fr: 'vous (futur)' },
];

/* ---------- verbos regulares (pa'al) ---------- */
export const VERBS = [
  {
    base: 'שָׁמַר', root: 'ש־מ־ר',
    es: 'guardar, cuidar', en: 'to guard, keep', fr: 'garder',
    past:    { i: 'שָׁמַרְתִּי', youM: 'שָׁמַרְתָּ', he: 'שָׁמַר', she: 'שָׁמְרָה', we: 'שָׁמַרְנוּ', they: 'שָׁמְרוּ' },
    present: { ms: 'שׁוֹמֵר', fs: 'שׁוֹמֶרֶת', mp: 'שׁוֹמְרִים', fp: 'שׁוֹמְרוֹת' },
    future:  { i: 'אֶשְׁמֹר', youM: 'תִּשְׁמֹר', he: 'יִשְׁמֹר', we: 'נִשְׁמֹר', they: 'יִשְׁמְרוּ' },
  },
  {
    base: 'סָגַר', root: 'ס־ג־ר',
    es: 'cerrar', en: 'to close', fr: 'fermer',
    past:    { i: 'סָגַרְתִּי', youM: 'סָגַרְתָּ', he: 'סָגַר', she: 'סָגְרָה', we: 'סָגַרְנוּ', they: 'סָגְרוּ' },
    present: { ms: 'סוֹגֵר', fs: 'סוֹגֶרֶת', mp: 'סוֹגְרִים', fp: 'סוֹגְרוֹת' },
    future:  { i: 'אֶסְגֹּר', youM: 'תִּסְגֹּר', he: 'יִסְגֹּר', we: 'נִסְגֹּר', they: 'יִסְגְּרוּ' },
  },
  {
    base: 'זָכַר', root: 'ז־כ־ר',
    es: 'recordar', en: 'to remember', fr: 'se souvenir',
    past:    { i: 'זָכַרְתִּי', youM: 'זָכַרְתָּ', he: 'זָכַר', she: 'זָכְרָה', we: 'זָכַרְנוּ', they: 'זָכְרוּ' },
    present: { ms: 'זוֹכֵר', fs: 'זוֹכֶרֶת', mp: 'זוֹכְרִים', fp: 'זוֹכְרוֹת' },
    future:  { i: 'אֶזְכֹּר', youM: 'תִּזְכֹּר', he: 'יִזְכֹּר', we: 'נִזְכֹּר', they: 'יִזְכְּרוּ' },
  },
  {
    base: 'כָּתַב', root: 'כ־ת־ב',
    es: 'escribir', en: 'to write', fr: 'écrire',
    past:    { i: 'כָּתַבְתִּי', youM: 'כָּתַבְתָּ', he: 'כָּתַב', she: 'כָּתְבָה', we: 'כָּתַבְנוּ', they: 'כָּתְבוּ' },
    present: { ms: 'כּוֹתֵב', fs: 'כּוֹתֶבֶת', mp: 'כּוֹתְבִים', fp: 'כּוֹתְבוֹת' },
    future:  { i: 'אֶכְתֹּב', youM: 'תִּכְתֹּב', he: 'יִכְתֹּב', we: 'נִכְתֹּב', they: 'יִכְתְּבוּ' },
  },
];

export const PAST_PERSONS = ['i', 'youM', 'he', 'she', 'we', 'they'];
export const FUTURE_PERSONS = ['i', 'youM', 'he', 'we', 'they'];
export const PRESENT_FORMS = ['ms', 'fs', 'mp', 'fp'];

/* ---------- sustantivos: singular → plural / dual ---------- */
export const NOUNS_PLURAL = [
  { sg: 'עֵץ',    pl: 'עֵצִים',    es: 'árbol',   en: 'tree',  fr: 'arbre',  dual: false },
  { sg: 'כּוֹכָב', pl: 'כּוֹכָבִים', es: 'estrella',en: 'star',  fr: 'étoile', dual: false },
  { sg: 'יוֹם',   pl: 'יָמִים',    es: 'día',     en: 'day',   fr: 'jour',   dual: false },
  { sg: 'שָׁנָה',  pl: 'שָׁנִים',   es: 'año',     en: 'year',  fr: 'année',  dual: false },
  { sg: 'יָד',    pl: 'יָדַיִם',   es: 'mano',    en: 'hand',  fr: 'main',   dual: true },
  { sg: 'עַיִן',  pl: 'עֵינַיִם',  es: 'ojo',     en: 'eye',   fr: 'œil',    dual: true },
];

/* ---------- sustantivos con sufijo posesivo ---------- */
export const NOUNS_POSS = [
  {
    base: 'אָב', es: 'padre', en: 'father', fr: 'père',
    forms: { i: 'אָבִי', youM: 'אָבִיךָ', he: 'אָבִיו', we: 'אָבִינוּ' },
  },
  {
    base: 'אָח', es: 'hermano', en: 'brother', fr: 'frère',
    forms: { i: 'אָחִי', youM: 'אָחִיךָ', he: 'אָחִיו', we: 'אָחִינוּ' },
  },
  {
    base: 'יָד', es: 'mano', en: 'hand', fr: 'main',
    forms: { i: 'יָדִי', youM: 'יָדְךָ', he: 'יָדוֹ', we: 'יָדֵנוּ' },
  },
];

export const POSS_PERSONS = ['i', 'youM', 'he', 'we'];
