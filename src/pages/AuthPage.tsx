import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, LogIn, UserPlus, AlertCircle, Sparkles, BarChart3 } from 'lucide-react';

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = mode === 'login'
      ? await login(code)
      : await signup(nom, prenom, code);
    setSubmitting(false);
    if (res.error) setError(res.error);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600 flex items-center justify-center p-4">
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
            Apprenez à votre rythme,<br />suivez votre progression.
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-md">
            Accédez à vos modules de formation, réalisez des exercices et des quiz,
            et évaluez votre niveau grâce aux tests de positionnement.
          </p>
          <ul className="space-y-3 text-white/90">
            {[
              { icon: Sparkles, text: 'Modules structurés par sections' },
              { icon: GraduationCap, text: 'Leçons, exercices et quiz interactifs' },
              { icon: BarChart3, text: 'Suivi de progression en temps réel' },
            ].map((f, i) => (
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

          <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">
            {mode === 'login' ? 'Bon retour !' : 'Créez votre compte'}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {mode === 'login'
              ? 'Saisissez votre code stagiaire pour accéder à vos modules.'
              : 'Renseignez votre nom, prénom et choisissez un code stagiaire personnel.'}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Code stagiaire</label>
              <input
                className="input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ex: ATI-2026-001"
                autoComplete="off"
              />
              {mode === 'signup' && (
                <p className="mt-1.5 text-xs text-slate-400">Ce code vous servira d'identifiant à chaque connexion.</p>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? 'Veuillez patienter…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            ATI Groupe Hub — Formation des stagiaires
          </p>
        </div>
      </div>
    </div>
  );
}
