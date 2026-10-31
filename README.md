# Recettes

Site statique de recettes à suivre en cuisinant : cases à cocher pour les ingrédients et les étapes, minuteries, ajustement des portions, recherche et filtres par type.

Site : https://julienmiron.github.io/recettes/

## Fichiers

- `index.html` : le site (aucune dépendance, aucune compilation).
- `ajouter.html` : formulaire d'ajout, qui écrit dans `recettes.js` par l'API GitHub.
- `recettes.js` : les recettes, au format JSON (`window.RECETTES = [...]`).
- `outils.js`, `style.css` : code et styles partagés.
- `bookmarklet.js` : source lisible du favori « Ajouter recette ». Après une modification, la version minifiée doit être recopiée dans `ajouter.html` (constante `BM`).

## Ajouter une recette

Depuis le téléphone : sur un site de recettes, lancer le favori « Ajouter recette », vérifier, enregistrer. Les instructions d'installation (favori et jeton GitHub) sont sur la page `ajouter.html`.

À la main : ajouter un objet dans le tableau de `recettes.js` (le fichier doit rester du JSON valide après `window.RECETTES = `).

## Format d'une recette

| Champ | Description |
|---|---|
| `id` | identifiant unique, sans espaces ni accents (sert dans l'URL) |
| `titre`, `description` | texte |
| `categorie` | type principal (filtre « Type ») |
| `etiquettes` | liste de mots-clés (filtres secondaires) |
| `portions`, `unitePortion` | rendement pour les quantités données |
| `tempsActif`, `tempsTotal` | texte libre |
| `ajoutee` | date AAAA-MM-JJ (tri « plus récentes ») |
| `ingredients` | `{ nom, quantite, unite, equivalent?, note? }`, unités : `g`, `kg`, `ml`, `l`, `c_the`, `c_soupe`, `tasse`, `pincee`, `oz`, `lb` ou `""`. Sans `quantite`, l'ingrédient est affiché tel quel. |
| `etapes` | `{ titre?, texte, minuterie? }` (minuterie en secondes) |
| `astuces` | liste de textes (facultatif) |
| `source`, `image` | lien vers la recette originale et image (facultatif) |

## Consulter en local

Ouvrir `index.html` directement dans un navigateur suffit.

Les cases cochées et les portions choisies sont gardées dans le navigateur (localStorage), par recette.
