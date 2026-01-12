import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, User, Bot } from 'lucide-react';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

export const AIChatOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: '반갑습니다. U Craft 총괄 실장입니다. 시공 관련 궁금한 점을 물어보시면 알기 쉽게 설명해 드리겠습니다. 🏠' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change or loading state toggles
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // 1. Check API Key: Support both process.env (Sandbox) and import.meta.env (Vite/Local)
      // Note: Casting to any to avoid TypeScript errors in environments where import.meta is not fully typed
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.API_KEY;

      if (!apiKey) {
         throw new Error("API_KEY_MISSING");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const chat = ai.chats.create({
        // CRITICAL FIX: Use gemini-3-flash-preview as 1.5-flash is deprecated/unstable in this SDK version
        model: 'gemini-3-flash-preview',
        history: history,
        config: {
          temperature: 0.7, 
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
          // Add Safety Settings
          safetySettings: [
             { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
             { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
             { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
             { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          ],
          systemInstruction: `
            당신은 'U Craft 인테리어'의 **총괄 실장**입니다.
            고객에게 전문적이지만 **친절하고 알기 쉽게** 설명하는 것이 목표입니다.

            **[답변 가이드]**
            1. **길이:** 2~3문장 정도로 핵심을 명확하게 설명하세요.
            2. **내용:** 전문 용어를 남발하지 말고, 일반 고객이 이해하기 쉬운 비유를 사용하세요.
            3. **태도:** '죄송합니다'라는 말보다는 '확인해 드리겠습니다'처럼 긍정적이고 능동적인 태도를 유지하세요.
            4. **행동 유도:** 견적 문의 시 "대략적인 비용은 ~이지만, 현장 상황에 따라 달라질 수 있으니 [시공 상담하기]로 상세 문의 부탁드립니다."라고 안내하세요.
          `,
        },
      });

      const result = await chat.sendMessageStream({ message: userMessage });
      
      let fullResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        const chunkText = chunk.text;
        if (chunkText) {
            fullResponse += chunkText;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = fullResponse;
                return newMessages;
            });
        }
      }

    } catch (error: any) {
      console.error("AI Chat Error Details:", error);
      
      let errorMessage = "죄송합니다. 잠시 연결 상태가 좋지 않아 답변을 드리지 못했습니다. 🔧";
      
      // Improve error feedback
      if (error.message === "API_KEY_MISSING") {
          errorMessage = "⚠️ API Key가 설정되지 않았습니다. (.env 파일을 확인해주세요)";
      } else if (error.message?.includes('403') || error.message?.includes('API key')) {
          errorMessage = "⚠️ API Key가 유효하지 않거나 권한이 없습니다. 키 값을 확인해주세요.";
      } else if (error.message?.includes('404') || error.message?.includes('Not Found')) {
          errorMessage = "⚠️ AI 모델을 찾을 수 없습니다. (모델명 오류 또는 지원 종료)";
      } else if (error.message?.includes('429') || error.message?.includes('Quota')) {
          errorMessage = "⚠️ 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.message?.includes('503') || error.message?.includes('Overloaded')) {
          errorMessage = "⚠️ AI 서버가 혼잡합니다. 잠시 후 다시 질문해 주세요.";
      }

      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 z-40 bg-white text-primary p-3 rounded-full shadow-lg shadow-primary/20 border border-primary/10 transition-all hover:scale-105 active:scale-95 group
        ${isOpen ? 'hidden' : 'flex items-center gap-2'}`}
      >
        <div className="relative">
            <div className="absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
            <MessageCircle className="w-6 h-6" />
        </div>
        <span className="text-sm font-bold pr-1">전문가 상담</span>
      </button>

      {/* Chat Window Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Container */}
          <div className="relative w-full sm:max-w-md h-[85vh] sm:h-[600px] bg-[#f2f4f8] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
            
            {/* Header */}
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text-dark text-sm">U Craft 총괄 실장</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-gray-500 font-medium">실시간 답변 중</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`size-8 rounded-full flex items-center justify-center shrink-0 border 
                    ${msg.role === 'user' ? 'bg-gray-200 border-gray-300' : 'bg-white border-gray-200'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <Sparkles className="w-4 h-4 text-primary" />}
                  </div>

                  {/* Bubble */}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap
                    ${msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 max-w-[85%]">
                   <div className="size-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                   </div>
                   <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-1">
                      <div className="size-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="size-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="size-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                   </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="text-center mb-2 px-2">
                 <p className="text-[11px] text-gray-500 font-medium tracking-tight">AI 답변은 참고용이며, 정확한 내용은 방문 상담이 필요합니다.</p>
              </div>
              <form onSubmit={handleSend} className="flex gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="예: 32평 아파트 견적은 얼마인가요?"
                  className="flex-1 bg-gray-100 text-text-dark text-sm rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1.5 p-2 bg-primary text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
};