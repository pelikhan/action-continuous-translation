---
"action-continuous-translation": patch
---

- ✨ Added an automated script to generate changesets using AI, available via `npm run genai:changeset`
- 🤖 Integrates LLM-powered summarization for creating concise, emoji-rich, bullet-pointed changeset descriptions
- 🛡️ Excludes translation files, localized docs, and package manifests from the diff to keep summaries focused
- 🗃️ Generates and names the changeset file after the current branch, saving it in `.changeset/`
- 🌳 Enforces usage only on feature branches, preventing main branch usage
- 🛠️ Adds detailed logging for debugging and transparency during execution
- ⚡ Automatically stages and commits the generated changeset to version control
- 📄 Updated contribution guidelines to document the new AI-powered changeset workflow
