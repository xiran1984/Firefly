import { about, profile, stats, timeline } from "../data/content";
import styles from "./About.module.css";
import { CountUp } from "./CountUp";

export default function About() {
  return (
    <section id="about" className="section motion-section">
      <div className="container">
        {/* 区块标题 */}
        <div className={styles.head}>
          <span className="eyebrow reveal">01 / About</span>
          <h2 className="section-title reveal" style={{ "--reveal-delay": "60ms" }}>
            把 AI 真正<span className={styles.accent}>落地</span>到业务里
          </h2>
        </div>

        {/* 主体：头像 + 介绍 */}
        <div className={styles.body}>
          <div className={`${styles.avatarCol} reveal`}>
            <div className={styles.avatar}>
              {/* 几何抽象头像占位 —— 替换为真人照时移除此结构，改用 <img> */}
              <div className={styles.avatarInner} aria-hidden>
                <span className={styles.avatarGlyph}>X</span>
                <div className={styles.avatarRing} />
                <div className={styles.avatarRingSecond} />
              </div>
              <span className={styles.avatarTag}>FDE</span>
            </div>

            {/* 联系方式 */}
            <ul className={styles.contactList}>
              <li>
                <span className={styles.contactIcon} aria-hidden>
                  ✉
                </span>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
              <li>
                <span className={styles.contactIcon} aria-hidden>
                  ☎
                </span>
                <a href={`tel:${profile.phone}`}>{profile.phone}</a>
              </li>
              <li>
                <span className={styles.contactIcon} aria-hidden>
                  ⌖
                </span>
                <span>{profile.location}</span>
              </li>
            </ul>
          </div>

          <div className={styles.introCol}>
            <div className={styles.intro}>
              {about.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="reveal"
                  style={{ "--reveal-delay": `${i * 90}ms` }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* 数据条 */}
        <div className={styles.stats}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`${styles.statItem} reveal`}
              style={{ "--reveal-delay": `${i * 80}ms` }}
            >
              <div className={styles.statValue}>
                <CountUp end={s.value} />
                <span className={styles.statSuffix}>{s.suffix}</span>
              </div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* 工作经历时间线 */}
        <div className={styles.timelineHead}>
          <span className="eyebrow reveal">职业经历</span>
        </div>
        <ol className={styles.timeline}>
          {timeline.map((item, i) => (
            <li
              key={item.company}
              className={`${styles.tlItem} reveal`}
              style={{ "--reveal-delay": `${i * 90}ms` }}
            >
              <div className={styles.tlMarker} aria-hidden>
                <span className={styles.tlDot} />
              </div>
              <div className={styles.tlContent}>
                <div className={styles.tlTop}>
                  <span className={styles.tlPeriod}>{item.period}</span>
                </div>
                <h3 className={styles.tlRole}>
                  {item.role}
                  <span className={styles.tlCompany}> · {item.company}</span>
                </h3>
                <ul className={styles.tlHighlights}>
                  {item.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
