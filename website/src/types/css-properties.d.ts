import "react";

/**
 * 扩展 React 的 CSSProperties，允许在 style 属性中使用任意 CSS 自定义属性
 * （如 "--reveal-delay"），避免 TS 严格模式下的类型报错。
 */
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
