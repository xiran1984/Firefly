import { getEnabledSkills } from "@/config";

export async function GET() {
  const skills = getEnabledSkills();

  const skillSections = skills
    .map(
      (s) => `## ${s.name}

> ${s.description}

${s.content}
`,
    )
    .join("\n---\n\n");

  const body = `# Skills

${skillSections || "No skills available."}
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
