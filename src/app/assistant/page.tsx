'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import styles from './page.module.css';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hello! I am your AI Election Assistant. I can help answer questions about voter registration, ID requirements, absentee voting, or general election dates. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMessage = { id: Date.now().toString(), role: 'user' as const, content: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      // Call our /api/chat route
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage.content }),
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.reply,
          },
        ]);
      } catch (error) {
        console.error('Error fetching chat response:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content:
              'I apologize, but I am currently having trouble connecting. Please try again later.',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading]
  );

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <div className={styles.header}>
          <h1 className="text-gradient">AI Election Assistant</h1>
          <p>Powered by Google Gemini</p>
        </div>

        <div className={`${styles.chatWrapper} glass-panel`}>
          <div className={styles.messagesContainer} aria-live="polite" aria-atomic="false">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageWrapper} ${styles[msg.role]}`}
                role="log"
              >
                <div className={styles.avatar} aria-hidden="true">
                  {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={styles.messageContent}>
                  <p>
                    <span className="sr-only">
                      {msg.role === 'assistant' ? 'Assistant: ' : 'You: '}
                    </span>
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.assistant}`} aria-busy="true">
                <div className={styles.avatar} aria-hidden="true">
                  <Bot size={20} />
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator} aria-label="Assistant is typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <input
                type="text"
                placeholder="Ask about voter ID, mail-in voting, or election dates..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className={styles.chatInput}
                aria-label="Your message"
              />
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
            <div className={styles.disclaimer}>
              <Sparkles size={12} />
              <span>
                AI can make mistakes. Always verify important information with your local election
                office.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
