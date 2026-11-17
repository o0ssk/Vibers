/* ==========================================================================
   REAL-TIME TERM, CONTEXT, FILE & QUESTION ANALYZER ENGINE
   Module: js/analyzer.js
   ========================================================================== */

window.StudyAnalyzer = (function () {
  // High-speed built-in knowledge base for common university terms + live API fallback for any word on Earth
  const ACADEMIC_KB = {
    argument: {
      term: 'Argument',
      phonetic: 'آر - قيو - منت',
      arabicMeaning: 'القيمة الفعلية (الرقم أو النص الحقيقي) التي نرسلها للدالة عند استدعائها في الكود.',
      generalContext: 'في الإنجليزي العام تعني «جدال أو نقاش حاد بين شخصين»، وهذا المعنى يضلّل الطالب في الاختبار.',
      academicContext: 'في البرمجة: القيمة الحقيقية الممررة بين قوسي استدعاء الدالة مثل الرقم 95 في calculateGrade(95).',
      examContext: 'في أسئلة الاختبار: تأتي في مقارنة مع (Parameter) وهو الاسم الفارغ في رأس الدالة، أو في المقالات بمعنى «حجة مدعومة بدليل».',
      keywords: ['actual value passed', 'inside method call', 'vs Parameter in header'],
      keywordsAr: ['القيمة الفعلية الممررة', 'داخل قوس استدعاء الدالة', 'مقابل المتغير في رأس الدالة'],
      exampleSentence: 'When calling printScore(95), the number 95 is the argument passed to the method.'
    },
    encapsulation: {
      term: 'Encapsulation',
      phonetic: 'إن - كاب - سوليشن',
      arabicMeaning: 'تغليف وحماية بيانات الكلاس بجعل المتغيرات (private) ومنع تعديلها إلا عبر دوال عامة (getters/setters).',
      generalContext: 'في اللغة العامة تعني «وضع الدواء داخل كبسولة»، لكن كتابة ذلك حرفيًا في الاختبار لا تعطي الدرجة.',
      academicContext: 'في البرمجة الكائنية (OOP): إخفاء البيانات (Data Hiding) بحمايتها بكلمة private وتوفير دوال public للقراءة والتعديل.',
      examContext: 'في أسئلة الاختبار: ابحث في السؤال عن عبارات (restrict direct access) أو (private variables with public setters).',
      keywords: ['data hiding', 'private variables', 'public getters and setters'],
      keywordsAr: ['إخفاء وحماية البيانات', 'متغيرات خاصة private', 'دوال قراءة وتعديل عامة'],
      exampleSentence: 'Encapsulation protects object state by making fields private and using public setter methods.'
    },
    polymorphism: {
      term: 'Polymorphism',
      phonetic: 'بولي - مور - فيزم',
      arabicMeaning: 'نفس اسم الدالة، لكن كل كائن (كلاس ابن) ينفذها بطريقته الخاصة حسب نوعه.',
      generalContext: 'في القاموس الحرفي تعني «تعدد الأشكال الهندسية»، وهو معنى حرفي لا يشرح سلوك الدوال في الكود.',
      academicContext: 'في البرمجة الكائنية: قدرة كائنات مختلفة على الاستجابة لنفس استدعاء الدالة مثل draw() كلٌّ بطريقته الخاصة.',
      examContext: 'في أسئلة الاختبار: تأتي بصيغة (same method name behaves differently depending on the object type at runtime).',
      keywords: ['same method name', 'different behavior', 'method overriding'],
      keywordsAr: ['نفس اسم الدالة', 'سلوك وتنفيذ مختلف', 'إعادة تعريف الدالة بالابن'],
      exampleSentence: 'Polymorphism allows calling calculatePay() to run different formulas for Manager and PartTimer.'
    },
    inheritance: {
      term: 'Inheritance',
      phonetic: 'إن - هير - يتانس',
      arabicMeaning: 'كلاس جديد (ابن Subclass) يرث المتغيرات والدوال الجاهزة من كلاس أقدم (أب Superclass) لمنع تكرار الكود.',
      generalContext: 'في الحياة اليومية تعني «الميراث العائلي»، أما في البرمجة فهي علاقة بين الكلاسات باستخدام كلمة extends.',
      academicContext: 'في البرمجة (OOP): بناء كلاس فرعي يكتسب خصائص ودوال الكلاس الأساسي (علاقة Is-A).',
      examContext: 'في أسئلة الاختبار: ابحث عن كلمة (extends) أو (code reuse between superclass and subclass).',
      keywords: ['code reuse', 'subclass extends superclass', 'is-a relationship'],
      keywordsAr: ['إعادة استخدام الكود', 'الكلاس الابن يرث الأب', 'علاقة (هو نوع من)'],
      exampleSentence: 'Inheritance enables a SavingsAccount subclass to reuse methods from the BankAccount superclass.'
    },
    protocol: {
      term: 'Protocol',
      phonetic: 'برو - تو - كول',
      arabicMeaning: 'مجموعة القواعد والاتفاقيات الموحدة التي تنظم كيف تتبادل الأجهزة البيانات في الشبكة.',
      generalContext: 'في الحياة العامة تعني «مراسم الاستقبال الرسمية والإتيكيت الدبلوماسي».',
      academicContext: 'في الشبكات: القواعد القياسية التي تحدد صيغة إرسال واستقبال البيانات (مثل HTTP و TCP/IP).',
      examContext: 'في أسئلة الاختبار: تأتي بصيغة (set of rules governing data communication between network devices).',
      keywords: ['set of rules', 'data communication', 'network standard'],
      keywordsAr: ['مجموعة قواعد منظمة', 'تواصل وتبادل البيانات', 'معيار قياسي بالشبكة'],
      exampleSentence: 'A network protocol defines the exact rules for transmitting packets between two computers.'
    },
    liability: {
      term: 'Liability',
      phonetic: 'لاي - أ - بيلتي',
      arabicMeaning: 'الالتزامات والديون المالية المستحقة على الشركة والتي يجب سدادها للغير (مثل القروض وفواتير الموردين).',
      generalContext: 'في الإنجليزي اليومي تعني «عبء أو نقطة ضعف»، لكن في المحاسبة تعني بند الديون المستحقة.',
      academicContext: 'في إدارة الأعمال والمحاسبة: كل مبلغ تدين به الشركة للدائنين (Owed to creditors) عكس الأصول المملوكة (Assets).',
      examContext: 'في أسئلة الاختبار: إذا رأيت (unpaid bank loan) أو (amounts owed to suppliers) فالجواب هو Liability.',
      keywords: ['financial debt owed', 'payable to creditors', 'opposite of Asset'],
      keywordsAr: ['دين مالي مستحق', 'واجب السداد للدائنين', 'عكس الأصول المملوكة Asset'],
      exampleSentence: 'An unpaid bank loan is recorded as a liability on the company balance sheet.'
    },
    capital: {
      term: 'Capital',
      phonetic: 'كاب - يـتال',
      arabicMeaning: 'رأس المال (الأموال والمعدات المستثمرة لتأسيس وتشغيل المشروع، أو مهارات الموظفين في Human Capital).',
      generalContext: 'في الإنجليزي العام تعني «عاصمة الدولة» أو «الحرف الكبير Capital Letter».',
      academicContext: 'في الإدارة والتمويل: الأموال والأصول التي يضخها الملاك أو المستثمرون لبدء وتشغيل النشاط التجاري.',
      examContext: 'في أسئلة الاختبار: انتبه للسياق! (Working Capital) = سيولة التشغيل، بينما (Human Capital) = مهارات وخبرات الموظفين.',
      keywords: ['invested wealth', 'start and run business', 'Human Capital = skills'],
      keywordsAr: ['الأموال المستثمرة', 'تأسيس وتشغيل المشروع', 'رأس المال البشري = المهارات'],
      exampleSentence: 'The founders invested 150,000 SAR in startup capital to purchase equipment.'
    },
    justify: {
      term: 'Justify',
      phonetic: 'جاس - تي - فاي',
      arabicMeaning: 'برّر قرارك أو إجابتك بذكر الأسباب والأدلة المقنعة (لماذا هذا الخيار أفضل من البدائل الأخرى؟).',
      generalContext: 'في برنامج الوورد تعني «محاذاة النص من الحواف»، لكن كفعل أمر في الاختبار تعني «برّر بالدليل».',
      academicContext: 'في أسئلة الـ TMA والاختبارات: تقديم حجج وأدلة (Reasons & Evidence) تدافع عن سبب اختيارك لحل معين.',
      examContext: 'في التصحيح: لا تكتفِ بكتابة التعريف (Describe)؛ لازم تكتب (because...) وتذكر ميزة الحل مقارنة بالبديل.',
      keywords: ['give strong reasons', 'support with evidence', 'explain WHY chosen'],
      keywordsAr: ['تقديم أسباب قوية', 'الدعم بالدليل من الحالة', 'شرح لماذا فضّلته عالبديل'],
      exampleSentence: 'Justify why the team selected cloud storage over local hard drives for this clinic.'
    }
  };

  async function translateLive(text, pair = 'en|ar') {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 380))}&langpair=${pair}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
    } catch (e) {}
    return null;
  }

  async function fetchDictionaryEntry(word) {
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data[0] || null;
    } catch (e) {
      return null;
    }
  }

  async function analyzeTerm(rawTerm, customArabicHint = '', sourceSentence = '') {
    const clean = rawTerm.trim();
    const key = clean.toLowerCase();

    if (ACADEMIC_KB[key]) {
      const kb = ACADEMIC_KB[key];
      return {
        id: 'term_' + key + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        term: kb.term,
        phonetic: kb.phonetic,
        arabicMeaning: customArabicHint || kb.arabicMeaning,
        generalContext: kb.generalContext,
        academicContext: kb.academicContext,
        examContext: kb.examContext,
        keywords: kb.keywords,
        keywordsAr: kb.keywordsAr,
        exampleSentence: sourceSentence || kb.exampleSentence
      };
    }

    // Live analysis for any custom word the user enters
    const [arTranslation, dictData] = await Promise.all([
      customArabicHint ? Promise.resolve(customArabicHint) : translateLive(clean, 'en|ar'),
      fetchDictionaryEntry(clean)
    ]);

    let phonetic = clean;
    let def1En = `General meaning of ${clean}.`;
    let def2En = sourceSentence || `Academic usage of ${clean} within the course context.`;
    let exampleEn = sourceSentence || `Understanding how ${clean} operates in different scenarios is essential for exams.`;
    let extractedKeywords = [clean, 'core concept', 'context application'];

    if (dictData) {
      if (dictData.phonetic) phonetic = dictData.phonetic;
      const defs = [];
      const syns = [];
      (dictData.meanings || []).forEach(m => {
        (m.definitions || []).forEach(d => defs.push(d));
        if (m.synonyms) syns.push(...m.synonyms);
      });
      if (defs[0]?.definition) def1En = defs[0].definition;
      if (defs[1]?.definition) def2En = defs[1].definition;
      if (defs[0]?.example) exampleEn = defs[0].example;

      const shortWords = def1En.replace(/[^a-zA-Z\s]/g, '').split(/\s+/).filter(w => w.length > 4).slice(0, 2).join(' ');
      extractedKeywords = [
        shortWords || clean,
        syns[0] ? `synonym: ${syns[0]}` : `role of ${clean}`,
        'contextual meaning'
      ];
    }

    const [def1Ar, def2Ar] = await Promise.all([
      translateLive(def1En, 'en|ar'),
      def2En !== def1En ? translateLive(def2En, 'en|ar') : Promise.resolve(null)
    ]);

    return {
      id: 'term_' + key + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      term: clean.charAt(0).toUpperCase() + clean.slice(1),
      phonetic: phonetic,
      arabicMeaning: arTranslation ? `${arTranslation}${def1Ar ? ' — ' + def1Ar : ''}` : (def1Ar || `مصطلح (${clean}) في سياق المادة`),
      generalContext: def1Ar ? `المعنى الأول/العام: ${def1Ar} (${def1En})` : `المعنى اللغوي العام لكلمة (${clean}) بمعزل عن التخصص.`,
      academicContext: sourceSentence
        ? `في سياق ملفك/محاضرتك: "${sourceSentence}" ${def2Ar ? ' — ' + def2Ar : ''}`
        : (def2Ar ? `المعنى الثاني/التخصصي: ${def2Ar} (${def2En})` : `في سياق المقرر، يُفهم (${clean}) من خلال وظيفته التطبيقية.`),
      examContext: `في الاختبار: قد يأتي السؤال عن (${clean}) بصيغة تعريف مباشر أو داخل سيناريو يتضمن كلمات مثل (${extractedKeywords[0]}).`,
      keywords: extractedKeywords,
      keywordsAr: [arTranslation || 'المعنى الأساسي', 'المرادف أو الوظيفة', 'السياق داخل السؤال'],
      exampleSentence: exampleEn
    };
  }

  async function analyzeQuestion(rawQuestion) {
    const cleanQ = rawQuestion.trim();
    const arQ = await translateLive(cleanQ, 'en|ar');

    const verbs = new Set(['justify', 'distinguish', 'trace', 'compare', 'contrast', 'evaluate', 'analyze', 'explain', 'define', 'identify', 'classify', 'calculate', 'why', 'how', 'what', 'which']);
    const traps = new Set(['except', 'not', 'never', 'only', 'solely', 'instead', 'rather', 'unlike', 'whereas', 'false']);
    const fillers = new Set(['in', 'the', 'of', 'a', 'an', 'to', 'for', 'on', 'at', 'by', 'from', 'with', 'about', 'into', 'during', 'after', 'before', 'consider', 'following', 'given', 'based']);

    const tokens = cleanQ.split(/\s+/).map(w => {
      const bare = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
      if (verbs.has(bare)) return { text: w, type: 'verb' };
      if (traps.has(bare)) return { text: w, type: 'trap' };
      if (fillers.has(bare) || bare.length <= 3) return { text: w, type: 'filler' };
      return { text: w, type: 'keyword' };
    });

    return {
      id: 'q_' + Date.now(),
      rawEn: cleanQ,
      translatedAr: arQ || 'تم تفكيك السؤال وإبراز أفعال السؤال والكلمات المفتاحية الدالة على الحل.',
      tokens
    };
  }

  function evaluateStudentExplanation(termObj, studentAnswer) {
    const raw = (studentAnswer || '').trim();
    if (!raw) {
      return { score: 0, understoodConcept: false, matchedKeywords: [], missingKeywords: termObj.keywords, feedback: 'اكتب شرحك للمصطلح بالعربي أو بالإنجليزي لنقيّم فهمك.' };
    }

    const normText = raw.toLowerCase().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
    const arMeaningWords = termObj.arabicMeaning
      .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/[^\u0600-\u06FF\s]/g, ' ')
      .split(/\s+/).filter(w => w.length >= 3);

    const matchedAr = arMeaningWords.filter(w => normText.includes(w.slice(0, 3)));
    const matchedEn = termObj.keywords.filter(kw => {
      const firstWord = kw.toLowerCase().split(/\s+/)[0];
      return normText.includes(firstWord) || normText.includes(termObj.term.toLowerCase());
    });

    const understoodConcept = matchedAr.length >= 1 || matchedEn.length >= 1 || raw.split(/\s+/).length >= 4;
    const missingKeywords = termObj.keywords.filter(kw => !matchedEn.includes(kw));

    let score = 0;
    if (understoodConcept) score += 50;
    if (matchedEn.length >= 1) score += 25;
    if (matchedEn.length >= 2) score += 25;

    let feedback = '';
    if (score === 100) {
      feedback = 'ممتاز! شرحك يجمع بين الفهم الصحيح واستخدام الكلمات المفتاحية الإنجليزية التي يبحث عنها المصحح.';
    } else if (understoodConcept) {
      feedback = 'فهمك للفكرة صحيح! ولتحصل على الدرجة الكاملة في الاختبار الإنجليزي، أضف الكلمات المفتاحية الإنجليزية بالأسفل إلى إجابتك.';
    } else {
      feedback = 'حاول توضيح وظيفة المصطلح الأساسية أو اضغط على الكلمات المفتاحية لإضافتها.';
    }

    return {
      score,
      understoodConcept,
      matchedKeywords: matchedEn,
      missingKeywords,
      feedback
    };
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
    analyzeTerm,
    analyzeQuestion,
    evaluateStudentExplanation,
    speak
  };
})();
