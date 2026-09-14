-- ==========================================
-- EDUPATH AI — SUPABASE POSTGRESQL SCHEMA DDL
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (User Specific)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  course_id TEXT DEFAULT 'btech-cse-aiml',
  year INTEGER DEFAULT 3,
  semester INTEGER DEFAULT 5,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COURSES TABLE (Shared Curriculum)
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBJECTS TABLE (Shared Curriculum)
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. UNITS TABLE (Shared Curriculum)
CREATE TABLE IF NOT EXISTS public.units (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
  unit_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT
);

-- 5. TOPICS TABLE (Shared Curriculum)
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  unit_id TEXT REFERENCES public.units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT DEFAULT 'Intermediate',
  estimated_minutes INTEGER DEFAULT 25
);

-- 6. RESOURCES TABLE (Shared Curriculum)
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- YouTube, Article, Documentation, Notes, PDF, Website
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT
);

-- 7. USER TOPIC PROGRESS TABLE (User Specific)
CREATE TABLE IF NOT EXISTS public.user_topic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started', -- not_started, in_progress, completed
  progress_percentage INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, topic_id)
);

-- 8. QUIZZES TABLE (Shared Curriculum)
CREATE TABLE IF NOT EXISTS public.quizzes (
  id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  passing_percentage INTEGER DEFAULT 70,
  xp_reward INTEGER DEFAULT 30
);

-- 9. QUIZ QUESTIONS TABLE (Shared Curriculum)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id TEXT PRIMARY KEY,
  quiz_id TEXT REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT
);

-- 10. USER QUIZ ATTEMPTS TABLE (User Specific)
CREATE TABLE IF NOT EXISTS public.user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CODING PROBLEMS TABLE (Shared Curriculum)
CREATE TABLE IF NOT EXISTS public.coding_problems (
  id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Easy',
  starter_code JSONB NOT NULL,
  test_cases JSONB NOT NULL,
  solution_explanation TEXT
);

-- 12. CODING SUBMISSIONS TABLE (User Specific)
CREATE TABLE IF NOT EXISTS public.coding_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL REFERENCES public.coding_problems(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT NOT NULL, -- accepted, wrong_answer, error
  score INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. USER ACTIVITY TABLE (User Specific)
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- topic_started, topic_completed, quiz_attempted, coding_submitted, etc.
  title TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ACHIEVEMENTS TABLE (Shared Definition)
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 100
);

-- 15. USER ACHIEVEMENTS TABLE (User Specific)
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

-- 16. CHAT SESSIONS TABLE (User Specific)
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id TEXT,
  topic_id TEXT,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. CHAT MESSAGES TABLE (User Specific)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- user, assistant
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Shared Curriculum Public Read Policies
CREATE POLICY "Allow public read courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Allow public read units" ON public.units FOR SELECT USING (true);
CREATE POLICY "Allow public read topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Allow public read resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Allow public read quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Allow public read quiz questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Allow public read coding problems" ON public.coding_problems FOR SELECT USING (true);
CREATE POLICY "Allow public read achievements" ON public.achievements FOR SELECT USING (true);

-- Profiles Table User Specific Policies
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User Topic Progress Policies
CREATE POLICY "Users access own topic progress" ON public.user_topic_progress FOR ALL USING (auth.uid() = user_id);

-- User Quiz Attempts Policies
CREATE POLICY "Users access own quiz attempts" ON public.user_quiz_attempts FOR ALL USING (auth.uid() = user_id);

-- Coding Submissions Policies
CREATE POLICY "Users access own coding submissions" ON public.coding_submissions FOR ALL USING (auth.uid() = user_id);

-- User Activity Policies
CREATE POLICY "Users access own activity" ON public.user_activity FOR ALL USING (auth.uid() = user_id);

-- User Achievements Policies
CREATE POLICY "Users access own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);

-- Chat Sessions Policies
CREATE POLICY "Users access own chat sessions" ON public.chat_sessions FOR ALL USING (auth.uid() = user_id);

-- Chat Messages Policies
CREATE POLICY "Users access own chat messages" ON public.chat_messages FOR ALL USING (auth.uid() = user_id);


-- ==========================================
-- AUTOMATIC PROFILE TRIGGER ON AUTH SIGNUP
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, course_id, year, semester, onboarding_completed, xp, level, streak)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    'btech-cse-aiml',
    3,
    5,
    FALSE,
    0,
    1,
    1
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
