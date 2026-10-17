import { Composition, Still } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { FrenchLesson } from "./french/FrenchLesson";
import { Thumbnail } from "./french/Thumbnail";
import { TcfThumbnail } from "./tcf/Thumbnail";
import { TCF_DURATION_S, TcfVideo } from "./tcf/TcfVideo";
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
      {/* TCF Canada — compréhension orale A1, partie 1 (Q1–40). Audio : public/tcf/audio/ */}
      <Composition
        id="TcfA1Partie1"
        component={TcfVideo}
        durationInFrames={Math.round(TCF_DURATION_S * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      {/* الصورة المصغّرة ليوتيوب */}
      <Still id="MiniatureCours01" component={Thumbnail} width={1280} height={720} />
      <Still id="MiniatureTcfA1Partie1" component={TcfThumbnail} width={1280} height={720} />
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
