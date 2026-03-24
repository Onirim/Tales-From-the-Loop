// ══════════════════════════════════════════════════════════════
// TALES FROM THE LOOP — Éditeur de personnage (Enfant)
// Remplace editor.js du template Energy System
// ══════════════════════════════════════════════════════════════

function newChar() {
  editingId = null;
  state     = freshState();
  populateEditor();
  showView('editor');
}

function editChar(id, dataOverride) {
  editingId = id;
  const src = dataOverride || (id ? chars[id] : null) || freshState();
  state = JSON.parse(JSON.stringify(src));
  if (!state.skills)  state.skills  = {};
  if (!state.liens)   state.liens   = [];
  if (!state.etat)    state.etat    = {};
  if (!state.tags)    state.tags    = [];
  if (editingId && charTagMap[editingId]) {
    state.tags = charTagMap[editingId]
      .map(tid => allTags.find(tg => tg.id === tid))
      .filter(Boolean);
  }
  populateEditor();
  showView('editor');
}

function populateEditor() {
  document.getElementById('f-name').value      = state.name || '';
  document.getElementById('f-sub').value       = state.subtitle || '';
  document.getElementById('f-age').value       = state.age || 12;
  document.getElementById('f-stereotype').value = state.stereotype || 'geek';

  const pubCb = document.getElementById('f-public');
  if (pubCb) {
    pubCb.checked = state.is_public || false;
    document.getElementById('public-label').textContent =
      pubCb.checked ? t('share_code_active') : t('share_code_inactive');
  }
  _updateShareCodeBox();

  _renderAttrs();
  _renderSkills();
  _renderNarratif();
  _renderLiens();
  _renderEtat();

  const bgField = document.getElementById('f-background');
  if (bgField) bgField.value = state.background || '';

  renderTagChips();
  setIllusPreview(state.illustration_url || '', state.illustration_position || 0);
  updatePreview();
  updatePtsDisplay();
  updateAptPtsDisplay();
}

// ── Share code ─────────────────────────────────────────────────
function _updateShareCodeBox() {
  const scBox = document.getElementById('share-code-box');
  const scVal = document.getElementById('share-code-val');
  if (!scBox || !scVal) return;
  const code = state.share_code || (editingId && chars[editingId]?.share_code) || null;
  if (state.is_public && code) {
    scVal.textContent   = code;
    scBox.style.display = 'flex';
  } else {
    scBox.style.display = 'none';
  }
}

// ── Attributs ─────────────────────────────────────────────────
function _renderAttrs() {
  updatePtsDisplay();
  ['physique', 'technique', 'coeur', 'intelligence'].forEach(attr => {
    const el = document.getElementById('val-' + attr);
    if (el) el.textContent = state[attr] || 1;
    // coûts
    const cost = document.getElementById('cost-' + attr);
    if (cost) cost.textContent = (state[attr] || 1) + ' pts';
  });
}

function changeAttr(attr, delta) {
  const cur = state[attr] || 1;
  const nv  = Math.max(1, Math.min(5, cur + delta));
  state[attr] = nv;
  const el = document.getElementById('val-' + attr);
  if (el) el.textContent = nv;
  const cost = document.getElementById('cost-' + attr);
  if (cost) cost.textContent = nv + ' pts';
  updatePtsDisplay();
  updatePreview();
}

function updatePtsDisplay() {
  const used = totalAttrUsed(state);
  const max  = attrPoints(state.age || 12);
  const el   = document.getElementById('pts-display');
  if (el) {
    el.textContent = `${used} / ${max}`;
    el.className   = 'pts-value ' + (used > max ? 'over' : 'ok');
  }
  // Recalcule les chances
  const luckEl = document.getElementById('luck-display');
  if (luckEl) luckEl.textContent = luckPoints(state.age || 12);
}

function updateRankMax() {
  // utilisé par l'age maintenant
  state.age = parseInt(document.getElementById('f-age')?.value || 12);
  updatePtsDisplay();
  updateAptPtsDisplay();
  updatePreview();
}

// ── Compétences ────────────────────────────────────────────────
function _renderSkills() {
  const keySkills = STEREOTYPES[state.stereotype]?.skills || [];
  const container = document.getElementById('skills-list');
  if (!container) return;

  container.innerHTML = SKILL_KEYS().map(key => {
    const val    = state.skills?.[key] || 0;
    const isKey  = keySkills.includes(key);
    const attr   = SKILL_ATTR[key];
    return `
      <div class="skill-editor-row ${isKey ? 'key-skill' : ''}">
        <div class="skill-editor-name">
          ${isKey ? '<span class="key-marker">★</span>' : ''}
          ${skillLabel(key)}
          <span class="skill-attr-tag">${t('attr_' + attr + '_short')}</span>
        </div>
        <div class="skill-ctrl">
          <button onclick="changeSkill('${key}', -1)">−</button>
          <div class="skill-val ${val === 0 ? 'zero' : ''}" id="skill-val-${key}">${val}</div>
          <button onclick="changeSkill('${key}', 1)">+</button>
        </div>
      </div>`;
  }).join('');

  updateAptPtsDisplay();
}

function changeSkill(key, delta) {
  if (!state.skills) state.skills = {};
  const cur = state.skills[key] || 0;
  const nv  = Math.max(0, Math.min(5, cur + delta));
  state.skills[key] = nv;
  const el = document.getElementById('skill-val-' + key);
  if (el) { el.textContent = nv; el.className = 'skill-val ' + (nv === 0 ? 'zero' : ''); }
  updateAptPtsDisplay();
  updatePreview();
}

function updateAptPtsDisplay() {
  const used = totalSkillsUsed(state);
  const max  = SKILL_POINTS_TOTAL;
  const el   = document.getElementById('apt-pts-display');
  if (el) {
    el.textContent = `${used} / ${max}`;
    el.className   = `val ${used > max ? 'over' : 'ok'}`;
  }
}

// ── Narratif ───────────────────────────────────────────────────
function _renderNarratif() {
  _setVal('f-motivation',    state.motivation    || '');
  _setVal('f-probleme',      state.probleme      || '');
  _setVal('f-fierte',        state.fierte        || '');
  _setVal('f-objet-fetiche', state.objet_fetiche || '');
  _setVal('f-chanson',       state.chanson_favorite || '');
}
function _setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

// ── Liens ──────────────────────────────────────────────────────
function _renderLiens() {
  const container = document.getElementById('liens-list');
  if (!container) return;
  container.innerHTML = (state.liens || []).map((l, i) => {
    const label  = typeof l === 'object' ? (l.label  || '') : l;
    const detail = typeof l === 'object' ? (l.detail || '') : '';
    return `
      <div class="compl-entry" style="margin-bottom:8px">
        <div class="compl-entry-header">
          <input type="text"
            placeholder="${t('editor_lien_label_ph')}"
            value="${esc(label)}"
            oninput="setLienLabel(${i}, this.value)">
          <button class="rm-btn" onclick="removeLien(${i})">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/>
            </svg>
          </button>
        </div>
        <textarea
          placeholder="${t('editor_lien_detail_ph')}"
          oninput="setLienDetail(${i}, this.value)">${esc(detail)}</textarea>
      </div>`;
  }).join('');
}

function setLienLabel(i, val) {
  if (!state.liens) state.liens = [];
  if (typeof state.liens[i] !== 'object') state.liens[i] = { label: '', detail: '' };
  state.liens[i].label = val;
  updatePreview();
}
function setLienDetail(i, val) {
  if (!state.liens) state.liens = [];
  if (typeof state.liens[i] !== 'object') state.liens[i] = { label: '', detail: '' };
  state.liens[i].detail = val;
  updatePreview();
}
function addLien() {
  if (!state.liens) state.liens = [];
  state.liens.push({ label: '', detail: '' });
  _renderLiens();
}
function removeLien(i) {
  state.liens.splice(i, 1);
  _renderLiens();
  updatePreview();
}

// ── État ────────────────────────────────────────────────────────
function _renderEtat() {
  if (!state.etat) state.etat = {};
  ['contrarie', 'effraye', 'epuise', 'blesse', 'brise'].forEach(key => {
    // on stocke 'effrayé' avec accent dans le state
    const stateKey = key === 'effraye' ? 'effrayé' : key;
    const cb = document.getElementById('etat-' + key);
    if (cb) cb.checked = state.etat[stateKey] || false;
  });
}

function toggleEtat(key) {
  if (!state.etat) state.etat = {};
  const stateKey = key === 'effraye' ? 'effrayé' : key;
  state.etat[stateKey] = !state.etat[stateKey];
  updatePreview();
}

// ── Preview ────────────────────────────────────────────────────
function updatePreview() {
  state.name             = document.getElementById('f-name')?.value      || state.name;
  state.subtitle         = document.getElementById('f-sub')?.value       || '';
  state.age              = parseInt(document.getElementById('f-age')?.value || 12);
  state.stereotype       = document.getElementById('f-stereotype')?.value  || state.stereotype;
  state.motivation       = document.getElementById('f-motivation')?.value   || '';
  state.probleme         = document.getElementById('f-probleme')?.value     || '';
  state.fierte           = document.getElementById('f-fierte')?.value       || '';
  state.objet_fetiche    = document.getElementById('f-objet-fetiche')?.value|| '';
  state.chanson_favorite = document.getElementById('f-chanson')?.value      || '';
  state.background       = document.getElementById('f-background')?.value   || '';

  const pubCb = document.getElementById('f-public');
  if (pubCb) {
    state.is_public = pubCb.checked;
    document.getElementById('public-label').textContent =
      pubCb.checked ? t('share_code_active') : t('share_code_inactive');
  }
  _updateShareCodeBox();
  updateAptPtsDisplay();
  updatePtsDisplay();

  // Re-render compétences si stéréotype a changé
  _renderSkills();

  document.getElementById('preview-content').innerHTML = renderCharSheet(state);
}

// ── Save / Share ───────────────────────────────────────────────
function saveChar() { saveCharToDB(); }

function shareChar() {
  if (!state.is_public) { showToast(t('toast_share_need_public')); return; }
  const code = state.share_code || (editingId && chars[editingId]?.share_code);
  if (!code) { showToast(t('toast_share_need_save')); return; }
  copyUrl(buildShareUrl('char', code));
}

function copyShareCode() {
  const code = document.getElementById('share-code-val')?.textContent;
  if (!code || code === '—') return;
  navigator.clipboard.writeText(code)
    .then(() => showToast(ti('toast_code_copied', { code })))
    .catch(() => prompt(t('share_code_prompt_short'), code));
}

// ── Mobile tabs ────────────────────────────────────────────────
function switchMobTab(tab) {
  const form    = document.getElementById('editor-form');
  const preview = document.getElementById('preview-panel');
  const btnForm = document.getElementById('mob-tab-form');
  const btnPrev = document.getElementById('mob-tab-preview');
  if (!form || !preview) return;
  if (tab === 'form') {
    form.classList.remove('mob-hidden');   preview.classList.add('mob-hidden');
    btnForm?.classList.add('active');      btnPrev?.classList.remove('active');
  } else {
    form.classList.add('mob-hidden');      preview.classList.remove('mob-hidden');
    btnForm?.classList.remove('active');   btnPrev?.classList.add('active');
  }
}

// stubs pour compatibilité scripts.js
function renderPowers()        {}
function renderAptitudes()     {}
function renderTraits()        {}
function renderComplications() {}
function changeXP()            {}
function addPower()            {}
function removePower()         {}
function changeApt()           {}
function changeTrait()         {}
function addTrait()            {}
function removeTrait()         {}
function addComplication()     {}
function removeComplication()  {}
function setComplLabel()       {}
function setComplDetail()      {}
