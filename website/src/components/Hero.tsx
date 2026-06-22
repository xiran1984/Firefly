import { useEffect, useRef, useState } from "react";
import { heroVideo, profile } from "../data/content";
import GradientText from "./GradientText";
import styles from "./Hero.module.css";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // 视频是否可用。无 src 或加载失败时降级为 CSS 动态背景。
  const [videoOk, setVideoOk] = useState(Boolean(heroVideo.src));

  useEffect(() => {
    // 有 src 但实际加载失败 → 降级
    if (!heroVideo.src) return;
    const v = videoRef.current;
    if (!v) return;
    const onErr = () => setVideoOk(false);
    v.addEventListener("error", onErr);
    return () => v.removeEventListener("error", onErr);
  }, []);

  return (
    <section id="top" className={styles.hero}>
      {/* ---- 背景层 ---- */}
      {videoOk && heroVideo.src ? (
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          poster={heroVideo.poster || undefined}
        >
          <source src={heroVideo.src} type="video/mp4" />
        </video>
      ) : (
        <div className={styles.fallbackBg} aria-hidden>
        </div>
      )}

      {/* 暗色遮罩，保证文字可读 */}
      <div className={styles.overlay} aria-hidden />

      {/* ---- 内容层 ---- */}
      <div className={`container ${styles.content}`}>
        <div className={`${styles.badge} reveal`}>
          <span className={styles.badgeDot} />
          <span className={styles.badgeText}>
            {profile.role} · {profile.location}
          </span>
        </div>

        <h1 className={`${styles.headline} reveal`} style={{ "--reveal-delay": "80ms" }}>
          {profile.heroHeadline.map((line, i) => (
            <GradientText
              key={i}
              className={styles.line}
              colors={
                i === 0
                  ? ["#eae5f5", "#22b2cb", "#8466f5", "#f5f7ff"]
                  : ["#00d4ff", "#22f7c8", "#3b82f6", "#eae5f5"]
              }
              animationSpeed={2.2}
              direction="horizontal"
              pauseOnHover={false}
              yoyo={false}
            >
              {line}
            </GradientText>
          ))}
        </h1>

        <p
          className={`${styles.sub} reveal`}
          style={{ "--reveal-delay": "180ms" }}
        >
          {profile.heroSub}
        </p>

        <div
          className={`${styles.actions} reveal`}
          style={{ "--reveal-delay": "280ms" }}
        >
          <a href="#works" className={styles.primaryBtn}>
            查看作品
            <span className={styles.btnArrow}>→</span>
          </a>
          <a href={`mailto:${profile.email}`} className={styles.ghostBtn}>
            直接联系
          </a>
        </div>
      </div>

      {/* 滚动指示器 */}
      <a href="#about" className={styles.scrollHint} aria-label="向下滚动">
        <span className={styles.scrollMouse}>
          <span className={styles.scrollDot} />
        </span>
        <span className={styles.scrollLabel}>SCROLL</span>
      </a>
    </section>
  );
}
