import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-card p-4">
      <div className="flex items-center gap-3 max-w-3xl mx-auto">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Descreva seu caso ou responda ao mediador..."
          disabled={disabled}
          className="flex-1 bg-secondary text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 text-sm border-none outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="bg-primary text-primary-foreground rounded-xl p-3 hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
