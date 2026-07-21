import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { getModuleIcon, getColor } from '@/lib/theme';
import { ChevronRight, ClipboardList, BookOpen, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import type { Module, Section, Lesson, ProgressLesson, PlacementResult } from '@/types';

interface Props {
  onOpenModule: (moduleId: string) => void;
  onOpenPlacement: () => void;
}

export default function Dashboard({ onOpenModule, onOpenPlacement }: Props) {
  const { stagiaire } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressLesson[]>([]);
  const [placements, setPlacements] = useState<PlacementResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: mods }, { data: secs }, { data: les }, { data: prog }, { data: plac }] = await Promise.all([
        supabase.from('modules').select('*').order('ordre'),
        supabase.from('sections').select('*').order('ordre'),
        supabase.from('lessons').select('*'),
        supabase.from('progress_lessons').select('*').eq('stagiaire_id', stagiaire?.id ?? ''),
        supabase.from('placement_results').select('*').eq('stagiaire_id', stagiaire?.id ?? '').order('created_at', { ascending: false }),
      ]);
      setModules(mods as Module[] ?? []);
      setSections(secs as Section[] ?? []);
      setLessons(les as Lesson[] ?? []);
      setProgress(prog as ProgressLesson[] ?? []);
      setPlacements(plac as PlacementResult[] ?? []);
      setLoading(false);
    })();
  }, [stagiaire?.id]);

  const completedLessonIds = new Set(progress.map((p) => p.lesson_id));
  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((l) => completedLessonIds.has(l.id)).length;
  const overallPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const moduleStats = (moduleId: string) => {
    const modSections = sections.filter((s) => s.module_id === moduleId);
    const sectionIds = new Set(modSections.map((s) => s.id));
    const modLessons = lessons.filter((l) => sectionIds.has(l.section_id));
    const done = modLessons.filter((l) => completedLessonIds.has(l.id)).length;
    return {
      sections: modSections.length,
      lessons: modLessons.length,
      done,
      pct: modLessons.length ? Math.round((done / modLessons.length) * 100) : 0,
    };
  };

  const hasPlacement = placements.length > 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Greeting */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
          Bonjour {stagiaire?.prenom} 👋
        </h1>
        <p className="text-slate-500 mt-1">Reprenez votre formation là où vous l'avez laissée.</p>
      </div>

      {/* Placement banner */}
      {!hasPlacement && (
        <div className="card p-5 sm:p-6 bg-gradient-to-br from-brand-600 to-brand-800 text-white border-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="grid place-items-center h-11 w-11 rounded-xl bg-white/15 ring-1 ring-white/20 shrink-0">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold">Test de positionnement</h2>
                <p className="text-sm text-white/80 mt-0.5 max-w-md">
                  Évaluez votre niveau initial avant de commencer. Cela ne prend que quelques minutes.
                </p>
              </div>
            </div>
            <button onClick={onOpenPlacement} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 hover:bg-white/90 transition shrink-0">
              Commencer <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={BookOpen} label="Modules" value={modules.length} color="brand" />
        <StatCard icon={CheckCircle2} label="Leçons terminées" value={`${completedLessons}/${totalLessons}`} color="emerald" />
        <StatCard icon={TrendingUp} label="Progression globale" value={`${overallPct}%`} color="amber" />
        <StatCard icon={ClipboardList} label="Tests positionnement" value={placements.length} color="rose" />
      </div>

      {/* Modules */}
      <div>
        <h2 className="font-display text-xl font-bold text-slate-900 mb-4">Mes modules</h2>
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-40 rounded-2xl bg-white ring-1 ring-slate-100 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {modules.map((m) => {
              const Icon = getModuleIcon(m.icone);
              const color = getColor(m.couleur);
              const stats = moduleStats(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => onOpenModule(m.id)}
                  className="card p-5 text-left group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`grid place-items-center h-12 w-12 rounded-2xl bg-gradient-to-br ${color.gradient} text-white shadow-sm`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900">{m.titre}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{m.description}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                    <span>{stats.sections} sections</span>
                    <span>·</span>
                    <span>{stats.lessons} leçons</span>
                  </div>
                  {stats.lessons > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500">Progression</span>
                        <span className="font-semibold text-slate-700">{stats.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full ${color.bg} transition-all duration-500`} style={{ width: `${stats.pct}%` }} />
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
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
