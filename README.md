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

## فيديو TCF Canada — الفهم الشفهي A1 (الجزء 1)

- النص: `scripts/TCF_Canada_CO_A1_Partie1_script_TTS.md` ← يُحوَّل إلى `src/tcf/script.json` بالأمر
  `python3 scripts/parse_tcf_script.py scripts/TCF_Canada_CO_A1_Partie1_script_TTS.md src/tcf/script.json`
- توليد الصوت تلقائياً: `GEMINI_API_KEY=... npm run tcf:voices` (Google AI Studio)، أو `python3 scripts/generate_tcf_audio.py edge` (Edge TTS، يتطلب `pip install edge-tts`).
- الصوت: ضع الملفات الـ 130 في `public/tcf/audio/` بأسمائها (`intro_01.wav`، `q01_1_document.wav`…)، ثم شغّل
  `npm run tcf:audio` لقياس المدد وكتابة `src/tcf/audio.json`، ثم `npm run tcf:build`.
- قبل وصول الصوت، المدد تُقدَّر من النص، فيمكن معاينة الفيديو (بدون صوت) في Studio.
- الصورة المصغّرة: `npm run tcf:thumbnail` ← `out/miniature-tcf-a1-partie1.png`. العنوان والوصف والوسوم (SEO) في `scripts/TCF_Canada_CO_A1_Partie1_youtube.md`.

## مثال: إضافة مقطع فيديو

```tsx
import { OffthreadVideo, staticFile } from "remotion";

<OffthreadVideo src={staticFile("clip.mp4")} />
```

التوثيق الرسمي: https://www.remotion.dev/docs
