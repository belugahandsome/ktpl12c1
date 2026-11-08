export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'idiom'
  | 'phrasal_verb';

export type VocabTopic =
  | 'Education'
  | 'Environment'
  | 'Technology'
  | 'Society'
  | 'Health'
  | 'Science'
  | 'Work and Career'
  | 'Culture'
  | 'Economy'
  | 'General Vocabulary';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type VocabLearningStatus = 'new' | 'learning' | 'mastered' | 'review_needed';

export interface Vocabulary {
  id: string;
  word: string;
  ipa: string;
  part_of_speech: PartOfSpeech;
  meaning_vi: string;
  definition_en: string;
  example_en: string;
  example_vi: string;
  synonyms: string[];
  antonyms: string[];
  topic: VocabTopic;
  difficulty: DifficultyLevel;
}

export interface UserVocabularyItem {
  id: string;
  user_id: string;
  vocabulary_id: string;
  status: VocabLearningStatus;
  is_favorite: boolean;
  notes?: string;
  updated_at: string;
}

export interface GrammarExercise {
  id: string;
  question: string;
  options: string[];
  correct_answer: number; // Index 0-3
  explanation: string;
}

export interface CommonMistake {
  mistake: string;
  correction: string;
  explanation: string;
}

export interface GrammarLesson {
  id: string;
  slug: string;
  title: string;
  title_vi: string;
  topic: string;
  order_index: number;
  summary: string;
  explanation_en: string;
  explanation_vi: string;
  formula: string;
  usage: string[];
  examples: { en: string; vi: string }[];
  common_mistakes: CommonMistake[];
  exercises: GrammarExercise[];
}

export type StructureCategory =
  | 'basic'
  | 'compound_complex'
  | 'conditionals'
  | 'comparison'
  | 'inversion'
  | 'cleft'
  | 'subjunctive'
  | 'academic';

export interface SentenceStructure {
  id: string;
  slug: string;
  title: string;
  category: StructureCategory;
  category_label_vi: string;
  formula: string;
  meaning_vi: string;
  usage: string;
  examples: { en: string; vi: string }[];
  common_mistakes: CommonMistake[];
  exercises: GrammarExercise[];
}

export type ExamCategory =
  | 'pronunciation'
  | 'word_stress'
  | 'vocabulary'
  | 'grammar'
  | 'communication'
  | 'error_identification'
  | 'sentence_transformation'
  | 'sentence_ordering'
  | 'reading_comprehension'
  | 'cloze_test';

export interface ExamOption {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface ExamQuestion {
  id: string;
  category: ExamCategory;
  category_label_vi: string;
  difficulty: DifficultyLevel;
  passage?: string;
  question_text: string;
  options: ExamOption[];
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  tags?: string[];
}

export interface MockExam {
  id: string;
  code: string;
  title: string;
  description: string;
  year: number;
  duration_minutes: number;
  total_questions: number;
  questions: ExamQuestion[];
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  quiz_title: string;
  quiz_type: 'mock_exam' | 'topic_practice' | 'vocabulary' | 'grammar';
  score: number; // Scale 0 - 10
  percentage: number;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  time_spent_seconds: number;
  answers: Record<string, string>; // questionId -> selected Option 'A' | 'B' | 'C' | 'D'
  completed_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  target_score: number; // e.g. 8.5
  school?: string;
  created_at: string;
}

export interface UserProgress {
  user_id: string;
  words_learned: number;
  grammar_completed: number;
  exercises_completed: number;
  streak_days: number;
  last_active_date: string;
  weekly_activity: { day: string; count: number; date: string }[];
}
