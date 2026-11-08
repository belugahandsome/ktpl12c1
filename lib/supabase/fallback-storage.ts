'use client';

import {
  UserProfile,
  UserProgress,
  UserVocabularyItem,
  QuizAttempt,
  Vocabulary,
} from '@/lib/types';
import { INITIAL_VOCABULARY } from '@/lib/data/initial-data';
import { isSupabaseConfigured, createClient } from './client';

const DEMO_USER_PROFILE: UserProfile = {
  id: 'demo-student-id',
  email: 'student@englishhub.edu.vn',
  display_name: 'Nguyễn Văn Minh',
  avatar_url: '',
  target_score: 8.5,
  school: 'THPT Chuyên Hà Nội - Amsterdam',
  created_at: new Date().toISOString(),
};

const DEFAULT_PROGRESS: UserProgress = {
  user_id: 'demo-student-id',
  words_learned: 28,
  grammar_completed: 6,
  exercises_completed: 45,
  streak_days: 7,
  last_active_date: new Date().toISOString().split('T')[0],
  weekly_activity: [
    { day: 'Thứ 2', count: 15, date: '2026-11-02' },
    { day: 'Thứ 3', count: 22, date: '2026-11-03' },
    { day: 'Thứ 4', count: 18, date: '2026-11-04' },
    { day: 'Thứ 5', count: 30, date: '2026-11-05' },
    { day: 'Thứ 6', count: 25, date: '2026-11-06' },
    { day: 'Thứ 7', count: 35, date: '2026-11-07' },
    { day: 'CN', count: 20, date: '2026-11-08' },
  ],
};

// --- AUTH & PROFILE SERVICE ---
export const getActiveUser = async (): Promise<UserProfile | null> => {
  if (typeof window === 'undefined') return null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) return profile as UserProfile;

      return {
        id: session.user.id,
        email: session.user.email || '',
        display_name:
          session.user.user_metadata?.full_name ||
          session.user.email?.split('@')[0] ||
          'Học viên',
        avatar_url: session.user.user_metadata?.avatar_url || '',
        target_score: 8.0,
        created_at: session.user.created_at,
      };
    } catch {
      // Fallback
    }
  }

  // Local storage fallback for seamless testing
  const stored = localStorage.getItem('eh_active_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEMO_USER_PROFILE;
    }
  }
  return DEMO_USER_PROFILE;
};

export const updateActiveProfile = async (
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();
        if (!error && data) return data as UserProfile;
      }
    } catch {
      // Fallback to local
    }
  }

  const current = (await getActiveUser()) || DEMO_USER_PROFILE;
  const updated: UserProfile = { ...current, ...updates };
  if (typeof window !== 'undefined') {
    localStorage.setItem('eh_active_user', JSON.stringify(updated));
  }
  return updated;
};

// --- USER PROGRESS SERVICE ---
export const getUserProgress = async (): Promise<UserProgress> => {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (data) return data as UserProgress;
      }
    } catch {
      // fallback
    }
  }

  const stored = localStorage.getItem('eh_user_progress');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_PROGRESS;
    }
  }
  return DEFAULT_PROGRESS;
};

export const incrementUserProgress = async (
  type: 'word' | 'grammar' | 'exercise',
  count = 1
): Promise<UserProgress> => {
  const current = await getUserProgress();
  const updated: UserProgress = {
    ...current,
    words_learned:
      type === 'word' ? current.words_learned + count : current.words_learned,
    grammar_completed:
      type === 'grammar'
        ? current.grammar_completed + count
        : current.grammar_completed,
    exercises_completed:
      type === 'exercise'
        ? current.exercises_completed + count
        : current.exercises_completed,
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('eh_user_progress', JSON.stringify(updated));
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_progress')
          .upsert({ ...updated, user_id: user.id });
      }
    } catch {
      // fallback handled
    }
  }

  return updated;
};

// --- USER VOCABULARY SERVICE ---
export const getUserVocabularyStatus = async (): Promise<
  Record<string, UserVocabularyItem>
> => {
  if (typeof window === 'undefined') return {};

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_vocabulary')
          .select('*')
          .eq('user_id', user.id);
        if (data) {
          const map: Record<string, UserVocabularyItem> = {};
          data.forEach((item) => {
            map[item.vocabulary_id] = item;
          });
          return map;
        }
      }
    } catch {
      // Fallback
    }
  }

  const stored = localStorage.getItem('eh_user_vocabulary');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  }
  return {};
};

export const saveUserVocabItem = async (
  vocabId: string,
  updates: Partial<UserVocabularyItem>
): Promise<UserVocabularyItem> => {
  const currentMap = await getUserVocabularyStatus();
  const currentItem: UserVocabularyItem = currentMap[vocabId] || {
    id: `uv-${vocabId}`,
    user_id: 'active-user',
    vocabulary_id: vocabId,
    status: 'learning',
    is_favorite: false,
    updated_at: new Date().toISOString(),
  };

  const updated: UserVocabularyItem = {
    ...currentItem,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  currentMap[vocabId] = updated;

  if (typeof window !== 'undefined') {
    localStorage.setItem('eh_user_vocabulary', JSON.stringify(currentMap));
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_vocabulary').upsert({
          user_id: user.id,
          vocabulary_id: vocabId,
          status: updated.status,
          is_favorite: updated.is_favorite,
          notes: updated.notes,
        });
      }
    } catch {
      // Handled
    }
  }

  return updated;
};

// --- QUIZ & EXAM ATTEMPTS SERVICE ---
export const saveQuizAttempt = async (
  attempt: Omit<QuizAttempt, 'id' | 'user_id' | 'completed_at'>
): Promise<QuizAttempt> => {
  const user = await getActiveUser();
  const newAttempt: QuizAttempt = {
    ...attempt,
    id: `attempt-${Date.now()}`,
    user_id: user?.id || 'demo-student-id',
    completed_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('eh_quiz_attempts');
    const list: QuizAttempt[] = stored ? JSON.parse(stored) : [];
    list.unshift(newAttempt);
    localStorage.setItem('eh_quiz_attempts', JSON.stringify(list));
  }

  // Increment exercises completed
  await incrementUserProgress('exercise', attempt.total_questions);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        await supabase.from('quiz_attempts').insert({
          user_id: authUser.id,
          quiz_id: attempt.quiz_id,
          quiz_title: attempt.quiz_title,
          quiz_type: attempt.quiz_type,
          score: attempt.score,
          percentage: attempt.percentage,
          total_questions: attempt.total_questions,
          correct_count: attempt.correct_count,
          incorrect_count: attempt.incorrect_count,
          time_spent_seconds: attempt.time_spent_seconds,
          answers: attempt.answers,
        });
      }
    } catch {
      // Handled
    }
  }

  return newAttempt;
};

export const getQuizAttempts = async (): Promise<QuizAttempt[]> => {
  if (typeof window === 'undefined') return [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });
        if (data) return data as QuizAttempt[];
      }
    } catch {
      // Fallback
    }
  }

  const stored = localStorage.getItem('eh_quiz_attempts');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  // Seed sample attempt for realistic dashboard statistics
  const sampleAttempt: QuizAttempt = {
    id: 'attempt-sample-1',
    user_id: 'demo-student-id',
    quiz_id: 'exam-thpt-2025-101',
    quiz_title: 'Đề Thi Thử Tốt Nghiệp THPT Chuẩn Cấu Trúc - Đề Số 01',
    quiz_type: 'mock_exam',
    score: 8.6,
    percentage: 86,
    total_questions: 15,
    correct_count: 13,
    incorrect_count: 2,
    time_spent_seconds: 1420,
    answers: {},
    completed_at: new Date(Date.now() - 86400000).toISOString(),
  };

  return [sampleAttempt];
};
