# مسلّمات يوم التحدي الجاهزة للتسليم (Prompt Log + الشرائح الـ 3 + سكريبت العرض)

---

## أولاً: سجل الأوامر (Prompt Log — 15 نقطة كاملة)
*(انسخ هذا القسم وأرسله في قروب الواتساب ضمن المسلّمات الثلاث)*

### 1. البرومبت الأول (The First Spec Prompt)
**Prompt:**
> Build a single-screen, zero-backend client-side web application (`ContextKey | مِفتاح السياق`) for 1st-year Arabic-speaking AOU students with beginner English studying English-taught courses (Track T2: Smarter Learning, Challenge 2.2). Include pre-filled sample data for AOU courses (`TM105/M251 IT`, `B123 Business`, `Academic English`) plus file/custom-term ingestion. Run each concept through a 3-stage mastery pipeline on one screen: (1) Progressive 3-Stage Language Fading (Arabic with embedded English keywords -> simplified English -> full academic exam question with an X-Ray toggle) and a 3-context comparison (Everyday False-Friend vs. Major Meaning vs. Exam Clue), (2) a 3-Disguise Exam Gauntlet with an intra-session retry queue, and (3) an Explain-to-Pass Grader Rubric Evaluator that checks the student's Arabic or simple English explanation against 3 grading criteria.

**ما الذي تغيّر بعده (What changed):**
> أنشأ الهيكل الأساسي للتطبيق في شاشة واحدة مع المراحل الثلاث وحزم البيانات التجريبية لمقررات الجامعة.

---

### 2. أمر الإصلاح (The Fix Prompt — One Fix)
**Prompt:**
> Fix two technical bugs identified during testing: (1) Mixed Arabic (RTL) and English (LTR) technical terms break sentence ordering and punctuation, and JavaScript regex `\b` word boundaries fail on Arabic script in the Stage 3 rubric evaluator; (2) Browser Web Speech API fails when reading mixed Arabic/English sentences in a single utterance. Isolate all inline English chips using `<bdi dir="ltr" style="unicode-bidi: isolate">`, replace regex `\b` with a deterministic Arabic/English morphological normalizer (unifying `أ/إ/آ -> ا`, `ة -> ه`, stripping prefixes `ال/وال/بال`), and scope TTS playback to `en-US` with `speechSynthesis.cancel()` queue protection and Arabic phonetic badges.

**ما الذي تغيّر بعده (What changed):**
> تم إصلاح تداخل النصوص العربية والإنجليزية بعزل الكلمات الإنجليزية داخل `<bdi dir="ltr">`، وأصبح مقيّم إجابة الطالب في المرحلة الثالثة يتعرف بدقة على الشرح العربي بمختلف صيغه الإملائية دون أخطاء، واستقر النطق الصوتي على جميع المتصفحات.

---

### 3. أمر التحسين (The Polish Prompt — One Polish)
**Prompt:**
> Optimize the single-screen UX for the 90-second live hackathon demo: (1) Compress Stage 1 into a 3-stop interactive Language Fading switcher with zero-layout-shift X-Ray token highlighting (`action_verb`, `context_clue`, `distractor_trap`, and dimmed `filler` words); (2) Make all 3 macro-stages freely navigable without hard-locking and add 1-click "Sample Student Draft" simulation chips in Stage 3 (Arabic-only draft, twin-term confusion trap, and full-mark English rewrite) plus a 1-click "90s Demo Reset" button in the header.

**ما الذي تغيّر بعده (What changed):**
> أصبحت تجربة العرض الحي تتم بالكامل في أقل من 90 ثانية بضغطات مباشرة (شريط التدرج اللغوي + فلتر أشعة X-Ray لتصفية أسئلة الاختبار + أزرار محاكاة فورية لإجابات الطلاب في مقيّم المصحح + زر إعادة ضبط العرض).

---

## ثانياً: محتوى الشرائح الثلاث (1–3 Slides)

### الشريحة 1: المشكلة (The Problem)
* **العنوان:** صدمة السياق لطالب السنة الأولى (يفهم بالعربي.. وينصدم في الاختبار الإنجليزي)
* **المستخدم المحدد:** طالب سنة أولى في الجامعة العربية المفتوحة (تخصص تقنية معلومات)، لغته الإنجليزية ضعيفة ويدرس مقرراته بالإنجليزية لأول مرة.
* **المشكلة:**
  1. **فخ المعنى العام والترجمة الحرفية:** يترجم الكلمة منفردة (مثل `Argument` = جدال، أو `Capital` = عاصمة) بينما معناها في التخصص مختلف تمامًا.
  2. **صدمة صيغة سؤال الاختبار:** يغرق في طول السؤال الإنجليزي ولا يلتقط الكلمات المفتاحية أو يخلط بين المصطلح وتوأمه (`Overriding` vs `Overloading`).
  3. **حاجز التعبير في الإجابة:** يفهم الفكرة بالعربي في ذهنه، لكنه يخسر الدرجة لعجزه عن كتابة الكلمات المفتاحية الإنجليزية التي يبحث عنها المصحح.

### الشريحة 2: العرض الحي للحل (Live Demo — مِفتاح السياق | ContextKey)
* **شاشة واحدة، 3 مراحل مترابطة تنقل الطالب من الفهم العربي إلى درجة الاختبار الكاملة:**
  1. **السحب التدريجي وفك السياق (Language Fading & X-Ray):** يتدرج بالطالب من جملة عربية مطعّمة بالمصطلح ← إلى إنجليزي مبسط ← إلى **أشعة X-Ray لسؤال الاختبار** التي تُبهّت 75% من الحشو الصعب وتُضيء فقط (فعل السؤال + شفرة الحل + فخ التوأم).
  2. **تحدي الأقنعة الثلاثة (3-Disguise Gauntlet):** يختبر الطالب في نفس المصطلح عبر 3 صيغ (فخ المعنى العام، فخ التوأم، وسيناريو مخفي) مع قائمة إعادة فورية للأخطاء.
  3. **مقيّم الفهم بعين المصحح (Explain-to-Pass Grader):** يكتب الطالب فهمه بالعربي، فيُشخّص النظام إجابته ويرقّيها تفاعليًا بالكلمات المفتاحية الإنجليزية للحصول على 100%.

### الشريحة 3: الأثر والخطوة التالية (Impact & Next Step)
* **الأثر المباشر:** تحويل مذاكرة طالب السنة الأولى من "حفظ ترجمة حرفية تنهار في القاعة" إلى إتقان فعلي لسياق المصطلح وصيغ أسئلته، مع قابلية استخدام الأداة لأي مقرر (`TM105`, `M251`, `B123`) أو رفع ملفات السلايدات والأسئلة السابقة.
* **الخطوة التالية:** توسيع القاموس السياقي المدمج ليشمل جميع مقررات السنة الأولى في الجامعة العربية المفتوحة وإضافة وضع المراجعة السريعة المشتركة بين طلاب الشعب.

---

## ثالثاً: سكريبت العرض في 3 دقائق (The 4-Beat Pitch Script)

* **0:00 – 0:30 | الدقة 1: المشكلة من خلال إنسان حقيقي (30 ثانية):**
  > "ما رح نبدأ بإحصائية عامة؛ المستخدم الحقيقي واقف جنبي الآن. خويي طالب في سنته الأولى بالجامعة، لغته الإنجليزية بسيطة، وفجأة وجد نفسه يدرس ويمتحن في تخصص كامل باللغة الإنجليزية. وقت المذاكرة يعتمد على الترجمة الحرفية ويفهم الفكرة بالعربي، لكن أول ما يفتح ورقة الاختبار ينصدم بـ 3 أشياء: كلمات يعرفها بمعنى عام مثل `Argument` (نقاش) بينما معناها البرمجي مختلف تمامًا، أسئلة إنجليزية طويلة لا يعرف إيش المطلوب فيها، وعجز عن تحويل الفكرة العربية اللي في راسه إلى كلمات مفتاحية إنجليزية يعطيه عليها الدكتور الدرجة."

* **0:30 – 2:00 | الدقة 2: العرض الحي لمسار واحد (90 ثانية):**
  > *(افتح التطبيق على مصطلح `Argument` أو `Encapsulation`)*
  > "كان خويي يضيع بين السلايدات والمترجم، والآن على شاشة واحدة في **مفتاح السياق (ContextKey)**:
  > **أولاً (في المرحلة 1):** يرى مقارنة فورية بين المعنى اليومي المخادع، ومعنى التخصص، وشفرة الاختبار. ومن خلال **شريط السحب التدريجي للغة**، ينتقل من جملة عربية مطعّمة بالمصطلح الإنجليزي ونطقه الصوتي ← إلى جملة إنجليزية مبسطة ← إلى **سؤال اختبار حقيقي مع أشعة X-Ray** *(اضغط زر X-Ray)* التي تُبهّت 75% من الكلام الإنجليزي الزائد وتُضيء له فقط: فعل السؤال المطلوب، وشفرة الحل، وفخ التوأم! كما يمكنه رفع ملف سلايداته أو لصق أي سؤال سابق.
  > **ثانياً (في المرحلة 2):** يدخل **تحدي الأقنعة الثلاثة** *(اضغط المرحلة 2 وجرّب إجابة خاطئة ثم صحيحة)*؛ لا يأخذ درع الإتقان إلا إذا كشف المصطلح في 3 صيغ مختلفة، وأي قناع يخطئ فيه ينتقل فورًا لـ **قائمة إعادة الأخطاء** في الأعلى.
  > **ثالثاً (في المرحلة 3 — لحظة الواو):** *(اضغط المرحلة 3 واضغط زر تجربة فهم طالب بالعربي 33% ثم اضغط الكلمات المفتاحية أو زر 100%)* يكتب الطالب فهمه بالعربي كما هو في راسه، فيقوم **مقيّم المصحح** بتشخيص فهمه وتنبيهه للكلمات الإنجليزية الناقصة، وبضغطة واحدة يدرج الكلمات المفتاحية الإنجليزية وتتحول إجابته إلى 100% جاهزة لورقة الاختبار!"

* **2:00 – 2:30 | الدقة 3: الأثر والخطوة التالية (30 ثانية):**
  > "الأثر المباشر هو كسر حاجز اللغة لطالب السنة الأولى في مقررات مثل `TM105` و`M251` و`B123`، بحيث يدخل القاعة وهو يعرف كيف يقرأ السؤال الإنجليزي وكيف يصيغ الجواب. خطوتنا التالية هي تغطية كافة مقررات السنة التأسيسية والتخصصية الأولى في الجامعة."

* **2:30 – 3:00 | الدقة 4: كيف ساعدنا الذكاء الاصطناعي وما لم يكتمل بعد (30 ثانية):**
  > "استخدمنا الذكاء الاصطناعي كشريك نقد وتصميم عبر 7 عدسات مراجعة (EGM) لاكتشاف نقاط الضعف، فقمنا ببناء محرك تطبيع لغوي محلي يفهم الصيغ العربية بدون الحاجة لمفاتيح API خارجية، وما لم نبنه بعد هو OCR لقراءة ملفات الـ PDF المصورة كصور وسنضيفه في المرحلة القادمة."
