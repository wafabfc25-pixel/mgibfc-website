import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, Bot } from 'lucide-react';
import { chatWithBotAI, isGreeting, GREETING_RESPONSE } from '../services/chatbotService';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        setMessages([{ role: 'bot', text: GREETING_RESPONSE }]);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Handle greetings locally — no API call needed
      if (isGreeting(userMessage)) {
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'bot', text: GREETING_RESPONSE }]);
          setIsLoading(false);
        }, 400);
        return;
      }

      // All other messages → Claude API with knowledge base
      const response = await chatWithBotAI(userMessage);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "Désolé, une erreur s'est produite. Contactez-nous à contact@bfc.com.tn"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render **bold** markdown
  const renderText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );
  };

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
                  Besoin d'aide ?
                  <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white rotate-45 border-b border-r border-ink/5" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trigger Button */}
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isHovered ? 1.15 : 1, opacity: 1, y: [0, -5, 0] }}
              transition={{
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.3 }
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
            className="w-[320px] sm:w-[360px] h-[450px] sm:h-[500px] bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-ink/5"
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
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 px-4 rounded-[1.5rem] text-[12px] leading-relaxed shadow-sm whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-[#00929f]/90 text-white rounded-tr-none'
                        : 'bg-white/80 text-ink border border-ink/5 rounded-tl-none font-medium'
                    }`}
                  >
                    {renderText(m.text)}
                  </div>
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
                  placeholder="Tapez votre message..."
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
                <p className="text-[9px] font-black uppercase tracking-[0.3em]">Claude AI · MGI BFC</p>
                <div className="h-px bg-gray w-4" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
