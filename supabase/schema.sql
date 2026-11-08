-- ====================================================================
-- ENGLISH HUB - SUPABASE DATABASE SCHEMA
-- Target: High School English Learning Platform & National Exam Prep
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  target_score NUMERIC(3, 1) DEFAULT 8.0,
  school TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VOCABULARY TABLE (Public educational content)
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id TEXT PRIMARY KEY,
  word TEXT NOT NULL,
  ipa TEXT NOT NULL,
  part_of_speech TEXT NOT NULL,
  meaning_vi TEXT NOT NULL,
  definition_en TEXT NOT NULL,
  example_en TEXT NOT NULL,
  example_vi TEXT NOT NULL,
  synonyms TEXT[] DEFAULT '{}',
  antonyms TEXT[] DEFAULT '{}',
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER VOCABULARY (Private user learning status & favorites)
CREATE TABLE IF NOT EXISTS public.user_vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vocabulary_id TEXT NOT NULL REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'learning' CHECK (status IN ('new', 'learning', 'mastered', 'review_needed')),
  is_favorite BOOLEAN DEFAULT FALSE,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vocabulary_id)
);

-- 5. GRAMMAR LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.grammar_lessons (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_vi TEXT NOT NULL,
  topic TEXT NOT NULL,
  order_index INTEGER DEFAULT 1,
  summary TEXT NOT NULL,
  explanation_en TEXT NOT NULL,
  explanation_vi TEXT NOT NULL,
  formula TEXT NOT NULL,
  usage JSONB DEFAULT '[]'::jsonb,
  examples JSONB DEFAULT '[]'::jsonb,
  common_mistakes JSONB DEFAULT '[]'::jsonb,
  exercises JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SENTENCE STRUCTURES TABLE
CREATE TABLE IF NOT EXISTS public.sentence_structures (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label_vi TEXT NOT NULL,
  formula TEXT NOT NULL,
  meaning_vi TEXT NOT NULL,
  usage TEXT NOT NULL,
  examples JSONB DEFAULT '[]'::jsonb,
  common_mistakes JSONB DEFAULT '[]'::jsonb,
  exercises JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. QUESTIONS TABLE (National Exam Practice Bank)
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  category_label_vi TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  passage TEXT,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of { label: 'A'|'B'|'C'|'D', text: string }
  correct_option TEXT NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  explanation TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. QUIZZES / EXAMS TABLE
CREATE TABLE IF NOT EXISTS public.quizzes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  quiz_type TEXT NOT NULL DEFAULT 'mock_exam' CHECK (quiz_type IN ('mock_exam', 'topic_practice', 'vocabulary', 'grammar')),
  duration_minutes INTEGER DEFAULT 50,
  total_questions INTEGER DEFAULT 50,
  passing_score NUMERIC(3, 1) DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. QUIZ ATTEMPTS (User exam submissions & history)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  quiz_title TEXT NOT NULL,
  quiz_type TEXT NOT NULL,
  score NUMERIC(3, 1) NOT NULL,
  percentage INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  incorrect_count INTEGER NOT NULL,
  time_spent_seconds INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. USER PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  words_learned INTEGER DEFAULT 0,
  grammar_completed INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  weekly_activity JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR FAST QUERYING
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_vocab_topic ON public.vocabulary(topic);
CREATE INDEX IF NOT EXISTS idx_vocab_difficulty ON public.vocabulary(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_vocab_user ON public.user_vocabulary(user_id);
CREATE INDEX IF NOT EXISTS idx_grammar_order ON public.grammar_lessons(order_index);
CREATE INDEX IF NOT EXISTS idx_sentence_category ON public.sentence_structures(category);
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_date ON public.quiz_attempts(completed_at DESC);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentence_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: users can select and update their own profile; public can read basic info
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Educational Content (Vocabulary, Grammar, Sentence Structures, Questions, Quizzes):
-- Anyone authenticated (or anonymous for preview) can read, but only service_role can modify
CREATE POLICY "Public can view vocabulary"
  ON public.vocabulary FOR SELECT
  USING (true);

CREATE POLICY "Public can view grammar lessons"
  ON public.grammar_lessons FOR SELECT
  USING (true);

CREATE POLICY "Public can view sentence structures"
  ON public.sentence_structures FOR SELECT
  USING (true);

CREATE POLICY "Public can view questions"
  ON public.questions FOR SELECT
  USING (true);

CREATE POLICY "Public can view quizzes"
  ON public.quizzes FOR SELECT
  USING (true);

-- 3. User Private Data (user_vocabulary, quiz_attempts, user_progress):
CREATE POLICY "Users can manage their user_vocabulary"
  ON public.user_vocabulary FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their quiz_attempts"
  ON public.quiz_attempts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their user_progress"
  ON public.user_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url, target_score)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    8.0
  );

  INSERT INTO public.user_progress (user_id, words_learned, grammar_completed, exercises_completed, streak_days)
  VALUES (NEW.id, 0, 0, 0, 1);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if already exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
