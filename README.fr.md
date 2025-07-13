# 🌍 Traduction Continue

> **Traduisez automatiquement votre documentation markdown avec l'IA** - propulsé par [GitHub Actions](https://github.com/actions) et [GitHub Models](https://github.com/models) avec prise en charge intégrée pour [Astro Starlight](https://starlight.astro.build/) !

[![GitHub Action](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/marketplace/actions/continuous-translation)
[![Documentation](https://img.shields.io/badge/📖-Documentation-green)](https://pelikhan.github.io/action-continuous-translation/)

## ✨ Fonctionnalités

* 🚀 **Traduction Incrémentielle** - Ne traduit que le contenu modifié, économisant du temps et des coûts API
* 🎯 **Analyse AST Intelligente** - Préserve la structure et le formatage du markdown
* 🔄 **Gestion du Cache** - Mise en cache intelligente pour éviter les traductions redondantes
* 📚 **Prêt pour Astro Starlight** - Support intégré pour les sites de documentation
* 🌐 **Support Multi-langues** - Traduisez dans plusieurs langues simultanément
* 🔍 **Validation de Qualité** - Validation automatique de la qualité des traductions
* ⚡ **Natif GitHub Actions** - Intégration fluide avec votre pipeline CI/CD
* 🤖 **Propulsé par l'IA** - Exploitez GitHub Models pour des traductions fluides et de haute qualité

## 📚 Ressources

* 📖 [**Documentation**](https://pelikhan.github.io/action-continuous-translation/) - Guide complet de configuration et référence API (également traduit par cette action - consultez le [tableau de bord des traductions](https://pelikhan.github.io/action-continuous-translation/dashboard/))
* ✍️ [**Article de blog**](https://microsoft.github.io/genaiscript/blog/continuous-translations/) - Plongée approfondie dans la technologie
* 🌐 **Traductions** : [English](./README.md) | [Français](./README.fr.md) | [Español](./README.es.md) | [Portuguese (Brazil)](./README.pt-br.md) | [العربية](./README.ar.md)

## 🔧 Fonctionnement

Cette action utilise [GenAIScript](https://microsoft.github.io/genaiscript/) pour analyser et traduire intelligemment vos documents markdown. Voici le fonctionnement en coulisses :

1. **📄 Analyse** - Convertit le markdown en AST (Abstract Syntax Tree)
2. **🔍 Analyse** - Identifie le contenu nécessitant une traduction par rapport aux traductions existantes
3. **🤖 Traduction** - Utilise l'IA pour générer des traductions de haute qualité
4. **✅ Validation** - Vérifie la qualité de la traduction et l'intègre au document
5. **💾 Mise en Cache** - Sauvegarde les traductions pour de futures mises à jour incrémentielles
6. **📝 Commit** - Commits automatiques des modifications dans votre dépôt

## ⚙️ Configuration

### 📝 Paramètres de Base

| Paramètre           | Description                                                                 | Valeur par défaut                              |
| ------------------- | --------------------------------------------------------------------------- | ---------------------------------------------- |
| `lang`              | Langue(s) cible(s) pour la traduction (codes ISO, séparés par des virgules) | `fr`                                           |
| `source`            | Langue source (code ISO)                                                    | `en`                                           |
| `files`             | Fichiers à traduire (séparés par des points-virgules)                       | `README.md`                                    |
| `instructions`      | Instructions personnalisées de traduction                                   | -                                              |
| `instructions_file` | Chemin vers le fichier avec les instructions de traduction                  | -                                              |
| `glossary_file`     | Chemin vers le fichier contenant les termes du glossaire                    | -                                              |
| `translations_dir`  | Dossier pour stocker les traductions                                        | `translations`                                 |
| `filename_template` | Modèle Jinja pour générer le chemin du fichier traduit                      | `{{dirname}}/{{basename}}.{{lang}}{{extname}}` |

### 🌟 Intégration Astro Starlight

| Paramètre        | Description                                        | Obligatoire               |
| ---------------- | -------------------------------------------------- | ------------------------- |
| `starlight_dir`  | Dossier racine de la documentation Astro Starlight | Uniquement pour Starlight |
| `starlight_base` | Alias de base pour la documentation Starlight      | Optionnel                 |

### 🔧 Diagnostics et Débogage

| Paramètre | Description                                                                                                                                                                                               | Valeur par défaut |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `force`   | Forcer la traduction même si elle est déjà réalisée                                                                                                                                                       | `false`           |
| `debug`   | Activer le journal de débogage (\[en savoir plus]\(https\://microsoft.github.io/genaiscript/reference/scripts/logging/))[learn more](https://microsoft.github.io/genaiscript/reference/scripts/logging/)) | `false`           |

### 🤖 Configuration du Fournisseur d'IA

#### GitHub Models (Recommandé)

| Paramètre      | Description                                                                                                                                                                                                                                                                                                       | Valeur par défaut             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `github_token` | Jeton GitHub avec autorisation \`models: read\` (\[guide de configuration]\(https\://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions)) `models: read` permission ([setup guide](https://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions)) | `${{ secrets.GITHUB_TOKEN }}` |

#### OpenAI

| Paramètre         | Description            | Valeur par défaut               |
| ----------------- | ---------------------- | ------------------------------- |
| `openai_api_key`  | Clé API OpenAI         | `${{ secrets.OPENAI_API_KEY }}` |
| `openai_api_base` | URL de base API OpenAI | `${{ env.OPENAI_API_BASE }}`    |

#### Azure OpenAI

| Paramètre                      | Description                                                          | Valeur par défaut                         |
| ------------------------------ | -------------------------------------------------------------------- | ----------------------------------------- |
| `azure_openai_api_endpoint`    | Endpoint Azure OpenAI                                                | `${{ env.AZURE_OPENAI_API_ENDPOINT }}`    |
| `azure_openai_api_key`         | Clé API Azure OpenAI (non nécessaire pour Microsoft Entra ID)        | `${{ secrets.AZURE_OPENAI_API_KEY }}`     |
| `azure_openai_subscription_id` | ID d'abonnement pour la liste des déploiements (Entra ID uniquement) | `${{ env.AZURE_OPENAI_SUBSCRIPTION_ID }}` |
| `azure_openai_api_version`     | Version API Azure OpenAI                                             | `${{ env.AZURE_OPENAI_API_VERSION }}`     |
| `azure_openai_api_credentials` | Type des identifiants API                                            | `${{ env.AZURE_OPENAI_API_CREDENTIALS }}` |

#### Alias de Modèles

| Paramètre     | Description                                                           | Valeur par défaut |
| ------------- | --------------------------------------------------------------------- | ----------------- |
| `model_alias` | Chaîne YAML-like de paires \`alias: modèleid\` `alias: modelid` pairs |                   |

Consultez la documentation [Modèles](/action-continuous-translation/models/) pour plus de détails.

## 📤 Résultats

| Résultat | Description                          |
| -------- | ------------------------------------ |
| `text`   | Texte de traduction généré en sortie |

## 🚀 Démarrage rapide

### Configuration simple

Ajoutez cette étape à votre workflow GitHub Actions pour traduire votre README en français et en espagnol :

```yaml
uses: pelikhan/action-continuous-translation@v0
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  lang: fr,es
```

### Exemple complet de workflow

Enregistrez ce fichier dans votre répertoire `.github/workflows/` sous le nom `continuous-translation.yml` :

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

**Créé avec ❤️ à l'aide de [GenAIScript](https://microsoft.github.io/genaiscript/)**

</div>
