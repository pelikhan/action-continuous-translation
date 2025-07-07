# action-continuous-translation

## 0.0.21

### Patch Changes

- [#40](https://github.com/pelikhan/action-continuous-translation/pull/40) [`1efc366`](https://github.com/pelikhan/action-continuous-translation/commit/1efc3661ec8607e74c20a564bdd1bc6846e2321b) Thanks [@pelikhan](https://github.com/pelikhan)! - - ✨ Added an automated script to generate changesets using AI, available via `npm run genai:changeset`
  - 🤖 Integrates LLM-powered summarization for creating concise, emoji-rich, bullet-pointed changeset descriptions
  - 🛡️ Excludes translation files, localized docs, and package manifests from the diff to keep summaries focused
  - 🗃️ Generates and names the changeset file after the current branch, saving it in `.changeset/`
  - 🌳 Enforces usage only on feature branches, preventing main branch usage
  - 🛠️ Adds detailed logging for debugging and transparency during execution
  - ⚡ Automatically stages and commits the generated changeset to version control
  - 📄 Updated contribution guidelines to document the new AI-powered changeset workflow

## 0.0.20

### Patch Changes

- [`111ac12`](https://github.com/pelikhan/action-continuous-translation/commit/111ac127ed5ccb525551dac832cfcd131bcdf719) Thanks [@pelikhan](https://github.com/pelikhan)! - missing tag

## 0.0.19

### Patch Changes

- [`d0a8fda`](https://github.com/pelikhan/action-continuous-translation/commit/d0a8fda1e9e08fd17d2a1df5ff68ef651a609699) Thanks [@pelikhan](https://github.com/pelikhan)! - One more attempt at fixing changesets

## 0.0.18

### Patch Changes

- [`1737f55`](https://github.com/pelikhan/action-continuous-translation/commit/1737f55ada37ec235bf87ff0df6a7fd5274eac83) Thanks [@pelikhan](https://github.com/pelikhan)! - Updated release.sh with additional logging

## 0.0.17

### Patch Changes

- [`589114a`](https://github.com/pelikhan/action-continuous-translation/commit/589114a5f7f8cd618bd0498f598b8afd9c25f963) Thanks [@pelikhan](https://github.com/pelikhan)! - Testing changeset

## 0.0.0

Initial Release
