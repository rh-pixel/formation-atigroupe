import { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AuthPage from '@/pages/AuthPage';
import AppShell from '@/components/AppShell';
import Dashboard from '@/pages/Dashboard';
import ModuleView from '@/pages/ModuleView';
import SectionView from '@/pages/SectionView';
import PlacementPage from '@/pages/PlacementPage';
import ProgressPage from '@/pages/ProgressPage';

type View =
  | { name: 'dashboard' }
  | { name: 'module'; moduleId: string }
  | { name: 'section'; sectionId: string; moduleId: string }
  | { name: 'placement' }
  | { name: 'progress' };

function AppContent() {
  const { stagiaire, loading } = useAuth();
  const [view, setView] = useState<View>({ name: 'dashboard' });

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <div className="text-slate-400 text-sm">Chargement…</div>
      </div>
    );
  }

  if (!stagiaire) return <AuthPage />;

  const navigate = (v: string) => {
    if (v === 'dashboard') setView({ name: 'dashboard' });
    else if (v === 'placement') setView({ name: 'placement' });
    else if (v === 'progress') setView({ name: 'progress' });
  };

  const currentNav = view.name === 'module' || view.name === 'section' ? 'dashboard' : view.name;

  return (
    <AppShell current={currentNav} onNavigate={navigate}>
      {view.name === 'dashboard' && (
        <Dashboard
          onOpenModule={(id) => setView({ name: 'module', moduleId: id })}
          onOpenPlacement={() => setView({ name: 'placement' })}
        />
      )}
      {view.name === 'module' && (
        <ModuleView
          moduleId={view.moduleId}
          onBack={() => setView({ name: 'dashboard' })}
          onOpenSection={(id) => setView({ name: 'section', sectionId: id, moduleId: view.moduleId })}
        />
      )}
      {view.name === 'section' && (
        <SectionView
          sectionId={view.sectionId}
          onBack={() => setView({ name: 'module', moduleId: view.moduleId })}
        />
      )}
      {view.name === 'placement' && (
        <PlacementPage onBack={() => setView({ name: 'dashboard' })} />
      )}
      {view.name === 'progress' && (
        <ProgressPage
          onBack={() => setView({ name: 'dashboard' })}
          onOpenModule={(id) => setView({ name: 'module', moduleId: id })}
        />
      )}
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
