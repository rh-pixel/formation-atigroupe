import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { Stagiaire } from '@/types';

interface AuthContextValue {
  stagiaire: Stagiaire | null;
  loading: boolean;
  login: (code: string) => Promise<{ error: string | null }>;
  signup: (nom: string, prenom: string, code: string) => Promise<{ error: string | null }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'ati_hub_stagiaire_id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [stagiaire, setStagiaire] = useState<Stagiaire | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const id = localStorage.getItem(STORAGE_KEY);
      if (!id) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('stagiaires')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      setStagiaire(data as Stagiaire | null);
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (code: string) => {
    const { data, error } = await supabase
      .from('stagiaires')
      .select('*')
      .eq('code_stagiaire', code.trim())
      .maybeSingle();
    if (error) return { error: 'Erreur de connexion.' };
    if (!data) return { error: 'Code stagiaire introuvable.' };
    localStorage.setItem(STORAGE_KEY, data.id);
    setStagiaire(data as Stagiaire);
    return { error: null };
  };

  const signup = async (nom: string, prenom: string, code: string) => {
    const trimmedCode = code.trim();
    if (!nom.trim() || !prenom.trim() || !trimmedCode) {
      return { error: 'Tous les champs sont obligatoires.' };
    }
    const { data: existing } = await supabase
      .from('stagiaires')
      .select('id')
      .eq('code_stagiaire', trimmedCode)
      .maybeSingle();
    if (existing) return { error: 'Ce code stagiaire est déjà utilisé.' };
    const { data, error } = await supabase
      .from('stagiaires')
      .insert({ nom: nom.trim(), prenom: prenom.trim(), code_stagiaire: trimmedCode })
      .select()
      .single();
    if (error || !data) return { error: 'Erreur lors de la création du compte.' };
    localStorage.setItem(STORAGE_KEY, data.id);
    setStagiaire(data as Stagiaire);
    return { error: null };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStagiaire(null);
  };

  return (
    <AuthContext.Provider value={{ stagiaire, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
