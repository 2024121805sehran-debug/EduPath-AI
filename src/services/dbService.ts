import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface DBProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  course_id: string;
  year: number;
  semester: number;
  onboarding_completed: boolean;
  xp: number;
  level: number;
  streak: number;
  created_at?: string;
  updated_at?: string;
}

export interface DBTopicProgress {
  id?: string;
  user_id: string;
  topic_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  time_spent: number;
  started_at?: string;
  completed_at?: string;
  updated_at?: string;
}

export interface DBQuizAttempt {
  id?: string;
  user_id: string;
  quiz_id: string;
  score: number;
  percentage: number;
  passed: boolean;
  answers?: any;
  attempted_at?: string;
}

export interface DBCodingSubmission {
  id?: string;
  user_id: string;
  problem_id: string;
  code: string;
  language: string;
  status: 'accepted' | 'wrong_answer' | 'error';
  score: number;
  submitted_at?: string;
}

export interface DBUserActivity {
  id?: string;
  user_id: string;
  activity_type: string;
  title: string;
  metadata?: any;
  created_at?: string;
}

export interface DBChatSession {
  id: string;
  user_id: string;
  subject_id?: string;
  topic_id?: string;
  title: string;
  created_at?: string;
  updated_at?: string;
}

export interface DBChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at?: string;
}

// ----------------------------------------
// PROFILE API
// ----------------------------------------
export const fetchUserProfile = async (userId: string): Promise<DBProfile | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as DBProfile;
  } catch (err) {
    console.warn('Supabase fetchUserProfile warning:', err);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<DBProfile>): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase updateUserProfile error:', err);
    return false;
  }
};

// ----------------------------------------
// TOPIC PROGRESS API
// ----------------------------------------
export const fetchUserTopicProgress = async (userId: string): Promise<DBTopicProgress[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('user_topic_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchUserTopicProgress warning:', err);
    return [];
  }
};

export const upsertTopicProgress = async (
  userId: string,
  topicId: string,
  status: 'not_started' | 'in_progress' | 'completed',
  progressPercentage: number = 100,
  timeSpentMinutes: number = 25
): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const now = new Date().toISOString();
    const payload: Partial<DBTopicProgress> = {
      user_id: userId,
      topic_id: topicId,
      status,
      progress_percentage: progressPercentage,
      time_spent: timeSpentMinutes,
      updated_at: now
    };

    if (status === 'completed') {
      payload.completed_at = now;
    }

    const { error } = await supabase
      .from('user_topic_progress')
      .upsert(payload, { onConflict: 'user_id,topic_id' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase upsertTopicProgress error:', err);
    return false;
  }
};

// ----------------------------------------
// QUIZ ATTEMPTS API
// ----------------------------------------
export const fetchUserQuizAttempts = async (userId: string): Promise<DBQuizAttempt[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('user_quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('attempted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchUserQuizAttempts warning:', err);
    return [];
  }
};

export const recordQuizAttemptInDB = async (
  userId: string,
  quizId: string,
  score: number,
  totalQuestions: number,
  passed: boolean,
  answers?: any
): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const { error } = await supabase.from('user_quiz_attempts').insert({
      user_id: userId,
      quiz_id: quizId,
      score,
      percentage,
      passed,
      answers,
      attempted_at: new Date().toISOString()
    });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase recordQuizAttemptInDB error:', err);
    return false;
  }
};

// ----------------------------------------
// CODING SUBMISSIONS API
// ----------------------------------------
export const fetchUserCodingSubmissions = async (userId: string): Promise<DBCodingSubmission[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('coding_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchUserCodingSubmissions warning:', err);
    return [];
  }
};

export const recordCodingSubmissionInDB = async (
  userId: string,
  problemId: string,
  code: string,
  language: string,
  status: 'accepted' | 'wrong_answer' | 'error',
  score: number = 100
): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('coding_submissions').insert({
      user_id: userId,
      problem_id: problemId,
      code,
      language,
      status,
      score,
      submitted_at: new Date().toISOString()
    });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase recordCodingSubmissionInDB error:', err);
    return false;
  }
};

// ----------------------------------------
// USER ACTIVITY LOG API
// ----------------------------------------
export const fetchUserActivitiesFromDB = async (userId: string): Promise<DBUserActivity[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchUserActivitiesFromDB warning:', err);
    return [];
  }
};

export const logUserActivityInDB = async (
  userId: string,
  activityType: string,
  title: string,
  metadata?: any
): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('user_activity').insert({
      user_id: userId,
      activity_type: activityType,
      title,
      metadata,
      created_at: new Date().toISOString()
    });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase logUserActivityInDB error:', err);
    return false;
  }
};

// ----------------------------------------
// CHAT SESSIONS & MESSAGES API
// ----------------------------------------
export const fetchChatSessionsFromDB = async (userId: string): Promise<DBChatSession[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchChatSessionsFromDB warning:', err);
    return [];
  }
};

export const createChatSessionInDB = async (
  userId: string,
  title: string,
  subjectId?: string,
  topicId?: string
): Promise<DBChatSession | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        title,
        subject_id: subjectId,
        topic_id: topicId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as DBChatSession;
  } catch (err) {
    console.error('Supabase createChatSessionInDB error:', err);
    return null;
  }
};

export const fetchChatMessagesFromDB = async (sessionId: string): Promise<DBChatMessage[]> => {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchChatMessagesFromDB warning:', err);
    return [];
  }
};

export const addChatMessageInDB = async (
  sessionId: string,
  userId: string,
  role: 'user' | 'assistant',
  message: string
): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase.from('chat_messages').insert({
      session_id: sessionId,
      user_id: userId,
      role,
      message,
      created_at: new Date().toISOString()
    });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase addChatMessageInDB error:', err);
    return false;
  }
};
