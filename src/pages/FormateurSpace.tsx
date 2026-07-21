import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { getModuleIcon, getColor } from '@/lib/theme';
import {
  Users, ClipboardList, Award, TrendingUp, Search, Download,
  Calendar, GraduationCap, Inbox,
} from 'lucide-react';
import type { Stagiaire, PlacementTest, PlacementResult, Module } from '@/types';

interface Props {
  tab: 'overview' | 'results';
}

interface EnrichedResult extends PlacementResult {
  stagiaireNom: string;
  stagiaireCode: string;
  testTitre: string;
  moduleColor: string;
  moduleIcon: string;
  pct: number;
}

export default function FormateurSpace({ tab }: Props) {
  const { formateur } = useAuth();
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [tests, setTests] = useState<PlacementTest[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [results, setResults] = useState<PlacementResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: t }, { data: m }, { data: r }] = await Promise.all([
        supabase.from('stagiaires').select('*').order('created_at', { ascending: false }),
        supabase.from('placement_tests').select('*'),
        supabase.from('modules').select('*'),
        supabase.from('placement_results').select('*').order('created_at', { ascending: false }),
      ]);
      setStagiaires(s as Stagiaire[] ?? []);
      setTests(t as PlacementTest[] ?? []);
      setModules(m as Module[] ?? []);
      setResults(r as PlacementResult[] ?? []);
      setLoading(false);
    })();
  }, []);

  const enriched: EnrichedResult[] = useMemo(() => {
    return results.map((r) => {
      const st = stagiaires.find((s) => s.id === r.stagiaire_id);
      const test = tests.find((t) => t.id === r.placement_test_id);
      const mod = test ? modules.find((m) => m.id === test.module_id) : undefined;
      return {
        ...r,
        stagiaireNom: st ? `${st.prenom} ${st.nom}` : 'Stagiaire supprimé',
        stagiaireCode: st?.code_stagiaire ?? '—',
        testTitre: test?.titre ?? 'Test supprimé',
        moduleColor: mod?.couleur ?? 'blue',
        moduleIcon: mod?.icone ?? 'ClipboardList',
        pct: r.total > 0 ? Math.round((r.score / r.total) * 100) : 0,
      };
    });
  }, [results, stagiaires, tests, modules]);

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in-up">
        <div className="h-24 rounded-2xl bg-white ring-1 ring-slate-100 animate-pulse" />
        <div className="grid sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-2xl bg-white ring-1 ring-slate-100 animate-pulse" />)}
        </div>
      </div>
    );
  }

  return tab === 'overview'
    ? <Overview formateur={formateur?.prenom ?? ''} stagiaires={stagiaires} tests={tests} modules={modules} enriched={enriched} />
    : <ResultsRegister tests={tests} enriched={enriched} />;
}

// ============ VUE D'ENSEMBLE ============
function Overview({
  formateur, stagiaires, tests, modules, enriched,
}: {
  formateur: string;
  stagiaires: Stagiaire[];
  tests: PlacementTest[];
  modules: Module[];
  enriched: EnrichedResult[];
}) {
  const nbEvalues = new Set(enriched.map((e) => e.stagiaire_id)).size;
  const avgPct = enriched.length
    ? Math.round(enriched.reduce((acc, e) => acc + e.pct, 0) / enriched.length)
    : 0;

  const stats = [
    { icon: Users, label: 'Stagiaires', value: String(stagiaires.length), tint: 'text-brand-600 bg-brand-50' },
    { icon: ClipboardList, label: 'Tests passés', value: String(enriched.length), tint: 'text-indigo-600 bg-indigo-50' },
    { icon: GraduationCap, label: 'Stagiaires évalués', value: `${nbEvalues}/${stagiaires.length}`, tint: 'text-emerald-600 bg-emerald-50' },
    { icon: TrendingUp, label: 'Score moyen', value: `${avgPct}%`, tint: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
          Bonjour {formateur} 👋
        </h1>
        <p className="text-slate-500 mt-1">Vue d’ensemble du suivi de vos stagiaires.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`grid place-items-center h-10 w-10 rounded-xl ${s.tint}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Par test de positionnement */}
      <div>
        <h2 className="font-display text-lg font-bold text-slate-900 mb-3">Par test de positionnement</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((t) => {
            const mod = modules.find((m) => m.id === t.module_id);
            const Icon = mod ? getModuleIcon(mod.icone) : ClipboardList;
            const color = getColor(mod?.couleur ?? 'blue');
            const rows = enriched.filter((e) => e.placement_test_id === t.id);
            const avg = rows.length ? Math.round(rows.reduce((a, e) => a + e.pct, 0) / rows.length) : 0;
            return (
              <div key={t.id} className="card p-5">
                <div className="flex items-center gap-3">
                  <div className={`grid place-items-center h-11 w-11 rounded-2xl bg-gradient-to-br ${color.gradient} text-white shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">{t.titre}</h3>
                    <p className="text-xs text-slate-500">{rows.length} passage{rows.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Score moyen</span>
                    <span className="font-semibold text-slate-700">{avg}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full ${pctBar(avg)}`} style={{ width: `${avg}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Derniers résultats */}
      <div>
        <h2 className="font-display text-lg font-bold text-slate-900 mb-3">Derniers résultats enregistrés</h2>
        {enriched.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="card divide-y divide-slate-100">
            {enriched.slice(0, 6).map((e) => (
              <div key={e.id} className="flex items-center gap-4 p-4">
                <div className="grid place-items-center h-9 w-9 rounded-full bg-brand-100 text-brand-700 font-semibold text-xs shrink-0">
                  {initials(e.stagiaireNom)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 truncate">{e.stagiaireNom}</p>
                  <p className="text-xs text-slate-500 truncate">{e.testTitre}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900">{e.score}/{e.total}</p>
                  <span className={`badge ${pctColor(e.pct)}`}>{e.level ?? levelLabel(e.pct)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ REGISTRE DES RÉSULTATS ============
function ResultsRegister({ tests, enriched }: { tests: PlacementTest[]; enriched: EnrichedResult[] }) {
  const [query, setQuery] = useState('');
  const [testFilter, setTestFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter((e) => {
      if (testFilter !== 'all' && e.placement_test_id !== testFilter) return false;
      if (!q) return true;
      return (
        e.stagiaireNom.toLowerCase().includes(q) ||
        e.stagiaireCode.toLowerCase().includes(q) ||
        e.testTitre.toLowerCase().includes(q)
      );
    });
  }, [enriched, query, testFilter]);

  const exportCsv = () => {
    const header = ['Stagiaire', 'Code', 'Test', 'Score', 'Total', 'Pourcentage', 'Niveau', 'Date'];
    const rows = filtered.map((e) => [
      e.stagiaireNom,
      e.stagiaireCode,
      e.testTitre,
      String(e.score),
      String(e.total),
      `${e.pct}%`,
      e.level ?? levelLabel(e.pct),
      formatDate(e.created_at),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';'))
      .join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tests_positionnement_stagiaires.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">Résultats de positionnement</h1>
          <p className="text-slate-500 mt-1">
            Enregistrés automatiquement dès qu’un stagiaire termine un test.
          </p>
        </div>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" /> Exporter (CSV)
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="input pl-10"
            placeholder="Rechercher un stagiaire, un code, un test…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-72"
          value={testFilter}
          onChange={(e) => setTestFilter(e.target.value)}
        >
          <option value="all">Tous les tests</option>
          {tests.map((t) => <option key={t.id} value={t.id}>{t.titre}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Tableau (desktop) */}
          <div className="card overflow-hidden hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3 font-medium">Stagiaire</th>
                  <th className="px-4 py-3 font-medium">Test</th>
                  <th className="px-4 py-3 font-medium text-center">Score</th>
                  <th className="px-4 py-3 font-medium text-center">Niveau</th>
                  <th className="px-4 py-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid place-items-center h-8 w-8 rounded-full bg-brand-100 text-brand-700 font-semibold text-xs shrink-0">
                          {initials(e.stagiaireNom)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{e.stagiaireNom}</p>
                          <p className="text-xs text-slate-400">{e.stagiaireCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{e.testTitre}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-slate-900">{e.score}/{e.total}</span>
                      <span className="text-slate-400 text-xs ml-1">({e.pct}%)</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`badge ${pctColor(e.pct)}`}>{e.level ?? levelLabel(e.pct)}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500 whitespace-nowrap">{formatDate(e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cartes (mobile) */}
          <div className="space-y-3 md:hidden">
            {filtered.map((e) => (
              <div key={e.id} className="card p-4">
                <div className="flex items-center gap-3">
                  <div className="grid place-items-center h-9 w-9 rounded-full bg-brand-100 text-brand-700 font-semibold text-xs shrink-0">
                    {initials(e.stagiaireNom)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 truncate">{e.stagiaireNom}</p>
                    <p className="text-xs text-slate-400">{e.stagiaireCode}</p>
                  </div>
                  <span className={`badge ${pctColor(e.pct)}`}>{e.level ?? levelLabel(e.pct)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-600 truncate pr-2">{e.testTitre}</span>
                  <span className="font-bold text-slate-900 shrink-0">{e.score}/{e.total}</span>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5" /> {formatDate(e.created_at)}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 text-center">
            {filtered.length} résultat{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
          </p>
        </>
      )}
    </div>
  );
}

// ============ HELPERS ============
function EmptyState() {
  return (
    <div className="card p-10 text-center">
      <div className="grid place-items-center h-14 w-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-4">
        <Inbox className="h-7 w-7" />
      </div>
      <p className="font-semibold text-slate-700">Aucun résultat pour l’instant</p>
      <p className="text-sm text-slate-500 mt-1">
        Les résultats apparaîtront automatiquement dès qu’un stagiaire terminera un test de positionnement.
      </p>
    </div>
  );
}

function initials(fullName: string): string {
  return fullName.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function pctColor(pct: number): string {
  if (pct >= 70) return 'bg-emerald-50 text-emerald-700';
  if (pct >= 50) return 'bg-amber-50 text-amber-700';
  return 'bg-rose-50 text-rose-700';
}

function pctBar(pct: number): string {
  if (pct >= 70) return 'bg-emerald-500';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
}

function levelLabel(pct: number): string {
  if (pct >= 85) return 'Avancé';
  if (pct >= 60) return 'Intermédiaire';
  if (pct >= 40) return 'Pré-intermédiaire';
  return 'Débutant';
}
