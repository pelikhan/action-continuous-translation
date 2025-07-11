# 🌍 Traduction Continue

> **Traduisez automatiquement votre documentation markdown à l'aide de l'IA** - alimenté par [GitHub Actions](https://github.com/actions) et [GitHub Models](https://github.com/models) avec support intégré pour [Astro Starlight](https://starlight.astro.build/) !

[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/marketplace/actions/continuous-translation)
[![Documentation](https://img.shields.io/badge/📖-Documentation-green)](https://pelikhan.github.io/action-continuous-translation/)

## ✨ Fonctionnalités

* 🚀 **Traduction incrémentielle** - Traduisez uniquement le contenu modifié, économisant ainsi du temps et des coûts API
* 🎯 **Analyse AST intelligente** - Préserve la structure et le formatage du markdown
* 🔄 **Gestion du Cache** - Mise en cache intelligente pour éviter les traductions redondantes
* 📚 **Prêt pour Astro Starlight** - Support intégré pour les sites de documentation
* 🌐 **Support Multilingue** - Traduisez simultanément dans plusieurs langues
* 🔍 **Validation de Qualité** - Validation automatique de la qualité de la traduction
* ⚡ **Natif avec GitHub Actions** - Intégration fluide avec votre pipeline CI/CD
* 🤖 **Alimenté par l'IA** - Exploitez GitHub Models pour des traductions fluides et de haute qualité

## 📚 Ressources

* 📖 [**Documentation**](https://pelikhan.github.io/action-continuous-translation/) - Guide complet d'installation et référence API (également traduit par cette action - voir [tableau de bord de traduction](https://pelikhan.github.io/action-continuous-translation/dashboard/))
* ✍️ [**Article de Blog**](https://microsoft.github.io/genaiscript/blog/continuous-translations/) - Exploration approfondie de la technologie
* 🌐 **Traductions** : [English](./README.md) | [Français](./README.fr.md) | [Español](./README.es.md) | [Portuguese (Brazil)](./README.pt-br.md) | [العربية](./README.ar.md)

## 🔧 Comment ça fonctionne

Cette action utilise [GenAIScript](https://microsoft.github.io/genaiscript/) pour analyser intelligemment et traduire vos documents markdown. Voici comment cela fonctionne en coulisses :

1. **📄 Analyse** - Convertir le markdown en AST (Arbre Syntaxique Abstrait)
2. **🔍 Analyse** - Identifier le contenu nécessitant une traduction par rapport aux traductions existantes
3. **🤖 Traduction** - Utiliser l'IA pour générer des traductions de haute qualité
4. **✅ Validation** - Garantir la qualité de la traduction et l'intégrer dans le document
5. **💾 Cache** - Enregistrer les traductions pour des mises à jour incrémentielles futures
6. **📝 Validation** - Valider automatiquement les changements dans votre dépôt

## ⚙️ Configuration

### 📝 Paramètres de base

| Paramètre           | Description                                                                 | Valeur par défaut |
| ------------------- | --------------------------------------------------------------------------- | ----------------- |
| `lang`              | Langue(s) cible(s) pour la traduction (codes ISO, séparés par des virgules) | `fr`              |
| `source`            | Langue source (code ISO)                                                    | `en`              |
| `files`             | Fichiers à traduire (séparés par des points-virgules)                       | `README.md`       |
| `instructions`      | Instructions de traduction personnalisées                                   | -                 |
| `instructions_file` | Chemin vers le fichier contenant les instructions de traduction             | -                 |
| `glossary_file`     | Chemin vers le fichier contenant les termes du glossaire                    | -                 |
| `translations_dir`  | Dossier pour stocker les traductions                                        | `translations`    |

### 🌟 Intégration Astro Starlight

| Paramètre        | Description                                        | Requis                    |
| ---------------- | -------------------------------------------------- | ------------------------- |
| `starlight_dir`  | Dossier racine de la documentation Astro Starlight | Uniquement pour Starlight |
| `starlight_base` | Alias de base pour la documentation Starlight      | Optionnel                 |

### 🔧 Diagnostics & Débogage

| Paramètre | Description                                                                                                         | Valeur par défaut |
| --------- | ------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `force`   | Forcer la traduction même si elle est déjà effectuée                                                                | `false`           |
| `debug`   | Activer le journal de débogage[en savoir plus](https://microsoft.github.io/genaiscript/reference/scripts/logging/)) | `false`           |

### 🤖 Configuration du fournisseur d'IA

#### Modèles GitHub (recommandé)

| Paramètre      | Description                                                                                                                                                                                          | Valeur par défaut             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `github_token` | Jeton GitHub avec permission \`models: read\` `models: read`guide d'installation[guide d'installation](https://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions)) | `${{ secrets.GITHUB_TOKEN }}` |

#### OpenAI

| Paramètre         | Description                 | Valeur par défaut               |
| ----------------- | --------------------------- | ------------------------------- |
| `openai_api_key`  | Clé API OpenAI              | `${{ secrets.OPENAI_API_KEY }}` |
| `openai_api_base` | URL de base de l'API OpenAI | `${{ env.OPENAI_API_BASE }}`    |

#### Azure OpenAI

| Paramètre                      | Description                                                        | Valeur par défaut                         |
| ------------------------------ | ------------------------------------------------------------------ | ----------------------------------------- |
| `azure_openai_api_endpoint`    | Point de terminaison Azure OpenAI                                  | `${{ env.AZURE_OPENAI_API_ENDPOINT }}`    |
| `azure_openai_api_key`         | Clé API Azure OpenAI (non nécessaire pour Microsoft Entra ID)      | `${{ secrets.AZURE_OPENAI_API_KEY }}`     |
| `azure_openai_subscription_id` | ID d'abonnement pour lister les déploiements (Entra ID uniquement) | `${{ env.AZURE_OPENAI_SUBSCRIPTION_ID }}` |
| `azure_openai_api_version`     | Version de l'API Azure OpenAI                                      | `${{ env.AZURE_OPENAI_API_VERSION }}`     |
| `azure_openai_api_credentials` | Type de credentials API                                            | `${{ env.AZURE_OPENAI_API_CREDENTIALS }}` |

#### Alias Modèle

| Paramètre     | Description                                                          | Valeur par défaut |
| ------------- | -------------------------------------------------------------------- | ----------------- |
| `model_alias` | Une chaîne YAML-like de paires \`alias: modelid\` `alias: modelid`\` |                   |

Voir la documentation des [modèles](/action-continuous-translation/models/) pour plus de détails.

## 📤 Sorties

| Sortie | Description                    |
| ------ | ------------------------------ |
| `text` | Texte généré par la traduction |

## 🚀 Démarrage rapide

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
          file_pattern: "**.md* translations/**"
          commit_message: "[cai] translated docs"
          commit_user_name: "genaiscript"
```

<div align="center">

**Fait avec ❤️ grâce à [GenAIScript](https://microsoft.github.io/genaiscript/)**

</div>
