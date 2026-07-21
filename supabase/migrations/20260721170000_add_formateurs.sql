/*
# ATI Groupe Hub — Espace Formateur

## Objectif
Ajouter le rôle « formateur » à la plateforme. Les formateurs se connectent avec un
code formateur et consultent, depuis un espace dédié, les résultats des tests de
positionnement enregistrés automatiquement pour chaque stagiaire.

## Nouveautés
1. Table `formateurs` — comptes formateurs (nom, prénom, code unique).
2. Politiques RLS ouvertes à `anon, authenticated` (même modèle single-tenant que les
   stagiaires ; l'accès est contrôlé par le code formateur côté application).
3. Un formateur de démonstration.

## Notes
- Les résultats de positionnement (`placement_results`) sont déjà écrits automatiquement
  par l'application dès qu'un stagiaire termine un test. Les politiques SELECT existantes
  (ouvertes) permettent au formateur de tous les lire. Aucune modification de ces tables
  n'est nécessaire.
- Migration additive et idempotente : elle peut être rejouée sans risque.
*/

-- ============ FORMATEURS ============
CREATE TABLE IF NOT EXISTS formateurs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  code_formateur text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE formateurs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_formateurs" ON formateurs;
CREATE POLICY "anon_select_formateurs" ON formateurs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_formateurs" ON formateurs;
CREATE POLICY "anon_insert_formateurs" ON formateurs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_formateurs" ON formateurs;
CREATE POLICY "anon_update_formateurs" ON formateurs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- ============ FORMATEUR DE DÉMONSTRATION ============
INSERT INTO formateurs (nom, prenom, code_formateur)
VALUES ('Formateur', 'ATI', 'FORM-2026')
ON CONFLICT (code_formateur) DO NOTHING;
