import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { Stagiaire, Formateur, Role } from '@/types';

interface AuthContextValue {
  stagiaire: Stagiaire | null;
  formateur: Formateur | null;
  role: Role | null;
  loading: boolean;
  loginStagiaire: (code: string) => Promise<{ error: string | null }>;
  signupStagiaire: (nom: string, prenom: string, code: string) => Promise<{ error: string | null }>;
  loginFormateur: (code: string) => Promise<{ error: string | null }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ROLE_KEY = 'ati_hub_role';
const ID_KEY = 'ati_hub_account_id';
// Ancienne clé (v1) : les stagiaires déjà connectés restent connectés.
const LEGACY_STAGIAIRE_KEY = 'ati_hub_stagiaire_id';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [stagiaire, setStagiaire] = useState<Stagiaire | null>(null);
  const [formateur, setFormateur] = useState<Formateur | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      let storedRole = localStorage.getItem(ROLE_KEY) as Role | null;
      let storedId = localStorage.getItem(ID_KEY);

      // Compatibilité avec l'ancienne clé de session stagiaire.
      if (!storedId) {
        const legacyId = localStorage.getItem(LEGACY_STAGIAIRE_KEY);
        if (legacyId) {
          storedRole = 'stagiaire';
          storedId = legacyId;
        }
      }

      if (!storedId || !storedRole) {
        setLoading(false);
        return;
      }

      if (storedRole === 'formateur') {
        const { data } = await supabase.from('formateurs').select('*').eq('id', storedId).maybeSingle();
        if (data) {
          setFormateur(data as Formateur);
          setRole('formateur');
        }
      } else {
        const { data } = await supabase.from('stagiaires').select('*').eq('id', storedId).maybeSingle();
        if (data) {
          setStagiaire(data as Stagiaire);
          setRole('stagiaire');
        }
      }
      setLoading(false);
    };
    restore();
  }, []);

  const persist = (r: Role, id: string) => {
    localStorage.setItem(ROLE_KEY, r);
    localStorage.setItem(ID_KEY, id);
    localStorage.removeItem(LEGACY_STAGIAIRE_KEY);
  };

  const loginStagiaire = async (code: string) => {
    const { data, error } = await supabase
      .from('stagiaires')
      .select('*')
      .eq('code_stagiaire', code.trim())
      .maybeSingle();
    if (error) return { error: 'Erreur de connexion.' };
    if (!data) return { error: 'Code stagiaire introuvable.' };
    persist('stagiaire', data.id);
    setStagiaire(data as Stagiaire);
    setFormateur(null);
    setRole('stagiaire');
    return { error: null };
  };

  const signupStagiaire = async (nom: string, prenom: string, code: string) => {
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
    persist('stagiaire', data.id);
    setStagiaire(data as Stagiaire);
    setFormateur(null);
    setRole('stagiaire');
    return { error: null };
  };

  const loginFormateur = async (code: string) => {
    const { data, error } = await supabase
      .from('formateurs')
      .select('*')
      .eq('code_formateur', code.trim())
      .maybeSingle();
    if (error) return { error: 'Erreur de connexion.' };
    if (!data) return { error: 'Code formateur introuvable.' };
    persist('formateur', data.id);
    setFormateur(data as Formateur);
    setStagiaire(null);
    setRole('formateur');
    return { error: null };
  };

  const logout = () => {
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(ID_KEY);
    localStorage.removeItem(LEGACY_STAGIAIRE_KEY);
    setStagiaire(null);
    setFormateur(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ stagiaire, formateur, role, loading, loginStagiaire, signupStagiaire, loginFormateur, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
