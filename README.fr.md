# Traduction continue

Cette action utilise la traduction incrémentielle des documents Markdown en utilisant [GitHub Models](https://github.com/models).
Prise en charge intégrée pour [Astro Starlight](https://starlight.astro.build/) !

* [Documentation](https://pelikhan.github.io/action-continuous-translation/)
* [Article de blog](https://microsoft.github.io/genaiscript/blog/continuous-translations/)
* [Français](./README.fr.md)
* [Espagnol](./README.es.md)
* [Arabe](./README.ar.md)

## Comment ça marche ?

Cette action utilise [GenAIScript](https://microsoft.github.io/genaiscript/) pour analyser et traduire les documents Markdown de manière programmatique. Le processus de traduction fonctionne comme suit :

* analyser le fichier Markdown en AST (arbre syntaxique abstrait)
* visiter l’arbre et rechercher une traduction existante ou marquer le nœud nécessitant une traduction
* exécuter l’inférence avec le LLM pour collecter de nouvelles traductions
* injecter les nouvelles traductions dans le document et valider leur qualité
* enregistrer les traductions dans une mémoire cache de fichiers
* valider et enregistrer les modifications

## Entrées

* `lang` : Le code ISO de la langue cible pour la traduction. (par défaut : `fr`)
* `source` : Le code ISO de la langue source pour la traduction. (par défaut : `en`)
* `files` : Fichiers à traiter, séparés par des points-virgules. Par défaut `README.md`.
* `instructions` : Instructions supplémentaires pour le LLM à utiliser lors de la traduction.
* `instructions_file` : Chemin vers un fichier contenant des instructions supplémentaires pour le LLM à utiliser lors de la traduction.
* `starlight_dir` : Dossier racine de la documentation Astro Starlight. (à définir uniquement si vous utilisez Starlight)
* `starlight_base` : Alias de base pour la documentation Starlight. (facultatif, même avec Starlight)

### Diagnostics

* `force` : Forcer la traduction même si le fichier a déjà été traduit.
* `debug` : Activer le journal de débogage (<https://microsoft.github.io/genaiscript/reference/scripts/logging/>).

### Configuration LLM

* `github_token` : Jeton GitHub avec au moins l’autorisation `models:read` (<https://microsoft.github.io/genaiscript/reference/github-actions/#github-models-permissions>). (par défaut : `${{ secrets.GITHUB_TOKEN }}`)

* `openai_api_key` : Clé API OpenAI (par défaut : `${{ secrets.OPENAI_API_KEY }}`)

* `openai_api_base` : URL de base de l'API OpenAI (par défaut : `${{ env.OPENAI_API_BASE }}`)

* `azure_openai_api_endpoint` : Point de terminaison Azure OpenAI. Dans le portail Azure, ouvrez votre ressource Azure OpenAI, sélectionnez "Clés et points de terminaison", copiez le point de terminaison. (par défaut : `${{ env.AZURE_OPENAI_API_ENDPOINT }}`)

* `azure_openai_api_key` : Clé API Azure OpenAI. \*\*Vous n'avez PAS besoin de ceci si vous utilisez Microsoft Entra ID. (par défaut : `${{ secrets.AZURE_OPENAI_API_KEY }}`)

* `azure_openai_subscription_id` : ID d'abonnement Azure OpenAI pour répertorier les déploiements disponibles (Microsoft Entra uniquement). (par défaut : `${{ env.AZURE_OPENAI_SUBSCRIPTION_ID }}`)

* `azure_openai_api_version` : Version de l'API Azure OpenAI. (par défaut : `${{ env.AZURE_OPENAI_API_VERSION }}`)

* `azure_openai_api_credentials` : Type d'identifiants pour l'API Azure OpenAI. Laissez sur 'default', sauf si vous disposez d'une configuration spéciale Azure. (par défaut : `${{ env.AZURE_OPENAI_API_CREDENTIALS }}`)

## Sorties

* `text` : Le texte généré en sortie.

## Utilisation

Ajoutez ce qui suit à votre étape dans le fichier de workflow :

```yaml
uses: pelikhan/action-continuous-translation@v0
with:
  github_token: ${{ secrets.GITHUB_TOKEN }}
  lang: fr,es
```

## Exemple

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

## Développement

Cette action a été générée automatiquement par GenAIScript à partir des métadonnées du script. Nous vous recommandons de mettre à jour les métadonnées du script au lieu de modifier directement les fichiers de l'action.

* les entrées de l’action sont déduites des paramètres du script
* les sorties de l’action sont déduites du schéma de sortie du script
* la description de l’action est la description du script
* la description du fichier README est la description du script
* le branding de l’action est le branding du script

## 🧞 Commandes

Toutes les commandes sont exécutées depuis la racine du projet, dans un terminal :

| Commande             | Action                                                                                    |
| :------------------- | :---------------------------------------------------------------------------------------- |
| `npm install`        | Installe les dépendances                                                                  |
| `npm run dev`        | Exécute un test de traduction de `README.md`\`README.md\` en `fr`                         |
| `npm run dev:astro`  | Traduit toute la documentation Astro                                                      |
| `npm run typecheck`  | Vérifies les fichiers TypeScript                                                          |
| `npm run lint`       | Lance prettier sur tous les fichiers du dépôt                                             |
| `npm run configure`  | Régénère `action.yml`\`action.yml\` lors de la modification des paramètres dans le script |
| `npm run upgrade`    | Met à jour les dépendances                                                                |
| `npm run test:genai` | Suite de tests locale                                                                     |
