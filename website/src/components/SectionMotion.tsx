import { useEffect } from "react";
import { navItems } from "../data/content";
import { useActiveSection } from "../hooks/useActiveSection";
import styles from "./SectionMotion.module.css";

const sectionIds = navItems.map((item) => item.id);

export function SectionMotion() {
  const active = useActiveSection(sectionIds);
  const activeIndex = Math.max(
    0,
    navItems.findIndex((item) => item.id === active),
  );
  const backgroundImage = `url("${import.meta.env.BASE_URL}backgrounds/site-background.webp")`;

  useEffect(() => {
    document.documentElement.dataset.activeSection = active;
    return () => {
      delete document.documentElement.dataset.activeSection;
    };
  }, [active]);

  useEffect(() => {
    let raf = 0;
    let lastY = "";

    const updateBackgroundPosition = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      const y = `${(18 + progress * 64).toFixed(2)}%`;

      if (y !== lastY) {
        document.documentElement.style.setProperty("--site-bg-y", y);
        lastY = y;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateBackgroundPosition);
    };

    updateBackgroundPosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.documentElement.style.removeProperty("--site-bg-y");
    };
  }, []);

  return (
    <>
      <div
        className={styles.backdropLayer}
        style={{
          "--active-index": activeIndex,
          "--site-bg-image": backgroundImage,
        }}
        aria-hidden
      >
        <div className={styles.backdrop}>
          <div className={styles.backgroundImage} />
          <div className={styles.backgroundVeil} />
        </div>
      </div>

      <nav
        className={styles.rail}
        style={{ "--active-index": activeIndex }}
        aria-label="区块快速导航"
      >
        {navItems.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`${styles.railItem} ${
              index === activeIndex ? styles.active : ""
            }`}
            aria-label={item.label}
            aria-current={index === activeIndex ? "true" : undefined}
          >
            <span className={styles.railIndex}>0{index + 1}</span>
            <span className={styles.railLabel}>{item.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
