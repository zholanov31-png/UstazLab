import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from '../context/AuthContext';
import { courseModules } from '../data/modules';
import { computeGame } from '../data/game';

// Бақылау тобының коды "CTRL" деп басталады (мысалы: CTRL, CTRL-3A).
export const isControlGroup = (code) => Boolean(code && code.toUpperCase().startsWith('CTRL'));

// Ағымдағы пайдаланушының барлық прогресін бір жерден жүктейді.
export function useProgress() {
  const { user, profile, isResearcher } = useAuth();
  const groupCode = profile?.group_code || null;
  const isControl = isControlGroup(groupCode);

  const [state, setState] = useState({
    loading: true,
    error: null,
    pre: null,
    post: null,
    completedModules: [],
    submittedModules: [],
    responses: [],
    postOpen: false,
  });

  const load = useCallback(async () => {
    if (!user) return;
    setState((s) => ({ ...s, loading: true, error: null }));

    const [attemptsRes, reflectionsRes, responsesRes, submissionsRes, settingsRes] = await Promise.all([
      supabase.from('assessment_attempts').select('kind, scores, self_ratings, completed_at').eq('user_id', user.id),
      supabase.from('reflections').select('module_id').eq('user_id', user.id),
      supabase.from('module_responses').select('module_id, question_index, option_index').eq('user_id', user.id),
      supabase.from('task_submissions').select('module_id').eq('user_id', user.id),
      groupCode
        ? supabase.from('group_settings').select('post_open').eq('group_code', groupCode).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]);

    const error = attemptsRes.error || reflectionsRes.error || responsesRes.error || submissionsRes.error || settingsRes.error;
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
      submittedModules: (submissionsRes.data || []).map((r) => r.module_id),
      responses: responsesRes.data || [],
      postOpen: Boolean(settingsRes.data?.post_open),
    });
  }, [user, groupCode]);

  useEffect(() => {
    load();
  }, [load]);

  const allModulesDone = courseModules.every((m) => state.completedModules.includes(m.id));
  // Кезекте тұрған модуль: аяқталмағандардың біріншісі (дайын болмаса — «дайындалуда»)
  const nextModule = courseModules.find((m) => !state.completedModules.includes(m.id)) ?? null;

  // Эксперимент тобы: pre → модульдер → post.
  // Бақылау тобы: pre → (күту) → зерттеуші ашқанда post → содан кейін ғана модульдер.
  const canStartModules = isControl ? Boolean(state.pre && state.post) : Boolean(state.pre);
  const canTakePost = isControl
    ? Boolean(state.pre) && state.postOpen && !state.post
    : Boolean(state.pre) && allModulesDone && !state.post;

  // Модульге кіру рұқсаты. Зерттеуші кез келген дайын модульді алдын ала көре алады.
  const moduleAccess = (mod) => {
    const done = state.completedModules.includes(mod.id);
    if (!mod.ready) return { open: false, done, reason: 'notReady' };
    if (isResearcher) return { open: true, done, preview: true };
    if (!canStartModules) return { open: false, done, reason: 'locked' };
    if (done || nextModule?.id === mod.id) return { open: true, done };
    return { open: false, done, reason: 'order' };
  };

  const game = computeGame({
    pre: state.pre,
    post: state.post,
    responses: state.responses,
    submissions: state.submittedModules,
    reflections: state.completedModules,
  });

  return {
    ...state,
    isControl,
    groupCode,
    allModulesDone,
    nextModule,
    canStartModules,
    canTakePost,
    moduleAccess,
    game,
    reload: load,
  };
}
