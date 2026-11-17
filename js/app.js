/* ==========================================================================
   CONTEXTKEY — THREE-ZONE LEARNING WORKBENCH CONTROLLER
   Module: js/app.js
   Persists state cleanly under `contextkey_store_v1` (< 500 KB guard)
   ========================================================================== */

const STORAGE_KEY = 'contextkey_store_v1';

const DEFAULT_STATE = {
  schemaVersion: 1,
  activePackId: 'it',
  activeConceptId: 'argument',
  activeStage: 1,            // 1 | 2 | 3
  fadingLevel: 1,            // 1 | 2 | 3
  xrayEnabled: true,
  inspectedTokenIdx: 4,
  activeRoundIdx: 0,         // 0 | 1 | 2
  selectedOptionByRound: {}, // { [`${conceptId}_${roundIdx}`]: optionIdx }
  passedRounds: {},          // { [`${conceptId}_${roundIdx}`]: true }
  missedRounds: {},          // { [`${conceptId}_${roundIdx}`]: true }
  retryQueue: [],            // Array<{ conceptId, packId, term, roundIdx, roundTitle }>
  studentDrafts: {},         // { [conceptId]: string }
  guidedScaffoldDrafts: {},  // { [conceptId]: string }
  draftDir: 'auto',          // 'auto' | 'rtl' | 'ltr'
  fadingVisited: {},         // { [`${conceptId}_${level}`]: true }
  customConcepts: [],
  mobilePanelCollapsed: false
};

let appState = cloneDefaultState();

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.schemaVersion === 1) {
      appState = { ...cloneDefaultState(), ...parsed };
    }
  } catch (e) {
    appState = cloneDefaultState();
  }
}

function saveStore() {
  try {
    const serialized = JSON.stringify(appState);
    if (serialized.length < 480000) {
      localStorage.setItem(STORAGE_KEY, serialized);
    }
  } catch (e) {}
}

function resetDemoState() {
  appState = cloneDefaultState();
  // Mark initial level 1 visited on the default demo concept
  appState.fadingVisited[`${appState.activeConceptId}_1`] = true;
  saveStore();
  renderWorkbench();
}

function getConceptsForPack(packId) {
  const pack = window.VCC_ONTOLOGY.packs[packId] || window.VCC_ONTOLOGY.packs.it;
  const custom = appState.customConcepts.filter(c => c.packId === packId);
  return [...custom, ...pack.concepts];
}

function getActiveConcept() {
  const list = getConceptsForPack(appState.activePackId);
  return list.find(c => c.id === appState.activeConceptId) || list[0];
}

function getConceptMastery(concept) {
  const s1Visited = [1, 2, 3].filter(l => appState.fadingVisited[`${concept.id}_${l}`]).length;
  const stage1Complete = s1Visited >= 2; // Explored fading levels

  const s2Passed = [0, 1, 2].filter(r => appState.passedRounds[`${concept.id}_${r}`]).length;
  const stage2Complete = s2Passed === 3;

  const draft = appState.studentDrafts[concept.id] || '';
  const evalRes = window.VCC_NLP.evaluateRubric(concept, draft);
  const stage3Complete = evalRes.scorePct === 100;

  return { s1Visited, stage1Complete, s2Passed, stage2Complete, evalRes, stage3Complete };
}

// ==========================================================================
// MASTER WORKBENCH RENDERER
// ==========================================================================
function renderWorkbench() {
  const concept = getActiveConcept();
  if (!concept) return;

  // Ensure initial fading level is recorded as visited when Stage 1 is viewed
  if (appState.activeStage === 1) {
    appState.fadingVisited[`${concept.id}_${appState.fadingLevel}`] = true;
  }

  renderZoneA(concept);
  renderContextTopBar(concept);
  renderZoneB(concept);
  renderZoneC(concept);
  saveStore();
}

// ==========================================================================
// ZONE A: NAVIGATION & LEARNING PROGRESS
// ==========================================================================
function renderZoneA(concept) {
  const m = getConceptMastery(concept);
  const stages = [
    {
      id: 1,
      num: '01',
      title: 'فك السياق والسحب التدريجي',
      sub: 'Context Decoder & X-Ray',
      done: m.stage1Complete
    },
    {
      id: 2,
      num: '02',
      title: 'تحدي الأقنعة الثلاثة',
      sub: 'Three-Disguise Gauntlet',
      done: m.stage2Complete
    },
    {
      id: 3,
      num: '03',
      title: 'مقيّم الفهم بعين المصحح',
      sub: 'Explain-to-Pass Evaluator',
      done: m.stage3Complete
    }
  ];

  const navEl = document.getElementById('zone-a-nav');
  navEl.innerHTML = stages.map(s => {
    const isActive = appState.activeStage === s.id;
    const cls = `ck-nav-item ${isActive ? 'is-active' : ''} ${!isActive && s.done ? 'is-done' : ''}`;
    const indicator = s.done && !isActive
      ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
      : s.num;

    return `
      <button type="button" onclick="switchStage(${s.id})" class="${cls}" aria-current="${isActive ? 'step' : 'false'}">
        <span class="ck-nav-num">${indicator}</span>
        <div>
          <div class="ck-nav-title">${s.title}</div>
          <div class="ck-nav-sub ck-en">${s.sub}</div>
        </div>
      </button>
    `;
  }).join('');

  const retryCount = appState.retryQueue.length;
  document.getElementById('rail-retry-count').textContent = retryCount;
  document.getElementById('mobile-retry-count').textContent = retryCount;
}

// ==========================================================================
// TOP CONTEXT BAR: PACKS & CONCEPTS
// ==========================================================================
function renderContextTopBar(activeConcept) {
  const packsEl = document.getElementById('course-pack-pills');
  packsEl.innerHTML = Object.values(window.VCC_ONTOLOGY.packs).map(p => {
    const selected = p.id === appState.activePackId;
    return `
      <button type="button" onclick="selectPack('${p.id}')" class="ck-pill ${selected ? 'is-selected' : ''}">
        <span>${p.titleAr}</span>
        <span class="ck-bidi-chip text-[11px] opacity-75 mr-1">(${p.code})</span>
      </button>
    `;
  }).join('');

  const concepts = getConceptsForPack(appState.activePackId);
  const conceptsEl = document.getElementById('concept-pills');
  conceptsEl.innerHTML = concepts.map(c => {
    const selected = c.id === activeConcept.id;
    return `
      <button type="button" onclick="selectConcept('${c.id}')" class="ck-pill ck-bidi-chip ${selected ? 'is-selected' : ''}">
        ${c.term}
      </button>
    `;
  }).join('');
}

// ==========================================================================
// ZONE B: MAIN LEARNING WORKSPACE
// ==========================================================================
function renderZoneB(concept) {
  const container = document.getElementById('zone-b-workspace');
  if (appState.activeStage === 1) {
    container.innerHTML = renderStage01(concept);
  } else if (appState.activeStage === 2) {
    container.innerHTML = renderStage02(concept);
  } else {
    container.innerHTML = renderStage03(concept);
  }
}

// --------------------------------------------------------------------------
// STAGE 01 — CONTEXT DECODER
// --------------------------------------------------------------------------
function renderStage01(c) {
  const lvl = appState.fadingLevel;
  const levelGoals = {
    1: 'الهدف: كسر رهبة المصطلح عبر شرح عربي واضح مع إبقاء الكلمات الإنجليزية الأساسية معزولة بصريًا.',
    2: 'الهدف: الانتقال إلى جملة إنجليزية مبسطة بدون الاعتماد على الترجمة الحرفية، مع ملاحظة الكلمات الدلالية.',
    3: 'الهدف: قراءة سؤال اختبار أكاديمي كامل واستخدام أشعة X-Ray لتمييز فعل السؤال والمفاتيح والفخاخ.'
  };

  let fadingContentHTML = '';
  if (lvl === 1) {
    fadingContentHTML = `
      <div class="ck-animate space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="ck-badge ck-badge-blue">المستوى 01 — الشرح العربي المطعّم بالمصطلحات</span>
          <button type="button" onclick="window.VCC_NLP.speak('${c.term}. ${c.coreEnglish.replace(/'/g, "\\'")}')" class="ck-btn-secondary py-1.5 px-3 text-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            <span>نطق المصطلح (<span class="text-[#748094]">${c.phonetic}</span>)</span>
          </button>
        </div>
        <div class="bg-white border border-[#E6EAF0] rounded-xl p-5 text-base md:text-lg font-medium text-[#202B3C] leading-loose" dir="rtl">
          ${c.fadingLevels.level1Ar}
        </div>
      </div>
    `;
  } else if (lvl === 2) {
    fadingContentHTML = `
      <div class="ck-animate space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="ck-badge ck-badge-teal">المستوى 02 — جسر الإنجليزي المبسط</span>
          <button type="button" onclick="window.VCC_NLP.speak('${c.fadingLevels.level2SimpleEn.replace(/'/g, "\\'")}')" class="ck-btn-secondary py-1.5 px-3 text-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            <span>استمع للجملة الإنجليزية</span>
          </button>
        </div>
        <div class="bg-white border border-[#E6EAF0] rounded-xl p-5 ck-en text-base md:text-lg font-semibold text-[#172B45] leading-relaxed">
          ${c.fadingLevels.level2SimpleEn}
        </div>
        <div class="text-xs font-medium text-[#0F5C4D] bg-[#DDF3EE]/70 border border-[#BFE6DD] rounded-lg px-3.5 py-2.5">
          ${c.fadingLevels.level2SubAr}
        </div>
      </div>
    `;
  } else {
    const tokens = c.fadingLevels.level3Tokens;
    const inspected = tokens[appState.inspectedTokenIdx] || tokens[0];
    const roleMap = {
      verb: { label: 'فعل السؤال (Command Verb)', cls: 'ck-badge-blue' },
      clue: { label: 'مفتاح السياق (Context Clue)', cls: 'ck-badge-teal' },
      trap: { label: 'فخ / أداة تقييد أو نفي (Trap / Marker)', cls: 'ck-badge-amber' },
      filler: { label: 'كلمة حشو (Filler Word)', cls: 'ck-badge-navy' }
    };
    const rMeta = roleMap[inspected.role] || roleMap.filler;

    fadingContentHTML = `
      <div class="ck-animate space-y-3.5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="ck-badge ck-badge-navy">المستوى 03 — سؤال الاختبار الأكاديمي</span>
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" onclick="toggleXRay()" class="${appState.xrayEnabled ? 'ck-btn-primary' : 'ck-btn-secondary'} py-1.5 px-3.5 text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>${appState.xrayEnabled ? 'أشعة X-Ray: مفعّلة' : 'تفعيل أشعة X-Ray'}</span>
            </button>
            <button type="button" onclick="window.VCC_NLP.speak('${tokens.map(t => t.text).join(' ').replace(/'/g, "\\'")}')" class="ck-btn-secondary py-1.5 px-3 text-xs">
              استماع
            </button>
          </div>
        </div>

        <!-- Compact Legend -->
        <div class="flex flex-wrap items-center gap-2 text-[11px]">
          <span class="ck-badge ck-badge-blue">أفعال السؤال</span>
          <span class="ck-badge ck-badge-teal">مفاتيح السياق</span>
          <span class="ck-badge ck-badge-amber">نفي وفخاخ التشتيت</span>
          <span class="text-[#748094] font-medium">الكلمات الباهتة: حشو يمكن تجاوزه</span>
        </div>

        <!-- X-Ray Interactive Surface -->
        <div class="ck-xray-surface ck-en ${appState.xrayEnabled ? 'ck-xray-on' : ''}">
          ${tokens.map((tok, i) => `
            <span onclick="inspectXRayToken(${i})" class="ck-tok ck-tok-${tok.role} ${i === appState.inspectedTokenIdx ? 'is-inspected' : ''}">${tok.text}</span>
          `).join(' ')}
        </div>

        <!-- Inspected Token Diagnostic Strip -->
        <div class="bg-white border border-[#E6EAF0] rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="ck-badge ${rMeta.cls}">${rMeta.label}</span>
              <span class="ck-bidi-chip text-xs font-bold text-[#172B45]">"${inspected.text}"</span>
            </div>
            <p class="text-xs text-[#202B3C] font-medium m-0">${inspected.explainAr}</p>
          </div>
          <span class="text-[11px] text-[#748094]">اضغط على أي عبارة في السؤال لتحليلها</span>
        </div>

        <div class="bg-[#DDF3EE]/60 border border-[#BFE6DD] rounded-xl px-4 py-3 text-xs md:text-sm text-[#0F5C4D] font-semibold">
          المعنى الدقيق المطلوب في السؤال: <span class="text-[#172B45]">${c.fadingLevels.level3PlainAr}</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="space-y-6 ck-animate">
      
      <!-- Stage Header -->
      <div class="flex flex-wrap items-start justify-between gap-4 border-b border-[#E6EAF0] pb-4">
        <div>
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="ck-badge ck-badge-blue">المرحلة 01</span>
            <h2 class="text-xl md:text-2xl font-bold text-[#172B45] m-0">فك السياق والسحب التدريجي</h2>
            <span class="ck-bidi-chip text-sm font-bold px-2.5 py-0.5 rounded-md bg-[#F7F8FA] border border-[#E6EAF0] text-[#4263D8]">${c.term}</span>
          </div>
          <p class="text-sm text-[#748094] mt-1.5 mb-0">${c.coreArabic}</p>
        </div>
        <button type="button" onclick="switchStage(2)" class="ck-btn-secondary text-xs">
          الانتقال للمرحلة 02
        </button>
      </div>

      <!-- A. Language Fading Slider -->
      <div class="ck-fading-box space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div class="text-sm font-bold text-[#172B45]">مؤشر التدرج اللغوي (Language Fading)</div>
            <div class="text-xs text-[#748094] mt-0.5">${levelGoals[lvl]}</div>
          </div>
        </div>

        <div>
          <div class="ck-slider-track" role="tablist" aria-label="مستويات التدرج اللغوي">
            <button type="button" onclick="setFadingLevel(1)" class="ck-slider-stop ${lvl === 1 ? 'is-active' : ''}">
              <span class="ck-bidi-chip">01</span>
              <span>شرح عربي</span>
            </button>
            <button type="button" onclick="setFadingLevel(2)" class="ck-slider-stop ${lvl === 2 ? 'is-active' : ''}">
              <span class="ck-bidi-chip">02</span>
              <span>إنجليزي مبسط</span>
            </button>
            <button type="button" onclick="setFadingLevel(3)" class="ck-slider-stop ${lvl === 3 ? 'is-active' : ''}">
              <span class="ck-bidi-chip">03</span>
              <span>سؤال اختبار + X-Ray</span>
            </button>
          </div>
          <input type="range" min="1" max="3" step="1" value="${lvl}" oninput="setFadingLevel(Number(this.value))" class="ck-range-input" aria-label="شريط السحب التدريجي للغة" />
        </div>

        ${fadingContentHTML}
      </div>

      <!-- C. Three-Context Comparison -->
      <div class="space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 class="text-sm font-bold text-[#172B45] m-0">مقارنة السياقات الثلاثة — لماذا لا تكفي ترجمة القاموس؟</h3>
          </div>
          <span class="text-xs text-[#748094]">التوأم المربك: <strong class="ck-bidi-chip text-[#172B45]">${c.twinTerm}</strong></span>
        </div>

        <div class="ck-context-grid">
          <div class="ck-context-col col-everyday">
            <div class="space-y-1.5">
              <div class="ck-en text-[11px] font-bold tracking-wider text-[#7A5212]">EVERYDAY MEANING</div>
              <div class="text-sm font-bold text-[#172B45]">المعنى العام أو اليومي</div>
              <p class="text-xs text-[#202B3C] m-0 leading-relaxed">${c.insteadOf.titleAr}</p>
            </div>
            <p class="text-[11px] text-[#748094] m-0 pt-2 border-t border-[#E6EAF0]">${c.insteadOf.trapNoteAr}</p>
          </div>

          <div class="ck-context-col col-major">
            <div class="space-y-1.5">
              <div class="ck-en text-[11px] font-bold tracking-wider text-[#4263D8]">MAJOR MEANING</div>
              <div class="text-sm font-bold text-[#172B45]">المعنى الأكاديمي التخصصي</div>
              <p class="text-xs text-[#202B3C] m-0 leading-relaxed">${c.tryThis.titleAr}</p>
            </div>
            <p class="ck-en text-[11px] text-[#748094] m-0 pt-2 border-t border-[#E6EAF0]">${c.tryThis.titleEn}</p>
          </div>

          <div class="ck-context-col col-exam">
            <div class="space-y-1.5">
              <div class="ck-en text-[11px] font-bold tracking-wider text-[#0F5C4D]">EXAM TRIGGER</div>
              <div class="text-sm font-bold text-[#172B45]">كيف يظهر المفهوم داخل سؤال الاختبار؟</div>
              <p class="text-xs text-[#202B3C] m-0 leading-relaxed">${c.tryThis.twinNoteAr}</p>
            </div>
            <div class="flex flex-wrap gap-1 pt-2 border-t border-[#E6EAF0]">
              ${c.threeKeywords.map(k => `<span class="ck-bidi-chip text-[11px] px-2 py-0.5 rounded bg-[#DDF3EE] text-[#0F5C4D] font-semibold">${k.en}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

// --------------------------------------------------------------------------
// STAGE 02 — THREE-DISGUISE GAUNTLET
// --------------------------------------------------------------------------
function renderStage02(c) {
  const rIdx = appState.activeRoundIdx;
  const round = c.gauntlet[rIdx] || c.gauntlet[0];
  const selKey = `${c.id}_${rIdx}`;
  const selectedOpt = appState.selectedOptionByRound[selKey];
  const hasSubmitted = selectedOpt !== undefined && selectedOpt !== null;
  const isCorrect = hasSubmitted && selectedOpt === round.correctIndex;

  const roundMeta = [
    { num: 'ROUND 01', label: 'فخ المعنى اليومي (False Friend)' },
    { num: 'ROUND 02', label: 'فخ التوأم الأكاديمي (Twin-Term Trap)' },
    { num: 'ROUND 03', label: 'سيناريو اختبار بدون اسم (Blind Scenario)' }
  ];

  return `
    <div class="space-y-6 ck-animate">
      
      <!-- Stage Header -->
      <div class="flex flex-wrap items-start justify-between gap-4 border-b border-[#E6EAF0] pb-4">
        <div>
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="ck-badge ck-badge-blue">المرحلة 02</span>
            <h2 class="text-xl md:text-2xl font-bold text-[#172B45] m-0">تحدي الأقنعة الثلاثة</h2>
            <span class="ck-bidi-chip text-sm font-bold px-2.5 py-0.5 rounded-md bg-[#F7F8FA] border border-[#E6EAF0] text-[#4263D8]">${c.term}</span>
          </div>
          <p class="text-sm text-[#748094] mt-1.5 mb-0">اختبر قدرتك على تمييز المفهوم عندما يتغير قناعه في ورقة الاختبار.</p>
        </div>
        <button type="button" onclick="switchStage(3)" class="ck-btn-secondary text-xs">
          الانتقال للمرحلة 03
        </button>
      </div>

      <!-- 3-Round Progress Stepper -->
      <div class="ck-round-stepper">
        ${roundMeta.map((rm, idx) => {
          const passed = !!appState.passedRounds[`${c.id}_${idx}`];
          const missed = !!appState.missedRounds[`${c.id}_${idx}`] && !passed;
          const active = idx === rIdx;
          return `
            <button type="button" onclick="selectRound(${idx})" class="ck-round-tab ${active ? 'is-active' : ''} ${passed ? 'is-passed' : ''}">
              <div class="flex items-center justify-between gap-2">
                <span class="ck-en text-[11px] font-bold text-[#4263D8]">${rm.num}</span>
                ${passed
                  ? '<span class="ck-badge ck-badge-teal">مجتاز</span>'
                  : (missed ? '<span class="ck-badge ck-badge-amber">في قائمة الإعادة</span>' : '<span class="text-[11px] text-[#748094]">غير مجاب</span>')}
              </div>
              <div class="text-xs font-bold text-[#172B45] mt-1">${rm.label}</div>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Question Card -->
      <div class="bg-[#F7F8FA] border border-[#E6EAF0] rounded-2xl p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="ck-badge ck-badge-navy">${round.titleAr}</span>
          <button type="button" onclick="window.VCC_NLP.speak('${round.stemEn.replace(/'/g, "\\'")}')" class="ck-btn-secondary py-1 px-3 text-xs">
            استماع للسؤال
          </button>
        </div>

        <div class="bg-white border border-[#E6EAF0] rounded-xl p-4 ck-en text-base md:text-lg font-semibold text-[#172B45] leading-relaxed">
          ${round.stemEn}
        </div>

        <div class="text-xs text-[#748094] font-medium">
          تلميح توجيهي: ${round.hintAr}
        </div>

        <!-- Answer Options -->
        <div class="space-y-2.5 pt-1">
          ${round.options.map((opt, oIdx) => {
            let optClass = '';
            if (hasSubmitted) {
              if (oIdx === round.correctIndex) optClass = 'is-correct';
              else if (oIdx === selectedOpt) optClass = 'is-wrong';
            }
            return `
              <button type="button" onclick="submitGauntletAnswer(${oIdx})" class="ck-option-btn ${optClass}">
                <div class="flex-1 text-right" dir="rtl">
                  <div class="text-sm font-bold text-[#202B3C]">${opt.ar}</div>
                  <div class="ck-en text-xs text-[#748094] mt-0.5">${opt.en}</div>
                </div>
                <span class="ck-option-letter">${opt.letter}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Diagnostic Feedback -->
        ${hasSubmitted ? `
          <div class="p-4 rounded-xl border ${
            isCorrect ? 'bg-[#DDF3EE]/70 border-[#BFE6DD]' : 'bg-[#FCEEEF] border-[#F4CBD2]'
          } space-y-2.5 ck-animate">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-sm font-bold ${isCorrect ? 'text-[#0F5C4D]' : 'text-[#A32237]'}">
                ${isCorrect ? 'إجابة دقيقة — تم توثيق إتقان هذا القناع' : 'تعثّر في السياق — أُضيف هذا السؤال إلى قائمة الإعادة'}
              </span>
              <div class="flex items-center gap-2">
                ${!isCorrect ? `
                  <button type="button" onclick="retryCurrentRound()" class="ck-btn-secondary py-1.5 px-3 text-xs">
                    إعادة المحاولة الآن
                  </button>
                ` : ''}
                ${rIdx < 2 ? `
                  <button type="button" onclick="selectRound(${rIdx + 1})" class="ck-btn-primary py-1.5 px-3 text-xs">
                    الجولة التالية
                  </button>
                ` : `
                  <button type="button" onclick="switchStage(3)" class="ck-btn-primary py-1.5 px-3 text-xs">
                    الانتقال لمقيّم الفهم (03)
                  </button>
                `}
              </div>
            </div>
            <p class="text-xs text-[#202B3C] m-0 leading-relaxed">
              <strong>التفسير العلمي:</strong> ${round.feedbackAr}
              ${!isCorrect ? ` — سبب اللبس الشائع في هذا القناع هو الاعتماد على الترجمة السطحية أو الخلط مع (${c.twinTerm}) بدل قراءة سياق الاستخدام الفعلي.` : ''}
            </p>
          </div>
        ` : ''}
      </div>

    </div>
  `;
}

// --------------------------------------------------------------------------
// STAGE 03 — EXPLAIN-TO-PASS EVALUATOR
// --------------------------------------------------------------------------
function renderStage03(c) {
  const draft = appState.studentDrafts[c.id] || '';
  const ev = window.VCC_NLP.evaluateRubric(c, draft);
  const scaffoldText = appState.guidedScaffoldDrafts[c.id] || '';

  const statusBadge = (status, isTrap = false) => {
    if (isTrap) return '<span class="ck-badge ck-badge-rose">خلط مع التوأم</span>';
    if (status === 'demonstrated') return '<span class="ck-badge ck-badge-teal">متحقق</span>';
    if (status === 'partial') return '<span class="ck-badge ck-badge-amber">متحقق جزئيًا</span>';
    return '<span class="ck-badge ck-badge-navy">لم يُرصد بعد</span>';
  };

  const cardStatusCls = (status, isTrap = false) => {
    if (isTrap) return 'status-trap';
    if (status === 'demonstrated') return 'status-demonstrated';
    if (status === 'partial') return 'status-partial';
    return '';
  };

  return `
    <div class="space-y-6 ck-animate">
      
      <!-- Stage Header -->
      <div class="flex flex-wrap items-start justify-between gap-4 border-b border-[#E6EAF0] pb-4">
        <div>
          <div class="flex flex-wrap items-center gap-2.5">
            <span class="ck-badge ck-badge-blue">المرحلة 03</span>
            <h2 class="text-xl md:text-2xl font-bold text-[#172B45] m-0">مقيّم الفهم بعين المصحح</h2>
            <span class="ck-bidi-chip text-sm font-bold px-2.5 py-0.5 rounded-md bg-[#F7F8FA] border border-[#E6EAF0] text-[#4263D8]">${c.term}</span>
          </div>
          <p class="text-sm text-[#748094] mt-1.5 mb-0">اشرح المفهوم بأسلوبك (بالعربية، أو بإنجليزية بسيطة، أو بمزيج منهما) ليتحقق المقيّم من المعايير الثلاثة.</p>
        </div>

        <div class="flex items-center gap-2 bg-[#F7F8FA] border border-[#E6EAF0] px-3.5 py-2 rounded-xl">
          <span class="text-xs font-semibold text-[#748094]">تحقق المعايير:</span>
          <span class="ck-en text-base font-bold ${ev.scorePct === 100 ? 'text-[#0F5C4D]' : 'text-[#172B45]'}">${ev.scorePct}%</span>
        </div>
      </div>

      <!-- B. Demo Attempt Presets -->
      <div class="space-y-2">
        <div class="ck-section-label">نماذج محاكاة سريعة لاختبار المقيّم (قابلة للتعديل الحر):</div>
        <div class="flex flex-wrap gap-2">
          ${c.rubric.sampleDrafts.map((sd, idx) => `
            <button type="button" onclick="applyPresetDraft(${idx})" class="ck-pill text-xs">
              ${sd.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- A. Student Explanation Writing Area -->
      <div class="space-y-2">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <label for="stage3-textarea" class="text-xs font-bold text-[#172B45]">مساحة شرح الطالب (عربي / إنجليزي / مختلط)</label>
          <div class="flex items-center gap-1.5">
            <span class="text-[11px] text-[#748094]">اتجاه النص:</span>
            <button type="button" onclick="setDraftDir('auto')" class="ck-pill py-0.5 px-2 text-[11px] ${appState.draftDir === 'auto' ? 'is-selected' : ''}">تلقائي</button>
            <button type="button" onclick="setDraftDir('rtl')" class="ck-pill py-0.5 px-2 text-[11px] ${appState.draftDir === 'rtl' ? 'is-selected' : ''}">عربي RTL</button>
            <button type="button" onclick="setDraftDir('ltr')" class="ck-pill py-0.5 px-2 text-[11px] ${appState.draftDir === 'ltr' ? 'is-selected' : ''}">إنجليزي LTR</button>
            <button type="button" onclick="clearDraft()" class="text-[11px] text-[#748094] hover:text-[#202B3C] mr-2 font-semibold">مسح</button>
          </div>
        </div>
        <textarea id="stage3-textarea" dir="${appState.draftDir}"
          oninput="onDraftInput(this.value)"
          placeholder="اكتب شرحك للمفهوم بكلماتك هنا... يمكنك البدء بالعربية ثم إضافة الكلمات الإنجليزية المطلوبة."
          class="ck-textarea">${draft}</textarea>
      </div>

      <!-- C. Live Three-Criterion Rubric -->
      <div class="space-y-2.5">
        <div class="ck-section-label">المقيّم الحتمي المباشر (3 معايير مستقلة):</div>
        <div class="ck-rubric-grid">
          
          <!-- Criterion 1 -->
          <div class="ck-rubric-card ${cardStatusCls(ev.c1Status)}">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold text-[#172B45]">1. آلية عمل المفهوم</span>
                ${statusBadge(ev.c1Status)}
              </div>
              <p class="text-[11px] text-[#748094] m-0">فهم وظيفة المفهوم وكيفية عمله (بالعربية أو الإنجليزية).</p>
            </div>
            <div class="text-[11px] text-[#202B3C] pt-2 border-t border-[#E6EAF0]">
              ${ev.matchedArabicWords.length > 0
                ? `رُصد في شرحك العربي: <strong class="text-[#0F5C4D]">${ev.matchedArabicWords.join('، ')}</strong>`
                : (ev.matchedMechEn.length > 0
                  ? `رُصدت مؤشرات آلية: <span class="ck-bidi-chip font-semibold">${ev.matchedMechEn.join(', ')}</span>`
                  : 'اشرح كيف يعمل المفهوم أو ما وظيفته.')}
            </div>
          </div>

          <!-- Criterion 2 -->
          <div class="ck-rubric-card ${cardStatusCls(ev.c2Status)}">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold text-[#172B45]">2. المصطلحات الإنجليزية المطلوبة</span>
                ${statusBadge(ev.c2Status)}
              </div>
              <p class="text-[11px] text-[#748094] m-0">الكلمات المفتاحية الإنجليزية التي يبحث عنها المصحح.</p>
            </div>
            <div class="flex flex-wrap gap-1.5 pt-2 border-t border-[#E6EAF0]">
              ${c.rubric.requiredEnglishTerms.map(kw => {
                const matched = ev.matchedEnKeywords.includes(kw);
                return `<span class="ck-bidi-chip text-[11px] px-2 py-0.5 rounded font-semibold ${
                  matched ? 'bg-[#DDF3EE] text-[#0F5C4D]' : 'bg-[#F7F8FA] text-[#748094] border border-[#E6EAF0]'
                }">${matched ? '✓ ' : ''}${kw}</span>`;
              }).join('')}
            </div>
          </div>

          <!-- Criterion 3 -->
          <div class="ck-rubric-card ${cardStatusCls(ev.c3Status, ev.fellIntoTrap)}">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold text-[#172B45]">3. التمييز عن التوأم (<span class="ck-bidi-chip">${c.twinTerm}</span>)</span>
                ${statusBadge(ev.c3Status, ev.fellIntoTrap)}
              </div>
              <p class="text-[11px] text-[#748094] m-0">
                ${ev.fellIntoTrap
                  ? `تنبيه: التعريف المكتوب يصف (${c.twinTerm}) وليس (${c.term}).`
                  : `توضيح الفارق باستخدام أداة مقارنة (whereas / unlike / بينما).`}
              </p>
            </div>
            <div class="text-[11px] text-[#202B3C] pt-2 border-t border-[#E6EAF0]">
              ${ev.c3Passed ? 'تم توثيق الفارق عن التوأم بوضوح.' : `مطلوب: أداة مقارنة + ذكر (${c.twinTerm}).`}
            </div>
          </div>

        </div>
      </div>

      <!-- D. Guided English Sentence Builder -->
      <div class="bg-[#F7F8FA] border border-[#E6EAF0] rounded-2xl p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div class="text-sm font-bold text-[#172B45]">باني الصياغة الأكاديمية (Guided English Sentence Builder)</div>
            <div class="text-xs text-[#748094] mt-0.5">فهم عربي ← مصطلحات إنجليزية مطلوبة ← إجابة أكاديمية قابلة للتعديل</div>
          </div>
          <button type="button" onclick="applyScaffoldTemplate()" class="ck-btn-secondary py-1.5 px-3 text-xs">
            تعبئة القالب المقترح
          </button>
        </div>

        <!-- Step Transformation Summary -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div class="bg-white border border-[#E6EAF0] rounded-xl p-3">
            <div class="font-bold text-[#172B45] mb-1">ما تحقق في مسودتك العربية / البسيطة:</div>
            <div class="text-[#0F5C4D] font-medium">
              ${ev.matchedArabicWords.length > 0
                ? `تم رصد الفهم الأساسي: (${ev.matchedArabicWords.join(' · ')})`
                : (ev.c1Status !== 'not_detected' ? 'تم رصد آلية المفهوم في إجابتك.' : 'اكتب فهمك أولاً أو اختر نموذج محاكاة من الأعلى.')}
            </div>
          </div>
          <div class="bg-white border border-[#E6EAF0] rounded-xl p-3">
            <div class="font-bold text-[#172B45] mb-1">الكلمات وعبارات الربط الناقصة (اضغط للإدراج):</div>
            <div class="flex flex-wrap gap-1.5">
              ${c.rubric.requiredEnglishTerms.map(kw => `
                <button type="button" onclick="insertIntoScaffold('${kw.replace(/'/g, "\\'")}')" class="ck-kw-chip ${ev.matchedEnKeywords.includes(kw) ? 'is-matched' : ''}">
                  + ${kw}
                </button>
              `).join('')}
              <button type="button" onclick="insertIntoScaffold('whereas ${c.twinTerm}')" class="ck-kw-chip ${ev.c3Passed ? 'is-matched' : ''}">
                + whereas ${c.twinTerm}
              </button>
            </div>
          </div>
        </div>

        <!-- Editable Guided Answer Output -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <label for="scaffold-editor" class="text-xs font-bold text-[#172B45]">الإجابة الأكاديمية المجمّعة (قابلة للتعديل والتقييم الفوري):</label>
            <button type="button" onclick="syncScaffoldToEvaluator()" class="text-xs font-bold text-[#4263D8] hover:underline">
              تقييم هذه الصياغة الآن
            </button>
          </div>
          <textarea id="scaffold-editor" dir="ltr" rows="2"
            oninput="onScaffoldInput(this.value)"
            placeholder="Click keyword chips above or load the template to assemble your concise English exam answer..."
            class="ck-textarea ck-en text-sm">${scaffoldText}</textarea>
        </div>
      </div>

    </div>
  `;
}

// ==========================================================================
// ZONE C: CONTEXT & INTELLIGENCE PANEL (STAGE-AWARE)
// ==========================================================================
function renderZoneC(c) {
  const m = getConceptMastery(c);
  const bodyEl = document.getElementById('zone-c-content');
  if (appState.mobilePanelCollapsed) {
    bodyEl.style.display = 'none';
    return;
  }
  bodyEl.style.display = 'flex';
  bodyEl.style.flexDirection = 'column';
  bodyEl.style.gap = '16px';

  const stageObjectives = {
    1: {
      title: 'مهمة المرحلة 01',
      desc: 'حرّك مؤشر السحب من العربي إلى سؤال الاختبار، وفعّل أشعة X-Ray لتمييز أفعال السؤال عن الحشو.'
    },
    2: {
      title: 'مهمة المرحلة 02',
      desc: 'اجتز الأقنعة الثلاثة دون الوقوع في فخ المعنى العام أو الخلط مع التوأم الأكاديمي.'
    },
    3: {
      title: 'مهمة المرحلة 03',
      desc: 'حوّل فهمك العربي إلى إجابة أكاديمية تتضمن الكلمات الإنجليزية المطلوبة والتمييز عن التوأم.'
    }
  };
  const obj = stageObjectives[appState.activeStage];

  bodyEl.innerHTML = `
    <!-- Selected Concept Card -->
    <div class="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E6EAF0] space-y-2">
      <div class="flex items-center justify-between gap-2">
        <span class="ck-bidi-chip text-base font-bold text-[#172B45]">${c.term}</span>
        <button type="button" onclick="window.VCC_NLP.speak('${c.term.replace(/'/g, "\\'")}')" class="ck-btn-secondary py-1 px-2.5 text-[11px]">
          نطق
        </button>
      </div>
      <div class="text-xs text-[#748094]">النطق التقريبي: ${c.phonetic}</div>
      <div class="text-xs text-[#202B3C] pt-1 border-t border-[#E6EAF0]">
        المصطلح التوأم: <strong class="ck-bidi-chip text-[#4263D8]">${c.twinTerm}</strong>
      </div>
    </div>

    <!-- Active Learning Objective -->
    <div class="p-3.5 rounded-xl bg-[#EEF0FF]/70 border border-[#4263D8]/20 space-y-1">
      <div class="text-xs font-bold text-[#4263D8]">${obj.title}</div>
      <p class="text-xs text-[#202B3C] m-0 leading-relaxed">${obj.desc}</p>
    </div>

    <!-- Live Mastery Receipt -->
    <div class="space-y-2">
      <div class="ck-section-label">إيصال الإتقان الفعلي (Mastery Receipt)</div>
      <div class="border border-[#E6EAF0] rounded-xl divide-y divide-[#E6EAF0] text-xs">
        <div class="px-3.5 py-2.5 flex items-center justify-between">
          <span class="text-[#202B3C] font-medium">01 · مستويات التدرج</span>
          <span class="ck-badge ${m.stage1Complete ? 'ck-badge-teal' : 'ck-badge-navy'}">${m.s1Visited} / 3</span>
        </div>
        <div class="px-3.5 py-2.5 flex items-center justify-between">
          <span class="text-[#202B3C] font-medium">02 · الأقنعة المجتازة</span>
          <span class="ck-badge ${m.stage2Complete ? 'ck-badge-teal' : 'ck-badge-navy'}">${m.s2Passed} / 3</span>
        </div>
        <div class="px-3.5 py-2.5 flex items-center justify-between">
          <span class="text-[#202B3C] font-medium">03 · درجة المقيّم</span>
          <span class="ck-badge ${m.stage3Complete ? 'ck-badge-teal' : 'ck-badge-navy'}">${m.evalRes.scorePct}%</span>
        </div>
      </div>
    </div>

    <!-- Retry Queue Summary -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="ck-section-label">ملخص قائمة الإعادة</span>
        <span class="ck-badge ${appState.retryQueue.length > 0 ? 'ck-badge-amber' : 'ck-badge-teal'}">${appState.retryQueue.length}</span>
      </div>
      ${appState.retryQueue.length === 0
        ? `<p class="text-xs text-[#748094] m-0 p-3 rounded-xl bg-[#F7F8FA] border border-[#E6EAF0]">لا توجد أخطاء معلقة حاليًا. أي جولة تتعثر فيها بالمرحلة 02 ستظهر هنا للمراجعة الفورية.</p>`
        : `<div class="space-y-1.5">
            ${appState.retryQueue.map((item, idx) => `
              <button type="button" onclick="jumpToRetryItem(${idx})" class="w-full text-right p-2.5 rounded-xl bg-[#F5E8C9]/50 hover:bg-[#F5E8C9] border border-[#E5CFA0] text-xs transition flex items-center justify-between">
                <div>
                  <div class="font-bold text-[#172B45] ck-bidi-chip">${item.term}</div>
                  <div class="text-[11px] text-[#7A5212]">${item.roundTitle}</div>
                </div>
                <span class="text-[11px] font-bold text-[#7A5212]">إعادة</span>
              </button>
            `).join('')}
          </div>`
      }
    </div>
  `;
}

// ==========================================================================
// INTERACTION HANDLERS
// ==========================================================================
function switchStage(stageNum) {
  appState.activeStage = stageNum;
  renderWorkbench();
}

function selectPack(packId) {
  appState.activePackId = packId;
  const first = getConceptsForPack(packId)[0];
  if (first) appState.activeConceptId = first.id;
  appState.fadingLevel = 1;
  appState.activeRoundIdx = 0;
  renderWorkbench();
}

function selectConcept(conceptId) {
  appState.activeConceptId = conceptId;
  appState.fadingLevel = 1;
  appState.activeRoundIdx = 0;
  appState.inspectedTokenIdx = 2;
  renderWorkbench();
}

function setFadingLevel(lvl) {
  appState.fadingLevel = lvl;
  const c = getActiveConcept();
  appState.fadingVisited[`${c.id}_${lvl}`] = true;
  renderWorkbench();
}

function toggleXRay() {
  appState.xrayEnabled = !appState.xrayEnabled;
  renderWorkbench();
}

function inspectXRayToken(idx) {
  appState.inspectedTokenIdx = idx;
  renderWorkbench();
}

function selectRound(rIdx) {
  appState.activeRoundIdx = rIdx;
  renderWorkbench();
}

function submitGauntletAnswer(optIdx) {
  const c = getActiveConcept();
  const rIdx = appState.activeRoundIdx;
  const round = c.gauntlet[rIdx];
  const key = `${c.id}_${rIdx}`;

  appState.selectedOptionByRound[key] = optIdx;

  if (optIdx === round.correctIndex) {
    appState.passedRounds[key] = true;
    delete appState.missedRounds[key];
    appState.retryQueue = appState.retryQueue.filter(q => !(q.conceptId === c.id && q.roundIdx === rIdx));
  } else {
    delete appState.passedRounds[key];
    appState.missedRounds[key] = true;
    const exists = appState.retryQueue.some(q => q.conceptId === c.id && q.roundIdx === rIdx);
    if (!exists) {
      appState.retryQueue.push({
        conceptId: c.id,
        packId: appState.activePackId,
        term: c.term,
        roundIdx: rIdx,
        roundTitle: round.titleAr
      });
    }
  }
  renderWorkbench();
}

function retryCurrentRound() {
  const c = getActiveConcept();
  const key = `${c.id}_${appState.activeRoundIdx}`;
  delete appState.selectedOptionByRound[key];
  renderWorkbench();
}

function openRetryQueue() {
  if (appState.retryQueue.length === 0) {
    appState.activeStage = 2;
    renderWorkbench();
    return;
  }
  jumpToRetryItem(0);
}

function jumpToRetryItem(idx) {
  const item = appState.retryQueue[idx];
  if (!item) return;
  appState.activePackId = item.packId;
  appState.activeConceptId = item.conceptId;
  appState.activeStage = 2;
  appState.activeRoundIdx = item.roundIdx;
  delete appState.selectedOptionByRound[`${item.conceptId}_${item.roundIdx}`];
  renderWorkbench();
}

function applyPresetDraft(idx) {
  const c = getActiveConcept();
  const preset = c.rubric.sampleDrafts[idx];
  if (!preset) return;
  appState.studentDrafts[c.id] = preset.text;
  renderWorkbench();
}

function onDraftInput(val) {
  const c = getActiveConcept();
  appState.studentDrafts[c.id] = val;
  const caret = document.getElementById('stage3-textarea')?.selectionStart || val.length;
  renderWorkbench();
  const ta = document.getElementById('stage3-textarea');
  if (ta) {
    ta.focus();
    ta.setSelectionRange(caret, caret);
  }
}

function setDraftDir(dir) {
  appState.draftDir = dir;
  renderWorkbench();
}

function clearDraft() {
  const c = getActiveConcept();
  appState.studentDrafts[c.id] = '';
  renderWorkbench();
}

function insertIntoScaffold(snippet) {
  const c = getActiveConcept();
  const curr = appState.guidedScaffoldDrafts[c.id] || '';
  const updated = (curr ? curr + ' ' + snippet : `${c.term}: ${snippet}`).trim();
  appState.guidedScaffoldDrafts[c.id] = updated;
  appState.studentDrafts[c.id] = updated;
  renderWorkbench();
}

function applyScaffoldTemplate() {
  const c = getActiveConcept();
  appState.guidedScaffoldDrafts[c.id] = c.rubric.scaffoldTemplateEn;
  appState.studentDrafts[c.id] = c.rubric.scaffoldTemplateEn;
  renderWorkbench();
}

function onScaffoldInput(val) {
  const c = getActiveConcept();
  appState.guidedScaffoldDrafts[c.id] = val;
  saveStore();
}

function syncScaffoldToEvaluator() {
  const c = getActiveConcept();
  const val = appState.guidedScaffoldDrafts[c.id] || '';
  if (val.trim()) {
    appState.studentDrafts[c.id] = val;
    renderWorkbench();
  }
}

function toggleMobileIntelPanel() {
  appState.mobilePanelCollapsed = !appState.mobilePanelCollapsed;
  renderZoneC(getActiveConcept());
  saveStore();
}

// ==========================================================================
// MATERIAL UPLOAD & CUSTOM CONCEPT MODAL
// ==========================================================================
function toggleIngestionModal() {
  document.getElementById('ck-ingestion-modal').classList.toggle('is-hidden');
}

function submitCustomMaterial() {
  const termEn = document.getElementById('inp-custom-term').value.trim();
  const termAr = document.getElementById('inp-custom-ar').value.trim();
  const qStem = document.getElementById('inp-custom-question').value.trim();
  if (!termEn && !qStem) return;

  const newC = window.VCC_NLP.buildCustomConcept(
    termEn || 'Exam Question Stem',
    termAr,
    qStem,
    appState.activePackId
  );
  appState.customConcepts.unshift(newC);
  appState.activeConceptId = newC.id;
  appState.activeStage = 1;
  appState.fadingLevel = qStem && !termEn ? 3 : 1;

  document.getElementById('inp-custom-term').value = '';
  document.getElementById('inp-custom-ar').value = '';
  document.getElementById('inp-custom-question').value = '';
  toggleIngestionModal();
  renderWorkbench();
}

async function handleMaterialUpload(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const statusEl = document.getElementById('upload-status-msg');
  statusEl.classList.remove('hidden');
  statusEl.textContent = `جاري فحص الملف (${file.name})...`;

  const { text, error } = await window.VCC_NLP.extractTextFromFile(file);
  if (error) {
    statusEl.textContent = error;
    return;
  }

  const lower = text.toLowerCase();
  let matchedConcept = null;
  for (const pk of Object.keys(window.VCC_ONTOLOGY.packs)) {
    for (const c of window.VCC_ONTOLOGY.packs[pk].concepts) {
      if (lower.includes(c.term.toLowerCase())) {
        appState.activePackId = pk;
        matchedConcept = c;
        break;
      }
    }
    if (matchedConcept) break;
  }

  const extractedQ = (text.match(/[A-Z][^.?!\n]*\?/g) || [])[0];
  if (matchedConcept) {
    appState.activeConceptId = matchedConcept.id;
    appState.activeStage = 1;
    appState.fadingLevel = 3;
    statusEl.textContent = `تمت مطابقة المفهوم (${matchedConcept.term}) من ملفك وتفعيل مرحلة السياق وأشعة X-Ray.`;
  } else {
    const built = window.VCC_NLP.buildCustomConcept(
      file.name.replace(/\.[^.]+$/, ''),
      `سؤال أو مفهوم مستخرج من الملف (${file.name})`,
      extractedQ || text.slice(0, 180),
      appState.activePackId
    );
    appState.customConcepts.unshift(built);
    appState.activeConceptId = built.id;
    appState.activeStage = 1;
    appState.fadingLevel = 3;
    statusEl.textContent = `تم استخراج النص وتجهيز نموذج المفهوم وأشعة X-Ray للملف (${file.name}).`;
  }

  setTimeout(() => {
    toggleIngestionModal();
    renderWorkbench();
  }, 500);
}

// ==========================================================================
// BOOTSTRAP
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  loadStore();
  renderWorkbench();
});
