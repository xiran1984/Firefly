import { works } from "../data/content";
import styles from "./Works.module.css";

export default function Works() {
  return (
    <section id="works" className="section motion-section">
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow reveal">02 / Works</span>
          <h2
            className="section-title reveal"
            style={{ "--reveal-delay": "60ms" }}
          >
            精选<span className={styles.accent}>项目</span>
          </h2>
          <p
            className="section-intro reveal"
            style={{ "--reveal-delay": "120ms" }}
          >
            以下是从简历中精选的代表性项目，覆盖 AI 中转、RPA 自动化与数据驱动运营。
          </p>
        </div>

        <div className={styles.grid}>
          {works.map((work, i) => (
            <article
              key={work.title}
              className={`${styles.card} reveal`}
              style={{ "--reveal-delay": `${i * 120}ms` }}
            >
              {/* 封面图区 */}
              <div className={styles.cover}>
                {work.cover ? (
                  <img src={work.cover} alt={work.title} loading="lazy" />
                ) : (
                  <div className={styles.coverPlaceholder} aria-hidden>
                    <div className={styles.coverGrid} />
                    <div className={styles.coverGlow} />
                    <span className={styles.coverWatermark}>
                      {work.title.slice(0, 2)}
                    </span>
                  </div>
                )}
                <span className={styles.coverMetric}>{work.metric}</span>
              </div>

              {/* 正文 */}
              <div className={styles.body}>
                <h3 className={styles.title}>{work.title}</h3>
                <p className={styles.summary}>{work.summary}</p>
                <ul className={styles.tags}>
                  {work.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
