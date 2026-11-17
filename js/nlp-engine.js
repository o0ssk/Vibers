/* ==========================================================================
   DETERMINISTIC BILINGUAL NLP, X-RAY TOKENIZER & RUBRIC ENGINE
   Module: js/nlp-engine.js
   Zero backend, zero external LLM calls, deterministic client-side execution.
   ========================================================================== */

window.VCC_NLP = (function () {
  const ACTION_VERBS = new Set([
    'justify', 'distinguish', 'trace', 'compare', 'contrast', 'evaluate',
    'analyze', 'explain', 'define', 'identify', 'classify', 'calculate', 'why', 'how'
  ]);

  const TRAP_MARKERS = new Set([
    'except', 'not', 'never', 'only', 'solely', 'exclusively', 'least',
    'instead', 'rather', 'false', 'incorrect', 'without', 'merely'
  ]);

  const STOPWORDS = new Set([
    'in', 'the', 'of', 'a', 'an', 'to', 'for', 'on', 'at', 'by', 'from',
    'with', 'about', 'into', 'during', 'after', 'before', 'consider',
    'following', 'given', 'based', 'last', 'semester', 'developed',
    'module', 'subsystem', 'application', 'that', 'this', 'which'
  ]);

  function normalizeArabic(str) {
    if (!str) return '';
    const cleaned = str
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, ' ');

    return cleaned
      .split(/\s+/)
      .map(w => {
        if (w.length >= 5 && (w.startsWith('وال') || w.startsWith('بال') || w.startsWith('كال') || w.startsWith('فال'))) {
          return w.slice(3);
        }
        if (w.length >= 4 && (w.startsWith('ال') || w.startsWith('لل'))) {
          return w.slice(2);
        }
        return w;
      })
      .join(' ');
  }

  function normalizeEnglish(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  }

  function evaluateRubric(concept, rawInput) {
    const text = (rawInput || '').trim();
    const normAr = normalizeArabic(text);
    const normEn = normalizeEnglish(text);
    const r = concept.rubric;

    // Criterion 1: Concept Mechanism (Arabic or English stems)
    const matchedMechAr = r.mechanismStemsAr.filter(s => normAr.includes(normalizeArabic(s)));
    const matchedMechEn = r.mechanismStemsEn.filter(s => normEn.includes(s.toLowerCase()));
    const mechHits = matchedMechAr.length + matchedMechEn.length;
    const c1Status = mechHits >= 2 ? 'demonstrated' : (mechHits === 1 ? 'partial' : 'not_detected');
    const c1Passed = c1Status === 'demonstrated';

    // Criterion 2: Required English Grading Keywords
    const matchedEnKeywords = r.requiredEnglishTerms.filter(kw => normEn.includes(kw.toLowerCase()));
    const missingEnKeywords = r.requiredEnglishTerms.filter(kw => !normEn.includes(kw.toLowerCase()));
    const reqThreshold = r.requiredEnglishTerms.length === 1 ? 1 : 2;
    const c2Status = matchedEnKeywords.length >= reqThreshold
      ? 'demonstrated'
      : (matchedEnKeywords.length >= 1 ? 'partial' : 'not_detected');
    const c2Passed = c2Status === 'demonstrated';

    // Criterion 3: Twin-Term Distinction & Confusion Trap Guard
    const hasBoundary = r.boundaryMarkers.some(m => normAr.includes(normalizeArabic(m)) || normEn.includes(m.toLowerCase()));
    const hasTwin = r.twinStems.some(t => normAr.includes(normalizeArabic(t)) || normEn.includes(t.toLowerCase()));
    const fellIntoTrap = !hasBoundary && hasTwin && !c1Passed;
    const c3Status = (hasBoundary && hasTwin)
      ? 'demonstrated'
      : ((hasBoundary || hasTwin) && !fellIntoTrap ? 'partial' : 'not_detected');
    const c3Passed = c3Status === 'demonstrated';

    // Exact deterministic score calculation from verified criterion states
    const points =
      (c1Status === 'demonstrated' ? 1 : c1Status === 'partial' ? 0.5 : 0) +
      (c2Status === 'demonstrated' ? 1 : c2Status === 'partial' ? 0.5 : 0) +
      (c3Status === 'demonstrated' ? 1 : c3Status === 'partial' ? 0.5 : 0);
    const scorePct = Math.round((points / 3) * 100);

    // Extract actual matched Arabic words from original student text for highlighting
    const rawTokens = text.split(/\s+/).filter(Boolean);
    const matchedArabicWords = rawTokens.filter(tok => {
      const nt = normalizeArabic(tok);
      return nt.length >= 2 && r.mechanismStemsAr.some(s => nt.includes(normalizeArabic(s)));
    });

    return {
      c1Passed,
      c1Status,
      c2Passed,
      c2Status,
      c3Passed,
      c3Status,
      fellIntoTrap,
      matchedMechAr,
      matchedMechEn,
      matchedArabicWords,
      matchedEnKeywords,
      missingEnKeywords,
      scorePct
    };
  }

  function tokenizeExamSentence(rawSentence) {
    const words = rawSentence.trim().split(/\s+/);
    return words.map(w => {
      const clean = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
      if (ACTION_VERBS.has(clean)) {
        return { text: w, role: 'verb', explainAr: 'فعل السؤال الأكاديمي (يحدد المطلوب منك بالضبط)' };
      }
      if (TRAP_MARKERS.has(clean)) {
        return { text: w, role: 'trap', explainAr: 'أداة نفي أو تقييد أو مقارنة في السؤال — انتبه لها!' };
      }
      if (STOPWORDS.has(clean) || clean.length <= 3) {
        return { text: w, role: 'filler', explainAr: 'كلمة ربط/حشو لغوي يمكنك تخطيها دون قلق' };
      }
      return { text: w, role: 'clue', explainAr: 'مصطلح أو مفتاح دلالي يقودك للجواب' };
    });
  }

  function buildCustomConcept(termEn, termAr, questionStemEn, packId) {
    const cleanTerm = (termEn || 'Protocol').trim();
    const cleanAr = (termAr || `المفهوم التخصصي لـ (${cleanTerm}) في سياق المقرر والاختبار`).trim();
    const qStem = (questionStemEn || `Distinguish how ${cleanTerm} operates within the system architecture instead of relying on manual configuration.`).trim();

    return {
      id: 'custom_' + Date.now(),
      packId: packId || 'it',
      isCustomScaffold: true,
      term: cleanTerm,
      phonetic: cleanTerm,
      twinTerm: 'Literal Meaning',
      terminalCmd: `> decode_custom --target="${cleanTerm}"`,
      coreArabic: cleanAr,
      coreEnglish: `Course-specific mechanism and exam application of ${cleanTerm}.`,
      insteadOf: {
        titleAr: `الترجمة الحرفية المنفردة لكلمة (${cleanTerm}) بمعزل عن السلايد`,
        titleEn: `Isolated single-word translation of "${cleanTerm}"`,
        trapNoteAr: 'حفظ الكلمة منفردة بدون سياقها البرمجي/الإداري يجعل الطالب يضيع عند تغير صيغة السؤال.'
      },
      tryThis: {
        titleAr: cleanAr,
        titleEn: `Contextual meaning of ${cleanTerm} in exam scenarios`,
        twinNoteAr: 'اربط المصطلح دائمًا بفعل السؤال والكلمات الدلالية المحيطة به.'
      },
      threeKeywords: [
        { en: cleanTerm, ar: 'المصطلح الأساسي' },
        { en: 'core mechanism', ar: 'آلية العمل في النظام' },
        { en: 'scenario context', ar: 'سياق التطبيق بالاختبار' }
      ],
      fadingLevels: {
        level1Ar: `في هذا المقرر نستخدم مصطلح <bdi dir="ltr" class="ck-inline-term">${cleanTerm}</bdi> للتعبير عن: ${cleanAr}.`,
        level2SimpleEn: `${cleanTerm} represents a specific course mechanism in context, unlike its isolated everyday dictionary translation.`,
        level2SubAr: `تذكر ربط (${cleanTerm}) بسياق الجملة في الاختبار.`,
        level3Tokens: tokenizeExamSentence(qStem),
        level3PlainAr: `تفكيك السؤال المضاف للمصطلح (${cleanTerm}) عبر مصنّف أشعة X-Ray القياسي.`
      },
      gauntlet: [
        {
          round: 1,
          titleAr: `القناع 1: المعنى السياقي لـ ${cleanTerm}`,
          titleEn: 'Disguise 1 · False-Friend Trap',
          stemEn: `In the context of your uploaded material, what does "${cleanTerm}" represent?`,
          hintAr: cleanAr,
          options: [
            { letter: 'A', en: `The course-specific mechanism: ${cleanAr}`, ar: cleanAr },
            { letter: 'B', en: 'An unrelated everyday conversational expression', ar: 'تعبير يومي عام لا علاقة له بالمقرر' },
            { letter: 'C', en: 'A formatting error in the document', ar: 'خطأ تنسيق في الملف' },
            { letter: 'D', en: 'None of the above', ar: 'لا شيء مما سبق' }
          ],
          correctIndex: 0,
          feedbackAr: `أحسنت! ربطت (${cleanTerm}) بمعناه الصحيح في المقرر.`
        },
        {
          round: 2,
          titleAr: 'القناع 2: فك الاشتباك السياقي',
          titleEn: 'Disguise 2 · Twin-Term Trap',
          stemEn: `Why is single-word literal translation insufficient for mastering "${cleanTerm}" in exams?`,
          hintAr: 'لأن الاختبار يقيس تطبيق المصطلح داخل سيناريو.',
          options: [
            { letter: 'A', en: 'Because exam questions test how the concept operates in a scenario, not isolated words', ar: 'لأن أسئلة الاختبار تقيس عمل المفهوم داخل سيناريو وليس الكلمة منفردة' },
            { letter: 'B', en: 'Because exams do not use English', ar: 'لأن الاختبارات لا تستخدم الإنجليزية' },
            { letter: 'C', en: 'Because definitions are never graded', ar: 'لأن التعاريف لا تُصحح' },
            { letter: 'D', en: 'Because all terms have identical meanings', ar: 'لأن كل المصطلحات بمعنى واحد' }
          ],
          correctIndex: 0,
          feedbackAr: 'الاختبار يقيس فهمك للسياق التطبيقي للمصطلح.'
        },
        {
          round: 3,
          titleAr: 'القناع 3: سؤال السيناريو المضاف',
          titleEn: 'Disguise 3 · Blind Scenario',
          stemEn: qStem,
          hintAr: `السؤال يختبر مصطلح (${cleanTerm}).`,
          options: [
            { letter: 'A', en: cleanTerm, ar: `المصطلح المستهدف (${cleanTerm})` },
            { letter: 'B', en: 'Static Allocation', ar: 'تخصيص ثابت' },
            { letter: 'C', en: 'Syntax Exception', ar: 'استثناء قواعدي' },
            { letter: 'D', en: 'Manual Override', ar: 'تجاوز يدوي' }
          ],
          correctIndex: 0,
          feedbackAr: `التقطت المصطلح (${cleanTerm}) من سياق السؤال بنجاح.`
        }
      ],
      rubric: {
        mechanismStemsAr: ['مفهوم', 'يعمل', 'يستخدم', 'سياق', 'اليه', 'طريق'],
        mechanismStemsEn: [cleanTerm.toLowerCase(), 'mechanism', 'context', 'system'],
        requiredEnglishTerms: [cleanTerm.toLowerCase()],
        boundaryMarkers: ['بينما', 'عكس', 'وليس', 'unlike', 'whereas', 'not'],
        twinStems: ['literal', 'حرفي', 'عام', 'general'],
        scaffoldTemplateEn: `${cleanTerm} operates as a core course mechanism in context, unlike its literal everyday meaning.`,
        sampleDrafts: [
          { label: '01 — مسودة عربية (Arabic Draft)', sub: 'شرح الفكرة بالعربي فقط', text: 'هذا المصطلح يعمل في سياق النظام الأساسي للمادة' },
          { label: '02 — خلط مع التوأم (Twin-Term Confusion)', sub: 'الخلط مع المعنى الحرفي العام', text: `${cleanTerm} is just an everyday literal word` },
          { label: '03 — إجابة الدرجة الكاملة (Full-Mark Answer)', sub: 'شاملة للمصطلح والتفريق السياقي', text: `${cleanTerm} operates as a core mechanism in system context, unlike its literal general meaning.` }
        ]
      }
    };
  }

  async function extractTextFromFile(file) {
    const name = (file.name || '').toLowerCase();
    if (name.endsWith('.pdf')) {
      if (window.pdfjsLib) {
        try {
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const buf = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
          const maxPages = Math.min(pdf.numPages, 15);
          let out = '';
          for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            out += content.items.map(it => it.str).join(' ') + '\n';
          }
          if (out.trim().length < 25) {
            return { text: '', error: 'ملف PDF مصور (بدون طبقة نصية قابلة للقراءة) — انسخ النص مباشرة أو ارفع ملف TXT.' };
          }
          return { text: out, error: null };
        } catch (err) {
          return { text: '', error: 'تعذرت قراءة بنية الـ PDF في المتصفح — يمكنك لصق النص أو رفع ملف TXT.' };
        }
      }
      return { text: '', error: 'مكتبة قراءة الـ PDF غير محمّلة حالياً — يمكنك رفع ملف TXT أو لصق السؤال مباشرة.' };
    }
    const text = await file.text();
    return { text, error: null };
  }

  function speak(text) {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.rate = 0.88;
        window.speechSynthesis.speak(u);
      }
    } catch (e) {}
  }

  return {
    normalizeArabic,
    normalizeEnglish,
    evaluateRubric,
    tokenizeExamSentence,
    buildCustomConcept,
    extractTextFromFile,
    speak
  };
})();
