import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { getModuleIcon, getColor } from '@/lib/theme';
import {
  ArrowLeft, BookOpen, CheckCircle2, Brain, FileQuestion, Trophy,
  TrendingUp, Award, ClipboardList, Target,
} from 'lucide-react';
import type {
  Module, Section, Lesson, ProgressLesson, ExerciseResult, QuizResult, PlacementResult,
} from '@/types';

interface Props {
  onBack: () => void;
  onOpenModule: (moduleId: string) => void;
}

export default function ProgressPage({ onBack, onOpenModule }: Props) {
  const { stagiaire } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressLesson[]>([]);
  const [exResults, setExResults] = useState<ExerciseResult[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [placements, setPlacements] = useState<PlacementResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sid = stagiaire?.id ?? '';
      const [{ data: m }, { data: s }, { data: l }, { data: p }, { data: ex }, { data: qr }, { data: pl }] = await Promise.all([
        supabase.from('modules').select('*').order('ordre'),
        supabase.from('sections').select('*').order('ordre'),
        supabase.from('lessons').select('*'),
        supabase.from('progress_lessons').select('*').eq('stagiaire_id', sid),
        supabase.from('exercise_results').select('*').eq('stagiaire_id', sid).order('created_at', { ascending: false }),
        supabase.from('quiz_results').select('*').eq('stagiaire_id', sid).order('created_at', { ascending: false }),
        supabase.from('placement_results').select('*').eq('stagiaire_id', sid).order('created_at', { ascending: false }),
      ]);
      setModules(m as Module[] ?? []);
      setSections(s as Section[] ?? []);
      setLessons(l as Lesson[] ?? []);
      setProgress(p as ProgressLesson[] ?? []);
      setExResults(ex as ExerciseResult[] ?? []);
      setQuizResults(qr as QuizResult[] ?? []);
      setPlacements(pl as PlacementResult[] ?? []);
      setLoading(false);
    })();
  }, [stagiaire?.id]);

  const completedIds = new Set(progress.map((p) => p.lesson_id));
  const totalLessons = lessons.length;
  const doneLessons = lessons.filter((l) => completedIds.has(l.id)).length;
  const overallPct = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;

  const moduleStats = (modId: string) => {
    const modSections = sections.filter((s) => s.module_id === modId);
    const sectionIds = new Set(modSections.map((s) => s.id));
    const modLessons = lessons.filter((l) => sectionIds.has(l.section_id));
    const done = modLessons.filter((l) => completedIds.has(l.id)).length;
    const modQuizResults = quizResults.filter((r) => sectionIds.has(r.section_id));
    const modExResults = exResults.filter((r) => sectionIds.has(r.section_id));
    return {
      sections: modSections.length,
      lessons: modLessons.length,
      done,
      pct: modLessons.length ? Math.round((done / modLessons.length) * 100) : 0,
      quizCount: modQuizResults.length,
      exCount: modExResults.length,
      bestQuiz: modQuizResults.length ? Math.max(...modQuizResults.map((r) => Math.round((r.score / r.total) * 100))) : 0,
    };
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition">
        <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
      </button>

      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">Ma progression</h1>
        <p className="text-slate-500 mt-1">Suivez votre avancement et vos résultats.</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Stat icon={BookOpen} label="Leçons lues" value={`${doneLessons}/${totalLessons}`} color="brand" />
        <Stat icon={TrendingUp} label="Progression" value={`${overallPct}%`} color="emerald" />
        <Stat icon={Brain} label="Quiz réalisés" value={quizResults.length} color="amber" />
        <Stat icon={ClipboardList} label="Tests positionnement" value={placements.length} color="rose" />
      </div>

      {/* Placement results */}
      {placements.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 mb-4">Tests de positionnement</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {placements.map((r) => {
              const test = r;
              const pct = Math.round((r.score / r.total) * 100);
              return (
                <div key={r.id} className="card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="h-5 w-5 text-amber-500" />
                    <span className="text-sm font-semibold text-slate-700">{test.level ?? 'Niveau'}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{r.score}/{r.total}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{pct}%</p>
                    </div>
                    <div className="h-2 w-24 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">{new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Module progress */}
      <div>
        <h2 className="font-display text-xl font-bold text-slate-900 mb-4">Progression par module</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-2xl bg-white ring-1 ring-slate-100 animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((m) => {
              const Icon = getModuleIcon(m.icone);
              const color = getColor(m.couleur);
              const s = moduleStats(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => onOpenModule(m.id)}
                  className="card p-5 w-full text-left group hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`grid place-items-center h-11 w-11 rounded-xl ${color.soft} ${color.text} shrink-0`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-slate-900">{m.titre}</h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> {s.done}/{s.lessons} leçons</span>
                        {s.quizCount > 0 && <span className="flex items-center gap-1"><Brain className="h-3.5 w-3.5" /> {s.quizCount} quiz · meilleur {s.bestQuiz}%</span>}
                        {s.exCount > 0 && <span className="flex items-center gap-1"><FileQuestion className="h-3.5 w-3.5" /> {s.exCount} exercices</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-bold text-slate-900">{s.pct}%</p>
                      <div className="h-2 w-20 rounded-full bg-slate-100 overflow-hidden mt-1">
                        <div className={`h-full ${color.bg}`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent quiz results */}
      {quizResults.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 mb-4">Derniers quiz</h2>
          <div className="card divide-y divide-slate-100">
            {quizResults.slice(0, 8).map((r) => {
              const sec = sections.find((s) => s.id === r.section_id);
              const mod = sec ? modules.find((m) => m.id === sec.module_id) : null;
              const pct = Math.round((r.score / r.total) * 100);
              return (
                <div key={r.id} className="flex items-center gap-4 p-4">
                  <div className={`grid place-items-center h-9 w-9 rounded-lg ${pct >= 70 ? 'bg-emerald-50 text-emerald-600' : pct >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{sec?.titre ?? 'Section'}</p>
                    <p className="text-xs text-slate-500">{mod?.titre}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-slate-900">{r.score}/{r.total}</p>
                    <p className="text-xs text-slate-500">{pct}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {totalLessons === 0 && quizResults.length === 0 && placements.length === 0 && !loading && (
        <div className="card p-10 text-center">
          <Target className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Aucune activité pour le moment. Commencez par un module ou un test de positionnement !</p>
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
  const map: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };
  return (
    <div className="card p-4">
      <div className={`grid place-items-center h-9 w-9 rounded-lg ${map[color]} mb-3`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}
