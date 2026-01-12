
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, User, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const AIChatOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: '반갑습니다. U Craft 총괄 실장입니다. 시공 관련 궁금한 점을 무엇이든 물어보세요. 🏠' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isOpen, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        history: messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        config: {
          systemInstruction: "당신은 'U Craft 인테리어'의 총괄 실장입니다. 친절하고 신뢰감 있는 태도로 답변하세요. 답변은 3문장 이내로 핵심만 전달하며, 구체적인 견적은 [시공 상담 신청] 메뉴를 통해 현장 실측이 필요하다고 안내하세요.",
        },
      });

      const result = await chat.sendMessageStream({ message: userMessage });
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        if (chunk.text) {
          fullResponse += chunk.text;
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1].text = fullResponse;
            return next;
          });
        }
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message?.includes("API key expired") 
        ? "API 키가 만료되었습니다. 관리자에게 문의하거나 잠시 후 다시 시도해 주세요." 
        : "서비스 연결이 지연되고 있습니다. 잠시 후 다시 질문해 주세요.";
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={`fixed bottom-24 right-4 z-40 bg-white text-primary p-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-primary/5 transition-all hover:scale-110 active:scale-95 ${isOpen ? 'hidden' : 'flex items-center gap-2'}`}
      >
        <div className="relative">
          <div className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          <MessageCircle className="w-6 h-6" />
        </div>
        <span className="text-sm font-bold pr-1">상담톡</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[4px]" onClick={() => setIsOpen(false)} />
          <div className="relative w-full sm:max-w-md h-[85vh] sm:h-[650px] bg-[#f8f9fa] rounded-t-[3rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-20">
            <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-gradient-to-br from-[#9147FF] to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-sm">U Craft 실장</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`size-9 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${msg.role === 'user' ? 'bg-gray-100 border-gray-200' : 'bg-white border-purple-50'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-gray-500" /> : <Sparkles className="w-4 h-4 text-[#9147FF]" />}
                  </div>
                  <div className={`px-5 py-4 rounded-[1.5rem] text-[13px] leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-[#9147FF] text-white rounded-tr-none' : 'bg-white text-gray-700 rounded-tl-none border border-gray-50'}`}>
                    {msg.text || <div className="flex gap-1 py-1"><div className="size-1.5 bg-gray-300 rounded-full animate-bounce" /><div className="size-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" /><div className="size-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" /></div>}
                  </div>
                