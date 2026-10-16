import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = {
  title: string;
  subtitle: string;
};

export const HelloWorld: React.FC<Props> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 200 } });
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a, #7c3aed)",
        justifyContent: "center",
        alignItems: "center",
        direction: "rtl",
        fontFamily: "Tahoma, Arial, sans-serif",
        opacity: fadeOut,
      }}
    >
      <h1
        style={{
          color: "white",
          fontSize: 120,
          margin: 0,
          transform: `scale(${titleScale})`,
        }}
      >
        {title}
      </h1>
      <p style={{ color: "#e9d5ff", fontSize: 56, opacity: subtitleOpacity }}>
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};
