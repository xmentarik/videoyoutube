import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { FrenchLesson } from "./french/FrenchLesson";
import { DURATION_S, FPS } from "./french/theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Cours de français n°1 — motion design synchronisé sur public/voiceover.wav */}
      <Composition
        id="CoursFrancais01"
        component={FrenchLesson}
        durationInFrames={Math.round(DURATION_S * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ showArabic: true }}
      />
      {/* فيديو تجريبي: 1920x1080 بمعدل 30 إطاراً في الثانية، مدته 5 ثوانٍ */}
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "مرحباً بكم في قناتي",
          subtitle: "فيديو مصنوع بـ Remotion",
        }}
      />
    </>
  );
};
