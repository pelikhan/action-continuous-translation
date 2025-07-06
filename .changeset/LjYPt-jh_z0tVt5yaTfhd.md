---
"action-continuous-translation": patch
---

- ✨ Added a new script to automate generating changeset descriptions from current code changes
- 📝 Filters out non-essential files (translations, docs in various languages, package files, etc.) from the diff before summarizing
- 🤖 Uses prompts to AI to produce engaging, bullet-pointed changeset summaries with emojis
- 💾 Dynamically generates a changeset markdown file in `.changeset/` with a unique ID for each run
- 🛠️ Console logging added for better traceability during execution
