import { User, Bot } from 'lucide-react';

import { CopyButton } from '@/components/CopyButton';
import { parseMarkdown } from '@/lib/markdown';

export interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage = ({ message }: { message: MessageProps }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      aria-label={`${isUser ? 'You said' : 'Assistant said'}`}
    >
      <div className={`max-w-[85%] flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${
            isUser ? 'bg-indigo-600' : 'bg-emerald-600'
          }`}
          aria-hidden="true"
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        <div
          className={`p-4 rounded-2xl shadow-sm text-sm sm:text-base leading-relaxed relative group ${
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-none'
              : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/5'
          }`}
        >
          {!isUser && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton text={message.content} />
            </div>
          )}
          {!isUser ? (
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(message.content),
              }}
            />
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};
