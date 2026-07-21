/*
# ATI Groupe Hub — Données de démonstration (seed)

## Contenu
Insère des modules de formation (Français, Mathématiques, Informatique, Anglais),
des sections, des leçons, des exercices (QCM), des questions de quiz, et des tests
de positionnement avec leurs questions. Permet à l'application d'être immédiatement
utilisable après création d'un compte stagiaire.

## Notes
- Utilise ON CONFLICT DO NOTHING pour être idempotent.
- Les identifiants sont récupérés via des CTE pour chaîner modules -> sections -> leçons etc.
*/

-- ============ MODULES ============
INSERT INTO modules (titre, description, couleur, icone, ordre) VALUES
('Français', 'Maîtriser la langue française : orthographe, grammaire, conjugaison et expression écrite.', 'rose', 'BookOpen', 1),
('Mathématiques', 'Calcul, algèbre, géométrie et raisonnement logique pour les stagiaires.', 'blue', 'Calculator', 2),
('Informatique', 'Bureautique, Internet, sécurité numérique et outils numériques du quotidien.', 'emerald', 'Laptop', 3),
('Anglais', 'Vocabulaire, grammaire et communication en anglais professionnel.', 'amber', 'Languages', 4)
ON CONFLICT DO NOTHING;

-- ============ SECTIONS ============
-- Français
INSERT INTO sections (module_id, titre, description, ordre)
SELECT m.id, s.titre, s.description, s.ordre
FROM (VALUES
  ('Français', 'Orthographe', 'Règles d''orthographe et pièges fréquents.', 1),
  ('Français', 'Grammaire', 'Nature et fonction des mots, phrases.', 2),
  ('Français', 'Conjugaison', 'Temps et modes des verbes.', 3)
) AS s(module_titre, titre, description, ordre)
JOIN modules m ON m.titre = s.module_titre
ON CONFLICT DO NOTHING;

-- Mathématiques
INSERT INTO sections (module_id, titre, description, ordre)
SELECT m.id, s.titre, s.description, s.ordre
FROM (VALUES
  ('Mathématiques', 'Calcul mental', 'Opérations de base et astuces de calcul.', 1),
  ('Mathématiques', 'Algèbre', 'Équations et manipulation algébrique.', 2),
  ('Mathématiques', 'Géométrie', 'Figures, surfaces et volumes.', 3)
) AS s(module_titre, titre, description, ordre)
JOIN modules m ON m.titre = s.module_titre
ON CONFLICT DO NOTHING;

-- Informatique
INSERT INTO sections (module_id, titre, description, ordre)
SELECT m.id, s.titre, s.description, s.ordre
FROM (VALUES
  ('Informatique', 'Bureautique', 'Traitement de texte, tableur, présentations.', 1),
  ('Informatique', 'Internet & sécurité', 'Navigation web et sécurité numérique.', 2)
) AS s(module_titre, titre, description, ordre)
JOIN modules m ON m.titre = s.module_titre
ON CONFLICT DO NOTHING;

-- Anglais
INSERT INTO sections (module_id, titre, description, ordre)
SELECT m.id, s.titre, s.description, s.ordre
FROM (VALUES
  ('Anglais', 'Vocabulaire', 'Lexique de base et vocabulaire professionnel.', 1),
  ('Anglais', 'Grammaire anglaise', 'Temps, articles et structures de phrases.', 2)
) AS s(module_titre, titre, description, ordre)
JOIN modules m ON m.titre = s.module_titre
ON CONFLICT DO NOTHING;

-- ============ LESSONS ============
-- Français / Orthographe
INSERT INTO lessons (section_id, titre, contenu, ordre)
SELECT s.id, l.titre, l.contenu, l.ordre
FROM (VALUES
  ('Français', 'Orthographe', 'Le pluriel des mots en -ou, -au, -eu', 'La règle générale : les noms en -ou, -au, -eu prennent généralement un s au pluriel. Exceptions notables : bijou, caillou, chou, genou, hibou, joujou, pou qui prennent x. Exemples : un trou → des trous ; un caillou → des cailloux.', 1),
  ('Français', 'Orthographe', 'Leur / leurs, c''est / s''est', 'Leur (sans s) est un pronom personnel placé devant un verbe : "je leur donne". Leurs (avec s) est un déterminant possessif placé devant un nom pluriel : "leurs affaires". "C''est" = c'' + est (sujet "ce"). "S''est" = s'' + est (pronom réfléchi) : "il s''est lavé".', 2)
) AS l(module_titre, section_titre, titre, contenu, ordre)
JOIN modules m ON m.titre = l.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = l.section_titre
ON CONFLICT DO NOTHING;

-- Français / Grammaire
INSERT INTO lessons (section_id, titre, contenu, ordre)
SELECT s.id, l.titre, l.contenu, l.ordre
FROM (VALUES
  ('Français', 'Grammaire', 'Nature et fonction des mots', 'La nature d''un mot est sa classe grammaticale (nom, verbe, adjectif...). La fonction est son rôle dans la phrase (sujet, COD, attribut...). Un même mot peut changer de nature selon le contexte.', 1)
) AS l(module_titre, section_titre, titre, contenu, ordre)
JOIN modules m ON m.titre = l.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = l.section_titre
ON CONFLICT DO NOTHING;

-- Français / Conjugaison
INSERT INTO lessons (section_id, titre, contenu, ordre)
SELECT s.id, l.titre, l.contenu, l.ordre
FROM (VALUES
  ('Français', 'Conjugaison', 'L''imparfait et le passé simple', 'L''imparfait exprime une action durable ou habituelle dans le passé. On le forme à partir du verbe au présent (nous) + terminaisons -ais, -ais, -ait, -ions, -iez, -aient. Le passé simple exprime des actions ponctuelles et soudaines.', 1)
) AS l(module_titre, section_titre, titre, contenu, ordre)
JOIN modules m ON m.titre = l.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = l.section_titre
ON CONFLICT DO NOTHING;

-- Mathématiques / Calcul mental
INSERT INTO lessons (section_id, titre, contenu, ordre)
SELECT s.id, l.titre, l.contenu, l.ordre
FROM (VALUES
  ('Mathématiques', 'Calcul mental', 'Multiplication par 11', 'Pour multiplier un nombre à deux chiffres par 11, on additionne les deux chiffres et on place le résultat entre eux. Exemple : 23 × 11 = 2 (2+3) 3 = 253. Si la somme dépasse 9, on reporte la dizaine : 57 × 11 = 627.', 1),
  ('Mathématiques', 'Calcul mental', 'Pourcentages rapides', 'Calculer 10 % d''un nombre revient à diviser par 10. Pour 5 %, on divise par 20. Pour 1 %, on divise par 100. Combiner ces valeurs permet d''obtenir tout pourcentage rapidement.', 2)
) AS l(module_titre, section_titre, titre, contenu, ordre)
JOIN modules m ON m.titre = l.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = l.section_titre
ON CONFLICT DO NOTHING;

-- Mathématiques / Algèbre
INSERT INTO lessons (section_id, titre, contenu, ordre)
SELECT s.id, l.titre, l.contenu, l.ordre
FROM (VALUES
  ('Mathématiques', 'Algèbre', 'Résoudre une équation du premier degré', 'Pour résoudre ax + b = c : on isole l''inconnue x. D''abord soustraire b des deux côtés, puis diviser par a. Exemple : 2x + 3 = 11 → 2x = 8 → x = 4.', 1)
) AS l(module_titre, section_titre, titre, contenu, ordre)
JOIN modules m ON m.titre = l.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = l.section_titre
ON CONFLICT DO NOTHING;

-- Mathématiques / Géométrie
INSERT INTO lessons (section_id, titre, contenu, ordre)
SELECT s.id, l.titre, l.contenu, l.ordre
FROM (VALUES
  ('Mathématiques', 'Géométrie', 'Aire et périmètre des figures usuelles', 'Carré : P = 4c, A = c². Rectangle : P = 2(L+l), A = L×l. Triangle : A = (base×hauteur)/2. Cercle : P = 2πr, A = πr².', 1)
) AS l(module_titre, section_titre, titre, contenu, ordre)
JOIN modules m ON m.titre = l.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = l.section_titre
ON CONFLICT DO NOTHING;

-- Informatique / Bureautique
INSERT INTO lessons (section_id, titre, contenu, ordre)
SELECT s.id, l.titre, l.contenu, l.ordre
FROM (VALUES
  ('Informatique', 'Bureautique', 'Mise en forme dans un traitement de texte', 'Les styles (Titre 1, Titre 2, Corps) permettent de structurer un document et de générer un sommaire automatique. Préférez les styles au formatage manuel (gras, taille) pour la cohérence.', 1),
  ('Informatique', 'Bureautique', 'Les formules de base dans un tableur', 'Une formule commence toujours par =. SOMME(A1:A10) additionne une plage. MOYENNE calcule la moyenne. SI(test; valeur_si_vrai; valeur_si_faux) renvoie une valeur selon une condition.', 2)
) AS l(module_titre, section_titre, titre, contenu, ordre)
JOIN modules m ON m.titre = l.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = l.section_titre
ON CONFLICT DO NOTHING;

-- Informatique / Internet & sécurité
INSERT INTO lessons (section_id, titre, contenu, ordre)
SELECT s.id, l.titre, l.contenu, l.ordre
FROM (VALUES
  ('Informatique', 'Internet & sécurité', 'Protéger ses mots de passe', 'Un bon mot de passe fait au moins 12 caractères, mélange majuscules, minuscules, chiffres et symboles, et n''est pas réutilisé sur plusieurs sites. Un gestionnaire de mots de passe est recommandé.', 1),
  ('Informatique', 'Internet & sécurité', 'Reconnaître le phishing', 'Le hameçonnage (phishing) est une fraude par email ou SMS visant à voler vos identifiants. Signes : urgences fictives, liens suspects, fautes d''orthographe, demandes d''informations personnelles.', 2)
) AS l(module_titre, section_titre, titre, contenu, ordre)
JOIN modules m ON m.titre = l.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = l.section_titre
ON CONFLICT DO NOTHING;

-- Anglais / Vocabulaire
INSERT INTO lessons (section_id, titre, contenu, ordre)
SELECT s.id, l.titre, l.contenu, l.ordre
FROM (VALUES
  ('Anglais', 'Vocabulaire', 'Salutations et présentations', 'Hello / Hi : bonjour. Good morning / afternoon / evening : selon le moment. How are you? I''m fine, thank you. Nice to meet you. Goodbye / Bye : au revoir.', 1)
) AS l(module_titre, section_titre, titre, contenu, ordre)
JOIN modules m ON m.titre = l.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = l.section_titre
ON CONFLICT DO NOTHING;

-- Anglais / Grammaire anglaise
INSERT INTO lessons (section_id, titre, contenu, ordre)
SELECT s.id, l.titre, l.contenu, l.ordre
FROM (VALUES
  ('Anglais', 'Grammaire anglaise', 'Le présent simple', 'Le present simple décrit des habitudes ou des faits. Forme : S + V (s à la 3e personne du singulier). Exemple : She works in London. Forme négative : does not / do not.', 1)
) AS l(module_titre, section_titre, titre, contenu, ordre)
JOIN modules m ON m.titre = l.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = l.section_titre
ON CONFLICT DO NOTHING;

-- ============ EXERCISES ============
-- Français / Orthographe
INSERT INTO exercises (section_id, question, options, correct_index, explanation, ordre)
SELECT s.id, e.question, e.options, e.correct_index, e.explanation, e.ordre
FROM (VALUES
  ('Français', 'Orthographe', 'Quel est le pluriel correct de "bijou" ?', '["bijous","bijoux","bijoeux","bijou"]'::jsonb, 1, 'Les noms en -ou prennent x dans 7 exceptions, dont bijou.', 1),
  ('Français', 'Orthographe', 'Complétez : "Je ___ donne mes documents." (pronom)', '["leurs","leur","leurs ","leurs"]'::jsonb, 1, 'Devant un verbe, "leur" est pronom et reste invariable.', 2),
  ('Français', 'Orthographe', 'Choisissez la bonne orthographe : "C''est ___ ami." (possessif)', '["leur","leurs","leure","leures"]'::jsonb, 0, 'Possessif devant un nom singulier : "leur ami".', 3)
) AS e(module_titre, section_titre, question, options, correct_index, explanation, ordre)
JOIN modules m ON m.titre = e.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = e.section_titre
ON CONFLICT DO NOTHING;

-- Français / Grammaire
INSERT INTO exercises (section_id, question, options, correct_index, explanation, ordre)
SELECT s.id, e.question, e.options, e.correct_index, e.explanation, e.ordre
FROM (VALUES
  ('Français', 'Grammaire', 'Dans "Le chat dort", quelle est la fonction de "Le chat" ?', '["COD","Sujet","Attribut","Complément circonstanciel"]'::jsonb, 1, 'Le sujet est celui qui fait l''action du verbe.', 1),
  ('Français', 'Grammaire', 'Quelle est la nature du mot "rapidement" ?', '["Nom","Adjectif","Adverbe","Verbe"]'::jsonb, 2, 'Les mots en -ment sont généralement des adverbes.', 2)
) AS e(module_titre, section_titre, question, options, correct_index, explanation, ordre)
JOIN modules m ON m.titre = e.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = e.section_titre
ON CONFLICT DO NOTHING;

-- Français / Conjugaison
INSERT INTO exercises (section_id, question, options, correct_index, explanation, ordre)
SELECT s.id, e.question, e.options, e.correct_index, e.explanation, e.ordre
FROM (VALUES
  ('Français', 'Conjugaison', 'Conjuguez "finir" à la 1re personne du singulier à l''imparfait.', '["finissais","finissai","finissait","finisais"]'::jsonb, 0, 'Imparfait : radical + -ais (je finissais).', 1),
  ('Français', 'Conjugaison', 'Quel est le passé simple de "aller" à la 3e personne du singulier ?', '["alla","allaient","allat","allaît"]'::jsonb, 0, 'Passé simple de aller : il alla.', 2)
) AS e(module_titre, section_titre, question, options, correct_index, explanation, ordre)
JOIN modules m ON m.titre = e.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = e.section_titre
ON CONFLICT DO NOTHING;

-- Mathématiques / Calcul mental
INSERT INTO exercises (section_id, question, options, correct_index, explanation, ordre)
SELECT s.id, e.question, e.options, e.correct_index, e.explanation, e.ordre
FROM (VALUES
  ('Mathématiques', 'Calcul mental', 'Combien font 23 × 11 ?', '["243","253","263","233"]'::jsonb, 1, 'Astuce × 11 : 2 (2+3) 3 = 253.', 1),
  ('Mathématiques', 'Calcul mental', 'Quel est 10 % de 250 ?', '["25","2,5","250","0,25"]'::jsonb, 0, '10 % = diviser par 10.', 2),
  ('Mathématiques', 'Calcul mental', 'Combien font 57 × 11 ?', '["527","627","617","577"]'::jsonb, 1, '5+7=12, on reporte : 627.', 3)
) AS e(module_titre, section_titre, question, options, correct_index, explanation, ordre)
JOIN modules m ON m.titre = e.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = e.section_titre
ON CONFLICT DO NOTHING;

-- Mathématiques / Algèbre
INSERT INTO exercises (section_id, question, options, correct_index, explanation, ordre)
SELECT s.id, e.question, e.options, e.correct_index, e.explanation, e.ordre
FROM (VALUES
  ('Mathématiques', 'Algèbre', 'Résolvez : 2x + 3 = 11. x = ?', '["3","4","5","8"]'::jsonb, 1, '2x = 8 → x = 4.', 1),
  ('Mathématiques', 'Algèbre', 'Résolvez : 5x - 7 = 18. x = ?', '["5","3","6","2"]'::jsonb, 0, '5x = 25 → x = 5.', 2)
) AS e(module_titre, section_titre, question, options, correct_index, explanation, ordre)
JOIN modules m ON m.titre = e.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = e.section_titre
ON CONFLICT DO NOTHING;

-- Mathématiques / Géométrie
INSERT INTO exercises (section_id, question, options, correct_index, explanation, ordre)
SELECT s.id, e.question, e.options, e.correct_index, e.explanation, e.ordre
FROM (VALUES
  ('Mathématiques', 'Géométrie', 'Aire d''un carré de côté 5 cm ?', '["20 cm²","25 cm²","10 cm²","15 cm²"]'::jsonb, 1, 'A = c² = 25.', 1),
  ('Mathématiques', 'Géométrie', 'Périmètre d''un rectangle 8 cm × 3 cm ?', '["22 cm","24 cm","11 cm","32 cm"]'::jsonb, 0, 'P = 2(8+3) = 22.', 2)
) AS e(module_titre, section_titre, question, options, correct_index, explanation, ordre)
JOIN modules m ON m.titre = e.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = e.section_titre
ON CONFLICT DO NOTHING;

-- Informatique / Bureautique
INSERT INTO exercises (section_id, question, options, correct_index, explanation, ordre)
SELECT s.id, e.question, e.options, e.correct_index, e.explanation, e.ordre
FROM (VALUES
  ('Informatique', 'Bureautique', 'Quelle formule additionne la plage A1:A10 dans un tableur ?', '["=SOMME(A1:A10)","=ADDITION(A1,A10)","=TOTAL(A1:A10)","=PLUS(A1:A10)"]'::jsonb, 0, 'La fonction SOMME additionne une plage.', 1),
  ('Informatique', 'Bureautique', 'Quel style utiliser pour un titre principal de document ?', '["Titre 1","Normal","Corps de texte","Gras manuel"]'::jsonb, 0, 'Les styles Titre structurent et génèrent le sommaire.', 2)
) AS e(module_titre, section_titre, question, options, correct_index, explanation, ordre)
JOIN modules m ON m.titre = e.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = e.section_titre
ON CONFLICT DO NOTHING;

-- Informatique / Internet & sécurité
INSERT INTO exercises (section_id, question, options, correct_index, explanation, ordre)
SELECT s.id, e.question, e.options, e.correct_index, e.explanation, e.ordre
FROM (VALUES
  ('Informatique', 'Internet & sécurité', 'Quelle est la longueur minimale recommandée d''un mot de passe ?', '["6 caractères","8 caractères","12 caractères","4 caractères"]'::jsonb, 2, 'Au moins 12 caractères pour un bon niveau de sécurité.', 1),
  ('Informatique', 'Internet & sécurité', 'Un email urgent vous demandant votre mot de passe est probablement :', '["Légitime","Du phishing","Une newsletter","Un message système"]'::jsonb, 1, 'L''urgence + demande d''identifiants = phishing.', 2)
) AS e(module_titre, section_titre, question, options, correct_index, explanation, ordre)
JOIN modules m ON m.titre = e.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = e.section_titre
ON CONFLICT DO NOTHING;

-- Anglais / Vocabulaire
INSERT INTO exercises (section_id, question, options, correct_index, explanation, ordre)
SELECT s.id, e.question, e.options, e.correct_index, e.explanation, e.ordre
FROM (VALUES
  ('Anglais', 'Vocabulaire', 'Comment dit-on "Bonjour" le matin en anglais ?', '["Good evening","Good morning","Good night","Goodbye"]'::jsonb, 1, 'Good morning = bonjour (le matin).', 1),
  ('Anglais', 'Vocabulaire', 'Que signifie "Nice to meet you" ?', '["Au revoir","Ravi de vous rencontrer","Comment allez-vous","Merci"]'::jsonb, 1, 'Nice to meet you = ravi de faire votre connaissance.', 2)
) AS e(module_titre, section_titre, question, options, correct_index, explanation, ordre)
JOIN modules m ON m.titre = e.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = e.section_titre
ON CONFLICT DO NOTHING;

-- Anglais / Grammaire anglaise
INSERT INTO exercises (section_id, question, options, correct_index, explanation, ordre)
SELECT s.id, e.question, e.options, e.correct_index, e.explanation, e.ordre
FROM (VALUES
  ('Anglais', 'Grammaire anglaise', 'Complétez : She ___ in London. (présent simple)', '["work","works","working","worked"]'::jsonb, 1, '3e personne du singulier : ajoute -s.', 1),
  ('Anglais', 'Grammaire anglaise', 'Forme négative de "I like coffee" au présent simple ?', '["I no like coffee","I don''t like coffee","I not like coffee","I doesn''t like coffee"]'::jsonb, 1, 'I + do not + verbe.', 2)
) AS e(module_titre, section_titre, question, options, correct_index, explanation, ordre)
JOIN modules m ON m.titre = e.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = e.section_titre
ON CONFLICT DO NOTHING;

-- ============ QUIZ QUESTIONS ============
-- Français / Orthographe
INSERT INTO quiz_questions (section_id, question, options, correct_index, explanation, ordre)
SELECT s.id, q.question, q.options, q.correct_index, q.explanation, q.ordre
FROM (VALUES
  ('Français', 'Orthographe', 'Le pluriel de "trou" est :', '["troux","trous","treux","trou"]'::jsonb, 1, 'Trou suit la règle générale en -s.', 1),
  ('Français', 'Orthographe', 'Choisissez : "___ amis sont venus." (possessif pluriel)', '["Leur","Leurs","Leur ","Leures"]'::jsonb, 1, 'Devant un nom pluriel : leurs.', 2),
  ('Français', 'Orthographe', 'Écrivez correctement : "Il ___ levé tôt." (réfléchi)', '["c''est","s''est","ces","ses"]'::jsonb, 1, 'Pronom réfléchi : s''est.', 3)
) AS q(module_titre, section_titre, question, options, correct_index, explanation, ordre)
JOIN modules m ON m.titre = q.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = q.section_titre
ON CONFLICT DO NOTHING;

-- Mathématiques / Calcul mental
INSERT INTO quiz_questions (section_id, question, options, correct_index, explanation, ordre)
SELECT s.id, q.question, q.options, q.correct_index, q.explanation, q.ordre
FROM (VALUES
  ('Mathématiques', 'Calcul mental', 'Combien font 35 × 11 ?', '["385","375","355","315"]'::jsonb, 0, '3 (3+5) 5 = 385.', 1),
  ('Mathématiques', 'Calcul mental', 'Quel est 5 % de 200 ?', '["10","20","5","100"]'::jsonb, 0, '5 % = diviser par 20.', 2)
) AS q(module_titre, section_titre, question, options, correct_index, explanation, ordre)
JOIN modules m ON m.titre = q.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = q.section_titre
ON CONFLICT DO NOTHING;

-- Informatique / Internet & sécurité
INSERT INTO quiz_questions (section_id, question, options, correct_index, explanation, ordre)
SELECT s.id, q.question, q.options, q.correct_index, q.explanation, q.ordre
FROM (VALUES
  ('Informatique', 'Internet & sécurité', 'Le phishing vise à :', '["Vendre des produits","Voler des identifiants","Envoyer des newsletters","Mettre à jour le système"]'::jsonb, 1, 'Le phishing vole des informations personnelles.', 1),
  ('Informatique', 'Internet & sécurité', 'Un bon mot de passe contient :', '["Votre date de naissance","123456","Majuscules, minuscules, chiffres, symboles","Votre prénom"]'::jsonb, 2, 'Variété de caractères = robustesse.', 2)
) AS q(module_titre, section_titre, question, options, correct_index, explanation, ordre)
JOIN modules m ON m.titre = q.module_titre
JOIN sections s ON s.module_id = m.id AND s.titre = q.section_titre
ON CONFLICT DO NOTHING;

-- ============ PLACEMENT TESTS ============
INSERT INTO placement_tests (titre, description, module_id)
SELECT 'Test de positionnement — Français', 'Évaluez votre niveau en orthographe, grammaire et conjugaison.', m.id
FROM modules m WHERE m.titre = 'Français'
ON CONFLICT DO NOTHING;

INSERT INTO placement_tests (titre, description, module_id)
SELECT 'Test de positionnement — Mathématiques', 'Évaluez votre niveau en calcul, algèbre et géométrie.', m.id
FROM modules m WHERE m.titre = 'Mathématiques'
ON CONFLICT DO NOTHING;

INSERT INTO placement_tests (titre, description, module_id)
SELECT 'Test de positionnement — Informatique', 'Évaluez votre niveau en bureautique et sécurité numérique.', m.id
FROM modules m WHERE m.titre = 'Informatique'
ON CONFLICT DO NOTHING;

-- ============ PLACEMENT QUESTIONS ============
INSERT INTO placement_questions (placement_test_id, question, options, correct_index, explanation, ordre)
SELECT pt.id, pq.question, pq.options, pq.correct_index, pq.explanation, pq.ordre
FROM (VALUES
  ('Test de positionnement — Français', 'Le pluriel de "caillou" est :', '["caillous","cailloux","caillos","caillou"]'::jsonb, 1, 'Exception en -oux.', 1),
  ('Test de positionnement — Français', 'Dans "Elle mange une pomme", "une pomme" est :', '["Sujet","COD","Attribut","Circonstanciel"]'::jsonb, 1, 'COD = complément direct du verbe.', 2),
  ('Test de positionnement — Français', 'Imparfait de "être" à la 1re personne du pluriel :', '["étions","étiez","était","étaient"]'::jsonb, 0, 'Nous étions.', 3),
  ('Test de positionnement — Français', 'Choisissez : "Je ___ dit oui." (pronom)', '["leur","leurs","leures","leurs "]'::jsonb, 0, 'Pronom invariable devant verbe.', 4),
  ('Test de positionnement — Français', 'Accord correct :', '["Les filles sont parties","Les filles est partie","Les filles sont parti","Les filles est parties"]'::jsonb, 0, 'Sujet pluriel féminin → parties.', 5)
) AS pq(test_titre, question, options, correct_index, explanation, ordre)
JOIN placement_tests pt ON pt.titre = pq.test_titre
ON CONFLICT DO NOTHING;

INSERT INTO placement_questions (placement_test_id, question, options, correct_index, explanation, ordre)
SELECT pt.id, pq.question, pq.options, pq.correct_index, pq.explanation, pq.ordre
FROM (VALUES
  ('Test de positionnement — Mathématiques', 'Combien font 12 × 11 ?', '["122","132","121","112"]'::jsonb, 1, '1 (1+2) 2 = 132.', 1),
  ('Test de positionnement — Mathématiques', 'Résolvez : 3x - 5 = 10. x = ?', '["5","3","6","2"]'::jsonb, 0, '3x = 15 → x = 5.', 2),
  ('Test de positionnement — Mathématiques', 'Aire d''un triangle de base 6 et hauteur 4 ?', '["12","24","10","48"]'::jsonb, 0, 'A = (6×4)/2 = 12.', 3),
  ('Test de positionnement — Mathématiques', 'Quel est 20 % de 150 ?', '["30","15","25","20"]'::jsonb, 0, '20 % = 0,2 × 150 = 30.', 4),
  ('Test de positionnement — Mathématiques', 'Périmètre d''un cercle de rayon 5 (π≈3) ?', '["30","15","25","10"]'::jsonb, 0, 'P = 2πr = 30.', 5)
) AS pq(test_titre, question, options, correct_index, explanation, ordre)
JOIN placement_tests pt ON pt.titre = pq.test_titre
ON CONFLICT DO NOTHING;

INSERT INTO placement_questions (placement_test_id, question, options, correct_index, explanation, ordre)
SELECT pt.id, pq.question, pq.options, pq.correct_index, pq.explanation, pq.ordre
FROM (VALUES
  ('Test de positionnement — Informatique', 'Quelle fonction additionne une plage dans un tableur ?', '["=SOMME(...)","=PLUS(...)","=TOTAL(...)","=ADD(...)"]'::jsonb, 0, 'SOMME additionne une plage.', 1),
  ('Test de positionnement — Informatique', 'Le phishing est :', '["Un antivirus","Une fraude par email","Un système d''exploitation","Un navigateur"]'::jsonb, 1, 'Fraude visant à voler des identifiants.', 2),
  ('Test de positionnement — Informatique', 'Un mot de passe robuste contient :', '["Son prénom","123456","Des caractères variés","Sa date de naissance"]'::jsonb, 2, 'Variété = robustesse.', 3),
  ('Test de positionnement — Informatique', 'Quel style structure un document ?', '["Gras","Titre 1","Italique","Souligné"]'::jsonb, 1, 'Les styles Titre structurent.', 4),
  ('Test de positionnement — Informatique', 'Que signifie "navigateur web" ?', '["Un logiciel pour naviguer sur internet","Un moteur de recherche","Un tableur","Un système d''exploitation"]'::jsonb, 0, 'Navigateur = logiciel d''accès au web.', 5)
) AS pq(test_titre, question, options, correct_index, explanation, ordre)
JOIN placement_tests pt ON pt.titre = pq.test_titre
ON CONFLICT DO NOTHING;