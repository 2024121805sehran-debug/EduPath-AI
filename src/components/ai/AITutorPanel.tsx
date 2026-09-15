import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { sendAIChatToBackend, type AIContextPayload } from '../../services/aiService';
import {
  fetchChatSessionsFromDB,
  createChatSessionInDB,
  fetchChatMessagesFromDB,
  addChatMessageInDB
} from '../../services/dbService';
import { 
  Sparkles, 
  X, 
  Send, 
  Copy, 
  Check, 
  Plus, 
  MessageSquare, 
  History,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}

interface ConversationSession {
  id: string;
  dbId?: string;
  title: string;
  context: AIContextPayload;
  messages: ChatMessage[];
  updatedAt: string;
}

import { renderCleanFormattedText } from '../../utils/textFormatter';

export const AITutorPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const location = useLocation();
  const { activeCourse, userProgress, authUser } = useUser();

  // Try to derive active subject/topic from URL context
  const pathParts = location.pathname.split('/');
  let currentSubjectName = 'General Curriculum';
  let currentUnitTitle = 'Unit 1';
  let currentTopicTitle = 'General Study';

  if (pathParts[1] === 'subjects' && pathParts[2]) {
    const subId = pathParts[2];
    activeCourse.years.forEach(y => {
      y.semesters.forEach(s => {
        s.subjects.forEach(sub => {
          if (sub.id === subId) {
            currentSubjectName = sub.name;
            if (pathParts[3] === 'topics' && pathParts[4]) {
              const topId = pathParts[4];
              sub.units.forEach(u => {
                u.topics.forEach(t => {
                  if (t.id === topId) {
                    currentUnitTitle = u.title.split(':')[0] || `Unit ${u.unitNumber}`;
                    currentTopicTitle = t.title;
                  }
                });
              });
            } else if (sub.units.length > 0) {
              currentUnitTitle = `Unit 1`;
              currentTopicTitle = sub.units[0].topics[0]?.title || sub.name;
            }
          }
        });
      });
    });
  }

  const activeContext: AIContextPayload = {
    course: activeCourse.name,
    year: userProgress.selectedYear,
    semester: userProgress.selectedSemester,
    subject: currentSubjectName,
    unit: currentUnitTitle,
    topic: currentTopicTitle
  };

  // Sessions / Conversations state
  const [sessions, setSessions] = useState<ConversationSession[]>(() => [
    {
      id: 'sess-1',
      title: `${currentSubjectName} — ${currentTopicTitle}`,
      context: activeContext,
      messages: [],
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>('sess-1');
  const [showHistorySidebar, setShowHistorySidebar] = useState<boolean>(false);
  const [showContextCard, setShowContextCard] = useState<boolean>(true);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState<boolean>(false);
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');

  // Load chat sessions from Supabase DB on mount if user is logged in
  useEffect(() => {
    if (!authUser) return;

    const loadDBSessions = async () => {
      const dbSessions = await fetchChatSessionsFromDB(authUser.id);
      if (dbSessions && dbSessions.length > 0) {
        const loaded: ConversationSession[] = await Promise.all(
          dbSessions.map(async s => {
            const rawMsgs = await fetchChatMessagesFromDB(s.id);
            const chatMsgs: ChatMessage[] = rawMsgs.map(m => ({
              id: m.id,
              role: m.role,
              content: m.message,
              timestamp: m.created_at
                ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));

            return {
              id: s.id,
              dbId: s.id,
              title: s.title,
              context: activeContext,
              messages: chatMsgs,
              updatedAt: s.updated_at
                ? new Date(s.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          })
        );

        setSessions(loaded);
        setActiveSessionId(loaded[0].id);
      }
    };

    loadDBSessions();
  }, [authUser]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession ? activeSession.messages : [];

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedAnswerId, setCopiedAnswerId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCreateNewChat = async () => {
    let newId = `sess-${Date.now()}`;
    const title = `${currentSubjectName} — ${currentTopicTitle}`;

    if (authUser) {
      const created = await createChatSessionInDB(authUser.id, title);
      if (created) {
        newId = created.id;
      }
    }

    const newSession: ConversationSession = {
      id: newId,
      dbId: authUser ? newId : undefined,
      title,
      context: activeContext,
      messages: [],
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setShowHistorySidebar(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update active session with user message
    const updatedMessages = [...messages, userMsg];
    setSessions(prev =>
      prev.map(s => (s.id === activeSessionId ? { ...s, messages: updatedMessages } : s))
    );
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    if (authUser && activeSession?.dbId) {
      addChatMessageInDB(activeSession.dbId, authUser.id, 'user', query);
    }

    try {
      const convHistory = updatedMessages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await sendAIChatToBackend({
        message: query,
        context: activeContext,
        conversation: convHistory
      });

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId ? { ...s, messages: [...updatedMessages, assistantMsg] } : s
        )
      );

      if (authUser && activeSession?.dbId) {
        addChatMessageInDB(activeSession.dbId, authUser.id, 'assistant', res.answer);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `EduPath AI is temporarily unavailable. Error: ${err.message || 'Network failure'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId ? { ...s, messages: [...updatedMessages, errorMsg] } : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    // Find last user prompt
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;
    await handleSendMessage(lastUserMsg.content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyText = (text: string, id: string, type: 'code' | 'answer') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } else {
      setCopiedAnswerId(id);
      setTimeout(() => setCopiedAnswerId(null), 2000);
    }
  };

  const confirmClearChat = () => {
    setSessions(prev =>
      prev.map(s => (s.id === activeSessionId ? { ...s, messages: [] } : s))
    );
    setShowClearConfirmModal(false);
  };

  const quickPrompts = [
    'Explain this simply',
    'Give me an example',
    'Give me a real-world example',
    'Quiz me on this',
    'Give me interview questions',
    'Explain like I\'m a beginner',
    'Help me debug my code',
    'Summarize this topic'
  ];

  // Helper for rendering rich Markdown text & code blocks
  const renderMessageContent = (msg: ChatMessage) => {
    const parts = msg.content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, pIdx) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const lang = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : 'code';
        const codeText = lang === lines[0] ? lines.slice(1).join('\n') : lines.join('\n');
        const codeId = `${msg.id}-${pIdx}`;

        return (
          <div key={pIdx} className="my-3 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
            <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px]">
              <span className="font-bold text-indigo-300 uppercase">{lang}</span>
              <button
                onClick={() => handleCopyText(codeText, codeId, 'code')}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
              >
                {copiedCodeId === codeId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 text-indigo-200 overflow-x-auto leading-relaxed whitespace-pre-wrap">
              {codeText}
            </pre>
          </div>
        );
      }

      // Format markdown text lines cleanly (headers, bold, lists) without raw ##, $$, $, or ** text
      return (
        <div key={pIdx} className="text-xs sm:text-sm leading-relaxed">
          {renderCleanFormattedText(part)}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex justify-end">
      {/* Slide-over panel */}
      <div className="w-full sm:w-[450px] h-full bg-[#0b0f19] border-l border-slate-800 flex flex-col shadow-2xl animate-fade-in relative">
        {/* Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-bg-primary flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>EduPath AI Tutor</span>
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                  Gemini
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  ● AI Online
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Ask anything about your course or anything else.</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowHistorySidebar(prev => !prev)}
              title="Chat History"
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <History className="w-4 h-4" />
            </button>

            <button
              onClick={handleCreateNewChat}
              title="New Chat"
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Context Card (Collapsible) */}
        <div className="bg-indigo-950/40 border-b border-indigo-500/20 text-[11px]">
          <div 
            onClick={() => setShowContextCard(prev => !prev)}
            className="px-4 py-2 flex items-center justify-between cursor-pointer select-none"
          >
            <span className="text-indigo-300 font-bold">Current Learning Context</span>
            <button className="text-indigo-300 hover:text-white">
              {showContextCard ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showContextCard && (
            <div className="px-4 pb-2.5 space-y-0.5 border-t border-indigo-500/10 pt-1.5 animate-fade-in">
              <div className="flex items-center justify-between text-indigo-200 font-semibold">
                <span>{activeContext.course}</span>
                <span>Yr {activeContext.year} • Sem {activeContext.semester}</span>
              </div>
              <div className="text-slate-400 flex items-center gap-1.5 truncate">
                <span className="font-medium text-slate-200">{activeContext.subject}</span>
                <span>•</span>
                <span className="truncate">{activeContext.unit} • {activeContext.topic}</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat History Drawer Overlay */}
        {showHistorySidebar && (
          <div className="absolute top-[108px] inset-x-0 bottom-0 z-20 bg-slate-950/95 border-b border-slate-800 p-4 space-y-3 animate-fade-in overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300">Previous Conversations</span>
              <button
                onClick={handleCreateNewChat}
                className="px-3 py-1 rounded-xl gradient-bg-primary text-white text-[11px] font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>New Chat</span>
              </button>
            </div>

            {/* Search Input for Conversations */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search history & messages..."
                value={historySearchQuery}
                onChange={e => setHistorySearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              {sessions
                .filter(s =>
                  !historySearchQuery.trim() ||
                  s.title.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
                  s.messages.some(m => m.content.toLowerCase().includes(historySearchQuery.toLowerCase()))
                )
                .map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSessionId(s.id);
                      setShowHistorySidebar(false);
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      s.id === activeSessionId
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                      <span className="truncate">{s.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{s.messages.length} msgs</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Clear Confirmation Modal */}
        {showClearConfirmModal && (
          <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-xs bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl">
              <h4 className="text-sm font-bold text-white text-center">Clear this conversation?</h4>
              <p className="text-xs text-slate-400 text-center">This will clear all messages in the current session.</p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowClearConfirmModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClearChat}
                  className="flex-1 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 text-xs font-bold transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message Workspace Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="py-8 text-center space-y-4 my-auto">
              <div className="w-14 h-14 rounded-2xl mx-auto gradient-bg-primary flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">How can I help you learn?</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Ask anything across programming, math, science, career guidance, or your course syllabus.
                </p>
              </div>

              {/* Quick Prompt Pills */}
              <div className="pt-2 flex flex-wrap justify-center gap-2 max-w-xs mx-auto">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(qp)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/30 text-xs font-semibold transition-all text-left"
                  >
                    {qp}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages List */
            messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl gradient-bg-primary flex items-center justify-center text-white shrink-0 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`space-y-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white border-indigo-500 rounded-br-none shadow-md'
                        : msg.isError
                        ? 'bg-rose-950/40 border-rose-500/40 text-rose-200 rounded-bl-none'
                        : 'bg-slate-900/90 border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2 text-[10px] text-indigo-400 font-bold">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          EduPath AI Assistant
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyText(msg.content, msg.id, 'answer')}
                            className="text-slate-400 hover:text-white flex items-center gap-1"
                          >
                            {copiedAnswerId === msg.id ? (
                              <span className="text-emerald-400 font-bold">Copied</span>
                            ) : (
                              <span>Copy</span>
                            )}
                          </button>
                          {index === messages.length - 1 && !isLoading && (
                            <button
                              onClick={handleRegenerate}
                              className="text-slate-400 hover:text-indigo-300 flex items-center gap-1"
                              title="Regenerate answer from Gemini API"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Regenerate</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {renderMessageContent(msg)}
                  </div>

                  <span className="text-[10px] text-slate-500 px-1">{msg.timestamp}</span>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3 items-start animate-fade-in">
              <div className="w-7 h-7 rounded-xl gradient-bg-primary flex items-center justify-center text-white shrink-0 shadow-md">
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-indigo-300 font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>EduPath AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-2">
          <div className="relative flex items-center">
            <textarea
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask EduPath AI anything..."
              rows={2}
              className="w-full pr-12 pl-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
            />

            <button
              disabled={!inputMessage.trim() || isLoading}
              onClick={() => handleSendMessage()}
              className="absolute right-2.5 bottom-2.5 w-8 h-8 rounded-xl gradient-bg-primary text-white flex items-center justify-center disabled:opacity-40 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>Shift + Enter for new line</span>
            {messages.length > 0 && (
              <button
                onClick={() => setShowClearConfirmModal(true)}
                className="hover:text-slate-300 transition-colors"
              >
                Clear Chat
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
