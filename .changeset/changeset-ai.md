---
"action-continuous-translation": patch
---

- ✨ Introduced a script to automate changeset generation based on current code changes
- 📝 Automatically excludes translations, documentation in several languages, and package files from considered diffs
- 🤖 Prompts an AI to create concise, emoji-enhanced, bullet-pointed changeset summaries following best practices
- 💾 Creates a uniquely named changeset Markdown file within `.changeset/`, tagged by branch name
- 🛠️ Adds console logging for transparency and debugging during script execution
- ⚡ Commits the generated changeset automatically to version control
