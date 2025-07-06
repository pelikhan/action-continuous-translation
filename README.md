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
- ⚡ **GitHub Actions Native** - Seamless integration with your CI/CD pipeline
- 🤖 **AI-Powered** - Leverage GitHub Models for seamless high-quality translations

## 📚 Resources

- 📖 [**Documentation**](https://pelikhan.github.io/action-continuous-translation/) - Complete setup guide and API reference (translated by this action too)
- ✍️ [**Blog Post**](https://microsoft.github.io/genaiscript/blog/continuous-translations/) - Deep dive into the technology
- 🌐 **Translations**: [Français](./README.fr.md) | [Español](./README.es.md) | [العربية](./README.ar.md)

## 🔧 How It Works

This action leverages [GenAIScript](https://microsoft.github.io/genaiscript/) to intelligently analyze and translate your markdown documents. Here's the magic behind the scenes:

1. **📄 Parse** - Convert markdown to AST (Abstract Syntax Tree)
2. **🔍 Analyze** - Identify content that needs translation vs. existing translations
3. **🤖 Translate** - Use AI to generate high-quality translations
4. **✅ Validate** - Ensure translation quality and inject into document
5. **💾 Cache** - Save translations for future incremental updates
6. **📝 Commit** - Automatically commit changes to your repository

## ⚙️ Configuration

### 📝 Basic Settings

| Parameter           | Description                                                     | Default     |
| ------------------- | --------------------------------------------------------------- | ----------- |
| `lang`              | Target language(s) for translation (ISO codes, comma-separated) | `fr`        |
| `source`            | Source language (ISO code)                                      | `en`        |
| `files`             | Files to translate (semicolon-separated)                        | `README.md` |
| `instructions`      | Custom translation instructions                                 | -           |
| `instructions_file` | Path to file with translation instructions                      | -           |

### 🌟 Astro Starlight Integration

| Parameter        | Description                                  | Required           |
| ---------------- | -------------------------------------------- | ------------------ |
| `starlight_dir`  | Root folder of Astro Starlight documentation | Only for Starlight |
| `starlight_base` | Base alias for Starlight documentation       | Optional           |

### 🔧 Diagnostics & Debugging

| Parameter | Description                                                                                             | Default |
| --------- | ------------------------------------------------------------------------------------------------------- | ------- |
| `force`   | Force translation even if already translated                                                            | `false` |
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
          file_pattern: "translations/*.json **.md* translations/*.json"
          commit_message: "[cai] translated docs"
          commit_user_name: "genaiscript"
```

<div align="center">

**Made with ❤️ using [GenAIScript](https://microsoft.github.io/genaiscript/)**

</div>
