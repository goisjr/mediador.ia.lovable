import React from 'react';
import { Volume2, Square } from 'lucide-react';
import KaraokeText from './KaraokeText';
import { useKaraokeSynthesis } from '@/hooks/useKaraokeSynthesis';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { speakWithHighlight, cancel, currentWordIndex, speaking } = useKaraokeSynthesis();
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isAssistant
            ? 'bg-card border border-border shadow-sm rounded-bl-md'
            : 'bg-primary text-primary-foreground rounded-br-md'
        }`}
      >
        {isAssistant ? (
          <>
            <p className="text-[11px] font-medium text-primary mb-1.5 uppercase tracking-wider">
              Mediador IA
            </p>
            <KaraokeText text={message.content} highlightIndex={currentWordIndex} />
            <div className="mt-2 flex items-center gap-2">
              {speaking ? (
                <button
                  onClick={cancel}
                  className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors"
                >
                  <Square className="w-3 h-3" />
                  Parar
                </button>
              ) : (
                <button
                  onClick={() => speakWithHighlight(message.content)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Volume2 className="w-3 h-3" />
                  Ouvir
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-xl leading-relaxed">{message.content}</p>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
