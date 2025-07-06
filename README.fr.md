# 🌍 Traduction Continue

> **Traduisez automatiquement votre documentation en markdown à l'aide de l'IA** - alimentée par [GitHub Actions](https://github.com/actions) et [GitHub Models](https://github.com/models) avec un support intégré pour [Astro Starlight](https://starlight.astro.build/) !

[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/marketplace/actions/continuous-translation)
[![Documentation](https://img.shields.io/badge/📖-Documentation-green)](https://pelikhan.github.io/action-continuous-translation/)

## ✨ Fonctionnalités

* 🚀 **Traduction Incrémentielle** - Traduit uniquement le contenu modifié, économisant du temps et des coûts d'API
* 🎯 **Analyse AST Intelligente** - Préserve la structure et le formatage du Markdown
* 🔄 **Gestion du Cache** - Caching intelligent pour éviter les traductions redondantes
* 📚 **Prêt pour Astro Starlight** - Support intégré pour les sites de documentation
* 🌐 **Support Multilingue** - Traduire vers plusieurs langues simultanément
* 🔍 **Validation de la Qualité** - Validation automatique de la qualité des traductions
* ⚡ **Natif GitHub Actions** - Intégration transparente avec votre pipeline CI/CD
* 🤖 **Propulsé par l'IA** - Exploitez GitHub Models pour des traductions fluides et de haute qualité

## 📚 Ressources

* 📖 [**Documentation**](https://pelikhan.github.io/action-continuous-translation/) - Guide complet d'installation et référence API (également traduit par cette action - voir [tableau de bord de traduction](https://pelikhan.github.io/action-continuous-translation/lunaria))
* ✍️ [**Article de Blog**](https://microsoft.github.io/genaiscript/blog/continuous-translations/) - Exploration approfondie de la technologie
* 🌐 **Traductions**: [English](./README.md) | [Français](./README.fr.md) | [Español](./README.es.md) | [Portuguese (Brazil)](./README.pt-br.md) | [العربية](./README.ar.md)

## 🔧 Comment ça marche

Cette action s'appuie sur [GenAIScript](https://microsoft.github.io/genaiscript/) pour analyser et traduire intelligemment vos documents Markdown. Voici la magie opérée en coulisses :

1. **📄 Analyse** - Convertit le Markdown en AST (Abstract Syntax Tree)
2. **🔍 Identification** - Identifie le contenu nécessitant une traduction par rapport aux traductions existantes
3. **🤖 Traduction** - Utilise l'IA pour générer des traductions de haute qualité
4. **✅ Validation** - Assure la qualité de la traduction et l'injecte dans le document
5. **💾 Mise en Cache** - Enregistre les traductions pour des mises à jour incrémentielles futures
6. **📝 Commit** - Commit automatiquement les modifications dans votre dépôt

## ⚙️ Configuration

### 📝 Paramètres de Base

| Paramètre           | Description                                                                 | Par Défaut  |
| ------------------- | --------------------------------------------------------------------------- | ----------- |
| `lang`              | Langue(s) cible(s) pour la traduction (codes ISO, séparés par des virgules) | `fr`        |
| `source`            | Langue source (code ISO)                                                    | `en`        |
| `files`             | Fichiers à traduire (séparés par des points-virgules)                       | `README.md` |
| `instructions`      | Instructions de traduction personnalisées                                   | -           |
| `instructions_file` | Chemin vers le fichier contenant des instructions de traduction             | -           |

### 🌟 Intégration Astro Starlight

| Paramètre        | Description                                        | Requis                    |
| ---------------- | -------------------------------------------------- | ------------------------- |
| `starlight_dir`  | Dossier racine de la documentation Astro Starlight | Uniquement pour Starlight |
| `starlight_base` | Alias de base pour la documentation Starlight      | Optionnel                 |

### 🔧 Diagnostics & Débogage

| Paramètre | Description                                                                                                           | Par Défaut |
| --------- | --------------------------------------------------------------------------------------------------------------------- | ---------- |
| `force`   | Force la traduction même si elle a déjà été effectuée                                                                 | `false`    |
| `debug`   | Activer les journaux de débogage[en savoir plus](https://microsoft.github.io/genaiscript/reference/scripts/logging/)) | `false`    |

### 🤖 Configuration du Fournisseur d'IA

#### GitHub Models (Recommandé)

| Paramètre      | Description                                                                                                                                                      | Par Défaut                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `github_token` | Jeton GitHub avec `models: read`autorisation[guide d'installation](https://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions)) | `${{ secrets.GITHUB_TOKEN }}` |

#### OpenAI

| Paramètre         | Description                 | Par Défaut                      |
| ----------------- | --------------------------- | ------------------------------- |
| `openai_api_key`  | Clé API OpenAI              | `${{ secrets.OPENAI_API_KEY }}` |
| `openai_api_base` | URL de base de l'API OpenAI | `${{ env.OPENAI_API_BASE }}`    |

#### Azure OpenAI

| Paramètre                      | Description                                                          | Par Défaut                                |
| ------------------------------ | -------------------------------------------------------------------- | ----------------------------------------- |
| `azure_openai_api_endpoint`    | Point de terminaison Azure OpenAI                                    | `${{ env.AZURE_OPENAI_API_ENDPOINT }}`    |
| `azure_openai_api_key`         | Clé API Azure OpenAI (non nécessaire pour l'ID Microsoft Entra)      | `${{ secrets.AZURE_OPENAI_API_KEY }}`     |
| `azure_openai_subscription_id` | ID d'abonnement pour la liste des déploiements (ID Entra uniquement) | `${{ env.AZURE_OPENAI_SUBSCRIPTION_ID }}` |
| `azure_openai_api_version`     | Version de l'API Azure OpenAI                                        | `${{ env.AZURE_OPENAI_API_VERSION }}`     |
| `azure_openai_api_credentials` | Type des identifiants API                                            | `${{ env.AZURE_OPENAI_API_CREDENTIALS }}` |

#### Alias de Modèle

| Paramètre     | Description                                    | Par Défaut |
| ------------- | ---------------------------------------------- | ---------- |
| `model_alias` | Une chaîne YAML-like de `alias: modelid`paires |            |

Consultez la documentation des [Modèles](/action-continuous-translation/models/) pour plus de détails.

## 📤 Sorties

| Sortie | Description                       |
| ------ | --------------------------------- |
| `text` | Le texte généré par la traduction |

## 🚀 Démarrage Rapide

### Configuration Simple

Ajoutez cette étape à votre workflow GitHub Actions pour traduire votre README en français et en espagnol :

```yaml
uses: pelikhan/action-continuous-translation@v0
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  lang: fr,es
```

### Exemple Complet de Workflow

Enregistrez ce fichier dans le répertoire `.github/workflows/` sous le nom `continuous-translation.yml` :

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

**Créé avec ❤️ grâce à [GenAIScript](https://microsoft.github.io/genaiscript/)**

</div>
