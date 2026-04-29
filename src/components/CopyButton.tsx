'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
      title="Copy to clipboard"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
    </button>
  );
};
