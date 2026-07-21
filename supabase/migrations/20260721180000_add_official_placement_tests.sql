/*
# ATI Groupe Hub — Tests de positionnement officiels (Constructeur Bois, RNCP35507)

## Objectif
Remplacer les tests de positionnement de démonstration par les trois tests officiels
du centre (fournis en PDF), en version interactive courte : 10 QCM par test,
sélectionnés pour couvrir chaque partie du test papier. La version complète reste
disponible via le PDF imprimable lié à chaque test.

1. « Test de positionnement — Module de Français » — 10 QCM (compréhension de
   documents, lecture, vocabulaire, consignes).
2. « Test de positionnement — Mathématiques appliquées » — 10 QCM (calcul,
   conversions, proportionnalité, géométrie).
3. « Test de positionnement — Métier, Logique & Aptitudes » — 10 QCM (métier,
   consignes, logique, repérage dans l'espace, savoir-être).

## Modifications
- Nouvelle colonne `placement_tests.pdf_url` : lien vers la version PDF imprimable,
  servie par l'application (`/tests/*.pdf`).
- Suppression des trois tests de démonstration seedés initialement (« Test de
  positionnement — Français / Mathématiques / Informatique »). ATTENTION : les
  résultats liés à ces tests de démonstration sont supprimés en cascade.
- Insertion des trois tests officiels et de leurs 10 questions chacun.
- Nettoyage : si une version précédente avait inséré plus de 10 questions,
  les questions au-delà de l'ordre 10 sont supprimées.

## Notes
- Idempotent : les tests ne sont insérés que s'ils n'existent pas déjà, et les
  questions que si le test n'en a aucune. Les titres des tests officiels sont
  distincts des titres de démonstration supprimés, donc rejouer cette migration
  ne supprime jamais les tests officiels ni leurs résultats.
*/

-- ============ COLONNE PDF ============
ALTER TABLE placement_tests ADD COLUMN IF NOT EXISTS pdf_url text;

-- ============ SUPPRESSION DES TESTS DE DÉMONSTRATION ============
DELETE FROM placement_tests
WHERE titre IN (
  'Test de positionnement — Français',
  'Test de positionnement — Mathématiques',
  'Test de positionnement — Informatique'
);

-- ============ TESTS OFFICIELS ============
INSERT INTO placement_tests (titre, description, module_id, pdf_url)
SELECT
  'Test de positionnement — Module de Français',
  'Compréhension écrite, lecture et vocabulaire — TP Constructeur Bois (RNCP35507). Version interactive : 10 QCM. Version complète (60 questions, dont expression écrite) disponible en PDF imprimable.',
  m.id,
  '/tests/test_positionnement.pdf'
FROM modules m
WHERE m.titre = 'Français'
  AND NOT EXISTS (SELECT 1 FROM placement_tests WHERE titre = 'Test de positionnement — Module de Français');

INSERT INTO placement_tests (titre, description, module_id, pdf_url)
SELECT
  'Test de positionnement — Mathématiques appliquées',
  'Calcul, conversions, proportionnalité et géométrie appliqués au métier — TP Constructeur Bois (RNCP35507). Version interactive : 10 QCM. Version complète (60 questions) disponible en PDF imprimable.',
  m.id,
  '/tests/test_positionnement_maths.pdf'
FROM modules m
WHERE m.titre = 'Mathématiques'
  AND NOT EXISTS (SELECT 1 FROM placement_tests WHERE titre = 'Test de positionnement — Mathématiques appliquées');

INSERT INTO placement_tests (titre, description, module_id, pdf_url)
SELECT
  'Test de positionnement — Métier, Logique & Aptitudes',
  'Connaissances du métier, compréhension de consignes, logique, repérage dans l''espace et savoir-être. Version interactive : 10 QCM. Version complète (40 questions) disponible en PDF imprimable.',
  NULL,
  '/tests/test_positionnement_metier.pdf'
WHERE NOT EXISTS (SELECT 1 FROM placement_tests WHERE titre = 'Test de positionnement — Métier, Logique & Aptitudes');

-- ============ QUESTIONS — MODULE DE FRANÇAIS (10 QCM) ============
INSERT INTO placement_questions (placement_test_id, question, options, correct_index, explanation, ordre)
SELECT pt.id, q.question, q.options, q.correct_index, q.explanation, q.ordre
FROM placement_tests pt
CROSS JOIN (VALUES
  (1,  'Fiche de débit : M1 « montant d''angle » (quantité 4), M2 « montant courant » (quantité 12), L1 « lisse haute » (quantité 2). Combien y a-t-il de montants courants (M2) à débiter au total ?', '["4 pièces","12 pièces","2 pièces","16 pièces"]'::jsonb, 1, 'La colonne quantité de la fiche de débit indique 12 pour le repère M2.'),
  (2,  'Fiche de débit : la lisse haute L1 a une section de 45 × 145 mm et une longueur de 4 800 mm. Quelle est la longueur d''une lisse haute (L1) ?', '["2 500 mm","1 200 mm","4 800 mm","4 500 mm"]'::jsonb, 2, NULL),
  (3,  'Pictogrammes de sécurité : A — Casque, B — Lunettes, C — Chaussures, D — Anti-bruit, E — Masque. Quel pictogramme indique l''obligation de porter un casque anti-bruit ?', '["A — Casque","B — Lunettes","C — Chaussures","D — Anti-bruit","E — Masque"]'::jsonb, 3, NULL),
  (4,  'Pictogrammes de sécurité : A — Casque, B — Lunettes, C — Chaussures, D — Anti-bruit, E — Masque. Quel pictogramme demande de porter des chaussures de sécurité ?', '["A — Casque","B — Lunettes","C — Chaussures","D — Anti-bruit","E — Masque"]'::jsonb, 2, NULL),
  (5,  'Dans la construction bois, comment s''appelle l''étape de découpe des pièces en atelier ?', '["L''assemblage","La préfabrication","La couverture","L''isolation"]'::jsonb, 1, 'La découpe des montants et lisses en atelier s''appelle la préfabrication.'),
  (6,  'Quel outil est utilisé pour vérifier que les montants sont bien droits ?', '["Un mètre ruban","Une équerre","Un niveau à bulle","Une scie circulaire"]'::jsonb, 2, NULL),
  (7,  'Que signifie le mot « aplomb » (pour un montant de mur) ?', '["Le poids de la pièce","Le fait d''être bien vertical / bien droit","La couleur du bois","La longueur du mur"]'::jsonb, 1, NULL),
  (8,  'Quel mot est bien orthographié ?', '["Chappente","Charpante","Charpente","Charpennte"]'::jsonb, 2, NULL),
  (9,  'Consigne : « Couper la planche à 80 cm. » Que faites-vous ?', '["Vous coupez à 8 cm","Vous coupez à 80 cm","Vous coupez à 800 cm","Vous ne coupez pas"]'::jsonb, 1, NULL),
  (10, 'Consigne : « Mettre le casque AVANT d''entrer sur le chantier. » Vous :', '["Entrez puis mettez le casque","Mettez le casque puis entrez","N''entrez jamais","Entrez sans casque"]'::jsonb, 1, NULL)
) AS q(ordre, question, options, correct_index, explanation)
WHERE pt.titre = 'Test de positionnement — Module de Français'
  AND NOT EXISTS (SELECT 1 FROM placement_questions x WHERE x.placement_test_id = pt.id);

-- ============ QUESTIONS — MATHÉMATIQUES APPLIQUÉES (10 QCM) ============
INSERT INTO placement_questions (placement_test_id, question, options, correct_index, explanation, ordre)
SELECT pt.id, q.question, q.options, q.correct_index, q.explanation, q.ordre
FROM placement_tests pt
CROSS JOIN (VALUES
  (1,  'Combien font 25 + 18 ?', '["33","43","53","42"]'::jsonb, 1, NULL),
  (2,  'Combien font 7 × 8 ?', '["54","56","48","64"]'::jsonb, 1, NULL),
  (3,  'Combien font 100 − 37 ?', '["63","73","67","53"]'::jsonb, 0, NULL),
  (4,  'Quelle est la moitié de 250 ?', '["100","125","150","120"]'::jsonb, 1, NULL),
  (5,  'Combien de mm dans 1 mètre ?', '["10 mm","100 mm","1 000 mm","10 000 mm"]'::jsonb, 2, NULL),
  (6,  '2,5 m, c''est combien en centimètres ?', '["25 cm","250 cm","2 500 cm","2,5 cm"]'::jsonb, 1, '1 m = 100 cm, donc 2,5 m = 250 cm.'),
  (7,  'Si 1 planche coûte 8 €, combien coûtent 5 planches ?', '["13 €","40 €","45 €","35 €"]'::jsonb, 1, NULL),
  (8,  'Une équipe pose 4 m de mur par heure. Combien en 3 heures ?', '["7 m","12 m","43 m","1,3 m"]'::jsonb, 1, NULL),
  (9,  'Quel est le périmètre d''un rectangle de 5 m sur 3 m ?', '["8 m","15 m","16 m","30 m"]'::jsonb, 2, 'P = 2 × (5 + 3) = 16 m.'),
  (10, 'Quelle est la surface d''un rectangle de 4 m sur 2 m ?', '["6 m²","8 m²","12 m²","16 m²"]'::jsonb, 1, 'A = 4 × 2 = 8 m².')
) AS q(ordre, question, options, correct_index, explanation)
WHERE pt.titre = 'Test de positionnement — Mathématiques appliquées'
  AND NOT EXISTS (SELECT 1 FROM placement_questions x WHERE x.placement_test_id = pt.id);

-- ============ QUESTIONS — MÉTIER, LOGIQUE & APTITUDES (10 QCM) ============
INSERT INTO placement_questions (placement_test_id, question, options, correct_index, explanation, ordre)
SELECT pt.id, q.question, q.options, q.correct_index, q.explanation, q.ordre
FROM placement_tests pt
CROSS JOIN (VALUES
  (1,  'À quoi sert un mètre ruban ?', '["À visser","À mesurer une longueur","À couper le bois","À peindre"]'::jsonb, 1, NULL),
  (2,  'Qu''est-ce qu''une « ossature bois » ?', '["Un meuble","Le squelette en bois d''une construction","Un type de peinture","Une machine"]'::jsonb, 1, NULL),
  (3,  'Consigne : « Visser tous les 50 cm. » Sur 2 m, combien de vis (départ à 0) ?', '["2","5","10","20"]'::jsonb, 1, 'Départ à 0 : vis à 0, 50, 100, 150 et 200 cm, soit 5 vis.'),
  (4,  'Consigne : « Ne pas dépasser 3 étages sur l''échafaudage. » Vous pouvez monter à :', '["5 étages","4 étages","3 étages maximum","Autant que possible"]'::jsonb, 2, NULL),
  (5,  'Quelle est la suite logique : 2, 4, 6, 8, ... ?', '["9","10","11","12"]'::jsonb, 1, 'On ajoute 2 à chaque fois.'),
  (6,  'Un mur prend 2 jours. Combien pour 3 murs identiques (1 équipe) ?', '["3 jours","5 jours","6 jours","2 jours"]'::jsonb, 2, '3 murs × 2 jours = 6 jours.'),
  (7,  'Sur un plan, « vue de dessus » signifie qu''on regarde :', '["De face","Depuis le ciel, vers le bas","De côté","De derrière"]'::jsonb, 1, NULL),
  (8,  'Si vous tournez à droite puis encore à droite, vous regardez :', '["Dans la même direction","Vers l''arrière (demi-tour)","Vers la gauche","Vers le haut"]'::jsonb, 1, 'Deux quarts de tour à droite = un demi-tour.'),
  (9,  'Vous voyez un danger (échafaudage qui bouge). Vous :', '["Continuez sans rien dire","Prévenez immédiatement et sécurisez la zone","Prenez une photo","Attendez demain"]'::jsonb, 1, NULL),
  (10, 'Pour bien réussir une formation, le plus important est :', '["La chance","L''assiduité, l''écoute et l''envie d''apprendre","Connaître déjà tout","Avoir un diplôme"]'::jsonb, 1, NULL)
) AS q(ordre, question, options, correct_index, explanation)
WHERE pt.titre = 'Test de positionnement — Métier, Logique & Aptitudes'
  AND NOT EXISTS (SELECT 1 FROM placement_questions x WHERE x.placement_test_id = pt.id);

-- ============ MISE À JOUR DES DESCRIPTIONS (si les tests existaient déjà) ============
UPDATE placement_tests SET description = 'Compréhension écrite, lecture et vocabulaire — TP Constructeur Bois (RNCP35507). Version interactive : 10 QCM. Version complète (60 questions, dont expression écrite) disponible en PDF imprimable.'
WHERE titre = 'Test de positionnement — Module de Français';
UPDATE placement_tests SET description = 'Calcul, conversions, proportionnalité et géométrie appliqués au métier — TP Constructeur Bois (RNCP35507). Version interactive : 10 QCM. Version complète (60 questions) disponible en PDF imprimable.'
WHERE titre = 'Test de positionnement — Mathématiques appliquées';
UPDATE placement_tests SET description = 'Connaissances du métier, compréhension de consignes, logique, repérage dans l''espace et savoir-être. Version interactive : 10 QCM. Version complète (40 questions) disponible en PDF imprimable.'
WHERE titre = 'Test de positionnement — Métier, Logique & Aptitudes';

-- ============ NETTOYAGE — LIMITE À 10 QUESTIONS PAR TEST ============
-- Si une version précédente de cette migration avait inséré les jeux complets
-- (48/60/40 questions), on ne conserve que les 10 premières de chaque test.
DELETE FROM placement_questions
WHERE ordre > 10
  AND placement_test_id IN (
    SELECT id FROM placement_tests
    WHERE titre IN (
      'Test de positionnement — Module de Français',
      'Test de positionnement — Mathématiques appliquées',
      'Test de positionnement — Métier, Logique & Aptitudes'
    )
  );
