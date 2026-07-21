/*
# ATI Groupe Hub — Schéma de la plateforme de formation

## Objectif
Créer le schéma complet de l'application de formation pour les stagiaires d'ATI Groupe Hub.
Les stagiaires accèdent à des modules divisés en sections, contenant des leçons, des exercices
et des quiz. Des tests de positionnement évaluent le niveau initial. Chaque stagiaire suit sa
propre progression et consulte ses résultats.

## Authentification
L'authentification est personnalisée (nom + prénom + code stagiaire), stockée dans la table
`stagiaires`. L'application utilise la clé anon Supabase ; les politiques RLS sont donc ouvertes
à `anon, authenticated` (modèle single-tenant sans auth.users). L'isolation par stagiaire est
gérée côté application via `stagiaire_id`.

## Nouvelles tables
1. `stagiaires` — comptes stagiaires (nom, prénom, code unique)
2. `modules` — modules de formation (ex: Français)
3. `sections` — sous-thèmes d'un module (ex: Orthographe)
4. `lessons` — leçons théoriques d'une section
5. `exercises` — exercices d'entraînement d'une section (QCM)
6. `quiz_questions` — questions de quiz d'une section (QCM)
7. `placement_tests` — tests de positionnement
8. `placement_questions` — questions d'un test de positionnement (QCM)
9. `progress_lessons` — suivi des leçons terminées par stagiaire
10. `exercise_results` — résultats d'exercices par stagiaire
11. `quiz_results` — résultats de quiz par stagiaire
12. `placement_results` — résultats de test de positionnement par stagiaire

## Sécurité
- RLS activée sur toutes les tables.
- Politiques CRUD ouvertes à `anon, authenticated` (application sans écran de login Supabase
  standard ; l'accès est contrôlé par le code stagiaire côté frontend).
*/

-- ============ STAGIAIRES ============
CREATE TABLE IF NOT EXISTS stagiaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  code_stagiaire text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE stagiaires ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_crud_stagiaires" ON stagiaires;
CREATE POLICY "anon_crud_stagiaires" ON stagiaires FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_stagiaires" ON stagiaires;
CREATE POLICY "anon_insert_stagiaires" ON stagiaires FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_stagiaires" ON stagiaires;
CREATE POLICY "anon_update_stagiaires" ON stagiaires FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ MODULES ============
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text,
  couleur text NOT NULL DEFAULT 'blue',
  icone text NOT NULL DEFAULT 'BookOpen',
  ordre int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_modules" ON modules;
CREATE POLICY "anon_select_modules" ON modules FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_modules" ON modules;
CREATE POLICY "anon_insert_modules" ON modules FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_modules" ON modules;
CREATE POLICY "anon_update_modules" ON modules FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_modules" ON modules;
CREATE POLICY "anon_delete_modules" ON modules FOR DELETE TO anon, authenticated USING (true);

-- ============ SECTIONS ============
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  titre text NOT NULL,
  description text,
  ordre int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_sections" ON sections;
CREATE POLICY "anon_select_sections" ON sections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_sections" ON sections;
CREATE POLICY "anon_insert_sections" ON sections FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_sections" ON sections;
CREATE POLICY "anon_update_sections" ON sections FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_sections" ON sections;
CREATE POLICY "anon_delete_sections" ON sections FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_sections_module_id ON sections(module_id);

-- ============ LESSONS ============
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  titre text NOT NULL,
  contenu text NOT NULL,
  ordre int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_lessons" ON lessons;
CREATE POLICY "anon_select_lessons" ON lessons FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_lessons" ON lessons;
CREATE POLICY "anon_insert_lessons" ON lessons FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_lessons" ON lessons;
CREATE POLICY "anon_update_lessons" ON lessons FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_lessons" ON lessons;
CREATE POLICY "anon_delete_lessons" ON lessons FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_lessons_section_id ON lessons(section_id);

-- ============ EXERCISES (QCM items) ============
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_index int NOT NULL,
  explanation text,
  ordre int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_exercises" ON exercises;
CREATE POLICY "anon_select_exercises" ON exercises FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_exercises" ON exercises;
CREATE POLICY "anon_insert_exercises" ON exercises FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_exercises" ON exercises;
CREATE POLICY "anon_update_exercises" ON exercises FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_exercises" ON exercises;
CREATE POLICY "anon_delete_exercises" ON exercises FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_exercises_section_id ON exercises(section_id);

-- ============ QUIZ QUESTIONS ============
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_index int NOT NULL,
  explanation text,
  ordre int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_quiz_questions" ON quiz_questions;
CREATE POLICY "anon_select_quiz_questions" ON quiz_questions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_quiz_questions" ON quiz_questions;
CREATE POLICY "anon_insert_quiz_questions" ON quiz_questions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_quiz_questions" ON quiz_questions;
CREATE POLICY "anon_update_quiz_questions" ON quiz_questions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_quiz_questions" ON quiz_questions;
CREATE POLICY "anon_delete_quiz_questions" ON quiz_questions FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_section_id ON quiz_questions(section_id);

-- ============ PLACEMENT TESTS ============
CREATE TABLE IF NOT EXISTS placement_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  description text,
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE placement_tests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_placement_tests" ON placement_tests;
CREATE POLICY "anon_select_placement_tests" ON placement_tests FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_placement_tests" ON placement_tests;
CREATE POLICY "anon_insert_placement_tests" ON placement_tests FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_placement_tests" ON placement_tests;
CREATE POLICY "anon_update_placement_tests" ON placement_tests FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_placement_tests" ON placement_tests;
CREATE POLICY "anon_delete_placement_tests" ON placement_tests FOR DELETE TO anon, authenticated USING (true);

-- ============ PLACEMENT QUESTIONS ============
CREATE TABLE IF NOT EXISTS placement_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placement_test_id uuid NOT NULL REFERENCES placement_tests(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL,
  correct_index int NOT NULL,
  explanation text,
  ordre int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE placement_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_placement_questions" ON placement_questions;
CREATE POLICY "anon_select_placement_questions" ON placement_questions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_placement_questions" ON placement_questions;
CREATE POLICY "anon_insert_placement_questions" ON placement_questions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_placement_questions" ON placement_questions;
CREATE POLICY "anon_update_placement_questions" ON placement_questions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_placement_questions" ON placement_questions;
CREATE POLICY "anon_delete_placement_questions" ON placement_questions FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_placement_questions_test_id ON placement_questions(placement_test_id);

-- ============ PROGRESS LESSONS ============
CREATE TABLE IF NOT EXISTS progress_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stagiaire_id uuid NOT NULL REFERENCES stagiaires(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean NOT NULL DEFAULT true,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (stagiaire_id, lesson_id)
);
ALTER TABLE progress_lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_progress_lessons" ON progress_lessons;
CREATE POLICY "anon_select_progress_lessons" ON progress_lessons FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_progress_lessons" ON progress_lessons;
CREATE POLICY "anon_insert_progress_lessons" ON progress_lessons FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_progress_lessons" ON progress_lessons;
CREATE POLICY "anon_update_progress_lessons" ON progress_lessons FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_progress_lessons" ON progress_lessons;
CREATE POLICY "anon_delete_progress_lessons" ON progress_lessons FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_progress_lessons_stagiaire ON progress_lessons(stagiaire_id);

-- ============ EXERCISE RESULTS ============
CREATE TABLE IF NOT EXISTS exercise_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stagiaire_id uuid NOT NULL REFERENCES stagiaires(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  score int NOT NULL,
  total int NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE exercise_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_exercise_results" ON exercise_results;
CREATE POLICY "anon_select_exercise_results" ON exercise_results FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_exercise_results" ON exercise_results;
CREATE POLICY "anon_insert_exercise_results" ON exercise_results FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_exercise_results" ON exercise_results;
CREATE POLICY "anon_delete_exercise_results" ON exercise_results FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_exercise_results_stagiaire ON exercise_results(stagiaire_id);

-- ============ QUIZ RESULTS ============
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stagiaire_id uuid NOT NULL REFERENCES stagiaires(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  score int NOT NULL,
  total int NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_quiz_results" ON quiz_results;
CREATE POLICY "anon_select_quiz_results" ON quiz_results FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_quiz_results" ON quiz_results;
CREATE POLICY "anon_insert_quiz_results" ON quiz_results FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_quiz_results" ON quiz_results;
CREATE POLICY "anon_delete_quiz_results" ON quiz_results FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_quiz_results_stagiaire ON quiz_results(stagiaire_id);

-- ============ PLACEMENT RESULTS ============
CREATE TABLE IF NOT EXISTS placement_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stagiaire_id uuid NOT NULL REFERENCES stagiaires(id) ON DELETE CASCADE,
  placement_test_id uuid NOT NULL REFERENCES placement_tests(id) ON DELETE CASCADE,
  score int NOT NULL,
  total int NOT NULL,
  level text,
  answers jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE placement_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_placement_results" ON placement_results;
CREATE POLICY "anon_select_placement_results" ON placement_results FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_placement_results" ON placement_results;
CREATE POLICY "anon_insert_placement_results" ON placement_results FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_placement_results" ON placement_results;
CREATE POLICY "anon_delete_placement_results" ON placement_results FOR DELETE TO anon, authenticated USING (true);
CREATE INDEX IF NOT EXISTS idx_placement_results_stagiaire ON placement_results(stagiaire_id);
