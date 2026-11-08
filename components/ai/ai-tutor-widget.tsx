'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Maximize2,
  Minimize2,
  MessageSquare,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  '💡 Giải thích đảo ngữ với No sooner... than',
  '📝 Sửa lỗi ngữ pháp câu này giúp mình',
  '🎯 Mẹo làm bài đọc hiểu điền từ THPT',
  '✨ Phân biệt Other, Another và The other',
];

export function AiTutorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        '👋 Chào bạn! Mình là **Gia Sư AI Tiếng Anh** của ENGLISH HUB.\n\nBạn có thể hỏi mình bất cứ câu hỏi nào về **ngữ pháp, từ vựng, giải thích câu hỏi đề thi THPT 2027**, hoặc nhờ mình chấm bài viết tiếng Anh nhé!',
      timestamp: 'Vừa xong',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content:
          data.reply ||
          'Xin lỗi bạn, mình chưa thể trả lời câu hỏi này lúc này. Bạn thử lại nhé!',
        timestamp: new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: '⚠️ Có lỗi kết nối tới máy chủ AI. Bạn vui lòng kiểm tra lại kết nối mạng nhé!',
          timestamp: 'Vừa xong',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove markdown symbols for smooth audio reading
      const clean = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        content:
          'Đoạn chat đã được làm mới! Bạn muốn hỏi về chủ đề tiếng Anh nào tiếp theo?',
        timestamp: 'Vừa xong',
      },
    ]);
  };

  return (
    <>
      {/* ── 1. FLOATING LAUNCHER BUTTON (GÓC PHẢI DƯỚI) ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white font-bold text-xs shadow-2xl shadow-indigo-400 hover:shadow-indigo-500 hover:scale-105 active:scale-95 transition-all duration-200 animate-pulse-glow"
          aria-label="Mở Gia Sư AI"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-300 animate-bounce-gentle" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>
          <span className="tracking-wide">Hỏi Gia Sư AI 24/7</span>
          <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-black uppercase text-amber-200">
            Free
          </span>
        </button>
      )}

      {/* ── 2. CHAT POPUP WINDOW ── */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[92vw] sm:w-[400px] h-[580px] max-h-[85vh] bg-white rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20">
                <Bot className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-indigo-700" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight leading-none">
                    Gia Sư AI Tiếng Anh
                  </h3>
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-bold">
                    THPT 2027
                  </span>
                </div>
                <p className="text-[10px] text-indigo-200 font-medium mt-1">
                  🟢 Sẵn sàng giải đáp 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Làm mới đoạn chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors"
                title="Thu nhỏ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            {messages.map((m) => {
              const isAi = m.role === 'assistant';
              return (
                <div
                  key={m.id}
                  className={cn('flex flex-col', isAi ? 'items-start' : 'items-end')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs',
                      isAi
                        ? 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs'
                        : 'bg-indigo-600 text-white rounded-tr-xs'
                    )}
                  >
                    {/* Message Text with simple formatting */}
                    <div className="whitespace-pre-wrap font-sans">
                      {m.content.split('\n').map((line, idx) => {
                        // Bold markup
                        const formatted = line.replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong>$1</strong>'
                        );
                        return (
                          <p
                            key={idx}
                            className={cn(line.startsWith('•') || line.startsWith('-') ? 'ml-2' : '')}
                            dangerouslySetInnerHTML={{ __html: formatted }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Message Action Footer */}
                  <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400 font-medium">
                    <span>{m.timestamp}</span>
                    {isAi && (
                      <>
                        <span>•</span>
                        <button
                          onClick={() => handleSpeak(m.content)}
                          className="hover:text-indigo-600 transition-colors flex items-center gap-0.5"
                          title="Đọc to câu trả lời"
                        >
                          <Volume2 className="w-3 h-3" /> Nghe
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="hover:text-indigo-600 transition-colors flex items-center gap-0.5"
                          title="Sao chép câu trả lời"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === m.id ? 'Đã chép' : 'Chép'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="p-3 rounded-2xl rounded-tl-xs bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-1.5 shadow-2xs">
                  <Bot className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  <span>Gia sư AI đang soạn câu trả lời...</span>
                  <span className="flex gap-0.5 ml-1">
                    <span className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce" />
                    <span className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce delay-100" />
                    <span className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce delay-200" />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          {messages.length <= 3 && !isLoading && (
            <div className="px-3 py-2 bg-slate-100/70 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {STARTER_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt.replace(/^[^\s]+\s/, ''))}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-[11px] font-semibold text-slate-600 transition-colors shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Hỏi về ngữ pháp, từ vựng, giải đề..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                  input.trim() && !isLoading
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                )}
                title="Gửi câu hỏi"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[9px] text-slate-400 text-center mt-1.5 font-medium">
              Được hỗ trợ bởi Google Gemini AI • Chuẩn kiến thức THPT 2027
            </p>
          </div>
        </div>
      )}
    </>
  );
}
