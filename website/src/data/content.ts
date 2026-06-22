/**
 * ============================================================
 *  内容数据层 —— 所有文案集中在此，方便后续修改
 *  修改这里即可更新页面文字，无需改动组件逻辑
 * ============================================================
 */

/* -------------------- 基础信息 -------------------- */
export const profile = {
  name: "Xiran",
  nameEn: "Xiran",
  role: "AI 产品经理 / FDE",
  // Hero 区定位大标题（FDE = Forward Deployed Engineer，前向部署工程师）
  heroHeadline: ["构建 AI 落地的", "最后一公里"],
  heroSub:
    "AI 产品经理，FDE（前向部署工程师）方向深耕。擅长把模型能力转化为可上线的业务系统——从需求拆解、原型设计到部署运维的全流程闭环。",
  location: "杭州",
  email: "qplazm119@gmail.com",
  phone: "17858605377",
} as const;

const assetPath = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

/* -------------------- 导航 -------------------- */
export const navItems = [
  { id: "about", label: "经历" },
  { id: "works", label: "项目" },
  { id: "strengths", label: "优势" },
  { id: "contact", label: "联系" },
] as const;

/* -------------------- Hero 背景视频 --------------------
 * 视频素材占位：把你的 mp4 放到 public/hero.mp4 即可自动启用。
 * 留空字符串则使用 CSS 动态背景降级方案。 */
export const heroVideo = {
  src: "", // 例如: "/hero.mp4"
  poster: "", // 例如: "/hero-poster.jpg"
} as const;

/* -------------------- 个人经历数据条 -------------------- */
export const stats = [
  { value: 5, suffix: "年", label: "行业经验" },
  { value: 3, suffix: "段", label: "职业经历" },
  { value: 10, suffix: "+", label: "AI 应用落地" },
  { value: 4, suffix: "类", label: "自动化场景" },
] as const;

/* -------------------- 个人介绍 -------------------- */
export const about = {
  paragraphs: [
    "5 年互联网经验，从亚马逊运营、数据运营一路走到 AI 产品经理，沉淀了「业务理解 → 数据分析 → 技术落地」的完整链路能力。",
    "能够独立完成 AI 应用从需求分析、产品设计到部署上线的全流程：熟悉企业级 AI 中转平台、知识库、Agent 工作流与多模型接入。",
    "日常用 Claude Code、Codex、n8n、Docker 等工具快速实现业务自动化，为团队每日节省数小时，让 AI 真正在业务里跑起来。",
  ],
} as const;

/* -------------------- 工作经历时间线 -------------------- */
export const timeline = [
  {
    period: "2025.12 - 至今",
    company: "江苏龙道数据集团",
    role: "AI 产品经理",
    highlights: [
      "负责企业 AI 中转平台、知识库 Agent 与 AI 应用落地。",
      "主导需求分析、原型设计（Stitch / Figma）到上线交付全流程。",
      "用 Claude Code、Codex、n8n、Docker 进行开发部署与运维。",
      "开发抖音、淘宝、拼多多等平台 RPA 工作流，覆盖采集、订单、BI。",
      "基于 AnythingLLM 搭建企业文档知识库，编写 Prompt 与 Skill 模板。",
    ],
  },
  {
    period: "2025.03 - 2025.10",
    company: "杭州戴高乐电子商务",
    role: "数据运营",
    highlights: [
      "用 SQL、Excel 分析 Amazon 流量、广告与转化，搭建指标监控体系。",
      "利用卖家精灵、SIF 进行关键词与竞品分析，优化 Listing 与排名。",
      "通过 AI 与数据分析优化 ROI、定价与促销策略。",
      "用线性回归与透视表进行库存预测，优化补货结构。",
    ],
  },
  {
    period: "2022.10 - 2025.01",
    company: "太阁智能设备（杭州）",
    role: "亚马逊运营",
    highlights: [
      "监控 CTR、CVR、流量漏斗等核心指标，推动多个产品进入类目前 50。",
      "用 SIF 与 Excel 分析竞品与市场数据，支持新品选品。",
      "通过 A/B Test 优化产品图片、关键词与 Listing 转化。",
      "使用影刀与 Tableau 完成数据采集与可视化分析。",
    ],
  },
] as const;

/* -------------------- 精选项目 --------------------
 * cover 设为 null 时使用 CSS 抽象占位图；
 * 替换真实截图时填入路径，如 assetPath("works/ai-platform.webp") */
type WorkItem = {
  title: string;
  summary: string;
  tags: readonly string[];
  cover: string | null;
  metric: string;
};

export const works: readonly WorkItem[] = [
  {
    title: "企业 AI 中转平台 & 知识库 Agent",
    summary:
      "基于 AnythingLLM 搭建企业文档知识库，整合 OpenAI / Claude / Gemini 多模型接入，为业务团队提供统一的 AI 能力入口与会话 Agent。",
    tags: ["AnythingLLM", "多模型接入", "Agent", "知识库", "Docker"],
    cover: assetPath("works/enterprise-ai-hub.webp"),
    metric: "统一入口 · 多模型",
  },
  {
    title: "电商全平台 RPA 工作流系统",
    summary:
      "面向抖音、淘宝、拼多多开发 RPA 工作流，覆盖数据采集、订单处理、BI 展示全链路，把分散的人工操作沉淀为可复用的自动化流水线。",
    tags: ["n8n", "RPA", "数据采集", "BI", "影刀"],
    cover: assetPath("works/omnichannel-rpa.webp"),
    metric: "日省数小时",
  },
  {
    title: "数据驱动运营体系",
    summary:
      "用 SQL、Excel、Tableau 搭建 Amazon 运营指标监控体系，结合线性回归做库存预测，以 A/B Test 持续优化 ROI、定价与 Listing 转化。",
    tags: ["SQL", "Tableau", "库存预测", "A/B Test", "ROI"],
    cover: assetPath("works/data-driven-ops.webp"),
    metric: "类目前 50",
  },
] as const;

/* -------------------- 个人优势 -------------------- */
export const strengths = [
  {
    icon: "flow",
    title: "AI 全流程落地",
    desc: "需求拆解 → 原型设计 → 部署上线的闭环能力。Claude Code、Codex、n8n、Docker 全链路实操，让模型能力真正跑在业务里。",
  },
  {
    icon: "automation",
    title: "企业级自动化",
    desc: "RPA + 脚本 + CLI 程序的组合拳，把重复劳动沉淀为自动化流水线，已为团队每日节省数小时。",
  },
  {
    icon: "data",
    title: "数据驱动决策",
    desc: "SQL、Excel、BI、透视表、线性回归——从运营到产品形成数据闭环，用指标而非直觉推动决策。",
  },
  {
    icon: "prototype",
    title: "快速原型验证",
    desc: "Stitch / Figma 原型 + Prompt / Skill 模板设计，快速验证想法、降低沟通成本，让业务同事更好地上手 AI。",
  },
] as const;

/* -------------------- 联系区 -------------------- */
export const contact = {
  headline: ["Let's Build", "Together"],
  sub: "如果你正在寻找一个能把 AI 真正落地到业务的人，欢迎聊聊。无论是 FDE 岗位还是 AI 应用合作，我都很期待。",
  ctaLabel: "发一封邮件",
} as const;

/* -------------------- Footer -------------------- */
export const footer = {
  copyright: `© ${new Date().getFullYear()} Xiran. All rights reserved.`,
  builtWith: "Built with React + Vite",
} as const;
