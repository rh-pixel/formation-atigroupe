/*
# ATI Groupe Hub — Tests de positionnement officiels (Constructeur Bois, RNCP35507)

## Objectif
Remplacer les tests de positionnement de démonstration par les trois tests officiels
du centre (fournis en PDF) :
1. « Test de positionnement — Module de Français » (60 questions dans le PDF ;
   version interactive : 48 QCM — les questions ouvertes et l'expression écrite
   restent dans la version PDF imprimable).
2. « Test de positionnement — Mathématiques appliquées » (60 QCM).
3. « Test de positionnement — Métier, Logique & Aptitudes » (40 QCM).

## Modifications
- Nouvelle colonne `placement_tests.pdf_url` : lien vers la version PDF imprimable,
  servie par l'application (`/tests/*.pdf`).
- Suppression des trois tests de démonstration seedés initialement (« Test de
  positionnement — Français / Mathématiques / Informatique »). ATTENTION : les
  résultats liés à ces tests de démonstration sont supprimés en cascade.
- Insertion des trois tests officiels et de leurs questions.

## Notes
- Idempotent : les tests ne sont insérés que s'ils n'existent pas déjà, et les
  questions que si le test n'en a aucune. Les titres des tests officiels sont
  distincts des titres de démonstration supprimés, donc rejouer cette migration
  ne supprime jamais les tests officiels ni leurs résultats.
- La partie « Métier, Logique & Aptitudes » (40 questions communes) figure dans
  les trois PDF ; elle est insérée via une table temporaire pour éviter la
  triplication.
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
  'Compréhension écrite, lecture et vocabulaire — TP Constructeur Bois (RNCP35507). Version interactive : 48 QCM. Version complète (60 questions, dont expression écrite) disponible en PDF imprimable.',
  m.id,
  '/tests/test_positionnement.pdf'
FROM modules m
WHERE m.titre = 'Français'
  AND NOT EXISTS (SELECT 1 FROM placement_tests WHERE titre = 'Test de positionnement — Module de Français');

INSERT INTO placement_tests (titre, description, module_id, pdf_url)
SELECT
  'Test de positionnement — Mathématiques appliquées',
  'Calcul, conversions, proportionnalité et géométrie appliqués au métier — TP Constructeur Bois (RNCP35507). 60 questions.',
  m.id,
  '/tests/test_positionnement_maths.pdf'
FROM modules m
WHERE m.titre = 'Mathématiques'
  AND NOT EXISTS (SELECT 1 FROM placement_tests WHERE titre = 'Test de positionnement — Mathématiques appliquées');

INSERT INTO placement_tests (titre, description, module_id, pdf_url)
SELECT
  'Test de positionnement — Métier, Logique & Aptitudes',
  'Connaissances du métier, compréhension de consignes, logique, repérage dans l''espace et savoir-être. 40 questions.',
  NULL,
  '/tests/test_positionnement_metier.pdf'
WHERE NOT EXISTS (SELECT 1 FROM placement_tests WHERE titre = 'Test de positionnement — Métier, Logique & Aptitudes');

-- ============ PARTIE COMMUNE — MÉTIER, LOGIQUE & APTITUDES (40 QCM) ============
CREATE TEMP TABLE _common_qs (ordre int, question text, options jsonb, correct_index int, explanation text);
INSERT INTO _common_qs (ordre, question, options, correct_index, explanation) VALUES
  -- Connaissances du métier (1-8)
  (1,  'À quoi sert un mètre ruban ?', '["À visser","À mesurer une longueur","À couper le bois","À peindre"]'::jsonb, 1, NULL),
  (2,  'Lequel de ces objets est un OUTIL ?', '["Une tuile","Un marteau","Une planche","Une vis"]'::jsonb, 1, 'Le marteau est un outil ; la tuile, la planche et la vis sont des matériaux ou de la quincaillerie.'),
  (3,  'Le bois de chêne est plutôt :', '["Un bois très tendre","Un bois dur","Un plastique","Un métal"]'::jsonb, 1, NULL),
  (4,  'Quel vêtement protège la tête sur un chantier ?', '["La casquette","Le casque de chantier","Le bonnet","La capuche"]'::jsonb, 1, NULL),
  (5,  'Que construit un constructeur bois ?', '["Des routes en béton","Des structures et maisons en bois","Des voitures","Des ordinateurs"]'::jsonb, 1, NULL),
  (6,  'Une « scie » sert à :', '["Mesurer","Couper","Visser","Coller"]'::jsonb, 1, NULL),
  (7,  'Sur un chantier, les chaussures de sécurité servent à :', '["Courir plus vite","Protéger les pieds des chutes et des clous","Être à la mode","Glisser moins"]'::jsonb, 1, NULL),
  (8,  'Qu''est-ce qu''une « ossature bois » ?', '["Un meuble","Le squelette en bois d''une construction","Un type de peinture","Une machine"]'::jsonb, 1, NULL),
  -- Compréhension de consignes (9-16)
  (9,  'Consigne : « Couper la planche à 80 cm. » Que faites-vous ?', '["Vous coupez à 8 cm","Vous coupez à 80 cm","Vous coupez à 800 cm","Vous ne coupez pas"]'::jsonb, 1, NULL),
  (10, 'Consigne : « Visser tous les 50 cm. » Sur 2 m, combien de vis (départ à 0) ?', '["2","5","10","20"]'::jsonb, 1, 'Départ à 0 : vis à 0, 50, 100, 150 et 200 cm, soit 5 vis.'),
  (11, 'Consigne : « Mettre le casque AVANT d''entrer sur le chantier. » Vous :', '["Entrez puis mettez le casque","Mettez le casque puis entrez","N''entrez jamais","Entrez sans casque"]'::jsonb, 1, NULL),
  (12, 'Consigne : « Poncer la pièce, puis la peindre. » Quel est le bon ordre ?', '["Peindre puis poncer","Poncer puis peindre","Peindre seulement","Poncer seulement"]'::jsonb, 1, NULL),
  (13, 'Consigne : « Ne pas dépasser 3 étages sur l''échafaudage. » Vous pouvez monter à :', '["5 étages","4 étages","3 étages maximum","Autant que possible"]'::jsonb, 2, NULL),
  (14, 'Consigne : « Vérifier la mesure 2 fois avant de couper. » Cela veut dire :', '["Couper d''abord","Mesurer une seule fois","Contrôler la mesure deux fois puis couper","Ne pas mesurer"]'::jsonb, 2, NULL),
  (15, 'Consigne : « En cas de doute, demander au chef. » Si vous n''êtes pas sûr, vous :', '["Faites à votre façon","Demandez au chef","Abandonnez le chantier","Devinez"]'::jsonb, 1, NULL),
  (16, 'Consigne : « Ranger les outils après usage. » Quand rangez-vous ?', '["Jamais","Avant de commencer","Après avoir utilisé les outils","La semaine suivante"]'::jsonb, 2, NULL),
  -- Logique et raisonnement (17-24)
  (17, 'Quelle est la suite logique : 2, 4, 6, 8, ... ?', '["9","10","11","12"]'::jsonb, 1, 'On ajoute 2 à chaque fois.'),
  (18, 'Quelle est la suite logique : 5, 10, 15, 20, ... ?', '["22","24","25","30"]'::jsonb, 2, 'On ajoute 5 à chaque fois.'),
  (19, 'Quel intrus dans la liste : marteau, scie, tournevis, pomme ?', '["Marteau","Scie","Tournevis","Pomme"]'::jsonb, 3, 'La pomme n''est pas un outil.'),
  (20, 'Si tous les montants sont en sapin et que cette pièce est un montant, alors :', '["Elle est en chêne","Elle est en sapin","Elle est en métal","On ne peut pas savoir"]'::jsonb, 1, NULL),
  (21, 'Pierre est plus grand que Paul. Paul est plus grand que Luc. Le plus grand est :', '["Luc","Paul","Pierre","Impossible à dire"]'::jsonb, 2, NULL),
  (22, 'Quelle est la suite : 1, 2, 4, 8, ... ?', '["10","12","16","20"]'::jsonb, 2, 'Chaque nombre est le double du précédent.'),
  (23, 'Un mur prend 2 jours. Combien pour 3 murs identiques (1 équipe) ?', '["3 jours","5 jours","6 jours","2 jours"]'::jsonb, 2, '3 murs × 2 jours = 6 jours.'),
  (24, 'Quel nombre complète : 10, 9, 8, 7, ... ?', '["5","6","7","8"]'::jsonb, 1, 'On enlève 1 à chaque fois.'),
  -- Repérage dans l'espace (25-32)
  (25, 'Combien de côtés a un carré ?', '["3","4","5","6"]'::jsonb, 1, NULL),
  (26, 'Combien de côtés a un triangle ?', '["2","3","4","5"]'::jsonb, 1, NULL),
  (27, 'Une pièce « horizontale » est posée :', '["Debout, verticale","À plat, comme le sol","En diagonale","En rond"]'::jsonb, 1, NULL),
  (28, 'Une pièce « verticale » est :', '["Couchée","Debout, comme un poteau","En diagonale","En spirale"]'::jsonb, 1, NULL),
  (29, 'Sur un plan, « vue de dessus » signifie qu''on regarde :', '["De face","Depuis le ciel, vers le bas","De côté","De derrière"]'::jsonb, 1, NULL),
  (30, 'Si vous tournez à droite puis encore à droite, vous regardez :', '["Dans la même direction","Vers l''arrière (demi-tour)","Vers la gauche","Vers le haut"]'::jsonb, 1, 'Deux quarts de tour à droite = un demi-tour.'),
  (31, 'Quelle forme a une roue ?', '["Un carré","Un triangle","Un cercle","Un rectangle"]'::jsonb, 2, NULL),
  (32, 'Le « haut » d''un mur est :', '["La partie posée au sol","La partie la plus élevée","Le côté gauche","Le côté droit"]'::jsonb, 1, NULL),
  -- Aptitudes et savoir-être (33-40)
  (33, 'Vous ne comprenez pas une consigne. La meilleure attitude :', '["Faire semblant d''avoir compris","Demander une explication poliment","Partir","Faire au hasard"]'::jsonb, 1, NULL),
  (34, 'Vous arrivez en retard. Vous :', '["Ne dites rien","Prévenez et vous excusez auprès du chef","Inventez une histoire","Repartez chez vous"]'::jsonb, 1, NULL),
  (35, 'Un collègue a besoin d''aide pour porter une poutre. Vous :', '["L''ignorez","L''aidez si vous le pouvez en sécurité","Vous moquez","Partez en pause"]'::jsonb, 1, NULL),
  (36, 'Vous voyez un danger (échafaudage qui bouge). Vous :', '["Continuez sans rien dire","Prévenez immédiatement et sécurisez la zone","Prenez une photo","Attendez demain"]'::jsonb, 1, NULL),
  (37, 'Vous avez fait une erreur sur une découpe. Vous :', '["La cachez","Le signalez au chef pour trouver une solution","Accusez un collègue","Jetez la pièce en cachette"]'::jsonb, 1, NULL),
  (38, 'Le chef vous fait une remarque sur votre travail. Vous :', '["Vous énervez","Écoutez et essayez de vous améliorer","Ignorez","Quittez le chantier"]'::jsonb, 1, NULL),
  (39, 'On vous confie une tâche que vous n''avez jamais faite. Vous :', '["Refusez tout de suite","Demandez comment faire puis essayez","Faites n''importe comment","Faites semblant d''être malade"]'::jsonb, 1, NULL),
  (40, 'Pour bien réussir une formation, le plus important est :', '["La chance","L''assiduité, l''écoute et l''envie d''apprendre","Connaître déjà tout","Avoir un diplôme"]'::jsonb, 1, NULL);

-- ============ QUESTIONS — MODULE DE FRANÇAIS (8 QCM spécifiques + 40 communes) ============
INSERT INTO placement_questions (placement_test_id, question, options, correct_index, explanation, ordre)
SELECT pt.id, q.question, q.options, q.correct_index, q.explanation, q.ordre
FROM placement_tests pt
CROSS JOIN (
  SELECT * FROM (VALUES
    (1, 'Fiche de débit : M1 « montant d''angle » (quantité 4), M2 « montant courant » (quantité 12), L1 « lisse haute » (quantité 2). Combien y a-t-il de montants courants (M2) à débiter au total ?', '["4 pièces","12 pièces","2 pièces","16 pièces"]'::jsonb, 1, 'La colonne quantité de la fiche de débit indique 12 pour le repère M2.'),
    (2, 'Fiche de débit : la lisse haute L1 a une section de 45 × 145 mm et une longueur de 4 800 mm. Quelle est la longueur d''une lisse haute (L1) ?', '["2 500 mm","1 200 mm","4 800 mm","4 500 mm"]'::jsonb, 2, NULL),
    (3, 'Pictogrammes de sécurité : A — Casque, B — Lunettes, C — Chaussures, D — Anti-bruit, E — Masque. Quel pictogramme indique l''obligation de porter un casque anti-bruit ?', '["A — Casque","B — Lunettes","C — Chaussures","D — Anti-bruit","E — Masque"]'::jsonb, 3, NULL),
    (4, 'Pictogrammes de sécurité : A — Casque, B — Lunettes, C — Chaussures, D — Anti-bruit, E — Masque. Quel pictogramme demande de porter des chaussures de sécurité ?', '["A — Casque","B — Lunettes","C — Chaussures","D — Anti-bruit","E — Masque"]'::jsonb, 2, NULL),
    (5, 'Dans la construction bois, comment s''appelle l''étape de découpe des pièces en atelier ?', '["L''assemblage","La préfabrication","La couverture","L''isolation"]'::jsonb, 1, 'La découpe des montants et lisses en atelier s''appelle la préfabrication.'),
    (6, 'Quel outil est utilisé pour vérifier que les montants sont bien droits ?', '["Un mètre ruban","Une équerre","Un niveau à bulle","Une scie circulaire"]'::jsonb, 2, NULL),
    (7, 'Que signifie le mot « aplomb » (pour un montant de mur) ?', '["Le poids de la pièce","Le fait d''être bien vertical / bien droit","La couleur du bois","La longueur du mur"]'::jsonb, 1, NULL),
    (8, 'Quel mot est bien orthographié ?', '["Chappente","Charpante","Charpente","Charpennte"]'::jsonb, 2, NULL)
  ) AS s(ordre, question, options, correct_index, explanation)
  UNION ALL
  SELECT c.ordre + 8, c.question, c.options, c.correct_index, c.explanation FROM _common_qs c
) q
WHERE pt.titre = 'Test de positionnement — Module de Français'
  AND NOT EXISTS (SELECT 1 FROM placement_questions x WHERE x.placement_test_id = pt.id);

-- ============ QUESTIONS — MATHÉMATIQUES (20 QCM spécifiques + 40 communes) ============
INSERT INTO placement_questions (placement_test_id, question, options, correct_index, explanation, ordre)
SELECT pt.id, q.question, q.options, q.correct_index, q.explanation, q.ordre
FROM placement_tests pt
CROSS JOIN (
  SELECT * FROM (VALUES
    (1,  'Combien font 25 + 18 ?', '["33","43","53","42"]'::jsonb, 1, NULL),
    (2,  'Combien font 7 × 8 ?', '["54","56","48","64"]'::jsonb, 1, NULL),
    (3,  'Combien font 144 ÷ 12 ?', '["11","12","14","16"]'::jsonb, 1, NULL),
    (4,  'Combien font 100 − 37 ?', '["63","73","67","53"]'::jsonb, 0, NULL),
    (5,  'Calculez 12 × 5 + 10.', '["60","70","120","170"]'::jsonb, 1, '12 × 5 = 60, puis 60 + 10 = 70.'),
    (6,  'Quelle est la moitié de 250 ?', '["100","125","150","120"]'::jsonb, 1, NULL),
    (7,  'Combien de mm dans 1 mètre ?', '["10 mm","100 mm","1 000 mm","10 000 mm"]'::jsonb, 2, NULL),
    (8,  '2,5 m, c''est combien en centimètres ?', '["25 cm","250 cm","2 500 cm","2,5 cm"]'::jsonb, 1, '1 m = 100 cm, donc 2,5 m = 250 cm.'),
    (9,  '3 000 mm, c''est combien en mètres ?', '["0,3 m","3 m","30 m","300 m"]'::jsonb, 1, NULL),
    (10, 'Une planche fait 1,20 m. Combien de mm ?', '["120 mm","1 200 mm","12 mm","12 000 mm"]'::jsonb, 1, NULL),
    (11, 'Combien de cm dans 1 mètre ?', '["10","100","1 000","12"]'::jsonb, 1, NULL),
    (12, '450 mm + 550 mm = ?', '["900 mm","1 000 mm","1 m","Les réponses b et c"]'::jsonb, 3, '450 + 550 = 1 000 mm, ce qui vaut aussi 1 m.'),
    (13, 'Si 1 planche coûte 8 €, combien coûtent 5 planches ?', '["13 €","40 €","45 €","35 €"]'::jsonb, 1, NULL),
    (14, 'À l''échelle 1/100, 1 cm sur le plan = combien en vrai ?', '["1 cm","10 cm","1 m","100 m"]'::jsonb, 2, '1 cm × 100 = 100 cm = 1 m.'),
    (15, 'Il faut 3 vis pour 1 montant. Combien de vis pour 10 montants ?', '["13","30","33","300"]'::jsonb, 1, NULL),
    (16, 'Une équipe pose 4 m de mur par heure. Combien en 3 heures ?', '["7 m","12 m","43 m","1,3 m"]'::jsonb, 1, NULL),
    (17, 'Quel est le périmètre d''un rectangle de 5 m sur 3 m ?', '["8 m","15 m","16 m","30 m"]'::jsonb, 2, 'P = 2 × (5 + 3) = 16 m.'),
    (18, 'Quelle est la surface d''un rectangle de 4 m sur 2 m ?', '["6 m²","8 m²","12 m²","16 m²"]'::jsonb, 1, 'A = 4 × 2 = 8 m².'),
    (19, 'Un mur fait 6 m de long et 2,5 m de haut. Quelle est sa surface ?', '["8,5 m²","15 m²","12 m²","17 m²"]'::jsonb, 1, 'A = 6 × 2,5 = 15 m².'),
    (20, 'Un carré a un côté de 3 m. Quelle est sa surface ?', '["6 m²","9 m²","12 m²","3 m²"]'::jsonb, 1, 'A = 3 × 3 = 9 m².')
  ) AS s(ordre, question, options, correct_index, explanation)
  UNION ALL
  SELECT c.ordre + 20, c.question, c.options, c.correct_index, c.explanation FROM _common_qs c
) q
WHERE pt.titre = 'Test de positionnement — Mathématiques appliquées'
  AND NOT EXISTS (SELECT 1 FROM placement_questions x WHERE x.placement_test_id = pt.id);

-- ============ QUESTIONS — MÉTIER, LOGIQUE & APTITUDES (40 communes) ============
INSERT INTO placement_questions (placement_test_id, question, options, correct_index, explanation, ordre)
SELECT pt.id, c.question, c.options, c.correct_index, c.explanation, c.ordre
FROM placement_tests pt
CROSS JOIN _common_qs c
WHERE pt.titre = 'Test de positionnement — Métier, Logique & Aptitudes'
  AND NOT EXISTS (SELECT 1 FROM placement_questions x WHERE x.placement_test_id = pt.id);

DROP TABLE _common_qs;
