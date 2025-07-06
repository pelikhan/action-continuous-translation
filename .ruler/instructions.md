# Ruler Instructions

## Project File Structure

This project is a custom GitHub ACtion that uses GenAIScript to translate markdown files in a repository. The project structure is as follows:

- `genaisrc/`: Contains GenAIScript code files.
- `docs/`: Contains documentation files and configurations for the action.
- `test/`: Contains test files and configurations.
- `package.json`: Contains project metadata, dependencies, and scripts for building and running the action.
- `README.md`: The main documentation file for the action.
- `.github/workflows/`: Contains GitHub Actions workflow files for continuous translation.
- `.ruler/`: Contains instructions for the Ruler tool to apply changes to the project.
- `action.yml`: The main GitHub Action configuration file.
- `translations/`: Contains translation files for different languages.

## Localized documentation

The localized files are automatically updated through a GitHub action. Do not try to edit them.

- `README.*.md`: localized readmes.
- `docs/src/content/docs/[fr,es,ar,pt-br,...]/*`: localized documentation files.

## GenAIScript Code Generation Instructions

GenAIScript is a custom runtime for node.js. It provides a set of unique APIs and support the TypeScript syntax, ESM, await/async.

- applies to files `*.genai.*` and files under the `genaisrc/` folder
- GenAIScript documentation: https://microsoft.github.io/genaiscript/llms-full.txt
- GenAIScript ambient type definitions: https://microsoft.github.io/genaiscript/genaiscript.d.ts

## Guidance for Code Generation

- you always generate TypeScript code using ESM modules for Node.JS.
- you prefer using APIs from GenAIScript `genaiscript.d.ts` rather than node.js. Do NOT use node.js imports.
- you keep the code simple, avoid exception handlers or error checking.
- you add `TODOs` where you are unsure so that the user can review them
- you use the global types in genaiscript.d.ts are already loaded in the global context, no need to import them.
- save generated code in the `./genaisrc` folder with `.genai.mts` extension
