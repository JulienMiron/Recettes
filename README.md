# Recettes

Site statique de recettes à suivre en cuisinant : cases à cocher pour les ingrédients et les étapes, minuteries, ajustement des portions, recherche et filtres par type.

Site : https://julienmiron.github.io/recettes/

## Fichiers

- `index.html` : le site (aucune dépendance, aucune compilation).
- `recettes.js` : les recettes. Le format est décrit en commentaire au début du fichier.

## Ajouter une recette

Copier un bloc `{ ... }` dans `recettes.js`, changer l'`id` et adapter le contenu. La catégorie et les étiquettes apparaissent automatiquement dans les filtres.

## Consulter en local

Ouvrir `index.html` directement dans un navigateur suffit.

Les cases cochées et les portions choisies sont gardées dans le navigateur (localStorage), par recette.
