import { strengths } from "../data/content";
import styles from "./Strengths.module.css";

// 能力卡片的 SVG 图标，按 content.ts 中 icon 字段映射
const icons: Record<string, React.ReactNode> = {
  flow: (
    <>
      <path d="M3 5h6a3 3 0 0 1 0 6H7a3 3 0 0 0 0 6h6" />
      <circle cx="18" cy="17" r="2.5" />
      <circle cx="6" cy="5" r="0" />
    </>
  ),
  automation: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
    </>
  ),
  data: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  prototype: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </>
  ),
};

export default function Strengths() {
  return (
    <section id="strengths" className="section motion-section">
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow reveal">03 / Strengths</span>
          <h2
            className="section-title reveal"
            style={{ "--reveal-delay": "60ms" }}
          >
            我的<span className={styles.accent}>核心能力</span>
          </h2>
          <p
            className="section-intro reveal"
            style={{ "--reveal-delay": "120ms" }}
          >
            从业务理解到技术落地，四个维度构成我作为 FDE 的能力底座。
          </p>
        </div>

        <div className={styles.grid}>
          {strengths.map((s, i) => (
            <div
              key={s.title}
              className={`${styles.card} reveal`}
              style={{ "--reveal-delay": `${i * 100}ms` }}
            >
              <div className={styles.iconWrap} aria-hidden>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.icon}
                >
                  {icons[s.icon]}
                </svg>
              </div>
              <h3 className={styles.title}>{s.title}</h3>
              <p className={styles.desc}>{s.desc}</p>
              <span className={styles.index}>0{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
