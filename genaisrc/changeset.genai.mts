import { nanoid } from "nanoid";

script({
  title: "Generates a changeset from the current changes",
});

const diff = await git.diff({
  base: await git.defaultBranch(),
  askStageOnEmpty: true,
  maxTokensFullDiff: 7000,
  excludedPaths: [
    "**/translations/**",
    "README.*.md",
    "docs/fr/**",
    "docs/es/**",
    "docs/ar/**",
    "docs/pr-br/**",
    "package*.json",
  ],
});
console.debug(diff);

const filename = `.changeset/${nanoid()}.md`;
const { text: content } = await runPrompt(
  (ctx) => {
    const diffRef = ctx.def("GIT_DIFF", diff);
    ctx.$`## Task

You are an expert code reviewer with great English technical writing skills.

Your task is to generate a **changeset** description of the changes in ${diffRef}.

## Instructions

- Follow best practices of https://github.com/changesets/changesets
- do NOT explain that ${diffRef} displays changes in the codebase
- try to extract the intent of the changes, don't focus on the details
- use bullet points to list the changes
- use emojis to make the description more engaging
- focus on the most important changes
- do not try to fix issues, only describe the changes
- ignore comments about imports (like added, remove, changed, etc.)
`.role("system");
  },
  {
    throwOnError: true,
  }
);

console.log(`Writing changeset to ${filename}...`);
await workspace.writeText(
  filename,
  `---
"action-continuous-translation": patch
---

${content}
`
);

await git.exec(`add .`);
await git.exec(`commit -m "[chore] add changeset for current changes"`);
