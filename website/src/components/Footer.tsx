import { contact, footer, profile } from "../data/content";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer id="contact" className={`${styles.footer} motion-section`}>
      {/* 背景装饰，与 Hero 呼应 */}
      <div className={styles.bg} aria-hidden>
        <div className={styles.gridLayer} />
        <div className={styles.glow} />
      </div>

      <div className={`container ${styles.inner}`}>
        <span className={`${styles.eyebrow} reveal`}>04 / Contact</span>

        <h2 className={`${styles.headline} reveal`} style={{ "--reveal-delay": "80ms" }}>
          {contact.headline.map((line, i) => (
            <span key={i} className={styles.line}>
              {line}
            </span>
          ))}
        </h2>

        <p className={`${styles.sub} reveal`} style={{ "--reveal-delay": "160ms" }}>
          {contact.sub}
        </p>

        <div
          className={`${styles.actions} reveal`}
          style={{ "--reveal-delay": "240ms" }}
        >
          <a href={`mailto:${profile.email}`} className={styles.mailBtn}>
            {contact.ctaLabel}
            <span className={styles.mailArrow}>→</span>
          </a>
        </div>

        {/* 大号联系方式 */}
        <ul
          className={`${styles.contactRow} reveal`}
          style={{ "--reveal-delay": "320ms" }}
        >
          <li>
            <span className={styles.contactLabel}>EMAIL</span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>
            <span className={styles.contactLabel}>PHONE</span>
            <a href={`tel:${profile.phone}`}>{profile.phone}</a>
          </li>
          <li>
            <span className={styles.contactLabel}>CITY</span>
            <span>{profile.location}</span>
          </li>
        </ul>

        <div className={styles.bottomBar}>
          <span>{footer.copyright}</span>
          <span className={styles.built}>{footer.builtWith}</span>
        </div>
      </div>
    </footer>
  );
}
