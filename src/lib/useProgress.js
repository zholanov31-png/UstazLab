import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from '../context/AuthContext';
import { courseModules } from '../data/modules';

// Бақылау тобының коды "CTRL" деп басталады (мысалы: CTRL, CTRL-3A).
export const isControlGroup = (code) => Boolean(code && code.toUpperCase().startsWith('CTRL'));

// Ағымдағы пайдаланушының барлық прогресін бір жерден жүктейді.
export function useProgress() {
  const { user, profile } = useAuth();
  const groupCode = profile?.group_code || null;
  const isControl = isControlGroup(groupCode);

  const [state, setState] = useState({
    loading: true,
    error: null,
    pre: null,
    post: null,
    completedModules: [],
    postOpen: false,
  });

  const load = useCallback(async () => {
    if (!user) return;
    setState((s) => ({ ...s, loading: true, error: null }));

    const [attemptsRes, reflectionsRes, settingsRes] = await Promise.all([
      supabase.from('assessment_attempts').select('kind, scores, self_ratings, completed_at').eq('user_id', user.id),
      supabase.from('reflections').select('module_id').eq('user_id', user.id),
      groupCode
        ? supabase.from('group_settings').select('post_open').eq('group_code', groupCode).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);

    const error = attemptsRes.error || reflectionsRes.error || settingsRes.error;
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
      postOpen: Boolean(settingsRes.data?.post_open),
    });
  }, [user, groupCode]);

  useEffect(() => {
    load();
  }, [load]);

  const allModulesDone = courseModules.every((m) => state.completedModules.includes(m.id));
  const unlockedModuleId =
    courseModules.find((m) => !state.completedModules.includes(m.id))?.id ?? null;

  // Эксперимент тобы: pre → модульдер → post.
  // Бақылау тобы: pre → (күту) → зерттеуші ашқанда post → содан кейін ғана модульдер.
  const canStartModules = isControl ? Boolean(state.pre && state.post) : Boolean(state.pre);
  const canTakePost = isControl
    ? Boolean(state.pre) && state.postOpen && !state.post
    : Boolean(state.pre) && allModulesDone && !state.post;

  return {
    ...state,
    isControl,
    groupCode,
    allModulesDone,
    unlockedModuleId,
    canStartModules,
    canTakePost,
    reload: load,
  };
}
