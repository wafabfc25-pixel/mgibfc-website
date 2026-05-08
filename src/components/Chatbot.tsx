import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'bot';
  text: string;
  buttons?: string[];
}

interface ChatbotProps {
  lang?: string;
}

// ── Messages de bienvenue bilingues ──────────────────────────
const WELCOME: Record<string, { text: string; buttons: string[] }> = {
  fr: {
    text: "Bonjour ! Je suis l'assistant de MGI BFC. Comment puis-je vous aider aujourd'hui ?",
    buttons: ['Nos services', 'Nous contacter', "L'équipe", 'Nos clients'],
  },
  en: {
    text: "Hello! I'm the MGI BFC assistant. How can I help you today?",
    buttons: ['Our services', 'Contact us', 'The team', 'Our clients'],
  },
};

// ── Composant ────────────────────────────────────────────────
export const Chatbot: React.FC<ChatbotProps> = ({ lang = 'fr' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Session ID persistant pour la mémoire backend
  const [sessionId] = useState(() => {
    try {
      const stored = sessionStorage.getItem('chat_session_id');
      if (stored) return stored;
      const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('chat_session_id', newId);
      return newId;
    } catch (e) {
      return `fallback-${Date.now()}`;
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Message de bienvenue à l'ouverture
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = WELCOME[lang] ?? WELCOME['fr'];
      const timer = setTimeout(() => {
        setMessages([{ role: 'bot', text: welcome.text, buttons: welcome.buttons }]);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length, lang]);

  // Reset si la langue change (chatbot fermé)
  useEffect(() => {
    if (!isOpen) setMessages([]);
  }, [lang, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ── Envoi d'un message (AVEC SESSION ID) ──────────────────────
  const handleSend = async (text?: string) => {
    const userMessage = (text ?? input).trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId }), // AJOUT sessionId
      });

      if (!res.ok) throw new Error(`Erreur réseau : ${res.status}`);

      const data = await res.json();

      setMessages(prev => [...prev, {
        role: 'bot',
        text: data.reply,
        buttons: data.buttons ?? [],
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: lang === 'en'
          ? 'Sorry, an error occurred. Contact us at contact@bfc.com.tn'
          : "Désolé, une erreur s'est produite. Contactez-nous à contact@bfc.com.tn",
        buttons: [],
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Rendu markdown **gras** + retours à la ligne ────────────
  const renderText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );
  };

  const placeholder = lang === 'en' ? 'Type your message...' : 'Tapez votre message...';
  const hoverLabel  = lang === 'en' ? 'Need help?' : 'Besoin d\'aide ?';

  // ── Rendu ───────────────────────────────────────────────────
  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {!isOpen ? (
          <div className="relative flex flex-col items-end gap-3">

            {/* Hover Bubble */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10, x: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10, x: 10 }}
                  className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-ink/5 text-ink text-[11px] font-bold whitespace-nowrap mb-1"
                >
                  {hoverLabel}
                  <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white rotate-45 border-b border-r border-ink/5" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trigger Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isHovered ? 1.15 : 1, opacity: 1, y: [0, -5, 0] }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                scale: { duration: 0.3 },
              }}
              exit={{ scale: 0, opacity: 0 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 bg-[#00929f] text-white rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Bot size={30} className="relative z-10" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white/20 rounded-full"
              />
            </motion.button>
          </div>

        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[320px] sm:w-[360px] h-[500px] sm:h-[560px] bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-ink/5"
          >
            {/* Header */}
            <div className="bg-[#2052a3] p-4 text-white flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-none mb-1 tracking-tight">MGI BFC Consulting</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                    <span className="text-[10px] text-white/70 uppercase tracking-[0.2em] font-black">AI Assistant</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-90 relative z-10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-soft-gray/30">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* Bulle message */}
                  <div
                    className={`max-w-[85%] p-3.5 px-4 rounded-[1.5rem] text-[12px] leading-relaxed shadow-sm whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-[#00929f]/90 text-white rounded-tr-none'
                        : 'bg-white/80 text-ink border border-ink/5 rounded-tl-none font-medium'
                    }`}
                  >
                    {renderText(m.text)}
                  </div>

                  {/* Boutons contextuels sous les messages bot */}
                  {m.role === 'bot' && m.buttons && m.buttons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {m.buttons.map((btn, j) => (
                        <button
                          key={j}
                          onClick={() => handleSend(btn)}
                          disabled={isLoading}
                          className="text-[11px] px-3 py-1.5 bg-white border border-[#2052a3]/20 text-[#2052a3] rounded-full hover:bg-[#2052a3] hover:text-white transition-all duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading Dots */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/60 backdrop-blur-sm px-4 py-3 rounded-[1.2rem] rounded-tl-none border border-ink/5 flex items-center gap-1.5">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay }}
                        className="w-1.5 h-1.5 bg-[#00929f] rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-ink/5">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-soft-gray p-3.5 pr-12 rounded-xl text-[12px] outline-none focus:ring-4 focus:ring-primary/5 transition-all border-2 border-transparent focus:border-primary/10"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    input.trim() && !isLoading
                      ? 'bg-[#2052a3] text-white shadow-xl shadow-[#2052a3]/20 hover:scale-105 active:scale-95'
                      : 'bg-gray/10 text-gray/30'
                  }`}
                >
                  <Send size={16} />
                </button>
              </form>
              <div className="flex items-center justify-center gap-2 mt-3 opacity-30">
                <div className="h-px bg-gray w-4" />
                <p className="text-[9px] font-black uppercase tracking-[0.3em]">MGI BFC · Assistant</p>
                <div className="h-px bg-gray w-4" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};