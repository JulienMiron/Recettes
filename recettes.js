/*
 * Recettes du site.
 *
 * Pour ajouter une recette, copier un bloc { ... } et l'adapter.
 *  - id          : identifiant unique, sans espaces ni accents (sert dans l'URL)
 *  - categorie   : type principal (sert au filtre « Type »)
 *  - etiquettes  : mots-clés libres (servent aux filtres secondaires)
 *  - portions    : nombre de portions pour les quantités données
 *  - ingredients : quantite (nombre), unite (g, kg, ml, l, c_the, c_soupe, tasse, pincee ou ""),
 *                  equivalent (facultatif, texte affiché à côté), note (facultatif)
 *  - etapes      : titre, texte, minuterie en secondes (facultatif)
 *  - astuces     : liste de conseils (facultatif)
 */
window.RECETTES = [
  {
    id: "pate-pizza-24h",
    titre: "Pâte à pizza 24 heures",
    description:
      "Pâte à fermentation lente au frigo, pétrie au batteur sur socle : plus de saveur, croûte légère et bien alvéolée.",
    categorie: "Pâtes à pizza",
    etiquettes: ["Fermentation longue", "Batteur sur socle", "Préparer la veille"],
    portions: 4,
    unitePortion: "pâtons de 210 g",
    tempsActif: "30 min",
    tempsTotal: "≈ 28 h",
    ajoutee: "2026-10-29",
    ingredients: [
      { nom: "farine tout usage non blanchie ou farine 00", quantite: 500, unite: "g" },
      { nom: "eau tiède (environ 25 °C)", quantite: 325, unite: "ml" },
      { nom: "levure instantanée", quantite: 2, unite: "g", equivalent: "≈ ⅔ c. à thé" },
      { nom: "sel fin", quantite: 10, unite: "g", equivalent: "≈ 1 ⅔ c. à thé de sel de table" },
      { nom: "huile d'olive", quantite: 1, unite: "c_soupe" }
    ],
    etapes: [
      {
        titre: "Mélanger",
        texte:
          "Dans le bol du batteur muni du crochet pétrisseur, mélanger la farine et la levure. Ajouter l'eau et mélanger à basse vitesse (1) environ 2 minutes, jusqu'à ce qu'il ne reste plus de farine sèche.",
        minuterie: 120
      },
      {
        titre: "Repos (autolyse)",
        texte: "Couvrir le bol et laisser reposer 15 minutes. La farine s'hydrate et le pétrissage sera plus efficace.",
        minuterie: 900
      },
      {
        titre: "Pétrir",
        texte:
          "Ajouter le sel et pétrir à vitesse 2 pendant 8 à 10 minutes, jusqu'à ce que la pâte se décolle des parois et soit lisse et élastique. Ne pas dépasser la vitesse 2 : la pâte chaufferait et le moteur forcerait pour rien.",
        minuterie: 540
      },
      {
        titre: "Ajouter l'huile",
        texte:
          "Verser l'huile en filet lent pendant que le batteur tourne, puis pétrir encore 1 à 2 minutes, jusqu'à absorption complète. Test : un petit morceau étiré doit devenir mince et translucide sans se déchirer.",
        minuterie: 90
      },
      {
        titre: "Première levée",
        texte: "Former une boule, mettre dans un bol légèrement huilé, couvrir et laisser lever 1 h 30 à température ambiante.",
        minuterie: 5400
      },
      {
        titre: "Façonner les pâtons",
        texte:
          "Fariner très légèrement le comptoir et le coupe-pâte, puis diviser en 4 portions d'environ 210 g (les peser). Bouler chaque portion en repliant les bords dessous, avec le moins de farine possible pour que la pâte se tende. Huiler légèrement les pâtons et les placer dans des contenants fermés de 750 ml à 1 L, ou sur une plaque à biscuits huilée, espacés d'au moins 5 cm et couverts d'une pellicule plastique sans serrer."
      },
      {
        titre: "Fermentation au froid",
        texte: "Réfrigérer 24 heures (de 18 à 48 h fonctionne aussi).",
        minuterie: 86400
      },
      {
        titre: "Tempérer",
        texte:
          "Sortir les pâtons du frigo 2 heures avant la cuisson, toujours couverts. Préchauffer le four au maximum (260–290 °C) avec la pierre, l'acier ou une plaque retournée dans le haut du four pendant au moins 45 minutes.",
        minuterie: 7200
      },
      {
        titre: "Abaisser et cuire",
        texte:
          "Fariner généreusement, étirer à la main du centre vers l'extérieur en gardant un rebord (éviter le rouleau). Garnir et cuire 6 à 9 minutes, jusqu'à ce que la croûte soit bien dorée.",
        minuterie: 480
      }
    ],
    astuces: [
      "Hydratation de 65 % : facile à manipuler. Pour une pâte plus aérée, monter à 340–350 ml d'eau une fois la technique maîtrisée.",
      "Si l'huile fait se séparer la pâte en morceaux, continuer à pétrir 3 à 5 minutes : elle se ressoude. Racler les parois au besoin, et ajouter 1 c. à soupe de farine si elle reste luisante.",
      "Si la pâte grimpe sur le crochet, arrêter le batteur, la redescendre et continuer.",
      "Si la pâte colle au moment de bouler, s'huiler légèrement les mains plutôt que d'ajouter de la farine.",
      "Au frigo, éviter le linge humide : l'air sec le fait sécher et la pâte colle dessus. Pellicule plastique ou grand sac fermé. Le linge humide convient pour les levées à température ambiante.",
      "Fermentation en masse : on peut aussi garder toute la pâte dans un bol de 3 L couvert. Le lendemain, diviser la pâte encore froide, bouler, puis laisser reposer 2 h 30 à 3 h avant d'étirer. Si elle se rétracte, attendre 10 minutes et reprendre.",
      "Sans pierre : préchauffer une plaque à biscuits retournée et y glisser la pizza sur du papier parchemin.",
      "Avec de la levure sèche active plutôt qu'instantanée, utiliser 3 g et la dissoudre d'abord dans l'eau."
    ]
  },
  {
    id: "pate-pizza-sans-gluten",
    titre: "Pâte à pizza sans gluten",
    description:
      "Pâte souple et collante qu'on étale à la main sur du papier parchemin, puis qu'on précuit avant de garnir. Se fait le jour même.",
    categorie: "Pâtes à pizza",
    etiquettes: ["Sans gluten", "Batteur sur socle", "Le jour même"],
    portions: 2,
    unitePortion: "pizzas de 30 cm",
    tempsActif: "20 min",
    tempsTotal: "≈ 1 h 30",
    ajoutee: "2026-10-30",
    ingredients: [
      { nom: "mélange de farine sans gluten tout usage (avec gomme xanthane)", quantite: 400, unite: "g" },
      { nom: "psyllium en poudre", quantite: 10, unite: "g", note: "facultatif, pour plus d'élasticité" },
      { nom: "levure instantanée", quantite: 7, unite: "g", equivalent: "≈ 2 ¼ c. à thé, 1 sachet" },
      { nom: "sucre", quantite: 1, unite: "c_the" },
      { nom: "sel fin", quantite: 1.5, unite: "c_the" },
      { nom: "eau tiède (environ 38 °C)", quantite: 340, unite: "ml" },
      { nom: "huile d'olive", quantite: 2, unite: "c_soupe" }
    ],
    etapes: [
      {
        titre: "Mélanger les ingrédients secs",
        texte: "Dans le bol du batteur, mélanger la farine, le psyllium, la levure, le sucre et le sel."
      },
      {
        titre: "Battre la pâte",
        texte:
          "Installer la feuille (palette) plutôt que le crochet. Ajouter l'eau et l'huile, puis battre à vitesse moyenne 3 à 4 minutes. La pâte sera épaisse et collante, comme une pâte à biscuits molle : c'est normal.",
        minuterie: 210
      },
      {
        titre: "Lever",
        texte:
          "Couvrir et laisser lever 45 minutes à 1 heure dans un endroit tiède. Préchauffer le four à 230 °C (avec la pierre ou une plaque à l'envers dans le bas du four) pendant les 30 dernières minutes.",
        minuterie: 3000
      },
      {
        titre: "Étaler",
        texte:
          "Diviser en 2. Déposer chaque portion sur du papier parchemin huilé et l'étaler avec les mains huilées ou mouillées en un cercle d'environ 30 cm et 5 mm d'épaisseur, en gardant un rebord un peu plus épais."
      },
      {
        titre: "Précuire",
        texte:
          "Glisser la pizza (avec le papier) dans le four et précuire 8 à 10 minutes, jusqu'à ce que la surface soit sèche et légèrement dorée.",
        minuterie: 540
      },
      {
        titre: "Garnir et cuire",
        texte: "Garnir et remettre au four 8 à 12 minutes, jusqu'à ce que le fromage soit bouillonnant et le dessous bien doré.",
        minuterie: 600
      }
    ],
    astuces: [
      "Choisir un mélange de farine qui contient déjà de la gomme xanthane (souvent appelé « 1 pour 1 »). Sinon, ajouter 1 c. à thé de gomme xanthane.",
      "La pâte sans gluten ne se pétrit pas et ne s'étire pas : elle s'étale. Le psyllium la rend plus souple et la croûte moins friable.",
      "Une fermentation de 24 h n'apporte pas grand-chose sans gluten : faire la pâte le jour même.",
      "Pour une personne cœliaque, vérifier que tous les ingrédients sont certifiés sans gluten et bien nettoyer le bol et la feuille du batteur avant de commencer."
    ]
  }
];
