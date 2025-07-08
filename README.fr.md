# 🌍 Traduction Continue

> **Traduisez automatiquement votre documentation markdown avec l'IA** - alimenté par [GitHub Actions](https://github.com/actions) et [GitHub Models](https://github.com/models) avec un support intégré pour [Astro Starlight](https://starlight.astro.build/) !

[![Action GitHub](https://img.shields.io/badge/GitHub-Action-blue?logo=github)](https://github.com/marketplace/actions/continuous-translation)
[![Documentation](https://img.shields.io/badge/📖-Documentation-green)](https://pelikhan.github.io/action-continuous-translation/)

## ✨ Fonctionnalités

* 🚀 **Traduction Incrémentale** - Traduisez uniquement le contenu modifié, économisant temps et coûts API
* 🎯 **Analyse AST Intelligente** - Préserve la structure et le formatage du markdown
* 🔄 **Gestion du Cache** - Mise en cache intelligente pour éviter les traductions redondantes
* 📚 **Prêt pour Astro Starlight** - Support intégré pour les sites de documentation
* 🌐 **Support Multilingue** - Traduisez simultanément dans plusieurs langues
* 🔍 **Validation de Qualité** - Validation automatique de la qualité des traductions
* ⚡ **Natif GitHub Actions** - Intégration transparente avec votre pipeline CI/CD
* 🤖 **Alimenté par l'IA** - Exploitez GitHub Models pour des traductions fluides et de haute qualité

## 📚 Ressources

* 📖 [**Documentation**](https://pelikhan.github.io/action-continuous-translation/) - Guide complet d'installation et référence API (également traduit par cette action - voir [tableau de bord des traductions](https://pelikhan.github.io/action-continuous-translation/dashboard/))
* ✍️ [**Article de Blog**](https://microsoft.github.io/genaiscript/blog/continuous-translations/) - Exploration approfondie de la technologie
* 🌐 **Traductions** : [English](./README.md) | [Français](./README.fr.md) | [Español](./README.es.md) | [Portuguese (Brazil)](./README.pt-br.md) | [العربية](./README.ar.md)

## 🔧 Comment Cela Fonctionne

Cette action utilise [GenAIScript](https://microsoft.github.io/genaiscript/) pour analyser et traduire intelligemment vos documents markdown. Voici la magie qui se cache derrière :

1. **📄 Parse** - Convertir le markdown en AST (Abstract Syntax Tree)
2. **🔍 Analyse** - Identifier le contenu nécessitant une traduction par rapport aux traductions existantes
3. **🤖 Traduire** - Utiliser l'IA pour générer des traductions de haute qualité
4. **✅ Valider** - Garantir la qualité de la traduction et l'injecter dans le document
5. **💾 Cache** - Enregistrer les traductions pour de futures mises à jour incrémentielles
6. **📝 Commit** - Commit automatiquement les modifications dans votre dépôt

## ⚙️ Configuration

### 📝 Paramètres de Base

| Paramètre           | Description                                                                 | Par défaut     |
| ------------------- | --------------------------------------------------------------------------- | -------------- |
| `lang`              | Langue(s) cible(s) pour la traduction (codes ISO, séparés par des virgules) | `fr`           |
| `source`            | Langue source (code ISO)                                                    | `en`           |
| `files`             | Fichiers à traduire (séparés par des points-virgules)                       | `README.md`    |
| `instructions`      | Instructions de traduction personnalisées                                   | -              |
| `instructions_file` | Chemin vers le fichier contenant les instructions de traduction             | -              |
| `translations_dir`  | Dossier pour stocker les traductions                                        | `translations` |

### 🌟 Intégration Astro Starlight

| Paramètre        | Description                                        | Requis                   |
| ---------------- | -------------------------------------------------- | ------------------------ |
| `starlight_dir`  | Dossier racine de la documentation Astro Starlight | Seulement pour Starlight |
| `starlight_base` | Alias de base pour la documentation Starlight      | Optionnel                |

### 🔧 Diagnostics & Débogage

| Paramètre | Description                                                                                                                                                                                                   | Par défaut |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `force`   | Forcer la traduction même si elle est déjà traduite                                                                                                                                                           | `false`    |
| `debug`   | Activer le journal de débogage (\[en savoir plus]\(https\://microsoft.github.io/genaiscript/reference/scripts/logging/))[en savoir plus](https://microsoft.github.io/genaiscript/reference/scripts/logging/)) | `false`    |

### 🤖 Configuration du Fournisseur d'IA

#### Modèles GitHub (Recommandés)

| Paramètre      | Description                                                                                                                                                                                                                                                                                                             | Par défaut                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `github_token` | Jeton GitHub avec permission \`models: read\` (\[guide de configuration]\(https\://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions)) `models: read`permission[guide de configuration](https://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions)) | `${{ secrets.GITHUB_TOKEN }}` |

#### OpenAI

| Paramètre         | Description            | Par défaut                      |
| ----------------- | ---------------------- | ------------------------------- |
| `openai_api_key`  | Clé API OpenAI         | `${{ secrets.OPENAI_API_KEY }}` |
| `openai_api_base` | URL de base OpenAI API | `${{ env.OPENAI_API_BASE }}`    |

#### Azure OpenAI

| Paramètre                      | Description                                                          | Par défaut                                |
| ------------------------------ | -------------------------------------------------------------------- | ----------------------------------------- |
| `azure_openai_api_endpoint`    | Point de terminaison Azure OpenAI                                    | `${{ env.AZURE_OPENAI_API_ENDPOINT }}`    |
| `azure_openai_api_key`         | Clé API Azure OpenAI (pas nécessaire pour Microsoft Entra ID)        | `${{ secrets.AZURE_OPENAI_API_KEY }}`     |
| `azure_openai_subscription_id` | ID d'abonnement pour la liste des déploiements (Entra ID uniquement) | `${{ env.AZURE_OPENAI_SUBSCRIPTION_ID }}` |
| `azure_openai_api_version`     | Version de l'API Azure OpenAI                                        | `${{ env.AZURE_OPENAI_API_VERSION }}`     |
| `azure_openai_api_credentials` | Type de crédentials API                                              | `${{ env.AZURE_OPENAI_API_CREDENTIALS }}` |

#### Alias du Modèle

| Paramètre     | Description                                                              | Par défaut |
| ------------- | ------------------------------------------------------------------------ | ---------- |
| `model_alias` | Une chaîne YAML-like de paires \`alias: modelid\` `alias: modelid`paires |            |

Voir la documentation [Modèles](/action-continuous-translation/models/) pour plus de détails.

## 📤 Sorties

| Sortie | Description                |
| ------ | -------------------------- |
| `text` | Texte de traduction généré |

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

Enregistrez ce fichier dans votre répertoire `.github/workflows/` en tant que `continuous-translation.yml` :

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

**Créé avec ❤️ en utilisant [GenAIScript](https://microsoft.github.io/genaiscript/)**

</div>
