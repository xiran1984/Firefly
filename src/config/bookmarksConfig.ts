import type { FriendLink } from "../types/config";

// 收藏配置
// 在下方数组中添加收藏的网站
export const bookmarksConfig: FriendLink[] = [
	{
		title: "OpenCLI",
		imgurl: "https://github.com/jackwener.png",
		desc: "把任何网站变成命令行工具，AI 原生的浏览器自动化框架，复用登录态零风控，GitHub 20k+ Star",
		siteurl: "https://github.com/jackwener/OpenCLI",
		tags: ["开源", "CLI", "AI"],
		weight: 10,
		enabled: true,
	},
	{
		title: "dbskill",
		imgurl: "https://github.com/dontbesilent2025.png",
		desc: "Claude Code 商业诊断技能包，从 12000+ 条推文中提炼知识原子，用奥派经济学与维特根斯坦哲学解决商业问题",
		siteurl: "https://github.com/dontbesilent2025/dbskill",
		tags: ["AI", "商业", "Skill"],
		weight: 10,
		enabled: true,
	},
	{
		title: "HA7CH",
		imgurl: "https://www.ha7ch.com/favicon.ico",
		desc: "Lawted 的个人博客，专注 FDE（前向部署工程师）、AI Native Builder 与独立开发，分享实操经验与行业洞察",
		siteurl: "https://www.ha7ch.com/",
		tags: ["博客", "FDE", "AI"],
		weight: 10,
		enabled: true,
	},
];

// 获取启用的收藏
export const getEnabledBookmarks = (): FriendLink[] => {
	const bookmarks = bookmarksConfig.filter((item) => item.enabled);
	return bookmarks.sort((a, b) => b.weight - a.weight);
};
