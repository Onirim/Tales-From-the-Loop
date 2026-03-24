// ══════════════════════════════════════════════════════════════
// GAME SYSTEM — Tales From the Loop
// Système Year Zero Engine (Fria Ligan / Nils Hintze)
// Adaptation française — Auroreville / La France des Années 80
// ══════════════════════════════════════════════════════════════


// ── 1. IDENTITÉ DU JEU ────────────────────────────────────────

const GAME_NAME     = 'Tales From the Loop';
const GAME_SUBTITLE = 'Les Mystères d\'Auroreville';


// ── 2. ÉTAT INITIAL D'UN PERSONNAGE ──────────────────────────

function freshState() {
  return {
    name:                 '',
    subtitle:             '',   // identité réelle / surnom
    stereotype:           'geek',
    age:                  12,
    // Attributs (min 1, max 5 — répartis à hauteur de l'âge)
    physique:             2,
    technique:            2,
    coeur:                2,
    intelligence:         2,
    // Compétences (max 12 points, 0–5)
    skills: {
      agilite:       0,
      force:         0,
      furtivite:     0,
      analyse:       0,
      bricolage:     0,
      programmation: 0,
      charisme:      0,
      charme:        0,
      reseau:        0,
      comprehension: 0,
      decouverte:    0,
      empathie:      0,
    },
    // Métadonnées narratives
    motivation:           '',
    probleme:             '',
    fierte:               '',
    objet_fetiche:        '',
    background:           '',
    chanson_favorite:     '',
    // Liens (tableau d'objets {label, detail})
    liens:                [],
    // État (cases cochées)
    etat: {
      contrarie: false,
      effrayé:   false,
      epuise:    false,
      blesse:    false,
      brise:     false,
    },
    // Technique standard
    is_public:            false,
    illustration_url:     '',
    illustration_position: 0,
    tags:                 [],
  };
}


// ── 3. CONSTANTES DE RÈGLES ───────────────────────────────────

// Points de chance = 15 – âge
function luckPoints(age) {
  return Math.max(0, 15 - age);
}

// Points d'attributs = âge (minimum 1, maximum 5 par attribut)
function attrPoints(age) {
  return age;
}

// Points de compétences = 10 (3 dans les clés du stéréotype, 1 dans les autres)
const SKILL_POINTS_TOTAL = 10;

// Stéréotypes et leurs compétences clés
const STEREOTYPES = {
  campagnard:  { key: 'campagnard',  skills: ['force', 'agilite', 'bricolage'] },
  excentrique: { key: 'excentrique', skills: ['furtivite', 'decouverte', 'empathie'] },
  geek:        { key: 'geek',        skills: ['analyse', 'programmation', 'comprehension'] },
  intello:     { key: 'intello',     skills: ['analyse', 'decouverte', 'comprehension'] },
  metalleux:   { key: 'metalleux',   skills: ['agilite', 'charme', 'empathie'] },
  rebelle:     { key: 'rebelle',     skills: ['force', 'furtivite', 'charisme'] },
  sportif:     { key: 'sportif',     skills: ['force', 'agilite', 'reseau'] },
  star:        { key: 'star',        skills: ['reseau', 'charme', 'charisme'] },
  combinard:   { key: 'combinard',   skills: ['programmation', 'charisme', 'reseau'] },
  frimeur:     { key: 'frimeur',     skills: ['agilite', 'bricolage', 'charisme'] },
  inventeur:   { key: 'inventeur',   skills: ['analyse', 'bricolage', 'programmation'] },
  roliste:     { key: 'roliste',     skills: ['comprehension', 'decouverte', 'empathie'] },
};

// Lien entre compétence et attribut
const SKILL_ATTR = {
  agilite:       'physique',
  force:         'physique',
  furtivite:     'physique',
  analyse:       'technique',
  bricolage:     'technique',
  programmation: 'technique',
  charisme:      'coeur',
  charme:        'coeur',
  reseau:        'coeur',
  comprehension: 'intelligence',
  decouverte:    'intelligence',
  empathie:      'intelligence',
};


// ── 4. LISTES DYNAMIQUES ──────────────────────────────────────

function STEREOTYPE_OPTIONS() {
  return [
    { value: 'campagnard',  label: t('stereotype_campagnard')  },
    { value: 'excentrique', label: t('stereotype_excentrique') },
    { value: 'geek',        label: t('stereotype_geek')        },
    { value: 'intello',     label: t('stereotype_intello')     },
    { value: 'metalleux',   label: t('stereotype_metalleux')   },
    { value: 'rebelle',     label: t('stereotype_rebelle')     },
    { value: 'sportif',     label: t('stereotype_sportif')     },
    { value: 'star',        label: t('stereotype_star')        },
    { value: 'combinard',   label: t('stereotype_combinard')   },
    { value: 'frimeur',     label: t('stereotype_frimeur')     },
    { value: 'inventeur',   label: t('stereotype_inventeur')   },
    { value: 'roliste',     label: t('stereotype_roliste')     },
  ];
}

function SKILL_KEYS() {
  return [
    'agilite', 'force', 'furtivite',
    'analyse', 'bricolage', 'programmation',
    'charisme', 'charme', 'reseau',
    'comprehension', 'decouverte', 'empathie',
  ];
}

function skillLabel(key) {
  return t('skill_' + key);
}

function attrLabel(key) {
  return t('attr_' + key);
}


// ── 5. CALCUL DES POINTS ──────────────────────────────────────

function totalAttrUsed(state) {
  return (state.physique || 0) + (state.technique || 0)
       + (state.coeur || 0)   + (state.intelligence || 0);
}

function totalSkillsUsed(state) {
  return Object.values(state.skills || {}).reduce((s, v) => s + v, 0);
}

// Stubs requis par editor.js (ne sont plus utilisés mais doivent exister)
function totalCost(state)    { return totalAttrUsed(state); }
function maxPts(state)       { return attrPoints(state.age || 12); }
function calcAptPts(state)   { return totalSkillsUsed(state); }
function maxAptPts(state)    { return SKILL_POINTS_TOTAL; }
function powerCost(p)        { return 0; }
function POWER_TYPES()       { return []; }
function MOD_OPTIONS()       { return []; }
function APTITUDES()         { return []; }
const APTITUDES_KEYS         = [];


// ── 6. RENDU CARTE ROSTER ─────────────────────────────────────

function renderCharCardBody(c) {
  const stereo = c.stereotype
    ? STEREOTYPE_OPTIONS().find(x => x.value === c.stereotype)?.label || c.stereotype
    : '—';
  const luck = luckPoints(c.age || 12);
  const stateFlags = _cardStateFlags(c);

  return `
    <div class="card-name">${esc(c.name) || '—'}</div>
    <div class="card-sub">${esc(stereo)} · ${c.age || '?'} ${t('card_age_suffix')}</div>
    <div class="card-rank">${t('card_luck_label')}${luck}</div>
    <div class="card-attrs">
      <div class="card-attr e">
        <div class="val">${c.physique || 1}</div>
        <div class="lbl">${t('attr_physique_short')}</div>
      </div>
      <div class="card-attr r">
        <div class="val">${c.technique || 1}</div>
        <div class="lbl">${t('attr_technique_short')}</div>
      </div>
      <div class="card-attr v">
        <div class="val">${c.coeur || 1}</div>
        <div class="lbl">${t('attr_coeur_short')}</div>
      </div>
      <div class="card-attr s">
        <div class="val">${c.intelligence || 1}</div>
        <div class="lbl">${t('attr_intelligence_short')}</div>
      </div>
    </div>
    ${stateFlags}
  `;
}

function _cardStateFlags(c) {
  if (!c.etat) return '';
  const active = [];
  if (c.etat.brise)    active.push(`<span class="state-flag brise">${t('etat_brise')}</span>`);
  else if (c.etat.blesse)    active.push(`<span class="state-flag blesse">${t('etat_blesse')}</span>`);
  if (c.etat.effrayé)  active.push(`<span class="state-flag effraye">${t('etat_effraye')}</span>`);
  if (c.etat.epuise)   active.push(`<span class="state-flag epuise">${t('etat_epuise')}</span>`);
  if (c.etat.contrarie)active.push(`<span class="state-flag contrarie">${t('etat_contrarie')}</span>`);
  return active.length
    ? `<div class="card-state-flags">${active.join('')}</div>`
    : '';
}


// ── 7. RENDU PREVIEW / VUE PARTAGÉE ──────────────────────────

function renderCharSheet(data) {
  const stereo = data.stereotype
    ? STEREOTYPE_OPTIONS().find(x => x.value === data.stereotype)?.label || data.stereotype
    : '—';
  const luck = luckPoints(data.age || 12);
  const keySkills = STEREOTYPES[data.stereotype]?.skills || [];

  // ── Attributs
  const attrsHtml = `
    <div class="preview-section-title">${t('preview_section_attrs')}
      <span style="font-family:var(--font-mono);font-size:10px;color:var(--text3);margin-left:4px">
        ${totalAttrUsed(data)} / ${attrPoints(data.age||12)} pts
      </span>
    </div>
    <div class="tftl-attrs-grid">
      ${_attrBlock('physique',     data.physique,     'e')}
      ${_attrBlock('technique',    data.technique,    'r')}
      ${_attrBlock('coeur',        data.coeur,        'v')}
      ${_attrBlock('intelligence', data.intelligence, 's')}
    </div>`;

  // ── Compétences (seulement celles > 0)
  const activeSkills = SKILL_KEYS().filter(k => (data.skills?.[k] || 0) > 0);
  const skillsHtml = activeSkills.length ? `
    <div class="preview-section-title">${t('preview_section_skills')}
      <span style="font-family:var(--font-mono);font-size:10px;color:var(--text3);margin-left:4px">
        ${totalSkillsUsed(data)} / ${SKILL_POINTS_TOTAL} pts
      </span>
    </div>
    <div class="tftl-skills-grid">
      ${activeSkills.map(k => _skillRow(k, data.skills[k], keySkills.includes(k))).join('')}
    </div>` : '';

  // ── Éléments narratifs
  const narratifHtml = [
    data.motivation    && _narratifBlock(t('preview_motivation'),    data.motivation),
    data.probleme      && _narratifBlock(t('preview_probleme'),      data.probleme),
    data.fierte        && _narratifBlock(t('preview_fierte'),        data.fierte),
    data.objet_fetiche && _narratifBlock(t('preview_objet_fetiche'), data.objet_fetiche, true),
  ].filter(Boolean).join('');

  // ── Liens
  const liensData = (data.liens || []).filter(l => l && (typeof l === 'object' ? l.label : l));
  const liensHtml = liensData.length ? `
    <div class="preview-section-title">${t('preview_liens')}</div>
    <div class="tftl-liens-list">
      ${liensData.map(l => {
        const label  = typeof l === 'object' ? l.label  : l;
        const detail = typeof l === 'object' ? l.detail : '';
        return `<div class="tftl-lien-chip">
          <div class="lien-label">${esc(label)}</div>
          ${detail ? `<div class="lien-detail">${esc(detail)}</div>` : ''}
        </div>`;
      }).join('')}
    </div>` : '';

  // ── État
  const etat = data.etat || {};
  const etatHtml = `
    <div class="preview-section-title">${t('preview_etat')}</div>
    <div class="tftl-etat-grid">
      ${_etatCheck('contrarie', etat.contrarie, t('etat_contrarie'), '-1')}
      ${_etatCheck('effraye',   etat.effrayé,   t('etat_effraye'),  '-1')}
      ${_etatCheck('epuise',    etat.epuise,    t('etat_epuise'),   '-1')}
      ${_etatCheck('blesse',    etat.blesse,    t('etat_blesse'),   '-1')}
      ${_etatCheck('brise',     etat.brise,     t('etat_brise'),    t('etat_brise_detail'))}
    </div>`;

  // ── Background + chanson
  const bgHtml = data.background ? `
    <div class="preview-section-title">${t('preview_background')}</div>
    <div class="background-preview">${esc(data.background)}</div>` : '';

  const chansonHtml = data.chanson_favorite ? `
    <div class="tftl-chanson">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="13" height="13">
        <path d="M9 3v7.5a2 2 0 11-1-1.73V4.5L6 5V3l3-1v1z"/>
      </svg>
      ${esc(data.chanson_favorite)}
    </div>` : '';

  return `
    ${data.illustration_url
      ? `<img class="preview-illus"
           src="${esc(data.illustration_url)}"
           style="object-position:center ${data.illustration_position || 0}%"
           onclick="openLightbox('${esc(data.illustration_url)}')" alt="">`
      : ''}
    <div class="preview-header">
      <div class="preview-name">${esc(data.name) || '—'}</div>
      ${data.subtitle ? `<div class="preview-sub">${esc(data.subtitle)}</div>` : ''}
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px">
        <div class="preview-rank-badge">${esc(stereo)}</div>
        <div class="tftl-age-badge">${data.age || '?'} ${t('card_age_suffix')}</div>
        <div class="tftl-luck-badge">
          <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10">
            <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.2l-3.7 2.1.7-4.1-3-2.9 4.2-.7z"/>
          </svg>
          ${luck} ${t('luck_label')}
        </div>
      </div>
    </div>

    ${attrsHtml}
    ${skillsHtml}
    ${narratifHtml ? `<div class="preview-section-title">${t('preview_section_narratif')}</div>${narratifHtml}` : ''}
    ${liensHtml}
    ${etatHtml}
    ${bgHtml}
    ${chansonHtml}
  `;
}

function _attrBlock(key, val, cls) {
  const v = val || 1;
  const dots = Array.from({length: 5}, (_, i) =>
    `<div class="pip ${i < v ? cls : 'empty'}"></div>`
  ).join('');
  return `
    <div class="tftl-attr-block ${cls}">
      <div class="val">${v}</div>
      <div class="lbl">${t('attr_' + key)}</div>
      <div class="pips">${dots}</div>
    </div>`;
}

function _skillRow(key, val, isKey) {
  const attr = SKILL_ATTR[key];
  const total = val; // juste la compétence, l'attribut s'ajoute au jet
  const dots = Array.from({length: 5}, (_, i) =>
    `<div class="skill-dot ${i < total ? '' : 'empty'}"></div>`
  ).join('');
  return `
    <div class="tftl-skill-row ${isKey ? 'key-skill' : ''}">
      <div class="skill-name">
        ${isKey ? '<span class="key-marker">★</span>' : ''}
        ${skillLabel(key)}
        <span class="skill-attr-tag">${t('attr_' + attr + '_short')}</span>
      </div>
      <div class="skill-dots">${dots}</div>
      <div class="skill-val">${val}</div>
    </div>`;
}

function _narratifBlock(label, content, isFetiche = false) {
  return `
    <div class="tftl-narratif-block ${isFetiche ? 'fetiche' : ''}">
      <div class="narratif-label">${label}</div>
      <div class="narratif-content">${esc(content)}</div>
    </div>`;
}

function _etatCheck(key, checked, label, penalty) {
  return `
    <div class="tftl-etat-item ${checked ? 'checked' : ''}">
      <div class="etat-box">${checked ? '✕' : ''}</div>
      <div class="etat-info">
        <div class="etat-label">${label}</div>
        <div class="etat-penalty">${penalty}</div>
      </div>
    </div>`;
}


// ── 8. CLÉS i18n SPÉCIFIQUES ──────────────────────────────────

const GAME_I18N = {
  fr: {
    // Stéréotypes
    stereotype_campagnard:  'Campagnard',
    stereotype_excentrique: 'Excentrique',
    stereotype_geek:        'Geek',
    stereotype_intello:     'Intello',
    stereotype_metalleux:   'Métalleux',
    stereotype_rebelle:     'Rebelle',
    stereotype_sportif:     'Sportif',
    stereotype_star:        'Star de l\'école',
    stereotype_combinard:   'Combinard',
    stereotype_frimeur:     'Frimeur',
    stereotype_inventeur:   'Inventeur',
    stereotype_roliste:     'Rôliste',

    // Attributs
    attr_physique:           'Physique',
    attr_physique_short:     'PHY',
    attr_technique:          'Technique',
    attr_technique_short:    'TEC',
    attr_coeur:              'Cœur',
    attr_coeur_short:        'CŒU',
    attr_intelligence:       'Intelligence',
    attr_intelligence_short: 'INT',

    // Compétences
    skill_agilite:       'Agilité',
    skill_force:         'Force',
    skill_furtivite:     'Furtivité',
    skill_analyse:       'Analyse',
    skill_bricolage:     'Bricolage',
    skill_programmation: 'Programmation',
    skill_charisme:      'Charisme',
    skill_charme:        'Charme',
    skill_reseau:        'Réseau',
    skill_comprehension: 'Compréhension',
    skill_decouverte:    'Découverte',
    skill_empathie:      'Empathie',

    // Carte
    card_age_suffix:   'ans',
    card_luck_label:   '★ ',
    luck_label:        'pts de chance',

    // Badges
    tftl_age_badge:  'ans',
    tftl_luck_badge: 'Chance',

    // Sections preview
    preview_section_attrs:    'Attributs',
    preview_section_skills:   'Compétences',
    preview_section_narratif: 'Profil',
    preview_motivation:       'Motivation',
    preview_probleme:         'Problème',
    preview_fierte:           'Fierté',
    preview_objet_fetiche:    'Objet fétiche (+2 dés)',
    preview_liens:            'Liens',
    preview_etat:             'État',
    preview_background:       'Background',

    // État
    etat_contrarie:       'Contrarié',
    etat_effraye:         'Effrayé',
    etat_epuise:          'Épuisé',
    etat_blesse:          'Blessé',
    etat_brise:           'Brisé',
    etat_brise_detail:    'Échec automatique',

    // Éditeur
    editor_field_age:              'Âge',
    editor_field_age_detail:       '(10–15 ans)',
    editor_field_stereotype:       'Stéréotype',
    editor_field_subtitle:         'Surnom / identité réelle',
    editor_field_subtitle_ph:      'Ex : Martine, dite "la Sauterelle"',
    editor_field_name_ph:          'Ex : Thomas Bernard',
    editor_section_attrs:          'Attributs',
    editor_attrs_detail:           'Répartissez un total égal à votre âge (min 1, max 5)',
    editor_pts_hero:               'Points d\'attributs',
    editor_section_skills:         'Compétences',
    editor_pts_aptitudes:          'Points de compétences',
    editor_skills_detail:          '10 points à répartir (max 3 dans les clés du stéréotype)',
    editor_key_skills_label:       'Compétences clés',
    editor_section_narratif:       'Profil',
    editor_motivation_label:       'Motivation',
    editor_motivation_ph:          'Pourquoi s\'exposer aux mystères ?',
    editor_probleme_label:         'Problème',
    editor_probleme_ph:            'Quel problème personnel compli-que la vie ?',
    editor_fierte_label:           'Fierté',
    editor_fierte_ph:              'Ce qui rend le personnage fort (1× par mystère : réussite auto)',
    editor_objet_fetiche_label:    'Objet fétiche',
    editor_objet_fetiche_ph:       'Ex : une vieille radio CB (+2 dés quand utilisé)',
    editor_chanson_label:          'Chanson favorite',
    editor_chanson_ph:             'Ex : "It\'s a Kind of Magic" — Queen',
    editor_section_etat:           'État',
    editor_section_liens:          'Liens',
    editor_liens_add:              '+ Ajouter un lien',
    editor_lien_label_ph:          'Nom ou relation (ex: Sophie, ma meilleure amie)',
    editor_lien_detail_ph:         'Détail du lien (optionnel)',
    editor_section_background:     'Background',
    editor_background_ph:          'Histoire, origines, vie à Auroreville…',

    // Alertes
    alert_char_no_name:  'Donnez un nom à cet enfant.',
  },
  en: {
    stereotype_campagnard:  'Country Kid',
    stereotype_excentrique: 'Weirdo',
    stereotype_geek:        'Geek',
    stereotype_intello:     'Bookworm',
    stereotype_metalleux:   'Headbanger',
    stereotype_rebelle:     'Hooligan',
    stereotype_sportif:     'Jock',
    stereotype_star:        'Popular Kid',
    stereotype_combinard:   'Schemer',
    stereotype_frimeur:     'Troublemaker',
    stereotype_inventeur:   'Inventor',
    stereotype_roliste:     'Roleplayer',

    attr_physique:           'Body',
    attr_physique_short:     'BOD',
    attr_technique:          'Tech',
    attr_technique_short:    'TEC',
    attr_coeur:              'Heart',
    attr_coeur_short:        'HRT',
    attr_intelligence:       'Mind',
    attr_intelligence_short: 'MND',

    skill_agilite:       'Agility',
    skill_force:         'Strength',
    skill_furtivite:     'Sneak',
    skill_analyse:       'Calculate',
    skill_bricolage:     'Tinker',
    skill_programmation: 'Program',
    skill_charisme:      'Lead',
    skill_charme:        'Charm',
    skill_reseau:        'Contact',
    skill_comprehension: 'Comprehend',
    skill_decouverte:    'Investigate',
    skill_empathie:      'Empathize',

    card_age_suffix:   'y.o.',
    card_luck_label:   '★ ',
    luck_label:        'luck pts',

    preview_section_attrs:    'Attributes',
    preview_section_skills:   'Skills',
    preview_section_narratif: 'Profile',
    preview_motivation:       'Drive',
    preview_probleme:         'Problem',
    preview_fierte:           'Pride',
    preview_objet_fetiche:    'Signature Item (+2 dice)',
    preview_liens:            'Relationships',
    preview_etat:             'Conditions',
    preview_background:       'Background',

    etat_contrarie:       'Upset',
    etat_effraye:         'Scared',
    etat_epuise:          'Exhausted',
    etat_blesse:          'Injured',
    etat_brise:           'Broken',
    etat_brise_detail:    'Automatic failure',

    editor_field_age:              'Age',
    editor_field_age_detail:       '(10–15)',
    editor_field_stereotype:       'Archetype',
    editor_field_subtitle:         'Nickname / real identity',
    editor_field_subtitle_ph:      'Ex: Tom "The Brain" Bernard',
    editor_field_name_ph:          'Ex: Thomas Bernard',
    editor_section_attrs:          'Attributes',
    editor_attrs_detail:           'Spend points equal to your age (min 1, max 5)',
    editor_pts_hero:               'Attribute points',
    editor_section_skills:         'Skills',
    editor_pts_aptitudes:          'Skill points',
    editor_skills_detail:          '10 points to spend (up to 3 in key skills)',
    editor_key_skills_label:       'Key skills',
    editor_section_narratif:       'Profile',
    editor_motivation_label:       'Drive',
    editor_motivation_ph:          'Why face the mysteries?',
    editor_probleme_label:         'Problem',
    editor_probleme_ph:            'What personal issue complicates life?',
    editor_fierte_label:           'Pride',
    editor_fierte_ph:              'What makes this kid special (1× per mystery: auto success)',
    editor_objet_fetiche_label:    'Signature Item',
    editor_objet_fetiche_ph:       'Ex: an old CB radio (+2 dice when used)',
    editor_chanson_label:          'Favourite Song',
    editor_chanson_ph:             'Ex: "It\'s a Kind of Magic" — Queen',
    editor_section_etat:           'Conditions',
    editor_section_liens:          'Relationships',
    editor_liens_add:              '+ Add relationship',
    editor_lien_label_ph:          'Name or relation (e.g. Sophie, my best friend)',
    editor_lien_detail_ph:         'Relationship detail (optional)',
    editor_section_background:     'Background',
    editor_background_ph:          'Story, origins, life in town…',

    alert_char_no_name:  'Please give this kid a name.',
  },
};

// Merge dans TRANSLATIONS
Object.keys(GAME_I18N).forEach(lang => {
  if (TRANSLATIONS[lang]) {
    Object.assign(TRANSLATIONS[lang], GAME_I18N[lang]);
  }
});
