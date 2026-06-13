import xiranGoalReadme from "../data/skills/xiran-goal.md?raw";
import type { Skill } from "../types/config";

export const skillsConfig: Skill[] = [
	{
		slug: "xiran-goal",
		name: "xiran-goal",
		description: "把任何目标拆成条件树，找到瓶颈，走最短可验证路径。",
		content: xiranGoalReadme,
		image: "/assets/images/skills/xiran-goal.png",
		tags: ["目标管理", "条件树", "AI"],
		weight: 100,
		enabled: true,
	},
];

export function getEnabledSkills(): Skill[] {
	return skillsConfig
		.filter((skill) => skill.enabled)
		.sort((a, b) => b.weight - a.weight);
}
