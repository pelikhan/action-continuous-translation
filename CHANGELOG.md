# action-continuous-translation

## 0.1.1

### Patch Changes

- [`36f7ef1`](https://github.com/pelikhan/action-continuous-translation/commit/36f7ef11b6461f444f65fd151b6da2075177c461) Thanks [@pelikhan](https://github.com/pelikhan)! - add filename-template to customize the output path of translated files

## 0.1.0

### Minor Changes

- [`3d27165`](https://github.com/pelikhan/action-continuous-translation/commit/3d2716542054f889b533e769e578e6f5953bd95e) Thanks [@pelikhan](https://github.com/pelikhan)! - Updated storage strategy for translation files.

## 0.0.24

### Patch Changes

- [#79](https://github.com/pelikhan/action-continuous-translation/pull/79) [`16ffbc8`](https://github.com/pelikhan/action-continuous-translation/commit/16ffbc8a946b6e6e537805380390fab790e0bba1) Thanks [@pelikhan](https://github.com/pelikhan)! - - 🧠 Improved detection of translatable content in paragraphs and headings to skip nodes containing only links or non-translatable text
  - 🔎 Updated French translations for increased accuracy, consistency, and clarity across UI and docs
  - 📈 Added new usage metrics for translation and validation steps in usage logs

## 0.0.23

### Patch Changes

- [#77](https://github.com/pelikhan/action-continuous-translation/pull/77) [`8e0eac4`](https://github.com/pelikhan/action-continuous-translation/commit/8e0eac42137510787c01d65d06b50b4ce1bc5307) Thanks [@pelikhan](https://github.com/pelikhan)! - - ✨ Added support for glossary markdown file to improve translation consistency and referenced it in translation prompts

  - 📝 Enhanced and clarified translation task instructions and prompt structure for better usability and detail
  - 🧹 Removed unused helper function for marker detection
  - ➕ Introduced new action and workflow parameters for specifying a glossary file
  - 📝 Added comprehensive Markdown feature test file, glossary, and translation style instructions for documentation and testing

- [#78](https://github.com/pelikhan/action-continuous-translation/pull/78) [`d6042fd`](https://github.com/pelikhan/action-continuous-translation/commit/d6042fd095370b0336ab482ce02b4f9f790a0177) Thanks [@pelikhan](https://github.com/pelikhan)! - we want to be able to run the translation job locally with models with more tokens, and maintain it with github mmodels. so the mmodel name in the file is not useful. the user can change the cache fodlder if needed.
  - ✨ Added prompt for extra user input when generating a changeset for more flexible descriptions
  - 🐛 Fixed translation cache to use only the language code in filenames, improving consistency
  - 🇫🇷 Added French translations for documentation in `translations-dev/fr.json`
  - 📊 Introduced translation usage tracking with `translations-dev/usage.jsonl` for audit and analytics
  - 💬 Improved formatting of translation instructions and prompts for better clarity

## 0.0.22

### Patch Changes

- [#47](https://github.com/pelikhan/action-continuous-translation/pull/47) [`d692757`](https://github.com/pelikhan/action-continuous-translation/commit/d69275788fddc35acf1410e2c9c368001adb2487) Thanks [@pelikhan](https://github.com/pelikhan)! - - ✨ Added support for a configurable `translations_dir` parameter to specify where translations are saved

  - 📁 Updated documentation and examples to describe the new `translations_dir` option
  - 🛠️ Refactored translator script to use the provided translations directory in all relevant file paths
  - 📝 Enhanced French translations with a new entry for "Folder to store translations"
  - 🗂️ Updated translation usage logs to include new French README translation records
  - ✅ Added `.gitignore` entry to exclude `test/generative-ai-with-javascript/` directory

- [`1bc8025`](https://github.com/pelikhan/action-continuous-translation/commit/1bc80258dd573fe0117258ccba6b620aea19983b) Thanks [@pelikhan](https://github.com/pelikhan)! - better genai summary page

- [#41](https://github.com/pelikhan/action-continuous-translation/pull/41) [`76885e0`](https://github.com/pelikhan/action-continuous-translation/commit/76885e0b76d883948c618546fdb64cdb43117ce1) Thanks [@pelikhan](https://github.com/pelikhan)! - - 🗒️ **Added translation usage logging:**

  - Introduced a `logUsage` function within the translation workflow.
  - Logs prompt usage details such as file name, stage (translate/validate), model, token counts, cost, and timestamp to `translations/log.json`.
  - Ensures both translation and validation steps are logged.

  - 📊 **New log file:**

    - Created `translations/log.json` to keep a record of prompt usage for each processed document.

  - 🔎 **Minor refactoring for clarity:**

    - Modernized some in-line functional syntax.
    - Consistently cleaned up function argument formatting for readability.

  - 🌐 **Translation sample data update:**
    - Replaced the verbose `translations/fr.json` sample/fixture file with a concise one focused on example paragraph and feature strings relevant to document-level translation instruction testing and demo.
    - Removed large documentation strings in favor of direct translation test cases and examples.

  **Impact:**

  - Easier tracking and analysis of translation operation costs and API usage.
  - Improved maintainability and focus of translation example data.

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
