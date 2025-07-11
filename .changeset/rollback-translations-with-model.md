---
"action-continuous-translation": patch
---

we want to be able to run the translation job locally with models with more tokens, and maintain it with github mmodels. so the mmodel name in the file is not useful. the user can change the cache fodlder if needed.
- ✨ Added prompt for extra user input when generating a changeset for more flexible descriptions
- 🐛 Fixed translation cache to use only the language code in filenames, improving consistency
- 🇫🇷 Added French translations for documentation in `translations-dev/fr.json`
- 📊 Introduced translation usage tracking with `translations-dev/usage.jsonl` for audit and analytics
- 💬 Improved formatting of translation instructions and prompts for better clarity
