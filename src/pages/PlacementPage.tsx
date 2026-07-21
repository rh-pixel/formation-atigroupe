import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { getModuleIcon, getColor } from '@/lib/theme';
import {
  ClipboardList, ArrowLeft, ChevronRight, Check, X, Trophy, RotateCcw,
  Lightbulb, GraduationCap, Award,
} from 'lucide-react';
import type { PlacementTest, PlacementQuestion, PlacementResult, Module } from '@/types';

interface Props {
  onBack: () => void;
}

export default function PlacementPage({ onBack }: Props) {
  const { stagiaire } = useAuth();
  const [tests, setTests] = useState<PlacementTest[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [results, setResults] = useState<PlacementResult[]>([]);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const sid = stagiaire?.id ?? '';
    const [{ data: t }, { data: m }, { data: r }] = await Promise.all([
      supabase.from('placement_tests').select('*'),
      supabase.from('modules').select('*'),
      supabase.from('placement_results').select('*').eq('stagiaire_id', sid).order('created_at', { ascending: false }),
    ]);
    setTests(t as PlacementTest[] ?? []);
    setModules(m as Module[] ?? []);
    setResults(r as PlacementResult[] ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [stagiaire?.id]);

  const resultForTest = (testId: string) => results.find((r) => r.placement_test_id === testId);

  if (activeTestId) {
    return (
      <PlacementRunner
        testId={activeTestId}
        stagiaireId={stagiaire?.id ?? ''}
        onExit={() => { setActiveTestId(null); load(); }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition">
        <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
      </button>

      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">Tests de positionnement</h1>
        <p className="text-slate-500 mt-1">Évaluez votre niveau initial dans chaque domaine.</p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 rounded-2xl bg-white ring-1 ring-slate-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {tests.map((t) => {
            const mod = modules.find((m) => m.id === t.module_id);
            const Icon = mod ? getModuleIcon(mod.icone) : ClipboardList;
            const color = mod ? getColor(mod.couleur) : getColor('blue');
            const res = resultForTest(t.id);
            return (
              <div key={t.id} className="card p-5">
                <div className="flex items-start gap-4">
                  <div className={`grid place-items-center h-12 w-12 rounded-2xl bg-gradient-to-br ${color.gradient} text-white shrink-0`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-bold text-slate-900">{t.titre}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{t.description}</p>
                  </div>
                </div>
                {res ? (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-500" />
                        <span className="text-sm font-semibold text-slate-700">Score : {res.score}/{res.total}</span>
                      </div>
                      <span className={`badge ${pctColor(res.score, res.total)}`}>{levelLabel(res.score, res.total)}</span>
                    </div>
                    {res.level && <p className="text-xs text-slate-500 mt-2">Niveau estimé : {res.level}</p>}
                    <button
                      onClick={() => setActiveTestId(t.id)}
                      className="btn-ghost w-full mt-3"
                    >
                      <RotateCcw className="h-4 w-4" /> Refaire le test
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveTestId(t.id)}
                    className="btn-primary w-full mt-4"
                  >
                    Commencer le test <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============ RUNNER ============
function PlacementRunner({ testId, stagiaireId, onExit }: { testId: string; stagiaireId: string; onExit: () => void }) {
  const [test, setTest] = useState<PlacementTest | null>(null);
  const [questions, setQuestions] = useState<PlacementQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: t }, { data: q }] = await Promise.all([
        supabase.from('placement_tests').select('*').eq('id', testId).maybeSingle(),
        supabase.from('placement_questions').select('*').eq('placement_test_id', testId).order('ordre'),
      ]);
      setTest(t as PlacementTest | null);
      const list = q as PlacementQuestion[] ?? [];
      setQuestions(list);
      setAnswers(new Array(list.length).fill(null));
      setLoading(false);
    })();
  }, [testId]);

  if (loading) return <div className="h-64 rounded-2xl bg-white ring-1 ring-slate-100 animate-pulse" />;

  if (submitted) {
    const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct_index ? 1 : 0), 0);
    const pct = Math.round((score / questions.length) * 100);
    const level = levelLabel(score, questions.length);
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
        <div className="card p-8 text-center">
          <div className={`grid place-items-center h-20 w-20 rounded-3xl mx-auto mb-4 ${pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'} text-white`}>
            <Trophy className="h-10 w-10" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Test terminé !</h2>
          <p className="text-slate-500 mt-1">{test?.titre}</p>
          <div className="mt-6 flex items-center justify-center gap-6">
            <div>
              <p className="text-3xl font-bold text-slate-900">{score}/{questions.length}</p>
              <p className="text-xs text-slate-500 mt-1">Bonnes réponses</p>
            </div>
            <div className="h-12 w-px bg-slate-200" />
            <div>
              <p className="text-3xl font-bold text-slate-900">{pct}%</p>
              <p className="text-xs text-slate-500 mt-1">Score</p>
            </div>
            <div className="h-12 w-px bg-slate-200" />
            <div>
              <p className="text-3xl font-bold text-slate-900">{level}</p>
              <p className="text-xs text-slate-500 mt-1">Niveau</p>
            </div>
          </div>
          <button onClick={onExit} className="btn-primary mt-8">
            Retour aux tests <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Review */}
        <div className="space-y-3">
          <h3 className="font-display text-lg font-bold text-slate-900">Correction</h3>
          {questions.map((q, i) => {
            const correct = answers[i] === q.correct_index;
            return (
              <div key={q.id} className="card p-4">
                <div className="flex items-start gap-2 mb-2">
                  {correct ? <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" /> : <X className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />}
                  <p className="font-medium text-slate-900 text-sm">{q.question}</p>
                </div>
                <p className="text-xs text-slate-500 ml-7">Bonne réponse : {q.options[q.correct_index]}</p>
                {q.explanation && (
                  <div className="mt-2 flex items-start gap-2 ml-7 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" />
                    <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  const submit = async () => {
    const score = questions.reduce((acc, qq, i) => acc + (answers[i] === qq.correct_index ? 1 : 0), 0);
    const level = levelLabel(score, questions.length);
    await supabase.from('placement_results').insert({
      stagiaire_id: stagiaireId,
      placement_test_id: testId,
      score,
      total: questions.length,
      level,
      answers,
    });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-xl font-bold text-slate-900">{test?.titre}</h1>
          <span className="text-sm text-slate-500">{current + 1} / {questions.length}</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-brand-600 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {q && (
        <div className="card p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <GraduationCap className="h-4 w-4" /> Question {current + 1}
          </div>
          <p className="font-display text-xl font-bold text-slate-900 mb-6">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[current] === oi;
              return (
                <button
                  key={oi}
                  onClick={() => setAnswers((a) => { const n = [...a]; n[current] = oi; return n; })}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm text-left transition border ${
                    selected ? 'border-brand-300 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className={`grid place-items-center h-7 w-7 rounded-full text-xs font-semibold shrink-0 ${
                    selected ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrent((v) => Math.max(0, v - 1))}
              disabled={current === 0}
              className="btn-ghost"
            >
              Précédent
            </button>
            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent((v) => v + 1)}
                disabled={answers[current] === null}
                className="btn-primary"
              >
                Suivant <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={answers.some((a) => a === null)}
                className="btn-primary"
              >
                Terminer le test
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function pctColor(score: number, total: number): string {
  const pct = (score / total) * 100;
  if (pct >= 70) return 'bg-emerald-50 text-emerald-700';
  if (pct >= 50) return 'bg-amber-50 text-amber-700';
  return 'bg-rose-50 text-rose-700';
}

function levelLabel(score: number, total: number): string {
  const pct = (score / total) * 100;
  if (pct >= 85) return 'Avancé';
  if (pct >= 60) return 'Intermédiaire';
  if (pct >= 40) return 'Pré-intermédiaire';
  return 'Débutant';
}
