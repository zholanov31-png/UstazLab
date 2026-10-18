import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from '../context/AuthContext';
import { courseModules } from '../data/modules';

// Ағымдағы пайдаланушының барлық прогресін бір жерден жүктейді.
export function useProgress() {
  const { user } = useAuth();
  const [state, setState] = useState({
    loading: true,
    error: null,
    pre: null,
    post: null,
    completedModules: [],
  });

  const load = useCallback(async () => {
    if (!user) return;
    setState((s) => ({ ...s, loading: true, error: null }));

    const [attemptsRes, reflectionsRes] = await Promise.all([
      supabase.from('assessment_attempts').select('kind, scores, self_ratings, completed_at').eq('user_id', user.id),
      supabase.from('reflections').select('module_id').eq('user_id', user.id),
    ]);

    const error = attemptsRes.error || reflectionsRes.error;
    if (error) {
      setState((s) => ({ ...s, loading: false, error }));
      return;
    }

    const attempts = attemptsRes.data || [];
    setState({
      loading: false,
      error: null,
      pre: attempts.find((a) => a.kind === 'pre') || null,
      post: attempts.find((a) => a.kind === 'post') || null,
      completedModules: (reflectionsRes.data || []).map((r) => r.module_id),
    });
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const allModulesDone = courseModules.every((m) => state.completedModules.includes(m.id));
  // Келесі ашық модуль: аяқталғандардан кейінгі біріншісі
  const unlockedModuleId =
    courseModules.find((m) => !state.completedModules.includes(m.id))?.id ?? null;

  return {
    ...state,
    allModulesDone,
    unlockedModuleId,
    canStartModules: Boolean(state.pre),
    canTakePost: Boolean(state.pre) && allModulesDone && !state.post,
    reload: load,
  };
}
