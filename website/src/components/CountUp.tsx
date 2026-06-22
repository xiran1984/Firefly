import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
}

/**
 * 数字滚动动画组件。
 * 进入视口时从 0 滚动到目标值，用 easeOutQuart 缓动。
 */
export function CountUp({ end, duration = 1600 }: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 尊重「减少动态」偏好：直接显示终值
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // easeOutQuart
            const eased = 1 - Math.pow(1 - progress, 4);
            setValue(Math.round(end * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} aria-label={String(end)}>
      {value}
    </span>
  );
}
