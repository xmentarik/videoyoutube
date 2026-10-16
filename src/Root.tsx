import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* فيديو يوتيوب أفقي: 1920x1080 بمعدل 30 إطاراً في الثانية، مدته 5 ثوانٍ */}
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
