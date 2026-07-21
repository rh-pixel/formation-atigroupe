import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, LogOut, Home, ClipboardList, BarChart3, Menu, X, type LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
  current: string;
  onNavigate: (view: string) => void;
  children: ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const STAGIAIRE_NAV: NavItem[] = [
  { id: 'dashboard', label: 'Accueil', icon: Home },
  { id: 'placement', label: 'Tests de positionnement', icon: ClipboardList },
  { id: 'progress', label: 'Ma progression', icon: BarChart3 },
];

const FORMATEUR_NAV: NavItem[] = [
  { id: 'overview', label: 'Vue d’ensemble', icon: Home },
  { id: 'results', label: 'Résultats de positionnement', icon: ClipboardList },
];

export default function AppShell({ current, onNavigate, children }: Props) {
  const { role, stagiaire, formateur, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isFormateur = role === 'formateur';
  const nav = isFormateur ? FORMATEUR_NAV : STAGIAIRE_NAV;

  const displayName = isFormateur
    ? `${formateur?.prenom ?? ''} ${formateur?.nom ?? ''}`
    : `${stagiaire?.prenom ?? ''} ${stagiaire?.nom ?? ''}`;
  const displaySub = isFormateur ? 'Formateur' : stagiaire?.code_stagiaire ?? '';
  const avatarInitials = `${(isFormateur ? formateur?.prenom : stagiaire?.prenom)?.[0] ?? ''}${(isFormateur ? formateur?.nom : stagiaire?.nom)?.[0] ?? ''}`.toUpperCase();

  const accent = isFormateur
    ? { logo: 'bg-indigo-600', active: 'bg-indigo-50 text-indigo-700', avatar: 'bg-indigo-100 text-indigo-700' }
    : { logo: 'bg-brand-600', active: 'bg-brand-50 text-brand-700', avatar: 'bg-brand-100 text-brand-700' };

  const homeId = nav[0].id;

  const go = (id: string) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => go(homeId)} className="flex items-center gap-2.5">
            <div className={`grid place-items-center h-9 w-9 rounded-xl text-white ${accent.logo}`}>
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-slate-900 leading-tight">ATI Groupe Hub</p>
              <p className="text-[11px] text-slate-500 leading-tight">
                {isFormateur ? 'Espace formateur' : 'Plateforme de formation'}
              </p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  current === n.id ? accent.active : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className={`grid place-items-center h-9 w-9 rounded-full font-semibold text-sm ${accent.avatar}`}>
                {avatarInitials}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 leading-tight">{displayName}</p>
                <p className="text-[11px] text-slate-500 leading-tight">{displaySub}</p>
              </div>
            </div>
            <button onClick={logout} title="Se déconnecter" className="grid place-items-center h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition">
              <LogOut className="h-4 w-4" />
            </button>
            <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden grid place-items-center h-9 w-9 rounded-lg text-slate-600 hover:bg-slate-100">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  current === n.id ? accent.active : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      <footer className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-center text-xs text-slate-400">
        ATI Groupe Hub — {isFormateur ? 'Suivi des stagiaires' : 'Plateforme de formation pour stagiaires'}
      </footer>
    </div>
  );
}
