import { nanoid } from "nanoid";

script({
  title: "Generates a changeset from the current changes",
});

const branch = await git.branch();
const defaultBranch = await git.defaultBranch();
if (branch === defaultBranch)
  cancel(
    "You must be on a feature branch to generate a changeset. Please switch to a feature branch and try again."
  );

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
if (!diff)
  cancel(
    "No changes found in the current branch. Please make some changes first."
  );

const type = await host.select("What type of changeset is this?", [
  "patch",
  "minor",
  "major",
]);
if (!type) cancel("No type selected. Please select a type of changeset.");

const filename = `.changeset/${branch}.md`;
const { text: content } = await runPrompt(
  (ctx) => {
    const diffRef = ctx.def("GIT_DIFF", diff);
    ctx.$`## Role
    You are an expert code reviewer with great English technical writing skills.

## Task
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
"action-continuous-translation": ${type}
---

${content}
`
);

await git.exec(`add .`);
await git.exec(`commit -m "[chore] add changeset for current changes"`);
await git.exec(`push`);
