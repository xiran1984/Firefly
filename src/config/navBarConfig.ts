import {
	LinkPreset,
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/config";
import { siteConfig } from "./siteConfig";

// 根据页面开关动态生成导航栏配置
const getDynamicNavBarConfig = (): NavBarConfig => {
	// 基础导航栏链接
	const links: (NavBarLink | LinkPreset)[] = [
		// 主页
		LinkPreset.Home,

		// 文章
		{
			name: "文章",
			url: "/archive/",
			icon: "material-symbols:archive",
		},

		// 技能
		{
			name: "技能",
			url: "/skills/",
			icon: "material-symbols:code",
		},

		// 收藏
		{
			name: "收藏",
			url: "/bookmarks/",
			icon: "material-symbols:bookmarks",
		},
	];

	// 根据配置决定是否添加友链
	if (siteConfig.pages.friends) {
		links.push(LinkPreset.Friends);
	}

	// 根据配置决定是否添加留言板
	if (siteConfig.pages.guestbook) {
		links.push(LinkPreset.Guestbook);
	}

	// 根据配置决定是否添加相册
	if (siteConfig.pages.gallery) {
		links.push(LinkPreset.Gallery);
	}

	// 关于及其子菜单
	links.push({
		name: "关于",
		url: "/content/",
		icon: "material-symbols:info",
		children: [
			...(siteConfig.pages.sponsor ? [LinkPreset.Sponsor] : []),
			LinkPreset.About,
		],
	});

	// 自定义导航栏链接（清空预设，可按需添加）
	// links.push({
	// 	name: "链接",
	// 	url: "/links/",
	// 	icon: "material-symbols:link",
	// 	children: [],
	// });

	// 仅返回链接，其它导航搜索相关配置在模块顶层常量中独立导出
	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
