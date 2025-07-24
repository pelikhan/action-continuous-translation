# 🌍 Continuous Translation

> **Automatically translate your markdown documentation using AI** - powered by [GitHub Actions](https://github.com/actions) and [GitHub Models](https://github.com/models) with built-in support for [Astro Starlight](https://starlight.astro.build/)!

[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/marketplace/actions/continuous-translation)
[![Documentation](https://img.shields.io/badge/📖-Documentation-green)](https://pelikhan.github.io/action-continuous-translation/)

## ✨ Features

- 🚀 **Incremental Translation** - Only translates changed content, saving time and API costs
- 🎯 **Smart AST Parsing** - Preserves markdown structure and formatting
- 🔄 **Cache Management** - Intelligent caching to avoid redundant translations
- 📚 **Astro Starlight Ready** - Built-in support for documentation sites
- 🌐 **Multi-language Support** - Translate to multiple languages simultaneously
- 🔍 **Quality Validation** - Automatic validation of translation quality
- 📝 **C++ Comment Generation** - Generate documentation comments for C++ code using AI
- ⚡ **GitHub Actions Native** - Seamless integration with your CI/CD pipeline
- 🤖 **AI-Powered** - Leverage GitHub Models for seamless high-quality translations

## 📚 Resources

- 📖 [**Documentation**](https://pelikhan.github.io/action-continuous-translation/) - Complete setup guide and API reference (translated by this action too - see [translation dashboard](https://pelikhan.github.io/action-continuous-translation/dashboard/))
- ✍️ [**Blog Post**](https://microsoft.github.io/genaiscript/blog/continuous-translations/) - Deep dive into the technology
- 🌐 **Translations**: [English](./README.md) | [Français](./README.fr.md) | [Español](./README.es.md) | [Portuguese (Brazil)](./README.pt-br.md) | [العربية](./README.ar.md)

## 🔧 How It Works

This action leverages [GenAIScript](https://microsoft.github.io/genaiscript/) to intelligently analyze and translate your markdown documents. Here's the magic behind the scenes:

1. **📄 Parse** - Convert markdown to AST (Abstract Syntax Tree) or analyze C++ code structure
2. **🔍 Analyze** - Identify content that needs translation or code that needs documentation
3. **🤖 Translate/Generate** - Use AI to generate high-quality translations or documentation comments
4. **✅ Validate** - Ensure translation quality and inject into documents/code
5. **💾 Cache** - Save translations for future incremental updates
6. **📝 Commit** - Automatically commit changes to your repository

## ⚙️ Configuration

### 📝 Basic Settings

| Parameter           | Description                                                     | Default                                        |
| ------------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| `lang`              | Target language(s) for translation (ISO codes, comma-separated) | `fr`                                           |
| `source`            | Source language (ISO code)                                      | `en`                                           |
| `files`             | Files to translate (semicolon-separated)                        | `README.md`                                    |
| `instructions`      | Custom translation instructions                                 | -                                              |
| `instructions_file` | Path to file with translation instructions                      | -                                              |
| `glossary_file`     | Path to file with glossary terms                                | -                                              |
| `translations_dir`  | Folder to store translations                                    | `translations`                                 |
| `filename_template` | Jinja template to generate the translated filepath              | `{{dirname}}/{{basename}}.{{lang}}{{extname}}` |

### Limits

| Parameter                | Description                                                              | Default |
| ------------------------ | ------------------------------------------------------------------------ | ------- |
| `max_translation_tokens` | Maximum available tokens for translation LLM call (to avoid rate limits) | `8000`  |
| `max_validation_tokens`  | Maximum available tokens for validation LLM call (to avoid rate limits)  | `2000`  |

### 🌟 Astro Starlight Integration

| Parameter        | Description                                  | Required           |
| ---------------- | -------------------------------------------- | ------------------ |
| `starlight_dir`  | Root folder of Astro Starlight documentation | Only for Starlight |
| `starlight_base` | Base alias for Starlight documentation       | Optional           |

### 🔧 Diagnostics & Debugging

| Parameter | Description                                                                                             | Default |
| --------- | ------------------------------------------------------------------------------------------------------- | ------- |
| `debug`   | Enable debug logging ([learn more](https://microsoft.github.io/genaiscript/reference/scripts/logging/)) | `false` |

### 🤖 AI Provider Configuration

#### GitHub Models (Recommended)

| Parameter      | Description                                                                                                                                              | Default                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `github_token` | GitHub token with `models: read` permission ([setup guide](https://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions)) | `${{ secrets.GITHUB_TOKEN }}` |

#### OpenAI

| Parameter         | Description         | Default                         |
| ----------------- | ------------------- | ------------------------------- |
| `openai_api_key`  | OpenAI API key      | `${{ secrets.OPENAI_API_KEY }}` |
| `openai_api_base` | OpenAI API base URL | `${{ env.OPENAI_API_BASE }}`    |

#### Azure OpenAI

| Parameter                      | Description                                              | Default                                   |
| ------------------------------ | -------------------------------------------------------- | ----------------------------------------- |
| `azure_openai_api_endpoint`    | Azure OpenAI endpoint                                    | `${{ env.AZURE_OPENAI_API_ENDPOINT }}`    |
| `azure_openai_api_key`         | Azure OpenAI API key (not needed for Microsoft Entra ID) | `${{ secrets.AZURE_OPENAI_API_KEY }}`     |
| `azure_openai_subscription_id` | Subscription ID for deployment listing (Entra ID only)   | `${{ env.AZURE_OPENAI_SUBSCRIPTION_ID }}` |
| `azure_openai_api_version`     | Azure OpenAI API version                                 | `${{ env.AZURE_OPENAI_API_VERSION }}`     |
| `azure_openai_api_credentials` | API credentials type                                     | `${{ env.AZURE_OPENAI_API_CREDENTIALS }}` |

#### Model Alias

| Parameter     | Description                                  | Default |
| ------------- | -------------------------------------------- | ------- |
| `model_alias` | A YAML-like string of `alias: modelid` pairs |         |

See the [Models](/action-continuous-translation/models/) documentation for more details.

## 📤 Outputs

| Output | Description                           |
| ------ | ------------------------------------- |
| `text` | The generated translation text output |

## 🚀 Quick Start

### Simple Setup

Add this step to your GitHub Actions workflow to translate your README to French and Spanish:

```yaml
uses: pelikhan/action-continuous-translation@v0
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  lang: fr,es
```

### Complete Workflow Example

Save this file in your `.github/workflows/` directory as `continuous-translation.yml`:

```yaml
name: Continuous Translation
on:
  workflow_dispatch:
  push:
    branches:
      - main
    paths:
      - "README.md"
      - "docs/src/content/docs/**"
permissions:
  contents: write
  models: read
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
jobs:
  continuous_translation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/cache@v4
        with:
          path: .genaiscript/cache/**
          key: continuous-translation-${{ github.run_id }}
          restore-keys: |
            continuous-translation-
      - uses: pelikhan/action-continuous-translation@v0
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          lang: fr,es
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          file_pattern: "**.md* translations/**"
          commit_message: "[cai] translated docs"
          commit_user_name: "genaiscript"
```

## 📝 C++ Comment Generation

This action also includes a powerful C++ comment generator that automatically creates documentation comments for your C++ code using AI.

### Quick Start for C++ Comments

Add this to your workflow to generate Doxygen-style comments for C++ files:

```yaml
- uses: pelikhan/action-continuous-translation@v0
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    files: "src/**/*.cpp;src/**/*.h"
    script: cpp-comment-generator
```

### C++ Comment Generation Features

- 🎯 **Smart Code Analysis** - Identifies classes, functions, methods, constructors, and destructors
- 📖 **Multiple Comment Styles** - Supports Doxygen, Javadoc, and block comment formats
- 🔒 **Privacy Control** - Configurable option to include or exclude private members
- 🔄 **Overwrite Protection** - Option to preserve existing comments or replace them
- ⚡ **Dry Run Mode** - Preview changes before applying them

### C++ Comment Parameters

| Parameter         | Description                                      | Default   |
| ----------------- | ------------------------------------------------ | --------- |
| `commentStyle`    | Comment style: `doxygen`, `javadoc`, or `block` | `doxygen` |
| `includePrivate`  | Generate comments for private members            | `false`   |
| `overwrite`       | Overwrite existing comments                      | `false`   |
| `dryRun`         | Preview changes without applying them            | `false`   |

### Usage Examples

Generate comments for all C++ files with dry run:
```bash
npm run genai:cpp-comments-simple -- -x dryRun=true
```

Generate comments with custom style:
```bash
npm run genai:cpp-comments -- -x commentStyle=javadoc -x includePrivate=true
```

<div align="center">

**Made with ❤️ using [GenAIScript](https://microsoft.github.io/genaiscript/)**

</div>
