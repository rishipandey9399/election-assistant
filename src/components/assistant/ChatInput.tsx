import { Send, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Honeypot } from '@/components/Honeypot';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent reject for bots
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');
    await onSendMessage(message);
  };

  return (
    <div className="p-6 bg-white/5 border-t border-white/10">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <Honeypot value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about voter ID, registration, or deadlines..."
          className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-gray-500"
          disabled={isLoading}
          aria-label="Ask anything about the election"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          aria-label="Send message"
          aria-busy={isLoading}
        >
          <Send size={20} />
        </button>
      </form>
      <div className="flex items-center gap-2 mt-4 text-gray-500 text-[10px] sm:text-xs justify-center">
        <Sparkles size={12} className="text-emerald-400" />
        <span>
          AI can make mistakes. Always verify important information with your local election office.
        </span>
      </div>
    </div>
  );
};
