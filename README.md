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

## مثال: إضافة مقطع فيديو

```tsx
import { OffthreadVideo, staticFile } from "remotion";

<OffthreadVideo src={staticFile("clip.mp4")} />
```

التوثيق الرسمي: https://www.remotion.dev/docs
