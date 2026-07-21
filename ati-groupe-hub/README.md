# ATI Groupe Hub — Espace de formation des stagiaires

Application web simple et moderne qui permet aux stagiaires de :

- **se connecter** avec leur nom, prénom et code stagiaire ;
- réaliser leurs **tests de positionnement** en début de parcours (un niveau
  et un conseil personnalisé leur sont attribués) ;
- suivre leurs **modules** (Français, Mathématiques, Compétences numériques…),
  organisés en sections contenant des **leçons**, des **exercices** à
  correction immédiate et des **quiz** notés ;
- suivre leur **progression** et consulter leurs **résultats**.

L'application fonctionne sur téléphone, tablette et ordinateur, en mode
clair ou sombre. Elle est 100 % statique : aucune base de données, aucune
compilation, hébergement gratuit possible sur Netlify.

## Arborescence

```
ati-groupe-hub/
├── index.html               ← l'application (ne pas modifier)
├── netlify.toml             ← configuration Netlify (ne pas modifier)
├── data/
│   ├── stagiaires.json      ← ★ la liste des stagiaires et leurs codes
│   └── contenu.json         ← ★ tout le contenu pédagogique
└── assets/
    ├── css/style.css        ← apparence (couleurs en haut du fichier)
    ├── js/app.js            ← moteur de l'application (ne pas modifier)
    └── img/favicon.svg
```

Vous n'avez à toucher **que les deux fichiers marqués d'une ★**.

## Ajouter un stagiaire

Dans `data/stagiaires.json`, copiez une ligne existante et adaptez-la :

```json
{ "nom": "Durand", "prenom": "Paul", "code": "ATI-1004" }
```

> Le code doit être **unique**. À la connexion, les majuscules, les accents
> et les espaces superflus sont ignorés : « durand / PAUL / ati-1004 »
> fonctionne aussi.

Un compte de démonstration est fourni : **Test / Demo / DEMO**
(supprimez cette ligne avant la mise en production si vous le souhaitez).

## Modifier le contenu pédagogique

Tout se passe dans `data/contenu.json` :

- **`modules`** : chaque module contient des `sections`, et chaque section
  une liste d'`elements` de trois types :
  - `"lecon"` : des blocs de texte (`h` = sous-titre, `p` = paragraphe,
    `liste`, `exemple`, `astuce`) ;
  - `"exercice"` : des questions avec correction immédiate après chaque
    réponse ;
  - `"quiz"` : des questions notées, avec score et récapitulatif à la fin.
- **`positionnement`** : les tests de début de parcours, avec les seuils
  de niveaux (`niveaux` : à partir de quel pourcentage on est « Débutant »,
  « Intermédiaire », « Avancé ») et le conseil affiché pour chaque niveau.

Trois types de questions sont disponibles :

```json
{ "type": "qcm",      "q": "Question ?", "choix": ["A", "B", "C"], "bonne": 1, "explication": "…" }
{ "type": "vraifaux", "q": "Affirmation.", "bonne": true, "explication": "…" }
{ "type": "texte",    "q": "Question ?", "reponses": ["réponse acceptée", "autre forme"], "explication": "…" }
```

> `bonne` pour un QCM = la position de la bonne réponse **en partant de 0**
> (0 = premier choix, 1 = deuxième…). Chaque `id` doit être unique.
> Après une modification, vérifiez le fichier sur https://jsonlint.com si
> l'application ne se charge plus.

## Où sont enregistrés les résultats ?

La progression et les scores de chaque stagiaire sont enregistrés
**dans le navigateur de son appareil** (aucun serveur, aucune donnée
personnelle ne circule). Concrètement :

- le stagiaire retrouve sa progression tant qu'il utilise le même appareil
  et le même navigateur ;
- s'il change d'appareil ou efface les données de navigation, sa
  progression repart de zéro (ses identifiants restent valables) ;
- pour un suivi centralisé côté formateur, une évolution vers une petite
  base de données (par exemple Supabase) est possible plus tard sans
  changer l'interface.

## Tester en local

Ouvrir `index.html` directement ne suffit pas (le navigateur bloque la
lecture des fichiers JSON). Lancez un petit serveur :

```
python -m http.server 8000
```

puis ouvrez http://localhost:8000. En ligne sur Netlify, ce problème
n'existe pas.

## Déployer sur Netlify

1. Sur https://app.netlify.com : « Add new site → Import an existing project ».
2. Choisissez ce dépôt GitHub et indiquez `ati-groupe-hub` comme
   **base directory** (répertoire de base). Aucune commande de build.
3. Chaque mise à jour poussée sur la branche déployée met le site à jour
   automatiquement.
