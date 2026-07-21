import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { getModuleIcon, getColor } from '@/lib/theme';
import { ArrowLeft, ChevronRight, BookOpen, FileQuestion, Brain, CheckCircle2 } from 'lucide-react';
import type { Module, Section, Lesson, ExerciseResult, QuizResult, ProgressLesson } from '@/types';

interface Props {
  moduleId: string;
  onBack: () => void;
  onOpenSection: (sectionId: string) => void;
}

export default function ModuleView({ moduleId, onBack, onOpenSection }: Props) {
  const { stagiaire } = useAuth();
  const [mod, setMod] = useState<Module | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressLesson[]>([]);
  const [exResults, setExResults] = useState<ExerciseResult[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sid = stagiaire?.id ?? '';
      const { data: m } = await supabase.from('modules').select('*').eq('id', moduleId).maybeSingle();
      const { data: secs } = await supabase.from('sections').select('*').eq('module_id', moduleId).order('ordre');
      const sectionIds = (secs as Section[] ?? []).map((s) => s.id);
      const [lesRes, progRes, exrRes, qrRes] = sectionIds.length
        ? await Promise.all([
            supabase.from('lessons').select('*').in('section_id', sectionIds),
            supabase.from('progress_lessons').select('*').eq('stagiaire_id', sid),
            supabase.from('exercise_results').select('*').eq('stagiaire_id', sid),
            supabase.from('quiz_results').select('*').eq('stagiaire_id', sid),
          ])
        : [null, null, null, null];
      setMod(m as Module | null);
      setSections(secs as Section[] ?? []);
      setLessons(lesRes?.data as Lesson[] ?? []);
      setProgress(progRes?.data as ProgressLesson[] ?? []);
      setExResults(exrRes?.data as ExerciseResult[] ?? []);
      setQuizResults(qrRes?.data as QuizResult[] ?? []);
      setLoading(false);
    })();
  }, [moduleId, stagiaire?.id]);

  const completedLessonIds = new Set(progress.map((p) => p.lesson_id));
  const Icon = mod ? getModuleIcon(mod.icone) : BookOpen;
  const color = mod ? getColor(mod.couleur) : getColor('blue');

  const sectionInfo = (sectionId: string) => {
    const secLessons = lessons.filter((l) => l.section_id === sectionId);
    const done = secLessons.filter((l) => completedLessonIds.has(l.id)).length;
    const bestEx = exResults.filter((r) => r.section_id === sectionId);
    const bestQuiz = quizResults.filter((r) => r.section_id === sectionId);
    return {
      lessons: secLessons.length,
      done,
      exDone: bestEx.length > 0,
      quizDone: bestQuiz.length > 0,
      bestQuizScore: bestQuiz.length ? Math.max(...bestQuiz.map((r) => Math.round((r.score / r.total) * 100))) : 0,
    };
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition">
        <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
      </button>

      {loading ? (
        <div className="h-32 rounded-2xl bg-white ring-1 ring-slate-100 animate-pulse" />
      ) : mod && (
        <div className={`card p-6 bg-gradient-to-br ${color.gradient} text-white border-0`}>
          <div className="flex items-center gap-4">
            <div className="grid place-items-center h-14 w-14 rounded-2xl bg-white/15 ring-1 ring-white/20">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">{mod.titre}</h1>
              <p className="text-white/80 mt-1 max-w-2xl">{mod.description}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-display text-xl font-bold text-slate-900 mb-4">Sections du module</h2>
        <div className="space-y-3">
          {sections.map((s) => {
            const info = sectionInfo(s.id);
            return (
              <button
                key={s.id}
                onClick={() => onOpenSection(s.id)}
                className="card p-5 w-full text-left group hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-bold text-slate-900">{s.titre}</h3>
                    {s.description && <p className="text-sm text-slate-500 mt-0.5">{s.description}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="badge bg-slate-100 text-slate-600">
                        <BookOpen className="h-3 w-3" /> {info.done}/{info.lessons} leçons
                      </span>
                      {info.exDone && (
                        <span className="badge bg-amber-50 text-amber-700">
                          <FileQuestion className="h-3 w-3" /> Exercices
                        </span>
                      )}
                      {info.quizDone && (
                        <span className="badge bg-emerald-50 text-emerald-700">
                          <Brain className="h-3 w-3" /> Quiz {info.bestQuizScore}%
                        </span>
                      )}
                      {info.lessons > 0 && info.done === info.lessons && (
                        <span className="badge bg-brand-50 text-brand-700">
                          <CheckCircle2 className="h-3 w-3" /> Terminée
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
