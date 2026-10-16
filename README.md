# videoyoutube — مونتاج فيديوهات يوتيوب بـ Remotion

## التثبيت

```bash
npm install
```

## الأوامر

| الأمر | الوظيفة |
| --- | --- |
| `npm run dev` | فتح Remotion Studio في المتصفح لمعاينة الفيديو وتعديله |
| `npm run build` | تصيير الفيديو إلى `out/video.mp4` |
| `npm run lint` | التحقق من أخطاء TypeScript |

## هيكل المشروع

- `src/index.ts` — نقطة الدخول
- `src/Root.tsx` — تسجيل الفيديوهات (المقاس، المدة، عدد الإطارات)
- `src/HelloWorld.tsx` — فيديو تجريبي (عنوان متحرك)
- `public/` — ضع هنا ملفات الفيديو والصور والصوت، واستخدمها عبر `staticFile("اسم-الملف.mp4")`

## مثال: إضافة مقطع فيديو

```tsx
import { OffthreadVideo, staticFile } from "remotion";

<OffthreadVideo src={staticFile("clip.mp4")} />
```

التوثيق الرسمي: https://www.remotion.dev/docs
