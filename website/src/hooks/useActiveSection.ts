import { useEffect, useState } from "react";

/**
 * 导航高亮 Hook
 *
 * 监听指定区块，当某个区块进入视口（偏上区域）时返回其 id，
 * 用于导航栏高亮当前所在区块。
 *
 * @param sectionIds 区块 id 列表
 * @returns 当前激活的区块 id
 */
export function useActiveSection(sectionIds: readonly string[]): string {
  const [active, setActive] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    if (sectionIds.length === 0) return;

    let raf = 0;

    const update = () => {
      const anchor = window.innerHeight * 0.5;
      let next = sectionIds[0] ?? "";
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height * 0.35;
        const distance = Math.abs(sectionCenter - anchor);

        if (distance < bestDistance) {
          bestDistance = distance;
          next = id;
        }
      }

      setActive((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionIds]);

  return active;
}
