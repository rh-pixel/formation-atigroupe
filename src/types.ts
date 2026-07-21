export interface Stagiaire {
  id: string;
  nom: string;
  prenom: string;
  code_stagiaire: string;
  created_at: string;
}

export interface Formateur {
  id: string;
  nom: string;
  prenom: string;
  code_formateur: string;
  created_at: string;
}

export type Role = 'stagiaire' | 'formateur';

export interface Module {
  id: string;
  titre: string;
  description: string | null;
  couleur: string;
  icone: string;
  ordre: number;
}

export interface Section {
  id: string;
  module_id: string;
  titre: string;
  description: string | null;
  ordre: number;
}

export interface Lesson {
  id: string;
  section_id: string;
  titre: string;
  contenu: string;
  ordre: number;
}

export interface QcmItem {
  id: string;
  section_id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  ordre: number;
}

export interface PlacementTest {
  id: string;
  titre: string;
  description: string | null;
  module_id: string | null;
  pdf_url: string | null;
}

export interface PlacementQuestion {
  id: string;
  placement_test_id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  ordre: number;
}

export interface ProgressLesson {
  id: string;
  stagiaire_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string;
}

export interface ExerciseResult {
  id: string;
  stagiaire_id: string;
  section_id: string;
  score: number;
  total: number;
  answers: number[];
  created_at: string;
}

export interface QuizResult {
  id: string;
  stagiaire_id: string;
  section_id: string;
  score: number;
  total: number;
  answers: number[];
  created_at: string;
}

export interface PlacementResult {
  id: string;
  stagiaire_id: string;
  placement_test_id: string;
  score: number;
  total: number;
  level: string | null;
  answers: number[];
  created_at: string;
}
