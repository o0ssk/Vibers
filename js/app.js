/* ==========================================================================
   USER-DRIVEN STUDY COMPANION APPLICATION CONTROLLER
   Module: js/app.js
   ========================================================================== */

let app = {
  myTerms: [],          // Terms added or uploaded by the user
  myQuestions: [],      // Past exam questions added or uploaded by the user
  activeTermIdx: 0,
  activeQuestionIdx: 0,
  activeTab: 'contexts', // 'contexts' | 'flashcards' | 'questions' | 'quiz'
  cardFlipped: false,
  simplifyQuestion: true,
  quizIdx: 0,
  selectedQuizOpt: null,
  studentExplanation: '',
  isLoading: false
};

// Optional 1-click starter set ONLY if the user clicks "ملء أمثلة سريعة للعرض"
async function loadQuickDemoSamples() {
  setLoading(true, 'جاري تجهيز أمثلة العرض...');
  const sampleWords = ['Argument', 'Encapsulation', 'Liability', 'Justify'];
  for (const w of sampleWords) {
    if (!app.myTerms.some(t => t.term.toLowerCase() === w.toLowerCase())) {
      const analyzed = await window.StudyAnalyzer.analyzeTerm(w);
      app.myTerms.push(analyzed);
    }
  }
  if (app.myQuestions.length === 0) {
    const q = await window.StudyAnalyzer.analyzeQuestion(
      'In the banking application, justify why the developer declared the balance variable as private and only allowed updates through public setter methods?'
    );
    app.myQuestions.push(q);
  }
  app.activeTermIdx = 0;
  setLoading(false);
  renderAll();
}

function setLoading(flag, msg = '') {
  app.isLoading = flag;
  const el = document.getElementById('loading-indicator');
  if (!el) return;
  if (flag) {
    el.textContent = '⏳ ' + msg;
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

// ==========================================================================
// USER INPUT HANDLERS (ADD YOUR OWN TERMS, FILES, OR QUESTIONS)
// ==========================================================================
async function handleAddUserTerms() {
  const termInput = document.getElementById('user-term-input');
  const hintInput = document.getElementById('user-hint-input');
  const raw = termInput.value.trim();
  const customHint = hintInput.value.trim();

  if (!raw) return;

  setLoading(true, 'جاري تحليل المصطلح واستخراج معانيه في أكثر من سياق...');
  const words = raw.split(/[,،\n]+/).map(s => s.trim()).filter(Boolean);

  for (const w of words) {
    const analyzed = await window.StudyAnalyzer.analyzeTerm(w, words.length === 1 ? customHint : '');
    app.myTerms.unshift(analyzed);
  }

  termInput.value = '';
  hintInput.value = '';
  app.activeTermIdx = 0;
  app.cardFlipped = false;
  setLoading(false);
  renderAll();
}

async function handleAddUserQuestion() {
  const qInput = document.getElementById('user-question-input');
  const rawQ = qInput.value.trim();
  if (!rawQ) return;

  setLoading(true, 'جاري ترجمة السؤال وتفكيك كلماته المفتاحية...');
  const analyzedQ = await window.StudyAnalyzer.analyzeQuestion(rawQ);
  app.myQuestions.unshift(analyzedQ);
  app.activeQuestionIdx = 0;
  app.activeTab = 'questions';
  qInput.value = '';
  setLoading(false);
  renderAll();
}

async function handleUserFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  setLoading(true, `جاري قراءة الملف (${file.name}) واستخراج المصطلحات والأسئلة...`);
  try {
    let text = '';
    if (file.name.toLowerCase().endsWith('.pdf') && window.pdfjsLib) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const maxPages = Math.min(pdf.numPages, 6);
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(it => it.str).join(' ') + '\n';
      }
    } else {
      text = await file.text();
    }

    // Extract candidate academic terms from the uploaded file
    const candidates = text.match(/\b[A-Z][a-zA-Z]{4,16}\b/g) || [];
    const ignore = new Set(['Which', 'Where', 'There', 'Their', 'About', 'Would', 'Could', 'Should', 'These', 'Those', 'After', 'Before', 'While', 'Student', 'Course', 'Slide', 'Lecture', 'Question']);
    const uniqueWords = [...new Set(candidates.filter(w => !ignore.has(w)))].slice(0, 5);

    for (const w of uniqueWords) {
      const sentenceMatch = (text.match(new RegExp(`[^.?!\\n]*\\b${w}\\b[^.?!\\n]*`, 'i')) || [''])[0].trim().slice(0, 140);
      const analyzed = await window.StudyAnalyzer.analyzeTerm(w, '', sentenceMatch);
      app.myTerms.unshift(analyzed);
    }

    // Extract any questions ending with '?'
    const questionsFound = text.match(/[A-Z][^.?!\n]*\?/g) || [];
    for (const qStr of questionsFound.slice(0, 3)) {
      const analyzedQ = await window.StudyAnalyzer.analyzeQuestion(qStr);
      app.myQuestions.unshift(analyzedQ);
    }

    app.activeTermIdx = 0;
    app.activeQuestionIdx = 0;
  } catch (e) {}

  setLoading(false);
  renderAll();
}

function removeTerm(idx, ev) {
  ev.stopPropagation();
  app.myTerms.splice(idx, 1);
  if (app.activeTermIdx >= app.myTerms.length) {
    app.activeTermIdx = Math.max(0, app.myTerms.length - 1);
  }
  renderAll();
}

function clearAllWorkspace() {
  app.myTerms = [];
  app.myQuestions = [];
  app.activeTermIdx = 0;
  app.activeQuestionIdx = 0;
  app.studentExplanation = '';
  renderAll();
}

// ==========================================================================
// RENDER CONTROLLER
// ==========================================================================
function switchTab(tabName) {
  app.activeTab = tabName;
  app.selectedQuizOpt = null;
  renderAll();
}

function selectActiveTerm(idx) {
  app.activeTermIdx = idx;
  app.cardFlipped = false;
  app.selectedQuizOpt = null;
  app.studentExplanation = '';
  renderAll();
}

function renderAll() {
  // Update counters
  document.getElementById('count-terms').textContent = app.myTerms.length;
  document.getElementById('count-questions').textContent = app.myQuestions.length;

  // Update tab buttons
  ['contexts', 'flashcards', 'questions', 'quiz'].forEach(t => {
    const btn = document.getElementById('tab-' + t);
    if (btn) {
      btn.classList.toggle('active', app.activeTab === t);
    }
  });

  renderUserTermsList();
  renderMainWorkspace();
}

function renderUserTermsList() {
  const strip = document.getElementById('my-terms-strip');
  const clearBtn = document.getElementById('clear-workspace-btn');

  if (app.myTerms.length === 0) {
    clearBtn.classList.add('hidden');
    strip.innerHTML = `
      <div class="text-sm text-slate-500 py-1">
        دفترك فارغ حاليًا — اكتب أي مصطلح إنجليزي بالأعلى أو ارفع ملف سلايداتك لتبدأ، أو 
        <button onclick="loadQuickDemoSamples()" class="text-blue-600 font-bold underline hover:text-blue-800">اضغط هنا لإضافة 4 مصطلحات وسؤال تجريبي كمثال سريع</button>.
      </div>
    `;
    return;
  }

  clearBtn.classList.remove('hidden');
  strip.innerHTML = app.myTerms.map((item, idx) => {
    const isActive = idx === app.activeTermIdx;
    return `
      <div onclick="selectActiveTerm(${idx})" class="cursor-pointer px-4 py-2 rounded-xl border text-sm font-bold transition flex items-center gap-2.5 ${
        isActive
          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
      }">
        <span class="en-text">${item.term}</span>
        <button onclick="removeTerm(${idx}, event)" title="حذف المصطلح" class="text-xs opacity-65 hover:opacity-100">✕</button>
      </div>
    `;
  }).join('');
}

function renderMainWorkspace() {
  const view = document.getElementById('workspace-view');

  if (app.activeTab === 'questions') {
    view.innerHTML = renderQuestionsView();
    return;
  }

  if (app.myTerms.length === 0) {
    view.innerHTML = `
      <div class="study-card p-10 text-center space-y-4 my-4">
        <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mx-auto">
          📚
        </div>
        <h3 class="text-xl font-bold text-slate-800">أضف مصطلحاتك أو ارفع سلايداتك لتبدأ</h3>
        <p class="text-sm text-slate-500 max-w-lg mx-auto">
          اكتب أي مصطلح إنجليزي تواجهه في دراستك في الحقل العلوي (أو ارفع ملف المحاضرة PDF / TXT)، وسيقوم النظام بشرحه في أكثر من سياق، وصنع بطاقات فلاش كارد وأسئلة اختبار منه فورًا.
        </p>
        <div class="pt-2">
          <button onclick="loadQuickDemoSamples()" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm transition">
            ✨ أو جرّب الآن بـ 4 مصطلحات جامعية جاهزة
          </button>
        </div>
      </div>
    `;
    return;
  }

  const currentTerm = app.myTerms[app.activeTermIdx] || app.myTerms[0];

  if (app.activeTab === 'contexts') {
    view.innerHTML = renderContextsView(currentTerm);
  } else if (app.activeTab === 'flashcards') {
    view.innerHTML = renderFlashcardsView(currentTerm);
  } else if (app.activeTab === 'quiz') {
    view.innerHTML = renderQuizAndExplainView(currentTerm);
  }
}

// ==========================================================================
// TAB 1: MULTI-CONTEXT MEANING VIEW
// ==========================================================================
function renderContextsView(t) {
  return `
    <div class="space-y-6 animate-fade">
      
      <!-- Term Hero Card -->
      <div class="study-card p-6 md:p-8 space-y-5">
        <div class="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="en-text text-3xl md:text-4xl font-extrabold text-slate-900">${t.term}</h2>
              <button onclick="window.StudyAnalyzer.speak('${t.term.replace(/'/g, "\\'")}')" class="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition flex items-center gap-1.5">
                🔊 اسمع النطق: <span>${t.phonetic}</span>
              </button>
            </div>
            <p class="text-base md:text-lg font-bold text-slate-700">
              المعنى المبسط: <span class="text-blue-600">${t.arabicMeaning}</span>
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="switchTab('flashcards')" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition">
              🃏 عرضه كـ فلاش كارد
            </button>
            <button onclick="switchTab('quiz')" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition">
              ✍️ اختبر فهمي فيه
            </button>
          </div>
        </div>

        <!-- 3 Contexts Grid -->
        <div>
          <h3 class="text-sm font-bold text-slate-500 mb-3">كيف يتغير معنى (${t.term}) باختلاف السياق؟</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Context 1: General / Everyday -->
            <div class="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-2">
              <div class="text-xs font-bold text-rose-700">1 · المعنى العام / الحرفي (انتبه للخلط)</div>
              <p class="text-sm text-slate-700 leading-relaxed">${t.generalContext}</p>
            </div>

            <!-- Context 2: Course / Major -->
            <div class="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
              <div class="text-xs font-bold text-blue-700">2 · المعنى في سياق التخصص والمحاضرة</div>
              <p class="text-sm text-slate-800 font-medium leading-relaxed">${t.academicContext}</p>
            </div>

            <!-- Context 3: Exam Context -->
            <div class="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <div class="text-xs font-bold text-emerald-700">3 · كيف يجي في سياق أسئلة الاختبار؟</div>
              <p class="text-sm text-slate-800 font-medium leading-relaxed">${t.examContext}</p>
            </div>

          </div>
        </div>

        <!-- The 3 Keywords & Example Sentence -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div class="text-xs font-bold text-slate-500">🔑 الكلمات المفتاحية المرتبطة بالمصطلح في الاختبار:</div>
            <div class="flex flex-wrap gap-2">
              ${t.keywords.map((kw, i) => `
                <button onclick="window.StudyAnalyzer.speak('${kw.replace(/'/g, "\\'")}')" class="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span class="en-text text-blue-600">${kw}</span>
                  <span class="text-slate-400">(${t.keywordsAr[i] || ''})</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500">💬 مثال في جملة أكاديمية:</span>
              <button onclick="window.StudyAnalyzer.speak('${t.exampleSentence.replace(/'/g, "\\'")}')" class="text-xs text-blue-600 font-bold">🔊 نطق الجملة</button>
            </div>
            <p class="en-text text-sm font-semibold text-slate-800">"${t.exampleSentence}"</p>
          </div>
        </div>

      </div>

    </div>
  `;
}

// ==========================================================================
// TAB 2: INTERACTIVE 3D FLASHCARDS VIEW
// ==========================================================================
function renderFlashcardsView(t) {
  return `
    <div class="max-w-2xl mx-auto space-y-5 animate-fade">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-slate-800">بطاقات المراجعة السريعة (Flashcards)</h3>
          <p class="text-xs text-slate-500">اضغط على البطاقة لقلبها بين المصطلح الإنجليزي وشرحه السياقي بالعربي</p>
        </div>
        <span class="text-xs font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-700">
          بطاقة ${app.activeTermIdx + 1} من ${app.myTerms.length}
        </span>
      </div>

      <!-- 3D Flip Card -->
      <div class="flashcard-perspective" onclick="flipCurrentCard()">
        <div class="flashcard-inner ${app.cardFlipped ? 'flipped' : ''}">
          
          <!-- Front Face (English Term & Example) -->
          <div class="flashcard-face study-card bg-white border-2 border-blue-200">
            <div class="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>الوجه الأمامي (المصطلح بالإنجليزي)</span>
              <button onclick="event.stopPropagation(); window.StudyAnalyzer.speak('${t.term.replace(/'/g, "\\'")}')" class="px-3 py-1 rounded-lg bg-blue-50 text-blue-600">
                🔊 نطق
              </button>
            </div>
            <div class="text-center my-auto py-6 space-y-2">
              <div class="en-text text-4xl font-extrabold text-slate-900">${t.term}</div>
              <div class="text-sm text-slate-500">النطق: ${t.phonetic}</div>
            </div>
            <div class="text-center text-xs font-bold text-blue-600">
              👆 اضغط على البطاقة لقلبها ورؤية المعنى والسياقات بالعربي
            </div>
          </div>

          <!-- Back Face (Arabic Meaning & Contexts) -->
          <div class="flashcard-face flashcard-back shadow-lg">
            <div class="flex items-center justify-between text-xs font-bold text-blue-100">
              <span>الوجه الخلفي (المعنى والسياق)</span>
              <span class="en-text">${t.term}</span>
            </div>
            <div class="my-auto space-y-3">
              <div class="text-lg md:text-xl font-bold text-white">${t.arabicMeaning}</div>
              <div class="text-xs text-blue-100 bg-white/10 p-3 rounded-xl">
                <strong>في التخصص والاختبار:</strong> ${t.academicContext}
              </div>
              <div class="flex flex-wrap gap-1.5">
                ${t.keywords.map(k => `<span class="en-text text-xs px-2.5 py-0.5 rounded bg-white/20 text-white font-bold">${k}</span>`).join('')}
              </div>
            </div>
            <div class="text-center text-xs text-blue-100">
              👆 اضغط للعودة للوجه الأمامي
            </div>
          </div>

        </div>
      </div>

      <!-- Prev / Next Controls -->
      <div class="flex items-center justify-between pt-2">
        <button onclick="prevFlashcard()" class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-xs font-bold text-slate-700">
          ➡️ المصطلح السابق
        </button>
        <button onclick="flipCurrentCard()" class="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold">
          🔄 اقلب البطاقة
        </button>
        <button onclick="nextFlashcard()" class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-xs font-bold text-slate-700">
          المصطلح التالي ⬅️
        </button>
      </div>
    </div>
  `;
}

function flipCurrentCard() {
  app.cardFlipped = !app.cardFlipped;
  renderMainWorkspace();
}

function prevFlashcard() {
  app.activeTermIdx = (app.activeTermIdx - 1 + app.myTerms.length) % app.myTerms.length;
  app.cardFlipped = false;
  renderAll();
}

function nextFlashcard() {
  app.activeTermIdx = (app.activeTermIdx + 1) % app.myTerms.length;
  app.cardFlipped = false;
  renderAll();
}

// ==========================================================================
// TAB 3: EXAM QUESTION SIMPLIFIER VIEW
// ==========================================================================
function renderQuestionsView() {
  if (app.myQuestions.length === 0) {
    return `
      <div class="study-card p-8 text-center space-y-4 animate-fade">
        <div class="text-3xl">🔍</div>
        <h3 class="text-lg font-bold text-slate-800">لم تقم بإضافة سؤال اختبار بعد</h3>
        <p class="text-sm text-slate-500 max-w-md mx-auto">
          الصق أي سؤال إنجليزي من أسئلة السنوات السابقة أو الواجبات في خانة <strong>"الصق سؤال اختبار سابق"</strong> بالأعلى لنقوم بترجمته وتصفية كلماته الصعبة.
        </p>
        <button onclick="loadQuickDemoSamples()" class="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
          أضف سؤالاً تجريبيًا الآن
        </button>
      </div>
    `;
  }

  const q = app.myQuestions[app.activeQuestionIdx] || app.myQuestions[0];

  return `
    <div class="study-card p-6 md:p-8 space-y-6 animate-fade">
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 class="text-xl font-bold text-slate-900">مفكك ومبسّط أسئلة الاختبارات</h3>
          <p class="text-xs text-slate-500">يخفي الكلمات الإنجليزية الجانبية ويبرز لك (فعل السؤال المطلوب + الكلمات المفتاحية للحل)</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="toggleSimplifyQ()" class="px-4 py-2 rounded-xl text-xs font-bold transition ${
            app.simplifyQuestion ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
          }">
            ${app.simplifyQuestion ? '✓ التصفية مفعّلة (إظهار الكل)' : '✨ صفِّ السؤال وأبرِز الكلمات المهمة'}
          </button>
          <button onclick="window.StudyAnalyzer.speak('${q.rawEn.replace(/'/g, "\\'")}')" class="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            🔊 نطق السؤال
          </button>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex flex-wrap gap-4 text-xs font-bold">
        <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-purple-600 inline-block"></span> البنفسجي = فعل السؤال (المطلوب منك)</span>
        <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-emerald-600 inline-block"></span> الأخضر = الكلمات المفتاحية والمصطلحات</span>
        <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-rose-600 inline-block"></span> الأحمر = أداة استثناء أو مقارنة</span>
      </div>

      <!-- Question Tokens Box -->
      <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 en-text text-lg md:text-xl leading-loose ${
        app.simplifyQuestion ? 'simplify-active' : ''
      }">
        ${q.tokens.map(t => `<span class="q-token q-${t.type}">${t.text}</span>`).join(' ')}
      </div>

      <!-- Arabic Translation of Question -->
      <div class="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
        <div class="text-xs font-bold text-emerald-700">🎯 ترجمة ومعنى السؤال بالعربي:</div>
        <div class="text-base md:text-lg font-bold text-slate-900">${q.translatedAr}</div>
      </div>
    </div>
  `;
}

function toggleSimplifyQ() {
  app.simplifyQuestion = !app.simplifyQuestion;
  renderMainWorkspace();
}

// ==========================================================================
// TAB 4: MULTI-FORMAT QUIZ & EXPLAIN IN YOUR OWN WORDS
// ==========================================================================
function renderQuizAndExplainView(t) {
  // Build options dynamically from user's terms + smart distractors
  const otherMeanings = app.myTerms
    .filter(x => x.id !== t.id)
    .map(x => x.arabicMeaning)
    .slice(0, 3);
  while (otherMeanings.length < 3) {
    const fallbacks = [
      'حذف المتغيرات من الذاكرة العشوائية عند إغلاق البرنامج',
      'ترجمة النص ترجمة حرفية دون النظر إلى سياق الجملة',
      'إعادة تشغيل الخادم الرئيسي عند انقطاع الاتصال'
    ];
    otherMeanings.push(fallbacks[otherMeanings.length]);
  }

  const options = [t.arabicMeaning, ...otherMeanings];
  const evalRes = window.StudyAnalyzer.evaluateStudentExplanation(t, app.studentExplanation);

  return `
    <div class="space-y-6 animate-fade">
      
      <!-- Part 1: Context Quiz -->
      <div class="study-card p-6 md:p-8 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span class="text-xs font-bold text-blue-600">الجزء 1 · سؤال اختبار السياق</span>
            <h3 class="text-lg font-bold text-slate-900">إذا جاءك هذا السياق في الاختبار، فما هو المعنى الدقيق لمصطلح (<span class="en-text text-blue-600">${t.term}</span>)؟</h3>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 en-text text-base font-semibold text-slate-800">
          "${t.exampleSentence}"
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${options.map((opt, i) => {
            let style = 'bg-white border-slate-200 hover:border-blue-400';
            if (app.selectedQuizOpt !== null) {
              if (i === 0) style = 'bg-emerald-50 border-emerald-500 text-emerald-900';
              else if (i === app.selectedQuizOpt) style = 'bg-rose-50 border-rose-500 text-rose-900';
            }
            return `
              <button onclick="selectQuizOption(${i})" class="p-4 rounded-xl border text-right text-sm font-bold transition ${style}">
                ${opt}
              </button>
            `;
          }).join('')}
        </div>

        ${app.selectedQuizOpt !== null ? `
          <div class="p-3.5 rounded-xl text-xs font-bold ${
            app.selectedQuizOpt === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }">
            ${app.selectedQuizOpt === 0
              ? '✅ إجابة صحيحة! ربطت المصطلح بسياقه الصحيح.'
              : `❌ الإجابة الصحيحة هي الخيار الأول: ${t.arabicMeaning}`}
          </div>
        ` : ''}
      </div>

      <!-- Part 2: Explain in Your Own Words & Get Evaluated -->
      <div class="study-card p-6 md:p-8 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span class="text-xs font-bold text-emerald-600">الجزء 2 · اشرح المعنى بطريقتك والأداة تقيّمك وتساعدك</span>
            <h3 class="text-lg font-bold text-slate-900">اكتب ما فهمته عن (<span class="en-text text-blue-600">${t.term}</span>) بالعربي أو بالإنجليزي:</h3>
          </div>
          <div class="px-4 py-1.5 rounded-xl bg-slate-100 font-bold text-sm">
            درجة إتقان الإجابة: <span class="${evalRes.score === 100 ? 'text-emerald-600' : 'text-blue-600'}">${evalRes.score}%</span>
          </div>
        </div>

        <textarea id="explain-input" rows="3" dir="auto"
          oninput="onExplanationInput(this.value)"
          placeholder="اشرح معنى المصطلح بكلماتك هنا (بالعربي أو بالإنجليزي)..."
          class="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-sm md:text-base font-medium focus:outline-none">${app.studentExplanation}</textarea>

        <!-- Keyword Helper Chips -->
        <div class="space-y-2">
          <div class="text-xs font-bold text-slate-500">
            💡 اضغط على الكلمات المفتاحية الإنجليزية لإضافتها لإجابتك ورفع تقييمك إلى 100%:
          </div>
          <div class="flex flex-wrap gap-2">
            ${t.keywords.map(kw => {
              const used = evalRes.matchedKeywords.includes(kw);
              return `
                <button onclick="insertKeywordToExplanation('${kw.replace(/'/g, "\\'")}')" class="en-text text-xs px-3 py-1.5 rounded-lg border font-bold transition ${
                  used ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
                }">
                  ${used ? '✓ ' : '+ '}${kw}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs md:text-sm font-bold text-slate-800">
          🤖 تقييم الأداة لشرحك: <span class="text-blue-700">${evalRes.feedback}</span>
        </div>
      </div>

    </div>
  `;
}

function selectQuizOption(idx) {
  app.selectedQuizOpt = idx;
  renderMainWorkspace();
}

function onExplanationInput(val) {
  app.studentExplanation = val;
  const caret = document.getElementById('explain-input')?.selectionStart || val.length;
  renderMainWorkspace();
  const box = document.getElementById('explain-input');
  if (box) {
    box.focus();
    box.setSelectionRange(caret, caret);
  }
}

function insertKeywordToExplanation(kw) {
  app.studentExplanation = (app.studentExplanation + ' ' + kw).trim();
  renderMainWorkspace();
}

window.addEventListener('DOMContentLoaded', renderAll);
