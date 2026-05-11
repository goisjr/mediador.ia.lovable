import React, { useState, useRef, useEffect } from 'react';
import { Scale } from 'lucide-react';
import ChatBubble, { ChatMessage } from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';

const INITIAL_MESSAGE: ChatMessage = {
  id: '1',
  role: 'assistant',
  content:
    'Olá! Sou o Mediador IA, seu assistente para mediação e resolução de conflitos online. Conte-me sobre a situação que você gostaria de resolver. Estou aqui para ajudar ambas as partes a encontrar uma solução justa e equilibrada.',
};

const Index = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Simulated assistant reply
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Entendi o seu problema. Vamos tentar resolver essa questão da melhor forma possível para todos os envolvidos. Poderia me dar mais detalhes sobre o que aconteceu?',
      };
      setMessages((prev) => [...prev, reply]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center gap-3 shadow-sm">
        <div className="bg-primary rounded-xl p-2">
          <Scale className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground leading-tight">
            Mediador IA
          </h1>
          <p className="text-xs text-muted-foreground">
            Assistente de mediação e composição de litígios
          </p>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={loading} />

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-2">
        <p className="text-[10px] text-muted-foreground text-center leading-tight">
          Desenvolvido pelo doutorando José Caldas Gois Júnior sob orientação do Professor Doutor Ricardo Castilho como protótipo em tese de doutorado perante a FADISP. Direitos reservados. Modelo de Licenciamento Dual (Dual-licensing), MIT para o sistema open code.
        </p>
      </footer>
    </div>
  );
};

export default Index;
