---
"action-continuous-translation": patch
---

- 🗒️ **Added translation usage logging:**  
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
