import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types';
import { GraduationCap, LogIn, UserPlus, AlertCircle, Sparkles, BarChart3, Users, ClipboardList } from 'lucide-react';

export default function AuthPage() {
  const { loginStagiaire, signupStagiaire, loginFormateur } = useAuth();
  const [role, setRole] = useState<Role>('stagiaire');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const switchRole = (r: Role) => {
    setRole(r);
    setMode('login');
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = role === 'formateur'
      ? await loginFormateur(code)
      : mode === 'login'
        ? await loginStagiaire(code)
        : await signupStagiaire(nom, prenom, code);
    setSubmitting(false);
    if (res.error) setError(res.error);
  };

  const isFormateur = role === 'formateur';

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br ${
      isFormateur ? 'from-slate-950 via-indigo-900 to-indigo-700' : 'from-brand-950 via-brand-800 to-brand-600'
    }`}>
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Brand panel */}
        <div className="hidden lg:flex flex-col gap-6 text-white">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center h-12 w-12 rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/20">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <p className="font-display text-xl font-bold leading-tight">ATI Groupe Hub</p>
              <p className="text-sm text-white/70">Plateforme de formation</p>
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight">
            {isFormateur ? (
              <>Suivez vos stagiaires,<br />pilotez leurs résultats.</>
            ) : (
              <>Apprenez à votre rythme,<br />suivez votre progression.</>
            )}
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-md">
            {isFormateur
              ? 'Consultez les tests de positionnement de vos stagiaires, enregistrés automatiquement, et suivez leur niveau en un coup d’œil.'
              : 'Accédez à vos modules de formation, réalisez des exercices et des quiz, et évaluez votre niveau grâce aux tests de positionnement.'}
          </p>
          <ul className="space-y-3 text-white/90">
            {(isFormateur
              ? [
                  { icon: Users, text: 'Vue d’ensemble de tous les stagiaires' },
                  { icon: ClipboardList, text: 'Résultats de positionnement automatiques' },
                  { icon: BarChart3, text: 'Niveaux et scores centralisés' },
                ]
              : [
                  { icon: Sparkles, text: 'Modules structurés par sections' },
                  { icon: GraduationCap, text: 'Leçons, exercices et quiz interactifs' },
                  { icon: BarChart3, text: 'Suivi de progression en temps réel' },
                ]
            ).map((f, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="grid place-items-center h-9 w-9 rounded-xl bg-white/10 ring-1 ring-white/15">
                  <f.icon className="h-5 w-5" />
                </span>
                <span className="text-sm">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form panel */}
        <div className="card p-6 sm:p-8 animate-fade-in-up">
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="grid place-items-center h-11 w-11 rounded-xl bg-brand-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-slate-900">ATI Groupe Hub</p>
              <p className="text-xs text-slate-500">Plateforme de formation</p>
            </div>
          </div>

          {/* Role switch */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-4">
            <button
              type="button"
              onClick={() => switchRole('stagiaire')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                role === 'stagiaire' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <GraduationCap className="h-4 w-4" /> Stagiaire
            </button>
            <button
              type="button"
              onClick={() => switchRole('formateur')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                role === 'formateur' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users className="h-4 w-4" /> Formateur
            </button>
          </div>

          {/* Login / signup tabs (stagiaire only) */}
          {!isFormateur && (
            <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  mode === 'login' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <LogIn className="h-4 w-4" /> Connexion
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  mode === 'signup' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <UserPlus className="h-4 w-4" /> Inscription
              </button>
            </div>
          )}

          <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">
            {isFormateur ? 'Espace formateur' : mode === 'login' ? 'Bon retour !' : 'Créez votre compte'}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {isFormateur
              ? 'Saisissez votre code formateur pour accéder au suivi des stagiaires.'
              : mode === 'login'
                ? 'Saisissez votre code stagiaire pour accéder à vos modules.'
                : 'Renseignez votre nom, prénom et choisissez un code stagiaire personnel.'}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {!isFormateur && mode === 'signup' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom</label>
                  <input className="input" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Dupont" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Prénom</label>
                  <input className="input" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Marie" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {isFormateur ? 'Code formateur' : 'Code stagiaire'}
              </label>
              <input
                className="input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={isFormateur ? 'ex: FORM-2026' : 'ex: ATI-2026-001'}
                autoComplete="off"
              />
              {!isFormateur && mode === 'signup' && (
                <p className="mt-1.5 text-xs text-slate-400">Ce code vous servira d'identifiant à chaque connexion.</p>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${
                isFormateur ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-brand-600 hover:bg-brand-700'
              }`}
              disabled={submitting}
            >
              {submitting ? 'Veuillez patienter…' : isFormateur ? 'Accéder à l’espace formateur' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            ATI Groupe Hub — {isFormateur ? 'Suivi des stagiaires' : 'Formation des stagiaires'}
          </p>
        </div>
      </div>
    </div>
  );
}
