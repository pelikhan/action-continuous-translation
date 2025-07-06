script({
  title: "Generates a changeset from the current changes",
});



const diff = await git.diff({
  base: await git.defaultBranch(),
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
