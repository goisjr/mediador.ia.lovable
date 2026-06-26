import React, { useState, useRef, useEffect } from 'react';
import { Scale } from 'lucide-react';
import ChatBubble, { ChatMessage } from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';

const INITIAL_MESSAGE: ChatMessage = {
  id: '1',
  role: 'assistant',
  content:
    'Olá! Eu sou a Doula IA, o protótipo de uma  inteligência Artificial treinada para ouvir relatos de mulheres em situação de vulnerabilidade usando técnicas de escuta ativa, dar informações legais e de organismos de apoio e ajudar na formulação clara e objetiva de pretensões jurídicas. Caso não queira se identificar apenas tecle um apelido, o anonimato é um direito seu. Caso queira gravar esta sessão para futuras conversas tecle um email válido ',
};

const Index = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(''); // Variável de memória do caso
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    // -------------------------------------------------------------
    // ETAPA 1: O usuário acabou de digitar o email (Primeira mensagem)
    // -------------------------------------------------------------
    if (!sessionId) {
      const emailDigitado = text.trim().toLowerCase();
      setSessionId(emailDigitado);
      setLoading(true);

      try {
        // Mostra o email que ele digitou na tela
        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
        setMessages((prev) => [...prev, userMsg]);

        // Consulta o nosso banco de dados MongoDB
        const response = await fetch(`https://doula.social.br/api/chat/${emailDigitado}`);
        const data = await response.json();

        if (data.mensagens && data.mensagens.length > 0) {
          // Se achou o caso no banco, carrega toda a conversa antiga!
          setMessages(data.mensagens);
        } else {
          // Se for um email novo, cria uma mensagem de boas-vindas
          const welcomeMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Identificador registrado com sucesso (${emailDigitado}). Por favor, descreva a situação que lhe aflige e que gostaria de se afastar.`,
          };
          setMessages((prev) => [...prev, welcomeMsg]);
        }
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoading(false);
      }
      return; // Interrompe aqui para ele não tentar enviar o email para o Gemini
    }

    // -------------------------------------------------------------
    // ETAPA 2: A conversa normal de mediação já com o sessionId
    // -------------------------------------------------------------
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };
    
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch('https://doula.social.br/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: sessionId, // Agora enviamos de quem é o caso!
          mensagens: updatedMessages 
        }),
      });

      if (!response.ok) throw new Error('Erro na resposta do servidor');

      const data = await response.json();

      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
      };

      setMessages((prev) => [...prev, reply]);
    } catch (error) {
      console.error("Erro ao conectar com o Doula.ia:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Ops! Tive um problema ao me conectar com o servidor. Por favor, tente novamente.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center gap-3 shadow-sm">
        <div className="bg-primary rounded-xl p-2">
          <Scale className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground leading-tight">
            Doula IA
          </h1>
          <p className="text-xs text-muted-foreground">
            A sua assistente de IA nos momentos de vulnerabilidade.
          </p>
        </div>
      </header>

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

      <ChatInput onSend={handleSend} disabled={loading} />
     
      <footer className="border-t border-border bg-card px-4 py-2">
        <p className="text-[10px] text-muted-foreground text-center leading-tight">
          Desenvolvido pelo doutorando José Caldas Gois Júnior sob orientação do Professor Doutor Ricardo Castilho como protótipo de artigo apresentado perante o Congresso Ibero Americano de Direitos Humanos.
	</p>
	<p className="text-[10px] text-muted-foreground text-center leading-tight">
	 Direitos reservados. Modelo de Licenciamento Dual (Dual-licensing), MIT para o sistema open code.
        </p>
      </footer>
    </div>
  );
};

export default Index;
