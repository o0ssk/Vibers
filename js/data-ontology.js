/* ==========================================================================
   AOU JEDDAH BILINGUAL COURSE ONTOLOGY & EXAM DISCOURSE GRAPH
   Module: js/data-ontology.js
   ========================================================================== */

window.VCC_ONTOLOGY = {
  packs: {
    it: {
      id: 'it',
      code: 'M251 · TM105',
      titleAr: 'البرمجة وتقنية المعلومات',
      titleEn: 'OOP & Computing',
      concepts: [
        {
          id: 'argument',
          term: 'Argument',
          phonetic: 'آر - قيو - منت',
          twinTerm: 'Parameter',
          terminalCmd: '> decode_term --target="Argument" --vs="Parameter"',
          coreArabic: 'القيمة الفعلية (الرقم أو النص الحقيقي) التي ترسلها للدالة لحظة مناداتها وتشغيلها.',
          coreEnglish: 'The actual value passed into a method call at runtime.',
          insteadOf: {
            titleAr: 'جدال أو نقاش حاد بين شخصين (المعنى اليومي العام)',
            titleEn: 'Everyday false friend: "A heated verbal disagreement"',
            trapNoteAr: 'الطالب المستجد يقرأ في الاختبار "Pass two arguments" فيظنها نقاشًا أو يخلطها مع المتغير الفارغ في رأس الدالة!'
          },
          tryThis: {
            titleAr: 'القيمة الحقيقية الممررة داخل قوس الاستدعاء مثل 95 في calculateGrade(95)',
            titleEn: 'Major & Exam Meaning: Actual value sent inside the method call',
            twinNoteAr: 'توأمه Parameter هو «الاسم الفارغ في تعريف الدالة» void f(int x)، أما Argument فهو «الرقم المرسل وقت التشغيل» f(95).'
          },
          threeKeywords: [
            { en: 'actual value passed', ar: 'القيمة الفعلية الممررة' },
            { en: 'inside method call', ar: 'داخل استدعاء الدالة' },
            { en: 'sent to parameter', ar: 'تُرسل للمعامل الفارغ' }
          ],
          fadingLevels: {
            level1Ar: 'عندما نشغّل الدالة في الكود ونرسل لها رقمًا حقيقيًا مثل <bdi dir="ltr" class="ck-inline-term">95</bdi>، نسمي هذا الرقم <bdi dir="ltr" class="ck-inline-term">Argument</bdi> لأنه يمثل <bdi dir="ltr" class="ck-inline-kw">actual value passed</bdi> داخل <bdi dir="ltr" class="ck-inline-kw">method call</bdi>.',
            level2SimpleEn: 'An Argument is the actual value passed inside a method call (e.g., 95 in printScore(95)), whereas a Parameter is the variable in the method header.',
            level2SubAr: 'احفظ الثلاثية: actual value (قيمة فعلية) + method call (مناداة الدالة) + whereas Parameter (عكس متغير الرأس).',
            level3Tokens: [
              { text: 'In the', role: 'filler', explainAr: 'حشو لغوي لا يؤثر على الجواب' },
              { text: 'AOU student grading module,', role: 'filler', explainAr: 'سياق قصصي عام يمكن تخطيه' },
              { text: 'distinguish', role: 'verb', explainAr: 'فعل السؤال الأكاديمي: فرّق بدقة بين أمرين' },
              { text: 'the', role: 'filler', explainAr: 'أداة تعريف' },
              { text: 'actual value 95 passed inside calculateGrade(95)', role: 'clue', explainAr: 'شفرة الحل: القيمة الحقيقية المرسلة بالاستدعاء = Argument' },
              { text: 'from the', role: 'filler', explainAr: 'حرف جر' },
              { text: 'placeholder variable int score in the method header', role: 'trap', explainAr: 'فخ التوأم: المتغير في رأس الدالة = Parameter' },
              { text: 'at compile time.', role: 'filler', explainAr: 'تكملة الجملة' }
            ],
            level3PlainAr: 'فرّق بين القيمة الفعلية (95) المرسلة عند مناداة الدالة (Argument) وبين المتغير الفارغ المكتوب في رأس الدالة (Parameter).'
          },
          gauntlet: [
            {
              round: 1,
              titleAr: 'القناع 1: فخ المعنى العام مقابل معنى البرمجة',
              titleEn: 'Disguise 1 · False-Friend Trap',
              stemEn: 'In Java programming (M251), what does "passing an argument to a method" actually mean?',
              hintAr: 'استبعد المعنى اليومي (جدال/نقاش) وركّز على ما يدخل بين قوسي الدالة وقت الاستدعاء.',
              options: [
                { letter: 'A', en: 'Sending an actual data value into the method when invoking it', ar: 'إرسال قيمة بيانات فعلية إلى الدالة عند استدعائها' },
                { letter: 'B', en: 'Writing a comment that disagrees with the compiler error', ar: 'كتابة تعليق يعترض على خطأ المترجم' },
                { letter: 'C', en: 'Creating a deadlock debate between two threads', ar: 'إنشاء جدال بين خيطين برمجيين' },
                { letter: 'D', en: 'Declaring the class name in a separate file', ar: 'تعريف اسم الكلاس في ملف منفصل' }
              ],
              correctIndex: 0,
              feedbackAr: 'في البرمجة، passing an argument تعني تمرير القيمة الفعلية للدالة وقت استدعائها.'
            },
            {
              round: 2,
              titleAr: 'القناع 2: فك الاشتباك مع التوأم (Argument vs Parameter)',
              titleEn: 'Disguise 2 · Twin-Term Distinction',
              stemEn: 'Given the header: void setFee(double amount) and the call: setFee(1500.0); — Which statement is true?',
              hintAr: 'الرقم المرسل في الاستدعاء (1500.0) هو Argument، والمتغير في الرأس (amount) هو Parameter.',
              options: [
                { letter: 'A', en: '1500.0 is the Argument, whereas amount is the Parameter', ar: 'الرقم 1500.0 هو Argument بينما amount هو Parameter' },
                { letter: 'B', en: 'amount is the Argument, whereas 1500.0 is the Parameter', ar: 'المتغير amount هو Argument والرقم هو Parameter' },
                { letter: 'C', en: 'Both amount and 1500.0 are Parameters', ar: 'كلاهما يعتبران Parameters' },
                { letter: 'D', en: 'Neither is an Argument because 1500.0 is a double', ar: 'لا يوجد Argument لأن الرقم عشري' }
              ],
              correctIndex: 0,
              feedbackAr: 'القيمة الحقيقية المرسلة وقت المناداة (1500.0) هي Argument، بينما المتغير في تعريف الدالة هو Parameter.'
            },
            {
              round: 3,
              titleAr: 'القناع 3: سيناريو اختبار مخفي بدون ذكر المصطلح',
              titleEn: 'Disguise 3 · Hidden Exam Scenario',
              stemEn: 'When a student writes Math.max(12, 45) inside main(), what are the literal numbers 12 and 45 called in the marking rubric?',
              hintAr: 'أرقام حقيقية ممررة داخل قوس استدعاء الدالة Math.max.',
              options: [
                { letter: 'A', en: 'Arguments', ar: 'القيم الفعلية الممررة (Arguments)' },
                { letter: 'B', en: 'Class Constructors', ar: 'بواني الكلاس (Constructors)' },
                { letter: 'C', en: 'Return Types', ar: 'أنواع الإرجاع (Return Types)' },
                { letter: 'D', en: 'Abstract Interfaces', ar: 'الواجهات المجردة (Interfaces)' }
              ],
              correctIndex: 0,
              feedbackAr: 'الأرقام 12 و 45 مرسلة فعليًا داخل استدعاء الدالة، لذا تُسمى Arguments.'
            }
          ],
          rubric: {
            mechanismStemsAr: ['قيم', 'فعل', 'حقيق', 'ترسل', 'مرسل', 'تمرر', 'ندخل', 'استدع', 'مناد'],
            mechanismStemsEn: ['actual', 'value', 'pass', 'send', 'sent', 'call', 'invoc', 'input'],
            requiredEnglishTerms: ['argument', 'actual value', 'method call'],
            boundaryMarkers: ['بينما', 'عكس', 'وليس', 'اما', 'تختلف', 'unlike', 'whereas', 'not', 'while', 'instead'],
            twinStems: ['parameter', 'باراميتر', 'معامل', 'متغير', 'راس', 'تعريف', 'header', 'variable', 'placeholder'],
            scaffoldTemplateEn: 'An Argument is the actual value passed inside a method call, whereas a Parameter is the placeholder variable in the method header.',
            sampleDrafts: [
              {
                label: '1. فهم طالب بالعربي فقط (33%)',
                sub: 'فاهم الفكرة بس نسي المصطلحات الإنجليزية',
                text: 'هي القيمة الحقيقية اللي نرسلها للدالة لما نناديها في الكود'
              },
              {
                label: '2. خلط مع التوأم Parameter (فخ!)',
                sub: 'وصف المعامل بدلاً من القيمة الفعلية',
                text: 'An argument is the variable declared in header of the function'
              },
              {
                label: '3. إجابة الدرجة الكاملة (100%)',
                sub: 'مستوفية للشروط الثلاثة للمصحح',
                text: 'An Argument is the actual value passed in a method call, whereas a Parameter is the variable in the method header.'
              }
            ]
          }
        },
        {
          id: 'encapsulation',
          term: 'Encapsulation',
          phonetic: 'إن - كاب - سوليشن',
          twinTerm: 'Abstraction',
          terminalCmd: '> decode_term --target="Encapsulation" --vs="Abstraction"',
          coreArabic: 'حماية وتغليف بيانات الكلاس بجعل المتغيرات (private) وحصر تعديلها عبر بوابات رسمية محمية (public getters/setters).',
          coreEnglish: 'Data hiding achieved by declaring variables private and exposing public getter/setter methods.',
          insteadOf: {
            titleAr: 'وضع الكود في كبسولة (ترجمة قوقل الحرفية بدون كلمات الكود)',
            titleEn: 'Literal Google Translate: "Putting things in a capsule"',
            trapNoteAr: 'الطالب يكتب في الاختبار "putting data in a capsule" فينقصه المصحح لأنه لم يذكر private variables ولا getters/setters!'
          },
          tryThis: {
            titleAr: 'إخفاء البيانات (data hiding) عبر متغيرات private ودوال public getters/setters',
            titleEn: 'Major & Exam Meaning: Data hiding via private fields + public getters/setters',
            twinNoteAr: 'توأمه Abstraction يخفي «تعقيد طريقة التنفيذ» بالـ Interface، أما Encapsulation فيحمي «البيانات نفسها» بـ private.'
          },
          threeKeywords: [
            { en: 'data hiding', ar: 'إخفاء وحماية البيانات' },
            { en: 'private variables', ar: 'متغيرات خاصة private' },
            { en: 'public getters/setters', ar: 'دوال قراءة وضبط عامة' }
          ],
          fadingLevels: {
            level1Ar: 'نطبّق مبدأ <bdi dir="ltr" class="ck-inline-term">Encapsulation</bdi> لتحقيق <bdi dir="ltr" class="ck-inline-kw">data hiding</bdi> وذلك بتعريف المتغيرات كـ <bdi dir="ltr" class="ck-inline-kw">private variables</bdi> وتوفير دوال <bdi dir="ltr" class="ck-inline-kw">public getters/setters</bdi>.',
            level2SimpleEn: 'Encapsulation achieves data hiding by making class variables private and controlling access via public getters and setters, unlike Abstraction which hides implementation complexity.',
            level2SubAr: 'الكلمات الثلاث الذهبية: data hiding + private variables + public getters/setters.',
            level3Tokens: [
              { text: 'In the', role: 'filler', explainAr: 'حشو استهلالي' },
              { text: 'hospital billing subsystem,', role: 'filler', explainAr: 'مثال سيناريو غير مؤثر' },
              { text: 'justify', role: 'verb', explainAr: 'فعل السؤال: برّر بالأسباب والفائدة' },
              { text: 'why the developer', role: 'filler', explainAr: 'حشو' },
              { text: 'declared the balance variable as private', role: 'clue', explainAr: 'شفرة 1: جعل المتغير private' },
              { text: 'and validated updates inside', role: 'filler', explainAr: 'ربط' },
              { text: 'public setter methods', role: 'clue', explainAr: 'شفرة 2: التعديل عبر دالة setter عامة = Encapsulation' },
              { text: 'instead of relying on', role: 'filler', explainAr: 'مقارنة' },
              { text: 'interface abstraction', role: 'trap', explainAr: 'فخ التوأم: Abstraction يخفي تعقيد التنفيذ لا البيانات' },
              { text: '.', role: 'filler', explainAr: 'نهاية الجملة' }
            ],
            level3PlainAr: 'برّر لماذا جعل المبرمج متغير الرصيد (private) وحصر التعديل داخل دالة (public setter)؟ الجواب: لتحقيق Encapsulation وحماية البيانات.'
          },
          gauntlet: [
            {
              round: 1,
              titleAr: 'القناع 1: الترجمة الحرفية مقابل الكلمات المفتاحية للكود',
              titleEn: 'Disguise 1 · Code Mechanism Check',
              stemEn: 'Which code structure directly implements Encapsulation in a Java class?',
              hintAr: 'ابحث عن الكلمتين المتلازمتين: private للمتغيرات و public للـ getters/setters.',
              options: [
                { letter: 'A', en: 'Declaring instance variables as private and providing public getter/setter methods', ar: 'تعريف المتغيرات كـ private وتوفير دوال getter/setter عامة' },
                { letter: 'B', en: 'Compressing the source file into a .zip archive', ar: 'ضغط ملف الكود في ملف مضغوط' },
                { letter: 'C', en: 'Using a while-loop to print numbers', ar: 'استخدام حلقة تكرار لطباعة الأرقام' },
                { letter: 'D', en: 'Making all variables public static', ar: 'جعل جميع المتغيرات عامة للجميع' }
              ],
              correctIndex: 0,
              feedbackAr: 'تحقيق الـ Encapsulation يتم بجعل المتغيرات private وتوفير دوال public getters/setters.'
            },
            {
              round: 2,
              titleAr: 'القناع 2: فك الاشتباك مع التوأم (Encapsulation vs Abstraction)',
              titleEn: 'Disguise 2 · Twin-Term Distinction',
              stemEn: 'How does Encapsulation differ from Abstraction in Object-Oriented Programming?',
              hintAr: 'الأول يحمي البيانات بـ private، والثاني يخفي تعقيد التنفيذ بـ Interface/Abstract.',
              options: [
                { letter: 'A', en: 'Encapsulation hides data using private fields, whereas Abstraction hides implementation details using interfaces', ar: 'التغليف يخفي البيانات بـ private بينما التجريد يخفي تفاصيل التنفيذ بالواجهات' },
                { letter: 'B', en: 'Encapsulation deletes variables, whereas Abstraction makes variables public', ar: 'التغليف يحذف المتغيرات والتجريد يجعلها عامة' },
                { letter: 'C', en: 'They mean the exact same thing in Java exams', ar: 'لا يوجد أي فرق بينهما في الاختبار' },
                { letter: 'D', en: 'Encapsulation is only for databases', ar: 'التغليف خاص بقواعد البيانات فقط' }
              ],
              correctIndex: 0,
              feedbackAr: 'الـ Encapsulation يركز على حماية البيانات (data hiding)، بينما الـ Abstraction يركز على إخفاء تعقيد التنفيذ.'
            },
            {
              round: 3,
              titleAr: 'القناع 3: سيناريو اختبار مخفي بدون ذكر المصطلح',
              titleEn: 'Disguise 3 · Hidden Exam Scenario',
              stemEn: 'To prevent external classes from setting a negative GPA on a Student object, the developer blocked direct field access and validated the value inside setGpa(). Which principle is applied?',
              hintAr: 'منع الوصول المباشر للمتغير وفحص القيمة داخل setGpa().',
              options: [
                { letter: 'A', en: 'Encapsulation', ar: 'تغليف وحماية البيانات (Encapsulation)' },
                { letter: 'B', en: 'Method Overloading', ar: 'التحميل الزائد للدوال (Overloading)' },
                { letter: 'C', en: 'Recursion', ar: 'الاستدعاء الذاتي (Recursion)' },
                { letter: 'D', en: 'Polymorphism', ar: 'تعدد الأشكال (Polymorphism)' }
              ],
              correctIndex: 0,
              feedbackAr: 'حماية المتغير من التعديل الخاطئ عبر حصره داخل دالة Setter هو التطبيق المباشر لـ Encapsulation.'
            }
          ],
          rubric: {
            mechanismStemsAr: ['اخف', 'حماي', 'نحم', 'تغليف', 'منع', 'وصول', 'تعديل', 'بيان', 'متغير'],
            mechanismStemsEn: ['hide', 'hiding', 'protect', 'restrict', 'access', 'data', 'field', 'variable'],
            requiredEnglishTerms: ['private', 'public', 'data hiding'],
            boundaryMarkers: ['بينما', 'عكس', 'وليس', 'اما', 'unlike', 'whereas', 'not', 'while', 'instead'],
            twinStems: ['abstraction', 'تجريد', 'تعقيد', 'واجهة', 'implementation', 'complexity', 'interface'],
            scaffoldTemplateEn: 'Encapsulation achieves data hiding by making variables private and using public getters/setters, unlike Abstraction which hides implementation complexity.',
            sampleDrafts: [
              {
                label: '1. فهم طالب بالعربي فقط (33%)',
                sub: 'شرح الفكرة بالعربي بدون الكلمات المفتاحية',
                text: 'هو إخفاء وحماية بيانات الكلاس ومنع تعديلها بشكل مباشر من الخارج'
              },
              {
                label: '02 — خلط مع التوأم (Twin-Term Confusion)',
                sub: 'وصف التجريد (Abstraction) بدلاً من حماية البيانات (Encapsulation)',
                text: 'Encapsulation hides implementation complexity using an abstract interface'
              },
              {
                label: '3. إجابة الدرجة الكاملة (100%)',
                sub: 'مستوفية للشروط الثلاثة للمصحح',
                text: 'Encapsulation achieves data hiding using private variables and public setters, unlike Abstraction which hides implementation complexity.'
              }
            ]
          }
        },
        {
          id: 'overriding',
          term: 'Method Overriding',
          phonetic: 'ميثود أوفر - رايدنق',
          twinTerm: 'Method Overloading',
          terminalCmd: '> decode_term --target="Overriding" --vs="Overloading"',
          coreArabic: 'قيام الكلاس الابن (Subclass) بإعادة كتابة دالة ورثها من الأب بنفس الاسم ونفس المدخلات (Same Signature) لتغيير سلوكها.',
          coreEnglish: 'Redefining an inherited method in a subclass with the exact same name and parameter list.',
          insteadOf: {
            titleAr: 'الخلط بينه وبين Overloading (أشهر فخ يضيع درجات الميدتيرم!)',
            titleEn: 'Confusing Overriding with Overloading in exam MCQs',
            trapNoteAr: 'الطالب يرى "نفس اسم الدالة" فيختار Overriding فورًا دون الانتباه هل المدخلات متطابقة في كلاس ابن أم مختلفة في نفس الكلاس!'
          },
          tryThis: {
            titleAr: 'كلاس ابن (subclass) + نفس الاسم ونفس المدخلات (same signature)',
            titleEn: 'Major & Exam Meaning: Subclass + Exact Same Signature',
            twinNoteAr: 'Overriding = كلاس ابن + تطابق المدخلات (same parameters)، بينما Overloading = اختلاف المدخلات (different parameters).'
          },
          threeKeywords: [
            { en: 'in a subclass', ar: 'في الكلاس الابن (وراثة)' },
            { en: 'same signature', ar: 'نفس الاسم ونفس المدخلات' },
            { en: 'replaces parent method', ar: 'يستبدل سلوك دالة الأب' }
          ],
          fadingLevels: {
            level1Ar: 'تحدث <bdi dir="ltr" class="ck-inline-term">Method Overriding</bdi> عندما يقوم <bdi dir="ltr" class="ck-inline-kw">subclass</bdi> بإعادة تعريف دالة ورثها من الأب بـ <bdi dir="ltr" class="ck-inline-kw">same signature</bdi>.',
            level2SimpleEn: 'Method Overriding occurs when a subclass redefines an inherited method with the exact same signature, whereas Method Overloading uses different parameters.',
            level2SubAr: 'احفظ القاعدة: same signature في الـ subclass = Overriding، أما different parameters = Overloading.',
            level3Tokens: [
              { text: 'In an', role: 'filler', explainAr: 'حشو' },
              { text: 'object-oriented hierarchy,', role: 'filler', explainAr: 'مقدمة' },
              { text: 'identify', role: 'verb', explainAr: 'فعل السؤال: حدد المصطلح' },
              { text: 'the feature where a', role: 'filler', explainAr: 'ربط' },
              { text: 'child subclass redefines an inherited method with the exact same name and parameter list', role: 'clue', explainAr: 'شفرة الحل: كلاس ابن + نفس الاسم والمدخلات = Method Overriding' },
              { text: 'rather than', role: 'filler', explainAr: 'مقارنة' },
              { text: 'defining methods with different parameter lists', role: 'trap', explainAr: 'فخ التوأم: اختلاف المدخلات = Overloading' },
              { text: '.', role: 'filler', explainAr: 'نقطة' }
            ],
            level3PlainAr: 'حدد الخاصية التي يعيد فيها الكلاس الابن تعريف دالة موروثة بنفس الاسم ونفس قائمة المدخلات بالضبط (Method Overriding).'
          },
          gauntlet: [
            {
              round: 1,
              titleAr: 'القناع 1: الشرط الإلزامي لـ Method Overriding',
              titleEn: 'Disguise 1 · Core Condition',
              stemEn: 'Which condition is required for Method Overriding in Java?',
              hintAr: 'لازم وراثة (subclass) + تطابق الاسم والمدخلات (same signature).',
              options: [
                { letter: 'A', en: 'An inheritance relationship (subclass) and the exact same method signature', ar: 'وجود وراثة (كلاس ابن) وتطابق تام في اسم ومدخلات الدالة' },
                { letter: 'B', en: 'Changing the method name completely', ar: 'تغيير اسم الدالة بالكامل' },
                { letter: 'C', en: 'Having no classes or methods', ar: 'عدم وجود كلاسات أو دوال' },
                { letter: 'D', en: 'Using only private constructors', ar: 'استخدام بواني خاصة فقط' }
              ],
              correctIndex: 0,
              feedbackAr: 'الـ Overriding يشترط وجود كلاس ابن (subclass) مع نفس الاسم والمدخلات (same signature).'
            },
            {
              round: 2,
              titleAr: 'القناع 2: فخ التوأم الشهير (Overriding vs Overloading)',
              titleEn: 'Disguise 2 · Twin-Term Trap',
              stemEn: 'Class Printer defines print(String s) and print(int n) inside the SAME class. What is this called?',
              hintAr: 'انتبه! هنا نفس الكلاس والمدخلات مختلفة (String مقابل int)!',
              options: [
                { letter: 'A', en: 'Method Overloading (different parameter types)', ar: 'التحميل الزائد Overloading لاختلاف نوع المدخلات' },
                { letter: 'B', en: 'Method Overriding (same method name)', ar: 'تجاوز الدالة Overriding لتشابه الاسم' },
                { letter: 'C', en: 'Encapsulation', ar: 'تغليف البيانات' },
                { letter: 'D', en: 'Deadlock', ar: 'الانتظار الدائري' }
              ],
              correctIndex: 0,
              feedbackAr: 'لأن المدخلات اختلفت (different parameters) في نفس الكلاس، فهذا هو التوأم Method Overloading!'
            },
            {
              round: 3,
              titleAr: 'القناع 3: سيناريو كود في الاختبار',
              titleEn: 'Disguise 3 · Code Scenario',
              stemEn: 'Class Manager extends Employee and provides its own implementation of getSalary() with identical parameters. Which mechanism is this?',
              hintAr: 'كلاس ابن (extends) أعاد كتابة نفس الدالة بنفس المدخلات.',
              options: [
                { letter: 'A', en: 'Method Overriding', ar: 'إعادة تعريف الدالة الموروثة (Method Overriding)' },
                { letter: 'B', en: 'Method Overloading', ar: 'التحميل الزائد (Method Overloading)' },
                { letter: 'C', en: 'Syntax Compilation', ar: 'ترجمة القواعد' },
                { letter: 'D', en: 'Static Binding', ar: 'الربط الثابت' }
              ],
              correctIndex: 0,
              feedbackAr: 'وجود extends مع إعادة تعريف نفس الدالة بنفس المدخلات هو Method Overriding.'
            }
          ],
          rubric: {
            mechanismStemsAr: ['اعاد', 'يعيد', 'تعريف', 'ابن', 'وراث', 'نفس', 'مدخل', 'دال', 'سلوك'],
            mechanismStemsEn: ['redefin', 'replace', 'inherit', 'same', 'child', 'parent', 'method'],
            requiredEnglishTerms: ['subclass', 'same signature'],
            boundaryMarkers: ['بينما', 'عكس', 'وليس', 'اما', 'يختلف', 'unlike', 'whereas', 'not', 'while', 'different'],
            twinStems: ['overloading', 'اوفرلود', 'مختلف', 'different', 'parameter'],
            scaffoldTemplateEn: 'Method Overriding redefines an inherited method in a subclass with the same signature, whereas Method Overloading uses different parameters.',
            sampleDrafts: [
              {
                label: '01 — مسودة عربية (Arabic Draft)',
                sub: 'فاهم الفكرة بالعربي بدون مصطلحات إنجليزية',
                text: 'أن الكلاس الابن يعيد تعريف دالة الأب بنفس الاسم ونفس المدخلات'
              },
              {
                label: '02 — خلط مع التوأم (Twin-Term Confusion)',
                sub: 'خلط Overriding مع Overloading',
                text: 'Method Overriding means using different parameter lists inside the same class'
              },
              {
                label: '03 — إجابة الدرجة الكاملة (Full-Mark Answer)',
                sub: 'شاملة للمصطلحات والتفريق عن التوأم',
                text: 'Method Overriding happens in a subclass with the same signature, whereas Overloading uses different parameters.'
              }
            ]
          }
        }
      ]
    },
    bus: {
      id: 'bus',
      code: 'B123 · BUS101',
      titleAr: 'إدارة الأعمال والمحاسبة',
      titleEn: 'Business & Accounting',
      concepts: [
        {
          id: 'liability',
          term: 'Liability',
          phonetic: 'لاي - أ - بيلتي',
          twinTerm: 'Asset',
          terminalCmd: '> decode_term --target="Liability" --vs="Asset"',
          coreArabic: 'الالتزامات والديون المالية المستحقة على الشركة والتي يجب سدادها للغير (قروض أو فواتير موردين).',
          coreEnglish: 'Financial debts and obligations owed by a business to outside creditors.',
          insteadOf: {
            titleAr: 'شخص يسبب عبئًا أو نقطة ضعف (المعنى اليومي العام)',
            titleEn: 'Everyday English: "A hindrance or burden"',
            trapNoteAr: 'الطالب يخلط بين المعنى اليومي للكلمة وبين بند الالتزامات المالية في قائمة المركز المالي (Balance Sheet).'
          },
          tryThis: {
            titleAr: 'دين مالي مستحق على الشركة للغير (Financial debt owed) عكس الأصول المملوكة (Asset)',
            titleEn: 'Accounting Meaning: Financial debt owed to creditors (vs. Assets owned)',
            twinNoteAr: 'احفظ الفرق بحرف واحد: Owed (عليك للغير) = Liability، بينما Owned (مملوك لك) = Asset!'
          },
          threeKeywords: [
            { en: 'financial debt owed', ar: 'دين مالي مستحق للغير' },
            { en: 'payable obligation', ar: 'التزام واجب السداد' },
            { en: 'opposite of Asset', ar: 'عكس الأصول المملوكة' }
          ],
          fadingLevels: {
            level1Ar: 'في قائمة المركز المالي، أي قرض بنكي غير مسدد يُصنف كـ <bdi dir="ltr" class="ck-inline-term">Liability</bdi> لأنه يمثل <bdi dir="ltr" class="ck-inline-kw">financial debt owed</bdi> على الشركة، بعكس <bdi dir="ltr" class="ck-inline-kw">Asset</bdi> المملوك للشركة.',
            level2SimpleEn: 'A Liability is a financial debt owed by a business to creditors, whereas an Asset is an economic resource owned by the business.',
            level2SubAr: 'قاعدة الحرف الواحد: Owed (مستحق عليك) = Liability | Owned (مملوك لك) = Asset.',
            level3Tokens: [
              { text: 'On the quarterly', role: 'filler', explainAr: 'حشو زمني' },
              { text: 'balance sheet of a Jeddah coffee roastery,', role: 'filler', explainAr: 'مثال قصصي' },
              { text: 'classify', role: 'verb', explainAr: 'فعل السؤال: صنّف محاسبيًا' },
              { text: 'the', role: 'filler', explainAr: 'أداة تعريف' },
              { text: 'unpaid 50,000 SAR bank loan owed to creditors', role: 'clue', explainAr: 'شفرة الحل: قرض غير مسدد مستحق للدائنين = Liability' },
              { text: 'in contrast to', role: 'filler', explainAr: 'أداة مقارنة' },
              { text: 'cash and roasting machines owned', role: 'trap', explainAr: 'فخ التوأم: الكاش والمعدات المملوكة = Asset' },
              { text: '.', role: 'filler', explainAr: 'نهاية الجملة' }
            ],
            level3PlainAr: 'صنّف القرض البنكي غير المسدد المستحق للدائنين (Liability) في مقابل النقد والمعدات المملوكة للشركة (Asset).'
          },
          gauntlet: [
            {
              round: 1,
              titleAr: 'القناع 1: المعنى العام مقابل المعنى المحاسبي',
              titleEn: 'Disguise 1 · Accounting Meaning',
              stemEn: 'On an AOU B123 Balance Sheet, what does the category "Liabilities" represent?',
              hintAr: 'تذكر كلمة Owed: الديون والمبالغ التي يجب على الشركة دفعها للغير.',
              options: [
                { letter: 'A', en: 'Financial debts and obligations owed by the business to creditors', ar: 'الديون والالتزامات المالية المستحقة على الشركة للدائنين' },
                { letter: 'B', en: 'Cash revenue collected from customers', ar: 'المبيعات النقدية المحصلة من العملاء' },
                { letter: 'C', en: 'Delivery trucks owned by the company', ar: 'شاحنات التوصيل المملوكة للشركة' },
                { letter: 'D', en: 'An employee who arrives late', ar: 'موظف يتأخر عن الدوام' }
              ],
              correctIndex: 0,
              feedbackAr: 'في المحاسبة، الـ Liabilities هي الديون والالتزامات المالية المستحقة للغير.'
            },
            {
              round: 2,
              titleAr: 'القناع 2: فك الاشتباك بين Liability و Asset',
              titleEn: 'Disguise 2 · Twin-Term Contrast',
              stemEn: 'Which statement accurately distinguishes a Liability from an Asset?',
              hintAr: 'قارن بين Owed (دين عليك) و Owned (أصل مملوك لك).',
              options: [
                { letter: 'A', en: 'Unpaid bank loans owed are Liabilities, whereas equipment owned is an Asset', ar: 'القروض غير المسددة هي التزامات، بينما المعدات المملوكة هي أصول' },
                { letter: 'B', en: 'Cash in the bank is a Liability, whereas loans are Assets', ar: 'النقد في البنك التزام والقروض أصول' },
                { letter: 'C', en: 'Both loans and equipment are Liabilities', ar: 'كلاهما التزامات' },
                { letter: 'D', en: 'Assets are debts owed to suppliers', ar: 'الأصول هي ديون للموردين' }
              ],
              correctIndex: 0,
              feedbackAr: 'القروض المستحقة للغير هي Liabilities، والممتلكات هي Assets.'
            },
            {
              round: 3,
              titleAr: 'القناع 3: سيناريو اختبار مخفي',
              titleEn: 'Disguise 3 · Case Study Scenario',
              stemEn: 'A store bought inventory on credit and must pay the supplier in 45 days. How is this unpaid invoice recorded?',
              hintAr: 'فاتورة شراء بالآجل واجبة السداد للمورد.',
              options: [
                { letter: 'A', en: 'Current Liability (Accounts Payable)', ar: 'التزام متداول (دائنون)' },
                { letter: 'B', en: 'Fixed Asset', ar: 'أصل ثابت' },
                { letter: 'C', en: 'Owner Equity', ar: 'حقوق ملكية' },
                { letter: 'D', en: 'Gross Revenue', ar: 'إجمالي الإيرادات' }
              ],
              correctIndex: 0,
              feedbackAr: 'الفواتير المستحقة للموردين بالآجل تُسجل كالتزام متداول (Liability).'
            }
          ],
          rubric: {
            mechanismStemsAr: ['دين', 'ديون', 'التزام', 'سداد', 'مستحق', 'قرض', 'تدين', 'عليها'],
            mechanismStemsEn: ['debt', 'owe', 'owed', 'obligat', 'loan', 'payable', 'creditor'],
            requiredEnglishTerms: ['liability', 'debt', 'owed'],
            boundaryMarkers: ['بينما', 'عكس', 'وليس', 'اما', 'unlike', 'whereas', 'not', 'while'],
            twinStems: ['asset', 'اصول', 'اصل', 'تمتلك', 'مملوك', 'own', 'owned', 'resource'],
            scaffoldTemplateEn: 'A Liability is a financial debt owed to creditors, whereas an Asset is a resource owned by the business.',
            sampleDrafts: [
              {
                label: '01 — مسودة عربية (Arabic Draft)',
                sub: 'فاهم المعنى بالعربي بدون الكلمات الإنجليزية',
                text: 'هي الديون والالتزامات المالية المستحقة على الشركة ويجب سدادها'
              },
              {
                label: '02 — خلط مع التوأم (Twin-Term Confusion)',
                sub: 'خلط الديون (Liability) مع الأصول المملوكة (Asset)',
                text: 'A liability is cash and equipment owned by the company'
              },
              {
                label: '03 — إجابة الدرجة الكاملة (Full-Mark Answer)',
                sub: 'شاملة للمصطلحات والتفريق عن Asset',
                text: 'A Liability is a financial debt owed by the company, whereas an Asset is a resource owned by the company.'
              }
            ]
          }
        }
      ]
    },
    acad: {
      id: 'acad',
      code: 'TMA · EXAM VERBS',
      titleAr: 'أفعال أسئلة الواجبات والاختبارات',
      titleEn: 'Academic Command Verbs',
      concepts: [
        {
          id: 'justify',
          term: 'Justify',
          phonetic: 'جاس - تي - فاي',
          twinTerm: 'Describe',
          terminalCmd: '> decode_verb --target="Justify" --vs="Describe"',
          coreArabic: 'برّر قرارك أو اختيارك بتقديم أسباب مقنعة وأدلة تثبت لماذا هذا الخيار أفضل من البدائل الأخرى.',
          coreEnglish: 'Provide evidence-based reasons defending WHY a decision or option was chosen over alternatives.',
          insteadOf: {
            titleAr: 'محاذاة النص في برنامج الوورد أو الاكتفاء بوصف سطحي للمفهوم',
            titleEn: 'Word Processor meaning ("Align text") or merely listing features',
            trapNoteAr: 'نصف الطلاب يخسرون درجة سؤال الـ TMA عندما يبدأ بـ Justify لأنهم يكتفون بكتابة تعريف المصطلح (Describe) دون ذكر الأسباب والأدلة!'
          },
          tryThis: {
            titleAr: 'ذكر الأسباب والأدلة (reasons + evidence) وشرح لماذا هذا الخيار أفضل من البديل',
            titleEn: 'Exam Command Meaning: Give evidence + reasons WHY chosen vs. alternatives',
            twinNoteAr: 'Describe يجيب عن (ما هو؟)، بينما Justify يجيب عن (لماذا اخترناه بالدليل على حساب البديل الآخر؟).'
          },
          threeKeywords: [
            { en: 'give strong reasons', ar: 'تقديم أسباب مقنعة' },
            { en: 'support with evidence', ar: 'الدعم بالأدلة من الحالة' },
            { en: 'explain WHY chosen', ar: 'شرح لماذا فضّلناه عالبديل' }
          ],
          fadingLevels: {
            level1Ar: 'عندما يبدأ سؤال الـ TMA بكلمة <bdi dir="ltr" class="ck-inline-term">Justify</bdi> فالمصحح يطلب منك <bdi dir="ltr" class="ck-inline-kw">reasons and evidence</bdi> تشرح فيها <bdi dir="ltr" class="ck-inline-kw">why chosen</bdi> وليس مجرد وصف.',
            level2SimpleEn: 'To Justify in an exam means giving evidence-based reasons for why an option is best, unlike Describe which only lists features.',
            level2SubAr: 'لأخذ الدرجة الكاملة في سؤال Justify: اكتب because + دليل من الحالة + مقارنة بالبديل.',
            level3Tokens: [
              { text: 'Based on the case study,', role: 'filler', explainAr: 'تمهيد السؤال' },
              { text: 'justify', role: 'verb', explainAr: 'فعل السؤال: برّر بالأسباب والدليل (لا تكتفِ بالتعريف!)' },
              { text: 'why the clinic adopted', role: 'filler', explainAr: 'سياق' },
              { text: 'encrypted cloud backup over local disks', role: 'clue', explainAr: 'شفرة المطلوب: أسباب تفضيل السحابة المشفرة على الأقراص المحلية' },
              { text: 'rather than simply', role: 'filler', explainAr: 'مقارنة' },
              { text: 'describing what cloud storage is', role: 'trap', explainAr: 'فخ شائع: الاكتفاء بالوصف Describe يضيع نصف الدرجة!' },
              { text: '.', role: 'filler', explainAr: 'نقطة' }
            ],
            level3PlainAr: 'برّر بالأدلة لماذا اختارت العيادة النسخ الاحتياطي السحابي المشفر بدلاً من الأقراص المحلية (لا تكتفِ بوصف السحابة!).'
          },
          gauntlet: [
            {
              round: 1,
              titleAr: 'القناع 1: معنى Justify في ورقة الاختبار',
              titleEn: 'Disguise 1 · Exam Verb Meaning',
              stemEn: 'When a TMA question asks you to "Justify your choice of database", what must you write?',
              hintAr: 'المصحح يبحث عن أسباب التفضيل (Why + Evidence).',
              options: [
                { letter: 'A', en: 'Evidence-based reasons explaining why this database fits the project better than alternatives', ar: 'أسباب مدعومة بأدلة تشرح لماذا تناسب قاعدة البيانات هذا المشروع أفضل من غيرها' },
                { letter: 'B', en: 'Aligning the paragraph margins on both sides in Word', ar: 'محاذاة النص من الجانبين في برنامج الوورد' },
                { letter: 'C', en: 'Writing a one-line dictionary definition only', ar: 'كتابة تعريف قاموسي من سطر واحد فقط' },
                { letter: 'D', en: 'Listing the names of database tables without explanation', ar: 'سرد أسماء الجداول بدون شرح' }
              ],
              correctIndex: 0,
              feedbackAr: 'فعل الأمر Justify يتطلب تقديم أسباب وأدلة تدافع عن سبب اختيارك.'
            },
            {
              round: 2,
              titleAr: 'القناع 2: لماذا يخسر الطالب الدرجة بين Justify و Describe؟',
              titleEn: 'Disguise 2 · Twin Verb Contrast',
              stemEn: 'Why does a student lose marks when the prompt says "Justify" and they only write what the technology is?',
              hintAr: 'كتابة "ما هي التقنية" تعتبر Describe وليست Justify.',
              options: [
                { letter: 'A', en: 'Because stating what something is only covers "Describe", whereas "Justify" requires defending WHY it was chosen', ar: 'لأن ذكر ماهية الشيء يغطي Describe فقط، بينما Justify يتطلب تبرير لماذا تم اختياره' },
                { letter: 'B', en: 'Because definitions are always wrong', ar: 'لأن التعريفات خاطئة دائمًا' },
                { letter: 'C', en: 'Because the font size was too small', ar: 'لأن حجم الخط صغير' },
                { letter: 'D', en: 'Because Describe and Justify are synonyms', ar: 'لأنهما بنفس المعنى' }
              ],
              correctIndex: 0,
              feedbackAr: 'الوصف يغطي Describe، بينما Justify يشترط ذكر الحجج والأسباب المقارنة.'
            },
            {
              round: 3,
              titleAr: 'القناع 3: أي إجابة تستحق الدرجة الكاملة؟',
              titleEn: 'Disguise 3 · Grader Selection',
              stemEn: 'Which student sentence earns full marks for a "Justify" question?',
              hintAr: 'ابحث عن الجملة التي تحتوي على because + ميزة + مقارنة بالبديل (unlike).',
              options: [
                { letter: 'A', en: 'We selected Agile because weekly sprints adapt to changing client needs, unlike Waterfall which locks requirements early.', ar: 'اخترنا Agile لأن الدورات الأسبوعية تتكيف مع التغييرات، بعكس Waterfall الذي يجمد المتطلبات مبكرًا' },
                { letter: 'B', en: 'Agile is a project management methodology.', ar: 'أجايل هي منهجية إدارة مشاريع' },
                { letter: 'C', en: 'Software projects use computers and teams.', ar: 'مشاريع البرمجيات تستخدم الحواسيب والفرق' },
                { letter: 'D', en: 'Waterfall has phases.', ar: 'منهجية الشلال لها مراحل' }
              ],
              correctIndex: 0,
              feedbackAr: 'الجملة الأولى قدمت السبب والدليل والمقارنة بالبديل، فحققت شرط Justify بالكامل.'
            }
          ],
          rubric: {
            mechanismStemsAr: ['برر', 'تبرير', 'سبب', 'اسباب', 'دليل', 'ادل', 'لماذا', 'افضل'],
            mechanismStemsEn: ['reason', 'evidence', 'why', 'support', 'argument', 'because', 'defend'],
            requiredEnglishTerms: ['reasons', 'evidence', 'why'],
            boundaryMarkers: ['بينما', 'عكس', 'وليس', 'اما', 'unlike', 'whereas', 'not', 'while', 'instead'],
            twinStems: ['describe', 'وصف', 'سرد', 'تعريف', 'فقط', 'list', 'define', 'feature'],
            scaffoldTemplateEn: 'Justify requires giving evidence-based reasons for why an option is chosen, unlike Describe which only lists features.',
            sampleDrafts: [
              {
                label: '01 — مسودة عربية (Arabic Draft)',
                sub: 'فاهم المطلوب بالعربي بدون الكلمات الإنجليزية',
                text: 'يعني أذكر الأسباب والأدلة لماذا اخترت هذا الحل'
              },
              {
                label: '02 — خلط مع التوأم (Twin-Term Confusion)',
                sub: 'الخلط بين Justify و Describe (سرد المواصفات فقط)',
                text: 'Justify means only list features and define the term'
              },
              {
                label: '03 — إجابة الدرجة الكاملة (Full-Mark Answer)',
                sub: 'مستوفية لشروط المصحح الثلاثة',
                text: 'Justify requires giving evidence and reasons for why a solution is chosen, unlike Describe which only lists features.'
              }
            ]
          }
        }
      ]
    }
  }
};
