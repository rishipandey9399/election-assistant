import { useEffect, useRef } from 'react';

import { ChatMessage, MessageProps } from './ChatMessage';

interface ChatHistoryProps {
  messages: MessageProps[];
  isLoading: boolean;
  error: string | null;
}

export const ChatHistory = ({ messages, isLoading, error }: ChatHistoryProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div
      className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10"
      role="log"
      aria-live="polite"
      aria-atomic="false"
      aria-label="Chat history"
    >
      {messages.map((m, idx) => (
        <ChatMessage key={idx} message={m} />
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
  );
};
