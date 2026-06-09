import type { Skill } from "../types/config";

export const skillsConfig: Skill[] = [];

export function getEnabledSkills(): Skill[] {
  return skillsConfig
    .filter((s) => s.enabled)
    .sort((a, b) => b.weight - a.weight);
}
