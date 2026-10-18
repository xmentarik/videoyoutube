import { Composition, Still } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { FrenchLesson } from "./french/FrenchLesson";
import { Thumbnail } from "./french/Thumbnail";
import { DIALOGUES_DURATION_S, DialoguesVideo } from "./dialogues/DialoguesVideo";
import { TcfThumbnail } from "./tcf/Thumbnail";
import { TcfVideo, tcfDuration } from "./tcf/TcfVideo";
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
      {/* TCF Canada — compréhension orale A1, parties 1 à 3 (Q1–120). Audio : public/tcf/audio/ */}
      {[1, 2, 3].map((part) => (
        <Composition
          key={part}
          id={`TcfA1Partie${part}`}
          component={TcfVideo}
          durationInFrames={Math.round(tcfDuration(part) * FPS)}
          fps={FPS}
          width={1920}
          height={1080}
          defaultProps={{ part }}
        />
      ))}
      {/* 40 dialogues A1 — entretien d'embauche (Paul + Sophie). Audio : public/dialogues/partN.wav */}
      <Composition
        id="DialoguesEntretienA1"
        component={DialoguesVideo}
        durationInFrames={Math.round(DIALOGUES_DURATION_S * FPS)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      {/* الصورة المصغّرة ليوتيوب */}
      <Still id="MiniatureCours01" component={Thumbnail} width={1280} height={720} />
      <Still id="MiniatureTcfA1Partie1" component={TcfThumbnail} width={1280} height={720} defaultProps={{ part: 1, sample: 1 }} />
      <Still id="MiniatureTcfA1Partie2" component={TcfThumbnail} width={1280} height={720} defaultProps={{ part: 2, sample: 80 }} />
      <Still id="MiniatureTcfA1Partie3" component={TcfThumbnail} width={1280} height={720} defaultProps={{ part: 3, sample: 101 }} />
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
