'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import { CfaCopilotEngine, CopilotMessage } from '@/lib/ai/cfa-copilot-engine';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sparkles, Send, Bot, User, ShieldCheck, Lightbulb, Trash2 } from 'lucide-react';

export function CfaAiCopilotChat() {
  const { locale, t } = useI18n();

  const initialGreeting: CopilotMessage = {
    id: 'msg-init',
    sender: 'assistant',
    timestamp: '21:00',
    text:
      locale === 'pt'
        ? 'Olá! Sou o seu **Copiloto Financeiro & Contábil CFA**. Posso responder a dúvidas sobre Runway, amortização de Retainers (ASC 606), deduções do IRS ou otimização de fluxo de caixa. Como posso ajudar?'
        : locale === 'es'
        ? '¡Hola! Soy su **Copiloto Financiero CFA**. Puedo responder preguntas sobre Runway, amortización de Retainers (ASC 606), impuestos del IRS o flujo de caja.'
        : 'Hello! I am your **CFA AI Financial & Accounting Copilot**. I can analyze your Runway, ASC 606 Retainer amortization, IRS tax deductions, or simulate cash flow scenarios. What would you like to explore?',
    metricsReference: 'Connected to Live US GAAP Ledger • 100% Synced',
  };

  const [messages, setMessages] = useState<CopilotMessage[]>([initialGreeting]);

  // Load from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mistercontabil_cfa_chat_history');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        } catch (e) {}
      }
    }
  }, []);

  // Save to localStorage
  const updateMessages = (newMsgs: CopilotMessage[]) => {
    setMessages(newMsgs);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mistercontabil_cfa_chat_history', JSON.stringify(newMsgs));
    }
  };

  const handleClearHistory = () => {
    updateMessages([initialGreeting]);
  };

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    { en: 'How is our Net Runway & Liquidity?', pt: 'Qual é o nosso Runway e liquidez?', es: '¿Cómo está nuestro Runway y liquidez?' },
    { en: 'How does ASC 606 Retainer Amortization work?', pt: 'Como funciona a amortização ASC 606 dos Retainers?', es: '¿Cómo funciona la amortización ASC 606?' },
    { en: 'Are all our 1099 contractor fees tax deductible?', pt: 'Nossos gastos com 1099 são dedutíveis no IRS?', es: '¿Los gastos com 1099 son deducibles en el IRS?' },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Math.random().toString(36).substring(7)}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    const nextMsgs = [...messages, userMsg];
    updateMessages(nextMsgs);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = CfaCopilotEngine.generateResponse(query, locale);
      updateMessages([...nextMsgs, botMsg]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <Card className="border-emerald-500/20 bg-slate-950 flex flex-col h-[520px]">
      <CardHeader className="pb-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm">CFA AI Financial & Accounting Copilot</CardTitle>
              <CardDescription>
                Natural Language Intelligence • US GAAP, ASC 606 & IRS Guidance
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearHistory}
              title="Limpar histórico da conversa"
              className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <Badge variant="success" className="text-[10px]">
              ● AI Copilot Online
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-xl p-3 text-xs space-y-1.5 ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white font-medium ml-auto'
                  : 'bg-slate-900 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="leading-relaxed">{msg.text}</div>
              {msg.metricsReference && (
                <div className="text-[10px] text-emerald-400 font-mono pt-1 border-t border-slate-800">
                  📊 {msg.metricsReference}
                </div>
              )}
              {msg.suggestedAction && (
                <div className="text-[10px] text-sky-300 font-medium pt-0.5">
                  💡 Action: {msg.suggestedAction}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 italic">
            <span className="inline-block animate-bounce">●</span>
            <span className="inline-block animate-bounce delay-100">●</span>
            <span className="inline-block animate-bounce delay-200">●</span>
            <span>CFA Copilot analyzing GL ledger...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/60 flex items-center space-x-2 overflow-x-auto">
        <span className="text-[10px] text-slate-500 shrink-0 flex items-center">
          <Lightbulb className="w-3 h-3 mr-1 text-amber-400" /> Prompts:
        </span>
        {quickPrompts.map((qp, idx) => {
          const promptText = locale === 'pt' ? qp.pt : locale === 'es' ? qp.es : qp.en;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(promptText)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 transition-colors"
            >
              {promptText}
            </button>
          );
        })}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask anything about US GAAP, Runway, Retainers, Taxes or Monte Carlo..."
          className="flex-1 h-9 rounded-lg bg-slate-900 border border-slate-800 px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <Button size="sm" variant="primary" type="submit" disabled={!inputValue.trim()}>
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </Card>
  );
}
