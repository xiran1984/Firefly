import { useEffect, useState } from "react";
import { navItems, profile } from "../data/content";
import { useActiveSection } from "../hooks/useActiveSection";
import styles from "./Navbar.module.css";

const sectionIds = navItems.map((n) => n.id);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    let raf = 0;

    const updateScrolled = () => {
      const next = window.scrollY > 40;
      setScrolled((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateScrolled);
    };

    updateScrolled();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.logo} aria-label="返回顶部">
          <span className={styles.logoMark}>X</span>
          <span className={styles.logoText}>
            {profile.nameEn.split(" ")[0]}
            <span className={styles.logoDot}>.</span>
          </span>
        </a>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`${styles.navLink} ${
                active === item.id ? styles.active : ""
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className={styles.cta}>
          联系我
          <span className={styles.ctaArrow}>→</span>
        </a>
      </div>
    </header>
  );
}
