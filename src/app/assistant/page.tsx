'use client';

import { Trash2 } from 'lucide-react';

import { ChatHistory } from '@/components/assistant/ChatHistory';
import { ChatInput } from '@/components/assistant/ChatInput';
import { useAssistant } from '@/hooks/useAssistant';

export default function AssistantPage() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useAssistant();

  return (
    <div className="flex-grow container mx-auto px-4 pt-24 pb-12">
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

        {/* Chat History Component */}
        <ChatHistory messages={messages} isLoading={isLoading} error={error} />

        {/* Chat Input Component */}
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
