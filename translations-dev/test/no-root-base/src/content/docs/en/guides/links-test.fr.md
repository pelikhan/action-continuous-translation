---
title: "Test de liens"
description: "Page de test avec différents types de liens pour vérifier le bon fonctionnement du correctif."
---

# Guide de test des liens

Cette page contient différents types de liens pour tester la fonctionnalité de correction des liens dans la configuration no-root-base.

## Liens internes avec chemin de base

Ces liens devraient être correctement corrigés par le traducteur :

- [Guide d'exemple](../../../fr/guides/example/)
- [Page de référence](../../../fr/reference/example/) 
- [Page d'accueil](../../../fr/)

## Liens externes

Ceux-ci devraient rester inchangés :

- [GitHub](https://github.com)
- [Documentation Astro](https://docs.astro.build)

## Liens relatifs

Ceux-ci devraient également être corrigés :

- [../reference/example/](../reference/example/)
- [./example/](./example/)

## Image avec chemin de base

![Image de test](../../../../../assets/test.jpg)

## Contenu mixte

Voici un paragraphe avec un [lien interne](../../../fr/guides/example/) et un [lien externe](https://example.com).