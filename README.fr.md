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

## 📚 Ressources

* 📖 [**Documentation**](https://pelikhan.github.io/action-continuous-translation/) - Guide complet d'installation et référence API
* ✍️ [**Article de Blog**](https://microsoft.github.io/genaiscript/blog/continuous-translations/) - Exploration approfondie de la technologie
* 🌐 **Traductions** : [Français](./README.fr.md) | [Español](./README.es.md) | [العربية](./README.ar.md)

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

## 🛠️ Développement & Contribution

### Architecture du Projet

Cette action est générée automatiquement par GenAIScript à partir des métadonnées du script, garantissant cohérence et fiabilité. Nous vous recommandons de mettre à jour les métadonnées du script plutôt que de modifier directement les fichiers de l'action.

**Composants générés automatiquement :**

* ⚙️ Entrées de l'action → déduites des paramètres du script
* 📤 Sorties de l'action → déduites du schéma de sortie du script
* 📝 Description de l'action → description du script
* 📖 Description du README → description du script
* 🎨 Branding de l'action → branding du script

### 🧞 Commandes de Développement

Toutes les commandes sont exécutées depuis la racine du projet :

| Commande             | Action                                        | Cas d'Utilisation                 |
| :------------------- | :-------------------------------------------- | :-------------------------------- |
| `npm install`        | Installer les dépendances                     | Configuration initiale            |
| `npm run dev`        | Tester la traduction de `README.md`→ Français | Test rapide                       |
| `npm run dev:astro`  | Traduire l'ensemble de la documentation Astro | Traduction complète des docs      |
| `npm run typecheck`  | Valider les fichiers TypeScript               | Qualité du code                   |
| `npm run lint`       | Formater le code avec Prettier                | Style du code                     |
| `npm run configure`  | Régénère `action.yml`                         | Après modification des paramètres |
| `npm run upgrade`    | Mettre à jour les dépendances                 | Maintenance                       |
| `npm run test:genai` | Exécuter la suite de tests locale             | Assurance qualité                 |

***

<div align="center">

**Créé avec ❤️ grâce à [GenAIScript](https://microsoft.github.io/genaiscript/)**

[📖 Documentation](https://pelikhan.github.io/action-continuous-translation/) • [🐛 Problèmes](https://github.com/pelikhan/action-continuous-translation/issues) • [💡 Discussions](https://github.com/pelikhan/action-continuous-translation/discussions)

</div>
