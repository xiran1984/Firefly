import type { ReactNode } from "react";
import "./GradientText.css";

type GradientTextProps = {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  direction?: "horizontal" | "vertical" | "diagonal";
  pauseOnHover?: boolean;
  yoyo?: boolean;
  showBorder?: boolean;
};

export default function GradientText({
  children,
  className = "",
  colors = ["#5227FF", "#FF9FFC", "#B497CF"],
  animationSpeed = 8,
  direction = "horizontal",
  pauseOnHover = false,
  yoyo = true,
  showBorder = false,
}: GradientTextProps) {
  const gradientAngle =
    direction === "horizontal"
      ? "to right"
      : direction === "vertical"
        ? "to bottom"
        : "to bottom right";
  const gradientColors = [...colors, colors[0]].join(", ");
  const shineColors = [
    colors[0] ?? "#00d4ff",
    colors[1] ?? "#22f7c8",
    "#ffffff",
    colors[2] ?? "#8466f5",
    colors[0] ?? "#00d4ff",
  ].join(", ");
  const gradientSize =
    direction === "horizontal"
      ? "220% 100%"
      : direction === "vertical"
        ? "100% 220%"
        : "220% 220%";
  const start =
    direction === "vertical"
      ? "50% 0%"
      : "0% 50%";
  const end =
    direction === "vertical"
      ? "50% 100%"
      : "100% 50%";

  return (
    <span
      className={`animated-gradient-text ${showBorder ? "with-border" : ""} ${
        pauseOnHover ? "pause-on-hover" : ""
      } ${yoyo ? "" : "no-yoyo"} ${className}`}
      style={{
        "--gradient-image": `linear-gradient(${gradientAngle}, ${shineColors}, ${gradientColors})`,
        "--gradient-size": gradientSize,
        "--gradient-speed": `${animationSpeed}s`,
        "--gradient-position-start": start,
        "--gradient-position-end": end,
      }}
    >
      <span className="text-content">{children}</span>
    </span>
  );
}
