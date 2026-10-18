# videoyoutube — مونتاج فيديوهات يوتيوب بـ Remotion

## التثبيت

```bash
npm install
```

## الأوامر

| الأمر | الوظيفة |
| --- | --- |
| `npm run dev` | فتح Remotion Studio في المتصفح لمعاينة الفيديو وتعديله |
| `npm run build` | تصيير فيديو «Cours de français 01» إلى `out/cours-francais-01.mp4` |
| `npm run thumbnail` | إنشاء الصورة المصغّرة ليوتيوب في `out/miniature-cours-01.png` |
| `npm run lint` | التحقق من أخطاء TypeScript |

## هيكل المشروع

- `src/index.ts` — نقطة الدخول
- `src/Root.tsx` — تسجيل الفيديوهات (المقاس، المدة، عدد الإطارات)
- `src/HelloWorld.tsx` — فيديو تجريبي (عنوان متحرك)
- `src/french/` — فيديو «Cours de français 01» (موشن جرافيك متزامن مع التعليق الصوتي):
  - `timeline.ts` — توقيت كل حرف ومقطع بالثواني (مقاس على `public/voiceover.wav`)
  - `captions.ts` — الترجمة الفرنسية كلمة بكلمة + الترجمة العربية
  - `scenes/` — المشاهد: المقدمة، الأبجدية، الحروف المتحركة، E وU، الأصوات، حرف H، الخاتمة
  - `theme.ts` — الألوان والخطوط ودوال الحركة
- `public/` — ضع هنا ملفات الفيديو والصور والصوت، واستخدمها عبر `staticFile("اسم-الملف.mp4")`

## تعديل فيديو الدرس

- لإخفاء الترجمة العربية: غيّر `showArabic` إلى `false` في `src/Root.tsx` (أو من لوحة Props في Studio).
- إذا غيّرت التعليق الصوتي، حدّث الأوقات في `src/french/timeline.ts` و`src/french/captions.ts`.

## فيديوهات TCF Canada — الفهم الشفهي A1 (سلسلة 200 سؤال، 40 سؤالاً لكل جزء)

الأجزاء 1 (Q1–40) و2 (Q41–80) و3 (Q81–120) تشترك في نفس الكود؛ الأوامر `tcf:*` للجزء 1 و`tcf2:*` و`tcf3:*` للجزأين 2 و3.

- النص: `scripts/TCF_Canada_CO_A1_PartieN_script_TTS.md` ← يُحوَّل إلى `src/tcf/script_pN.json` بالأمر
  `python3 scripts/parse_tcf_script.py scripts/TCF_Canada_CO_A1_Partie2_script_TTS.md src/tcf/script_p2.json`
- توليد الصوت تلقائياً: `GEMINI_API_KEY=... npm run tcf2:voices` (Google AI Studio)، أو `python3 scripts/generate_tcf_audio.py edge --part=2` (Edge TTS، يتطلب `pip install edge-tts`).
- الصوت: الملفات في `public/tcf/audio/` بأسماء كتل النص (`p2_intro_01.wav`، `q41_1_document.wav`…)، ثم شغّل
  `npm run tcf2:audio` لقياس المدد وكتابة `src/tcf/audio_p2.json`، ثم `npm run tcf2:build`.
- لإضافة جزء جديد: سجّله في `PARTS` (`src/tcf/data.ts`)، وفي مشاهد `SCENES` (`src/tcf/TcfVideo.tsx`)، وفي `src/Root.tsx`.
- قبل وصول الصوت، المدد تُقدَّر من النص، فيمكن معاينة الفيديو (بدون صوت) في Studio.
- الصورة المصغّرة: `npm run tcf:thumbnail` / `npm run tcf2:thumbnail`. العنوان والوصف والوسوم (SEO) في `scripts/TCF_Canada_CO_A1_PartieN_youtube.md`.

## فيديو «40 dialogues A1 — L'entretien d'embauche» (رسوم متحركة)

- النص: `scripts/dialogues_employe_candidate_A1.md`، والصوت: `public/dialogues/part1.wav` … `part4.wav` (كل ملف = 10 حوارات متتالية من قسم واحد، بول + صوفي).
- `npm run dialogues:align` ← يحوّل النص إلى `src/dialogues/script.json`، ثم يحدّد توقيت كل جملة في الصوت (`src/dialogues/timing.json`) دون التعرّف على الكلام: تقطيع على فترات الصمت + تمييز صوت الرجل/المرأة بطبقة الصوت (يتطلب `pip install librosa`).
- `npm run dialogues:build` ← `out/dialogues-entretien-a1.mp4`. الشخصيات والديكور في `src/dialogues/` (`Characters.tsx`، `Scenes.tsx`).

## مثال: إضافة مقطع فيديو

```tsx
import { OffthreadVideo, staticFile } from "remotion";

<OffthreadVideo src={staticFile("clip.mp4")} />
```

التوثيق الرسمي: https://www.remotion.dev/docs
