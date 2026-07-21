import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, LogOut, Home, ClipboardList, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  current: string;
  onNavigate: (view: string) => void;
  children: ReactNode;
}

export default function AppShell({ current, onNavigate, children }: Props) {
  const { stagiaire, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = [
    { id: 'dashboard', label: 'Accueil', icon: Home },
    { id: 'placement', label: 'Tests de positionnement', icon: ClipboardList },
    { id: 'progress', label: 'Ma progression', icon: BarChart3 },
  ];

  const go = (id: string) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => go('dashboard')} className="flex items-center gap-2.5">
            <div className="grid place-items-center h-9 w-9 rounded-xl bg-brand-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-slate-900 leading-tight">ATI Groupe Hub</p>
              <p className="text-[11px] text-slate-500 leading-tight">Plateforme de formation</p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  current === n.id ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="grid place-items-center h-9 w-9 rounded-full bg-brand-100 text-brand-700 font-semibold text-sm">
                {(stagiaire?.prenom?.[0] ?? '').toUpperCase()}{(stagiaire?.nom?.[0] ?? '').toUpperCase()}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800 leading-tight">{stagiaire?.prenom} {stagiaire?.nom}</p>
                <p className="text-[11px] text-slate-500 leading-tight">{stagiaire?.code_stagiaire}</p>
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
                  current === n.id ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
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
        ATI Groupe Hub — Plateforme de formation pour stagiaires
      </footer>
    </div>
  );
}
