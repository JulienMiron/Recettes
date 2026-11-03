# Recettes

Site statique de recettes à suivre en cuisinant : cases à cocher pour les ingrédients et les étapes, minuteries, ajustement des portions, recherche et filtres par type.

Site : https://julienmiron.github.io/Recettes/

## Fichiers

- `index.html` : le site (aucune dépendance, aucune compilation).
- `ajouter.html` : formulaire d'ajout ; ouvre une issue pré-remplie sur GitHub.
- `.github/workflows/ajouter-recette.yml` : ajoute à `recettes.js` la recette d'une issue ouverte par le propriétaire, ferme l'issue et republie le site.
- `.github/workflows/publier.yml` : publie le site sur GitHub Pages à chaque push.
- `recettes.js` : les recettes, au format JSON (`window.RECETTES = [...]`).
- `outils.js`, `style.css` : code et styles partagés.
- `bookmarklet.js` : source lisible du favori « Ajouter recette ». Après une modification, la version minifiée doit être recopiée dans `ajouter.html` (constante `BM`).

## Ajouter une recette

Depuis le téléphone : sur un site de recettes, lancer le favori « Ajouter recette », vérifier, toucher Enregistrer, puis créer l'issue sur GitHub. L'Action ajoute la recette en une à deux minutes. Les instructions d'installation du favori sont sur la page `ajouter.html`.

Prérequis : Settings → Pages → Source : **GitHub Actions**.

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
| `composer` | groupes d'options à cocher (facultatif) : `{ titre, mode?, quantite?, unite?, options: [{ nom, quantite?, unite?, equivalent?, note?, defaut? }] }`. Avec `mode: "partage"`, la `quantite` du groupe est répartie également entre les options cochées ; sinon chaque option cochée ajoute sa propre quantité. Les options cochées s'ajoutent à la liste d'ingrédients. |
| `source`, `image` | lien vers la recette originale et image (facultatif) |

## Consulter en local

Ouvrir `index.html` directement dans un navigateur suffit.

Les cases cochées et les portions choisies sont gardées dans le navigateur (localStorage), par recette.

## Menu de la semaine

Le bouton ☆ (sur chaque carte et sur la page d'une recette) met la recette « Au menu cette semaine » ; ces recettes s'affichent en premier sur l'accueil. Le menu repart à zéro chaque dimanche à 18 h : le menu terminé est archivé et consultable sous « Semaines précédentes » (`#/menus`), d'où on peut remettre une recette au menu. Sans connexion, le menu est gardé dans le navigateur (`recettes:menu`, `recettes:menus`). Avec le bouton « Se connecter » (compte Google), il est synchronisé entre les appareils par Firebase : `sync.js`, projet `recettes-93421`, document Firestore `foyer/menu`. Les règles Firestore n'autorisent que les adresses courriel listées ; pour donner l'accès à quelqu'un d'autre, ajouter son adresse dans Firestore → Règles.
