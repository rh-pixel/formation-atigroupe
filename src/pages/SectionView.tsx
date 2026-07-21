import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import {
  ArrowLeft, BookOpen, FileQuestion, Brain, CheckCircle2, Circle,
  ChevronRight, ChevronLeft, Trophy, RotateCcw, Check, X, Lightbulb,
} from 'lucide-react';
import type { Section, Lesson, QcmItem, ProgressLesson } from '@/types';

interface Props {
  sectionId: string;
  onBack: () => void;
}

type Tab = 'lessons' | 'exercises' | 'quiz';

export default function SectionView({ sectionId, onBack }: Props) {
  const { stagiaire } = useAuth();
  const [section, setSection] = useState<Section | null>(null);
  const [tab, setTab] = useState<Tab>('lessons');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('sections').select('*').eq('id', sectionId).maybeSingle();
      setSection(data as Section | null);
      setLoading(false);
    })();
  }, [sectionId]);

  const tabs = [
    { id: 'lessons' as Tab, label: 'Leçons', icon: BookOpen },
    { id: 'exercises' as Tab, label: 'Exercices', icon: FileQuestion },
    { id: 'quiz' as Tab, label: 'Quiz', icon: Brain },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition">
        <ArrowLeft className="h-4 w-4" /> Retour au module
      </button>

      {loading ? (
        <div className="h-24 rounded-2xl bg-white ring-1 ring-slate-100 animate-pulse" />
      ) : section && (
        <div className="card p-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">{section.titre}</h1>
          {section.description && <p className="text-slate-500 mt-1">{section.description}</p>}
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-xl bg-slate-100 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
              tab === t.id ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <t.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === 'lessons' && <LessonsTab sectionId={sectionId} stagiaireId={stagiaire?.id ?? ''} />}
      {tab === 'exercises' && <QcmTab sectionId={sectionId} stagiaireId={stagiaire?.id ?? ''} kind="exercise" />}
      {tab === 'quiz' && <QcmTab sectionId={sectionId} stagiaireId={stagiaire?.id ?? ''} kind="quiz" />}
    </div>
  );
}

// ============ LESSONS TAB ============
function LessonsTab({ sectionId, stagiaireId }: { sectionId: string; stagiaireId: string }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressLesson[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [{ data: les }, { data: prog }] = await Promise.all([
      supabase.from('lessons').select('*').eq('section_id', sectionId).order('ordre'),
      supabase.from('progress_lessons').select('*').eq('stagiaire_id', stagiaireId),
    ]);
    setLessons(les as Lesson[] ?? []);
    setProgress(prog as ProgressLesson[] ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [sectionId, stagiaireId]);

  const completedIds = new Set(progress.map((p) => p.lesson_id));
  const current = lessons[active];

  const markComplete = async (lessonId: string) => {
    await supabase.from('progress_lessons').upsert({
      stagiaire_id: stagiaireId,
      lesson_id: lessonId,
      completed: true,
    }, { onConflict: 'stagiaire_id,lesson_id' });
    load();
  };

  if (loading) return <div className="h-48 rounded-2xl bg-white ring-1 ring-slate-100 animate-pulse" />;

  if (lessons.length === 0) {
    return (
      <div className="card p-10 text-center">
        <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">Aucune leçon dans cette section pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-4">
      {/* Lesson list */}
      <div className="space-y-2">
        {lessons.map((l, i) => {
          const done = completedIds.has(l.id);
          return (
            <button
              key={l.id}
              onClick={() => setActive(i)}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                i === active ? 'bg-brand-50 ring-1 ring-brand-200' : 'bg-white ring-1 ring-slate-100 hover:ring-slate-200'
              }`}
            >
              {done ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> : <Circle className="h-5 w-5 text-slate-300 shrink-0" />}
              <span className={`font-medium ${i === active ? 'text-brand-700' : 'text-slate-700'}`}>{l.titre}</span>
            </button>
          );
        })}
      </div>

      {/* Lesson content */}
      {current && (
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span>Leçon {active + 1} / {lessons.length}</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">{current.titre}</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{current.contenu}</p>
          </div>
          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              onClick={() => setActive((v) => Math.max(0, v - 1))}
              disabled={active === 0}
              className="btn-ghost"
            >
              <ChevronLeft className="h-4 w-4" /> Précédent
            </button>
            <div className="flex items-center gap-2">
              {!completedIds.has(current.id) && (
                <button onClick={() => markComplete(current.id)} className="btn-primary">
                  <Check className="h-4 w-4" /> Marquer comme lu
                </button>
              )}
              {completedIds.has(current.id) && (
                <span className="badge bg-emerald-50 text-emerald-700 px-3 py-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Lu
                </span>
              )}
            </div>
            <button
              onClick={() => setActive((v) => Math.min(lessons.length - 1, v + 1))}
              disabled={active === lessons.length - 1}
              className="btn-ghost"
            >
              Suivant <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ QCM TAB (exercises + quiz) ============
function QcmTab({ sectionId, stagiaireId, kind }: { sectionId: string; stagiaireId: string; kind: 'exercise' | 'quiz' }) {
  const [items, setItems] = useState<QcmItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  const table = kind === 'exercise' ? 'exercises' : 'quiz_questions';
  const resultTable = kind === 'exercise' ? 'exercise_results' : 'quiz_results';

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from(table).select('*').eq('section_id', sectionId).order('ordre');
      const list = data as QcmItem[] ?? [];
      setItems(list);
      setAnswers(new Array(list.length).fill(null));
      setLoading(false);
    })();
  }, [sectionId, kind]);

  if (loading) return <div className="h-48 rounded-2xl bg-white ring-1 ring-slate-100 animate-pulse" />;

  if (items.length === 0) {
    return (
      <div className="card p-10 text-center">
        {kind === 'exercise' ? <FileQuestion className="h-10 w-10 text-slate-300 mx-auto mb-3" /> : <Brain className="h-10 w-10 text-slate-300 mx-auto mb-3" />}
        <p className="text-slate-500">Aucun {kind === 'exercise' ? 'exercice' : 'quiz'} dans cette section pour le moment.</p>
      </div>
    );
  }

  const score = items.reduce((acc, it, i) => acc + (answers[i] === it.correct_index ? 1 : 0), 0);
  const pct = Math.round((score / items.length) * 100);

  const submit = async () => {
    setSubmitted(true);
    await supabase.from(resultTable).insert({
      stagiaire_id: stagiaireId,
      section_id: sectionId,
      score,
      total: items.length,
      answers,
    });
    setSaved(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setAnswers(new Array(items.length).fill(null));
    setSubmitted(false);
    setSaved(false);
  };

  return (
    <div className="space-y-4">
      {submitted && (
        <div className={`card p-6 ${pct >= 70 ? 'bg-emerald-50' : pct >= 50 ? 'bg-amber-50' : 'bg-rose-50'} border-0`}>
          <div className="flex items-center gap-4">
            <div className={`grid place-items-center h-14 w-14 rounded-2xl ${pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'} text-white`}>
              <Trophy className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900">Résultat : {score}/{items.length} ({pct}%)</h3>
              <p className="text-sm text-slate-600 mt-0.5">
                {pct >= 70 ? 'Excellent travail ! Continuez ainsi.' : pct >= 50 ? 'Bon début, quelques révisions à prévoir.' : 'Reprenez les leçons et réessayez.'}
              </p>
            </div>
            <button onClick={reset} className="btn-ghost ml-auto shrink-0">
              <RotateCcw className="h-4 w-4" /> Recommencer
            </button>
          </div>
        </div>
      )}

      {items.map((item, i) => {
        const userAns = answers[i];
        const isCorrect = submitted && userAns === item.correct_index;
        const isWrong = submitted && userAns !== null && userAns !== item.correct_index;
        return (
          <div key={item.id} className="card p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="grid place-items-center h-7 w-7 rounded-lg bg-slate-100 text-slate-600 text-sm font-semibold shrink-0">{i + 1}</span>
              <p className="font-medium text-slate-900 pt-0.5">{item.question}</p>
            </div>
            <div className="space-y-2">
              {item.options.map((opt, oi) => {
                const selected = userAns === oi;
                const correct = submitted && oi === item.correct_index;
                const wrong = submitted && selected && oi !== item.correct_index;
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => { const n = [...a]; n[i] = oi; return n; })}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-left transition border ${
                      correct ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : wrong ? 'border-rose-300 bg-rose-50 text-rose-800'
                      : selected ? 'border-brand-300 bg-brand-50 text-brand-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className={`grid place-items-center h-6 w-6 rounded-full text-xs font-semibold shrink-0 ${
                      correct ? 'bg-emerald-500 text-white'
                      : wrong ? 'bg-rose-500 text-white'
                      : selected ? 'bg-brand-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                    }`}>
                      {correct ? <Check className="h-4 w-4" /> : wrong ? <X className="h-4 w-4" /> : String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && item.explanation && (isCorrect || isWrong) && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                <span>{item.explanation}</span>
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <div className="sticky bottom-4">
          <button
            onClick={submit}
            disabled={answers.some((a) => a === null)}
            className="btn-primary w-full shadow-lg"
          >
            {answers.some((a) => a === null) ? 'Répondez à toutes les questions' : 'Valider mes réponses'}
          </button>
        </div>
      )}
      {saved && !submitted && null}
    </div>
  );
}
