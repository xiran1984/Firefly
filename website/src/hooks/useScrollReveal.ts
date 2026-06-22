import { useEffect } from "react";

/**
 * 滚动渐入动画 Hook
 *
 * 给挂载的容器内所有带 `.reveal` 类的元素绑定 IntersectionObserver，
 * 进入视口时添加 `.is-visible` 触发 CSS 过渡。
 *
 * 支持 `style={{ "--reveal-delay": "120ms" }}` 实现错落延迟。
 *
 * @param rootRef 需要监听的根容器引用
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  rootRef: React.RefObject<T | null>,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>(".reveal");
    if (targets.length === 0) return;

    // 尊重「减少动态」偏好：直接全部显示
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rootRef]);
}
