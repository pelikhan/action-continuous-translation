---
title: Exemple de Markdown
sidebar:
  order: 100
---

# Guide complet de la syntaxe Markdown

Ce document présente toutes les principales constructions syntaxiques disponibles en Markdown.

## En-têtes

# En-tête H1

## En-tête H2

### En-tête H3

#### En-tête H4

##### En-tête H5

###### En-tête H6

# Alternative H1

## Alternative H2

## Mise en forme du texte

**Texte en gras avec des astérisques**\
**Texte en gras avec des soulignements**

_Texte en italique avec des astérisques_\
_Texte en italique avec des soulignements_

**_Texte en gras et italique avec des astérisques_**\
**_Texte en gras et italique avec des soulignements_**

~~Texte barré~~

`Inline code`

Texte normal avec **gras**, _italique_, et `code` mélangés.

## Listes

### Listes non ordonnées

- Élément 1
- Élément 2
  - Élément imbriqué 2.1
  - Élément imbriqué 2.2
    - Élément profondément imbriqué 2.2.1
- Élément 3

Syntaxe alternative :

- Élément A
- Élément B
  - Élément imbriqué B.1
  - Élément imbriqué B.2

Autre alternative :

- Élément X
- Élément Y
  - Élément imbriqué Y.1

### Listes ordonnées

1. Premier élément
2. Deuxième élément
   1. Élément numéroté imbriqué
   2. Un autre élément imbriqué
      1. Élément profondément imbriqué
3. Troisième élément

Numérotation alternative :

1. Élément un
2. Élément deux (numérotation automatique)
3. Élément trois (numérotation automatique)

### Listes mixtes

1. Élément ordonné
   - Élément imbriqué non ordonné
   - Un autre élément imbriqué non ordonné
2. Un autre élément ordonné
   1. Élément ordonné imbriqué
   2. Un autre élément ordonné imbriqué

### Listes de tâches

- [x] Tâche terminée
- [ ] Tâche incomplète
- [x] Une autre tâche terminée
  - [x] Tâche imbriquée terminée
  - [ ] Tâche imbriquée incomplète

## Liens et images

### Liens

[Lien simple](https://www.example.com)

[Lien avec titre](https://www.example.com "Example Website")

// TODO désactiver MDX\
< [https://www.autolink.com>](https://www.autolink.com>)

[Lien de référence][ref1]

[Un autre lien de référence][ref2]

[Lien de référence insensible à la casse][REF1]

Vous pouvez également créer un lien vers [des fichiers locaux](./README.md).

### Images

![Texte alternatif](https://via.placeholder.com/150x100 "Image title")

![Reference image][img1]

### Définitions de référence

[ref1]: https://www.reference1.com "Reference 1 Title"
[ref2]: https://www.reference2.com
[img1]: https://via.placeholder.com/200x150 "Reference Image"

## Code

### Code inline

Utilisez `console.log()` pour afficher dans la console.

### Blocs de code

```
Simple code block without syntax highlighting
```

```javascript
// JavaScript code block
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("World");
```

```python
# Python code block
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

```bash
# Bash script
#!/bin/bash
echo "Hello, World!"
for i in {1..5}; do
    echo "Number: $i"
done
```

```json
{
  "name": "Sample JSON",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

Bloc de code indenté (4 espaces) : &#x20;
TODO : corriger ce problème d’analyse

## Tableaux

| Colonne 1 | Colonne 2 | Colonne 3       |
| --------- | --------- | --------------- |
| Ligne 1   | Données   | Plus de données |
| Ligne 2   | Infos     | Détails         |

### Tableau avec alignement

| Aligné à gauche | Aligné au centre | Aligné à droite |
| :-------------- | :--------------: | --------------: |
| Gauche          |      Centre      |          Droite |
| Texte           |      Texte       |           Texte |
| Plus            |     Données      |             Ici |

### Tableau simple

| Première en-tête     | Deuxième en-tête     |
| -------------------- | -------------------- |
| Cellule de contenu 1 | Cellule de contenu 2 |
| Cellule de contenu 3 | Cellule de contenu 4 |

## Blocs de citations

> Ceci est un simple bloc de citation.

> Ceci est un bloc de citation &#x20;
> qui s’étend sur plusieurs lignes.

> Blocs de citations imbriqués :
>
> > Ceci est un bloc de citation imbriqué.
> >
> > > Et ceci est profondément imbriqué.

> ### Bloc de citation avec d'autres éléments
>
> - Élément de liste dans le bloc de citation
> - Un autre élément
>
> **Texte en gras** dans le bloc de citation avec `code inline`.

## Règles horizontales

---

---

---

---

---

---

## Sauts de ligne

Ceci est la première ligne.\
Ceci est la deuxième ligne (deux espaces à la fin de la ligne précédente).

Ceci est la troisième ligne.

Ceci est la quatrième ligne (une ligne vide crée une séparation de paragraphes).

Ceci est une ligne avec une\
coupure de ligne avec slash inversé.

## Éléments HTML

Vous pouvez utiliser <em>des balises HTML</em> dans Markdown.

<strong>Gras avec HTML</strong>

<code>Code inline avec HTML</code>

<kbd>Ctrl</kbd> + <kbd>C</kbd>

<mark>Texte surligné</mark>

<small>Texte en petit</small>

<sub>Indice</sub> et <sup>Exposant</sup>

<details>
<summary>Expandable section</summary>

Ce contenu est masqué par défaut et peut être développé.

- Élément de liste
- Un autre élément

```javascript
console.log("Code in details");
```

</details>

## Fonctionnalités avancées

### Notes de bas de page

Voici une phrase avec une note de bas de page\[^1].

Une autre phrase avec une note de bas de page\[^note].

[^1]: Ceci est la première note de bas de page.
[^note]: Ceci est une note de bas de page nommée avec plus de détails.

### Listes de définitions

Terme 1 &#x20;
: Définition pour le terme 1

Terme 2 &#x20;
: Définition pour le terme 2 &#x20;
: Une autre définition pour le terme 2

### Abréviations

\\\_\[HTML] : Hyper Text Markup Language &#x20;
\\\_\[CSS] : Cascading Style Sheets

HTML et CSS sont des technologies web importantes.

### Mathématiques (si pris en charge)

Mathématiques en ligne : $E = mc^2$

Mathématiques en bloc :

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

### Caractères d'échappement

Utilisez des barres obliques inverses pour échapper les caractères spéciaux :

\\\*Pas en italique\\\* &#x20;
\\#Pas un en-tête &#x20;
\\\[Pas un lien] &#x20;
\\\`Pas un code\\\`

### Commentaires

### Émojis

\\\:smile: \\\:heart: \\\:thumbsup: \\\:rocket: \\\:computer:

😀 😍 👍 🚀 💻

---

## Alertes GitHub dans Markdown

GitHub prend en charge des alertes personnalisées dans les fichiers Markdown, qui peuvent être utilisées pour mettre en évidence des informations importantes ou des avertissements. Voici quelques exemples de leur utilisation :

> [!NOTE]
> Informations utiles que les utilisateurs devraient connaître, même en parcourant rapidement le contenu.

> [!TIP]
> Conseils utiles pour faire les choses de manière plus efficace ou plus simple.

> [!IMPORTANT]
> Informations clés que les utilisateurs doivent connaître pour atteindre leur objectif.

> [!WARNING]
> Informations urgentes nécessitant une attention immédiate de l'utilisateur pour éviter des problèmes.

> [!CAUTION]
> Conseille sur les risques ou les conséquences négatives de certaines actions.

## Conclusion

Ce document couvre la majorité de la syntaxe standard de Markdown. Certaines fonctionnalités comme les notes de bas de page, les listes de définitions, les mathématiques et certains éléments HTML peuvent ne pas être prises en charge par tous les processeurs Markdown, mais elles fonctionnent dans de nombreuses versions étendues comme GitHub Flavored Markdown (GFM), CommonMark, et d'autres.

**Remarque** : Le rendu exact de ces éléments peut varier en fonction du processeur Markdown utilisé.
