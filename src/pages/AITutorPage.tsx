import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { sendAIChatToBackend } from '../services/aiService';
import type { ChatMessage } from '../types';
import { Bot, Send, User, Copy, Check } from 'lucide-react';

export const AITutorPage: React.FC = () => {
  const { activeCourse, userProgress } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hello ${userProgress.studentName}! I am **EduBot AI**, your 24/7 personal learning tutor for **${activeCourse.title}**.

How can I assist you with your Year ${userProgress.selectedYear} / Semester ${userProgress.selectedSemester} subjects today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedTopics: [
        'Explain Backprop step-by-step',
        'Debug Dijkstra algorithm in Python',
        'Summarize OS Deadlock Coffman conditions',
        'Explain RSA Encryption Math'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    try {
      const res = await sendAIChatToBackend({
        message: query,
        context: {
          course: activeCourse.title,
          year: userProgress.selectedYear,
          semester: userProgress.selectedSemester
        }
      });

      const botResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: `EduBot AI is temporarily unavailable. Error: ${err.message || 'Network error'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col justify-between glass-panel border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl gradient-bg-primary flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">EduBot AI Tutor</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">Contextual assistant for {activeCourse.shortTitle}</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'gradient-bg-primary text-white shadow-md'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`space-y-3 p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-indigo-600/90 text-white rounded-tr-none'
                : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

              {/* Code Snippet Box */}
              {msg.codeSnippet && (
                <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-xs my-2">
                  <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-slate-400">
                    <span className="font-mono text-[10px] uppercase">{msg.codeSnippet.language}</span>
                    <button
                      onClick={() => handleCopyCode(msg.codeSnippet!.code, msg.id)}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 font-mono text-indigo-200 overflow-x-auto text-[11px]">
                    {msg.codeSnippet.code}
                  </pre>
                </div>
              )}

              {/* Suggested Topics Prompt Chips */}
              {msg.suggestedTopics && msg.suggestedTopics.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {msg.suggestedTopics.map((chip, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => handleSendMessage(chip)}
                      className="px-3 py-1 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
                    >
                      💡 {chip}
                    </button>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-slate-500 text-right">{msg.timestamp}</div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl gradient-bg-primary text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>EduBot is analyzing course notes & generating response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          <input
            type="text"
            placeholder="Ask EduBot a doubt, code bug, or syllabus question..."
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="px-5 py-3 rounded-2xl gradient-bg-primary text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all disabled:opacity-40 flex items-center gap-1.5 shrink-0"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
