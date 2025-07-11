# 🌍 Traduction Continue

> **Traduisez automatiquement votre documentation markdown avec l'IA** - propulsé par [GitHub Actions](https://github.com/actions) et [GitHub Models](https://github.com/models) avec une prise en charge intégrée pour [Astro Starlight](https://starlight.astro.build/) !

[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/marketplace/actions/continuous-translation)
[![Documentation](https://img.shields.io/badge/📖-Documentation-green)](https://pelikhan.github.io/action-continuous-translation/)

## ✨ Fonctionnalités

* 🚀 **Traduction Incrémentale** - Ne traduit que le contenu modifié, économisant du temps et des coûts API
* 🎯 **Analyse AST Intelligente** - Préserve la structure et le formatage du markdown
* 🔄 **Gestion du Cache** - Mise en cache intelligente pour éviter les traductions redondantes
* 📚 **Compatible Astro Starlight** - Prise en charge intégrée pour les sites de documentation
* 🌐 **Support Multilingue** - Traduisez dans plusieurs langues simultanément
* 🔍 **Validation de la Qualité** - Validation automatique de la qualité des traductions
* ⚡ **Natif GitHub Actions** - Intégration fluide avec votre pipeline CI/CD
* 🤖 **Propulsé par l'IA** - Utilise GitHub Models pour des traductions de haute qualité

## 📚 Ressources

* 📖 [**Documentation**](https://pelikhan.github.io/action-continuous-translation/) - Guide complet d'installation et de référence API (également traduit par cette action - voir le [tableau de bord de traduction](https://pelikhan.github.io/action-continuous-translation/dashboard/))
* ✍️ [**Article de Blog**](https://microsoft.github.io/genaiscript/blog/continuous-translations/) - Exploration approfondie de la technologie
* 🌐 **Traductions** : [English](./README.md) | [Français](./README.fr.md) | [Español](./README.es.md) | [Portuguese (Brazil)](./README.pt-br.md) | [العربية](./README.ar.md)

## 🔧 Comment ça marche

Cette action utilise [GenAIScript](https://microsoft.github.io/genaiscript/) pour analyser et traduire intelligemment vos documents markdown. Voici le processus derrière la magie :

1. **📄 Analyse** - Convertit le markdown en AST (Abstract Syntax Tree)
2. **🔍 Analyse** - Identifie le contenu à traduire par rapport aux traductions existantes
3. **🤖 Traduire** - Utilise l'IA pour générer des traductions de haute qualité
4. **✅ Valider** - Assure la qualité des traductions et les injecte dans le document
5. **💾 Mise en Cache** - Enregistre les traductions pour des mises à jour incrémentales futures
6. **📝 Commit** - Effectue automatiquement les changements dans votre dépôt

## ⚙️ Configuration

### 📝 Paramètres de Base

| Paramètre           | Description                                                                 | Valeur par Défaut |
| ------------------- | --------------------------------------------------------------------------- | ----------------- |
| `lang`              | Langue(s) cible(s) pour la traduction (codes ISO, séparés par des virgules) | `fr`              |
| `source`            | Langue source (code ISO)                                                    | `en`              |
| `files`             | Fichiers à traduire (séparés par des points-virgules)                       | `README.md`       |
| `instructions`      | Instructions de traduction personnalisées                                   | -                 |
| `instructions_file` | Chemin vers le fichier contenant les instructions de traduction             | -                 |
| `translations_dir`  | Dossier pour stocker les traductions                                        | `translations`    |

### 🌟 Intégration Astro Starlight

| Paramètre        | Description                                        | Requis                    |
| ---------------- | -------------------------------------------------- | ------------------------- |
| `starlight_dir`  | Dossier racine de la documentation Astro Starlight | Uniquement pour Starlight |
| `starlight_base` | Alias de base pour la documentation Starlight      | Optionnel                 |

### 🔧 Diagnostics et Débogage

| Paramètre | Description                                                                                                                                                                                                  | Valeur par Défaut |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `force`   | Force la traduction même si elle a déjà été réalisée                                                                                                                                                         | `false`           |
| `debug`   | Active le journal de débogage (\[en savoir plus]\(https\://microsoft.github.io/genaiscript/reference/scripts/logging/))[en savoir plus](https://microsoft.github.io/genaiscript/reference/scripts/logging/)) | `false`           |

### 🤖 Configuration du Fournisseur IA

#### GitHub Models (Recommandé)

| Paramètre      | Description                                                                                                                                                                                                                                                                                                  | Valeur par Défaut             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| `github_token` | Token GitHub avec `models: read`l'autorisation \`models: read\` (\[guide d'installation]\(https\://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions))[guide d'installation](https://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions)) | `${{ secrets.GITHUB_TOKEN }}` |

#### OpenAI

| Paramètre         | Description                 | Valeur par Défaut               |
| ----------------- | --------------------------- | ------------------------------- |
| `openai_api_key`  | Clé API OpenAI              | `${{ secrets.OPENAI_API_KEY }}` |
| `openai_api_base` | URL de base de l'API OpenAI | `${{ env.OPENAI_API_BASE }}`    |

#### Azure OpenAI

| Paramètre                      | Description                                                        | Valeur par Défaut                         |
| ------------------------------ | ------------------------------------------------------------------ | ----------------------------------------- |
| `azure_openai_api_endpoint`    | Point de terminaison Azure OpenAI                                  | `${{ env.AZURE_OPENAI_API_ENDPOINT }}`    |
| `azure_openai_api_key`         | Clé API Azure OpenAI (non requise pour Microsoft Entra ID)         | `${{ secrets.AZURE_OPENAI_API_KEY }}`     |
| `azure_openai_subscription_id` | ID d'abonnement pour la liste de déploiement (uniquement Entra ID) | `${{ env.AZURE_OPENAI_SUBSCRIPTION_ID }}` |
| `azure_openai_api_version`     | Version de l'API Azure OpenAI                                      | `${{ env.AZURE_OPENAI_API_VERSION }}`     |
| `azure_openai_api_credentials` | Type d'identifiants API                                            | `${{ env.AZURE_OPENAI_API_CREDENTIALS }}` |

#### Alias de Modèles

| Paramètre     | Description                                           | Valeur par Défaut |
| ------------- | ----------------------------------------------------- | ----------------- |
| `model_alias` | Une chaîne YAML de `alias: modelid`\`alias: modelid\` |                   |

Consultez la documentation sur les [Modèles](/action-continuous-translation/models/) pour plus de détails.

## 📤 Sorties

| Sortie | Description                             |
| ------ | --------------------------------------- |
| `text` | Le texte de traduction généré en sortie |

## 🚀 Démarrage Rapide

### Configuration Simple

Ajoutez cette étape à votre workflow GitHub Actions pour traduire votre README en français et en espagnol :

```yaml
uses: pelikhan/action-continuous-translation@v0
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  lang: fr,es
```

### Exemple de Workflow Complet

Enregistrez ce fichier dans votre répertoire `.github/workflows/` sous le nom `continuous-translation.yml` :

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
          file_pattern: "**.md* translations/**/*.json"
          commit_message: "[cai] translated docs"
          commit_user_name: "genaiscript"
```

<div align="center">

**Créé avec ❤️ grâce à [GenAIScript](https://microsoft.github.io/genaiscript/)**

</div>
