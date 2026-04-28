'use client';

import { useState, useRef, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAssistant } from '@/hooks/useAssistant';
import { Send, User, Bot, Trash2, Sparkles } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function AssistantPage() {
  const [input, setInput] = useState('');
  const { messages, isLoading, error, sendMessage, clearMessages } = useAssistant();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');
    await sendMessage(message);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white">
      <Navigation />

      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto flex flex-col h-[75vh] bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                AI Election Assistant
              </h1>
              <p className="text-gray-400 text-sm">Ask about voting, registration, or deadlines</p>
            </div>
            <button
              onClick={clearMessages}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              title="Clear Chat"
              aria-label="Clear Chat"
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10"
            role="log"
            aria-live="polite"
            aria-atomic="false"
            aria-label="Chat history"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                aria-label={`${m.role === 'user' ? 'You said' : 'Assistant said'}`}
              >
                <div
                  className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${m.role === 'user' ? 'bg-indigo-600' : 'bg-emerald-600'}`}
                    aria-hidden="true"
                  >
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div
                    className={`p-4 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'}`}
                  >
                    {m.role === 'assistant' ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            typeof window !== 'undefined'
                              ? DOMPurify.sanitize(m.content)
                              : m.content,
                        }}
                      />
                    ) : (
                      <p>{m.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start" aria-busy="true" aria-label="Assistant is typing">
                <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.3s]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-.5s]" />
                </div>
              </div>
            )}
            {error && (
              <div
                className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center mx-6"
                role="alert"
              >
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white/5 border-t border-white/10">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about voter ID, registration, or deadlines..."
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-500"
                disabled={isLoading}
                aria-label="Your question"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </form>
            <div className="flex items-center gap-2 mt-4 text-gray-500 text-[10px] sm:text-xs justify-center">
              <Sparkles size={12} className="text-emerald-400" />
              <span>
                AI can make mistakes. Always verify important information with your local election
                office.
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
