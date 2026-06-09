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
	];

	// 文章及其子菜单
	links.push({
		name: "文章",
		url: "/post/",
		icon: "material-symbols:article-rounded",
		children: [
			// 归档
			LinkPreset.Archive,
			// 分类
			LinkPreset.Categories,
			// 标签
			LinkPreset.Tags,
		],
	});

	// 技能
	links.push({
		name: "技能",
		url: "/skills/",
		icon: "material-symbols:code",
	});

	// 收藏
	links.push({
		name: "收藏",
		url: "/bookmarks/",
		icon: "material-symbols:bookmarks",
	});

	// 根据配置决定是否添加友链，在siteConfig关闭pages.friends时导航栏不显示友链
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

	return { links } as NavBarConfig;
};

// 导航搜索配置
export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
