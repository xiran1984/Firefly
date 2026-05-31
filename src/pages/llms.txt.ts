import { getEnabledSkills, siteConfig } from "@/config";
import { getSortedPosts } from "@utils/content-utils";

export async function GET() {
	const posts = await getSortedPosts();
	const skills = getEnabledSkills();

	const postList = posts
		.map(
			(p) =>
				`- [${p.data.title}](${siteConfig.site_url}/posts/${p.id}/) — ${p.data.published.toISOString().slice(0, 10)}`,
		)
		.join("\n");

	const skillList = skills
		.map(
			(s) =>
				`- **${s.name}** — ${s.description} (load via \`Read ${siteConfig.site_url}/skills.txt，用 ${s.name} 模式，目标是【...】\`)`,
		)
		.join("\n");

	const body = `# ${siteConfig.title}

> ${siteConfig.subtitle}

${siteConfig.description ? `${siteConfig.description}\n` : ""}

## About

- Site: ${siteConfig.site_url}
- Language: ${siteConfig.lang}
- RSS: ${siteConfig.site_url}/rss.xml

## Skills

${skillList || "No skills available."}

## Posts

${postList || "No posts yet."}

## Contact

- GitHub: https://github.com/xiran1984
- Email: qplazm119@gmail.com
`;

	return new Response(body, {
		status: 200,
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
