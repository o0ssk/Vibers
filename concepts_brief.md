# ContextKey (Bilingual Academic Context & Exam Mastery Pipeline)

* **Author:** Vibers Team (AOU Jeddah)
* **Date:** 2026-11-17

## Overview

ContextKey is a single-screen, client-side web application for first-year Arabic-speaking students at the Arab Open University (AOU Jeddah) who have beginner English proficiency and must study and pass English-taught major courses (Track T2: Smarter Learning, Challenge 2.2). The application addresses the root failure mode where students rely on literal single-word translation during study and then fail in exams when terms appear in unfamiliar academic contexts, indirect scenarios, or alongside confusable twin terms.

Each concept passes through a three-stage mastery pipeline on one screen:
1. **Stage 1: Progressive Language Fading and Multi-Context Decoder** (a 3-stop slider transitioning from an Arabic explanation with embedded English keywords to simplified English clues, and finally to a full academic exam question with an X-Ray toggle that dims filler words and highlights action verbs, context clues, and distractor traps, paired with a General vs. Major vs. Exam meaning comparison).
2. **Stage 2: Three-Disguise Exam Gauntlet** (three rounds testing the same concept across an everyday false-friend meaning trap, a confusable twin-term distinction, and an unlabeled exam scenario, routing missed rounds into an immediate intra-session retry queue).
3. **Stage 3: Explain-to-Pass Grader Rubric Evaluator** (where the student writes their understanding in Arabic or simple English, and a deterministic client-side evaluator checks for concept mechanism, mandatory English grading keywords, and twin-term distinction, providing a guided English sentence scaffold to reach a full-mark answer).

## Analysis

All seven Goldfish brainstorming lenses (`egm-design`, `egm-codebase-details`, `egm-zoom-out`, `egm-comprehension`, `egm-implementation-readiness`, `egm-structural`, `egm-inventive-catalyst`) completed their audits. Below is the deduplicated synthesis of structural contradictions, technical risks, and inventive resolutions.

### 1. Contradiction: Arbitrary PDF/TXT & Custom Input vs. Zero-Backend / Zero-API-Key Pedagogical Richness (Blocker)
* ** Lenses:** `egm-design`, `egm-codebase-details`, `egm-zoom-out`, `egm-comprehension`, `egm-implementation-readiness`, `egm-inventive-catalyst`
* **Finding:** The hackathon rules prohibit backend servers and exposed API keys in the page. However, the 3-stage pipeline requires rich semantic structures per concept (bilingual faded sentences, General vs. Major vs. Exam meanings, false-friend traps, confusable twin terms, and 3-criterion bilingual rubrics). Pure client-side JavaScript cannot autonomously generate accurate Arabic explanations, false friends, or twin-term boundaries from arbitrary unstructured PDF/TXT files. Additionally, `pdf.js` Web Workers often fail under local `file://` execution or with scanned image PDFs.
* **Inventive Resolution (TRIZ Preliminary Action + Inversion + Cushioning):**
  * **Tier 1 (Curated AOU Concept Ontology & Corpus Matcher):** Bundle a pre-indexed client-side AOU First-Year Concept Ontology (covering high-yield CS/IT `TM105`/`M251`, Business `B123`, and Academic English concepts with complete Stage 1–3 metadata) plus a universal Academic Exam Discourse Lexicon (action verbs like `justify`, `trace`, `distinguish`, and negation/trap markers like `except`, `only`, `never`). When a student uploads a `.txt`/`.md`/`.pdf` slide or past-exam file, the app scans it against the bundled ontology to immediately unlock full 3-stage bilingual fidelity for matched course concepts.
  * **Tier 2 (Deterministic Exam X-Ray & Guided Blueprint Editor for Novel Input):** For any arbitrary pasted exam question or custom term not in the local ontology, the app activates the deterministic **Universal Exam X-Ray Classifier** (highlighting command verbs, negation traps, and long technical tokens while dimming stopwords) and opens a pre-filled **Quick Concept Blueprint Editor** (extracting definitional sentences and contrast markers like `unlike` / `whereas` from the uploaded text) rather than outputting broken placeholders.

### 2. Contradiction: Free-Text Bilingual Rubric Grading vs. Deterministic Client-Side Execution (Blocker)
* **Lenses:** `egm-codebase-details`, `egm-design`, `egm-comprehension`, `egm-implementation-readiness`, `egm-inventive-catalyst`
* **Finding:** Evaluating free-text student explanations in Arabic or beginner English without an LLM fails under naive substring or ASCII `\b` regex matching (`\b` in JavaScript regular expressions fails completely on Arabic UTF-16 characters). Arabic orthographic variations (`أ/إ/آ/ا`, `ة/ه`, `ى/ي`, tashkeel, and attached prefixes `ال`, `و`, `ب`, `ف`, `ل`) cause high false-negative rates, while naive keyword checks fail to catch students who confuse a concept with its twin term.
* **Inventive Resolution (TRIZ Segmentation + Blessing in Disguise):**
  * **Zero-Dependency Bilingual Normalizer:** Implement a client-side normalizer using `Intl.Segmenter` (or whitespace/punctuation tokenization) that strips Arabic diacritics/tatweel, unifies alef/hamza/taa-marbuta/yaa variants, strips common Arabic proclitics on words $\ge 4$ characters, applies English suffix stemming, and supports a Levenshtein distance $\le 1$ spelling hint for English grading keywords.
  * **Three-Bucket Polarity Rubric Schema:** Evaluate each concept against three deterministic token sets: (1) `mechanismClusters` (bilingual Arabic/English stem synonyms for how the concept works), (2) `requiredEnglishTerms` (exact Latin-script keywords required by exam graders), and (3) `boundaryClusters` (requiring both a contrast/negation marker such as `unlike`, `whereas`, `بينما`, `عكس`, `وليس` and the twin term's distinguishing attribute).
  * **Diagnostic Failure-to-Scaffold Synthesizer:** When a criterion is missing in the student's Arabic draft, the UI highlights the matched Arabic concepts in green and provides clickable English keyword/phrase chips (`Click to insert into rewrite`) that assemble a concise, full-mark academic English sentence.

### 3. Contradiction: 9-Substep Pipeline & Spaced Repetition vs. Single-Screen 90-Second Live Demo Clock (Blocker)
* **Lenses:** `egm-zoom-out`, `egm-comprehension`, `egm-structural`, `egm-design`, `egm-inventive-catalyst`
* **Finding:** Traversing 3 fading levels in Stage 1, 3 gauntlet rounds + retry queue in Stage 2, and dual Arabic-to-English rubric writing in Stage 3 represents 9–11 sequential interactions. Hard-locking stages sequentially or typing Arabic and English live during a 90-second pitch will run out the clock and create visual clutter on a single screen. Furthermore, multi-day spaced repetition (SM-2) is invisible in a 90-second session.
* **Inventive Resolution (TRIZ Dynamics + Self-Service):**
  * **Fixed 3-Zone Single-Screen Shell with Non-Blocking Navigation:** Mount only the active macro-stage (`Stage 1: Context & Fading Decoder` | `Stage 2: 3-Disguise Gauntlet` | `Stage 3: Explain-to-Pass Grader`) in the central canvas while keeping all stages freely clickable at any time. Compress Stage 1 into a **3-Stop Interactive Language Fading Slider** paired with a 3-card context row (`Everyday False Friend` | `Major Context` | `Exam Trigger`) so Stage 1 can be demonstrated in under 15 seconds.
  * **One-Click Persona Simulation Chips:** Place 3 instant-fill demo chips above the Stage 3 input (*"1. Arabic Draft (Understands Idea, Missing English Keywords)"*, *"2. Twin-Term Confusion Trap"*, *"3. Full-Mark English Rewrite"*) while keeping the textarea 100% live-editable.
  * **Intra-Session Turn-Based Retry Queue:** Replace multi-day timers with an immediate **Weak Spots / Retry Queue (`Retry (N)`)** badge in the top bar that enqueues any missed Stage 2 disguise round and lets the student or presenter replay missed traps with one click, plus a **1-Click Reset Demo (90s Seed)** button in the header.

### 4. Browser API Constraints: Mixed RTL/LTR Bidirectional Layout & Web Speech API Voices (Major)
* **Lenses:** `egm-structural`, `egm-codebase-details`, `egm-comprehension`, `egm-design`
* **Finding:** Mixing Arabic (RTL) sentences with embedded English (LTR) technical terms scrambles punctuation and bounding boxes unless isolated. Passing mixed Arabic/English strings into a single `SpeechSynthesisUtterance` fails across OS voice engines, and many Windows machines lack an installed `ar-*` TTS voice.
* **Resolution:** Wrap all Arabic blocks in `dir="rtl"`, English blocks in `dir="ltr"`, and isolate every inline English chip inside Arabic sentences with `<bdi dir="ltr" style="unicode-bidi: isolate">`. Scope TTS playback primarily to the English technical terms and English exam sentences using `en-US` (with `speechSynthesis.cancel()` queue protection) and always display an inline Arabic phonetic transliteration badge (e.g., `Polymorphism [بولي-مورفيزم]`) so pronunciation works reliably on any machine.

## Goals vs. Non-Goals

* **In-Scope Goals:**
  * Single-screen, zero-backend client-side web app with a fixed 3-zone layout and `localStorage` persistence (`contextkey_store_v1`) with `<500 KB` budget guard and 1-click Demo Reset.
  * Pre-loaded AOU First-Year Course Packs (`TM105/M251 IT`, `B123 Business`, `Academic English`) plus deterministic slide/past-exam text/PDF scanning and a Quick Concept Blueprint builder.
  * Stage 1: 3-Stop Language Fading Slider (`Arabic + English Term` $\rightarrow$ `Simple English Bridge` $\rightarrow$ `Full Exam Question with X-Ray Toggle`) + 3-Context Comparison (`Everyday False Friend` vs. `Major Meaning` vs. `Exam Clue`).
  * Stage 2: 3-Disguise Exam Gauntlet (`Round 1: Everyday vs. Technical Meaning` $\rightarrow$ `Round 2: Twin-Term Distinction` $\rightarrow$ `Round 3: Unlabeled Exam Scenario`) with an immediate intra-session Retry Queue.
  * Stage 3: Explain-to-Pass Bilingual Rubric Evaluator with Arabic/English morphological normalization, live 3-criterion telemetry badges, clickable English keyword scaffolding chips, and 1-click demo student draft presets.
* **Out-of-Scope Non-Goals:**
  * External LLM API calls or exposed API keys in client code.
  * Multi-day calendar/SM-2 spaced-repetition scheduling.
  * Full OCR for scanned image-only PDFs.
  * User authentication, backend databases, or multi-page routing.

## Alternatives Weighed

* **Standard Bilingual Flashcards + 4-Option Quiz (`Term Twin` starter template):** Rejected by author: Does not solve context shock, false-friend traps, exam phrasing complexity, or the student's inability to convert Arabic understanding into English grading keywords; identical to baseline apps built by other teams.
* **Unconstrained Free-File Upload with Naive Regex Generation:** Rejected during Goldfish review (`egm-zoom-out`, `egm-design`, `egm-codebase-details`): Without a backend LLM, raw unstructured file parsing produces empty or broken pedagogical stages if tested with unseen words. Replaced with the Two-Tier Ontology Matcher + Universal Exam X-Ray Classifier.
* **Hard-Locked Sequential 9-Step Wizard:** Rejected during Goldfish review (`egm-zoom-out`, `egm-comprehension`, `egm-structural`): Prevents presenters and judges from navigating freely and exceeds the 90-second live demo time budget.

## Key Decisions & Staging for Next Steps

1. **Adopt the 3-Zone Single-Screen Workbench:** Only one macro-stage (`1. السحب التدريجي وفك السياق`, `2. تحدي الأقنعة الثلاثة`, `3. مقيّم الفهم بعين المصحح`) renders in the main viewport at a time, with non-blocking tab switching and a 1-line Mastery Receipt bar.
2. **Compress Stage 1 with a 3-Stop Language Fading Slider:** Let the user slide smoothly between Level 1 (Arabic with embedded English `<bdi>` keywords), Level 2 (Simple English bridge), and Level 3 (Full Exam Question with live X-Ray filter).
3. **Implement the Deterministic Bilingual Normalizer & Guided Sentence Builder in Stage 3:** Normalize Arabic (`أ/إ/آ` $\rightarrow$ `ا`, `ة` $\rightarrow$ `ه`, strip prefixes `ال/وال/بال`) and English stems, display live match telemetry for the 3 rubric criteria, and include 3 one-click student attempt chips for the 90-second live demo.
