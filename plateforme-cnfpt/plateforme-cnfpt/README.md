# Plateforme de formation ATIGROUPE

Site statique pour partager les supports de cours et les quiz aux stagiaires.
Aucune base de données, aucune compilation : ce sont des fichiers HTML simples,
hébergeables gratuitement sur Netlify.

## Principe

Toute la navigation est pilotée par **un seul fichier** : `data/catalogue.json`.
Vous n'avez jamais à toucher au code (HTML, CSS, JS) pour ajouter du contenu.

## Arborescence

```
plateforme-cnfpt/
├── index.html                ← page d'accueil (liste des formations)
├── formation.html            ← page d'une formation (modules + quiz)
├── lecteur.html              ← visionneuse plein écran
├── 404.html                  ← page "introuvable"
├── netlify.toml              ← configuration Netlify (ne pas modifier)
├── data/
│   └── catalogue.json        ← ★ LE fichier à modifier pour tout le contenu
├── assets/
│   ├── css/style.css         ← apparence (couleurs, mise en page)
│   ├── js/app.js             ← moteur de navigation (ne pas modifier)
│   └── img/favicon.svg
└── formations/
    └── initiation-informatique/
        ├── supports/         ← déposez ici les modules HTML
        └── quiz/             ← déposez ici les quiz HTML
```

## Ajouter / remplacer un module

1. Placez votre fichier HTML dans le dossier `supports/` de la formation.
2. Dans `data/catalogue.json`, ajoutez (ou vérifiez) une ligne dans `"modules"` :

```json
{
  "id": "m9",
  "titre": "Module 9 — Mon nouveau module",
  "resume": "Une phrase de description.",
  "fichier": "formations/initiation-informatique/supports/module-9.html"
}
```

3. Mettez le site à jour (voir le guide PDF, étape 5).

> `id` doit être unique dans la formation. `fichier` doit correspondre
> exactement au chemin réel du fichier (attention aux majuscules).

## Ajouter un quiz

Identique, mais dans la section `"quiz"` du catalogue, et le fichier va
dans le dossier `quiz/`.

## Ajouter une nouvelle formation

1. Créez un dossier `formations/ma-formation/` avec deux sous-dossiers
   `supports/` et `quiz/`.
2. Copiez un bloc complet de formation dans `catalogue.json` et adaptez-le
   (`id`, `titre`, `client`, modules, quiz…).

La nouvelle formation apparaît automatiquement sur la page d'accueil.

## Changer les couleurs / le logo

- Couleurs : variables en haut de `assets/css/style.css` (`--bleu`, `--orange`…).
- Logo : la lettre dans `.marque-logo` (CSS) ou remplacez par une image.
- Coordonnées de pied de page : champ `organisme.pied` dans le catalogue.

## Tester en local

Ouvrir `index.html` directement ne suffit pas (le navigateur bloque la
lecture du JSON). Lancez un petit serveur :

```
# Python (déjà installé sur la plupart des machines)
python -m http.server 8000
```

Puis ouvrez `http://localhost:8000` dans le navigateur.
En ligne sur Netlify, ce problème n'existe pas.
