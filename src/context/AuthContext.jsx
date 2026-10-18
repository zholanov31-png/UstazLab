import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, group_code, created_at')
      .eq('id', userId)
      .maybeSingle();
    if (!error) setProfile(data);
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      await loadProfile(data.session?.user?.id);
      if (active) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      // Supabase ұсынысы: callback ішінде тікелей await жасамау
      setTimeout(() => loadProfile(newSession?.user?.id), 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email: email.trim(), password });

  const signUp = ({ email, password, fullName, role, groupCode }) =>
    supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim(), role, group_code: groupCode?.trim() || null },
        emailRedirectTo: window.location.origin + '/app',
      },
    });

  const signOut = () => supabase.auth.signOut();

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    isResearcher: profile?.role === 'researcher',
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile: () => loadProfile(session?.user?.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
