import type { ChatMessage, UserProgress } from '../types';

export interface AIContextPayload {
  course?: string;
  year?: number | string;
  semester?: number | string;
  subject?: string;
  unit?: string;
  topic?: string;
}

export interface SendChatMessageParams {
  message: string;
  context?: AIContextPayload;
  conversation?: { role: string; content: string }[];
}

export interface AIChatResponsePayload {
  success: boolean;
  answer: string;
  contextUsed: Record<string, any>;
  fallbackUsed?: boolean;
}

export const generateAIInsight = (userProgress: UserProgress) => {
  return {
    title: 'AI Learning Insight',
    highlight: `Your strongest subject is ${userProgress.strongestSubject || 'Machine Learning'}, while ${userProgress.needsFocusSubject || 'Computer Networks'} needs more attention.`,
    recommendation: `We recommend revising core concepts in ${userProgress.needsFocusSubject || 'Computer Networks'} and attempting a 10-minute module quiz to boost your confidence.`,
    actionLabel: 'View Recommendations',
    actionRoute: '/subjects'
  };
};

export const getQuickTopicExplanation = (topicTitle: string, subjectName: string): string => {
  return `### AI EduBot Explanation: ${topicTitle} (${subjectName})

Here is a simplified high-level breakdown:

1. **Core Principle**: ${topicTitle} is a critical milestone concept in ${subjectName}. It provides the framework for analyzing professional scenarios, biological interactions, or computational models.
2. **Clinical / Industry Context**: In real-world practice, mastering ${topicTitle} helps eliminate operational errors and ensures standard compliance.
3. **Exam & Interview Tip**: Be prepared to outline step-by-step procedures, key formulas/articles, and edge-case exceptions.

> 💡 *Need a custom case study analysis or step-by-step code/formula breakdown? Ask your query below!*`;
};

export const generateBotResponse = (userPrompt: string, subjectContext?: string): ChatMessage => {
  return {
    id: `msg-${Date.now()}`,
    sender: 'bot',
    text: `Regarding your query about **${userPrompt}** in ${subjectContext || 'your course'}:

1. **Overview**: Key principles involve understanding procedural workflows, input validation, and execution boundaries.
2. **Practical Tip**: Review standard definitions and test edge cases.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

export const sendAIChatToBackend = async (params: SendChatMessageParams): Promise<AIChatResponsePayload> => {
  try {
    const rawApiUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim();
    const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');
    const endpoint = API_BASE_URL ? `${API_BASE_URL}/api/ai/chat` : '/api/ai/chat';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Server returned status ${response.status}`);
    }

    const data: AIChatResponsePayload = await response.json();
    return data;
  } catch (error: any) {
    console.warn('Backend API request failed or backend server offline. Using safe fallback mode.', error);
    
    // Client-side fallback if backend server is unreachable or offline
    const fallbackText = `### EduPath AI Tutor (Offline Fallback Mode)

I am currently running in offline fallback mode because the backend API server is unreachable.

**Regarding your question: "${params.message}"**

In **${params.context?.topic || params.context?.subject || 'your current topic'}**, core concepts revolve around understanding baseline definitions, procedural workflows, and error handling.

> 💡 *To activate live Gemini API AI responses, start the backend server with python backend/main.py and configure GEMINI_API_KEY in .env.*`;

    return {
      success: true,
      answer: fallbackText,
      contextUsed: params.context || {},
      fallbackUsed: true
    };
  }
};
