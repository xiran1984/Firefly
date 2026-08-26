import xrGoalReadme from "../data/skills/xr-goal.md?raw";
import xrSurviveGameReadme from "../data/skills/xr-survive-game.md?raw";
import xrTraumaSupportReadme from "../data/skills/xr-trauma-support.md?raw";
import type { Skill } from "../types/config";

export const skillsConfig: Skill[] = [
	{
		slug: "xr-goal",
		name: "xr-goal",
		description: "把任何目标拆成条件树，找到瓶颈，走最短可验证路径。",
		content: xrGoalReadme,
		image: "/assets/images/skills/xr-goal.png",
		tags: ["目标管理", "条件树", "AI"],
		weight: 100,
		enabled: true,
	},
	{
		slug: "xr-survive-game",
		name: "xr-survive-game",
		description: "判断一件事值不值得继续；卡住或能量很低时，给出五分钟内能完成的动作。",
		content: xrSurviveGameReadme,
		tags: ["行动选择", "意义评估", "AI"],
		weight: 90,
		enabled: true,
	},
	{
		slug: "xr-trauma-support",
		name: "xr-trauma-support",
		description: "通过低压力对话识别心理卡点，先承接情绪，再寻找安全、可执行的恢复方向。",
		content: xrTraumaSupportReadme,
		tags: ["心理支持", "行动恢复", "AI"],
		weight: 80,
		enabled: true,
	},
];

export function getEnabledSkills(): Skill[] {
	return skillsConfig
		.filter((skill) => skill.enabled)
		.sort((a, b) => b.weight - a.weight);
}
