import React, { useState, useCallback } from 'react';
import { SendHorizontal, Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');

  const handleVoiceResult = useCallback((text: string) => {
    setValue((prev) => (prev ? prev + ' ' + text : text));
  }, []);

  const { start, stop, listening, interim, isSupported } = useSpeechRecognition({
    onResult: handleVoiceResult,
  });

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
          value={listening ? value + (interim ? ' ' + interim : '') : value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={listening ? 'Ouvindo...' : 'Descreva seu caso ou responda ao mediador...'}
          disabled={disabled || listening}
          className="flex-1 bg-secondary text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 text-lg border-none outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />

        {isSupported && (
          <button
            type="button"
            onClick={listening ? stop : start}
            disabled={disabled}
            className={`rounded-xl p-3 transition-all ${
              listening
                ? 'bg-destructive text-destructive-foreground animate-pulse'
                : 'bg-accent text-primary hover:opacity-80'
            }`}
            aria-label={listening ? 'Parar gravação' : 'Falar por voz'}
          >
            {listening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        )}

        <button
          type="submit"
          disabled={disabled || !value.trim() || listening}
          className="bg-primary text-primary-foreground rounded-xl p-3 hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
