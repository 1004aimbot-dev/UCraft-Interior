
import React, { useState, useRef, useEffect } from 'react';
import { View } from '../types';
import { ArrowLeft, Sparkles, Image as ImageIcon, Download, Check, Palette, Layout, Wand2, Clock, Layers } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AIPreviewProps {
  navigate: (view: View) => void;
  goBack: () => void;
}

const INTERIOR_STYLES = [
  { id: 'Modern', label: '모던', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80' },
  { id: 'Minimalist', label: '미니멀', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=400&q=80' },
  { id: 'Wood & Cozy', label: '우드/코지', image: 'https://images.unsplash.com/photo-1597072689227-8882273e8f6d?auto=format&fit=crop&w=400&q=80' },
  { id: 'Nordic', label: '북유럽', image: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=400&q=80' }
];

const COLOR_TONES = [
  { id: 'White & Cream', label: '화이트/크림', color: '#FDFBF7', checkColor: 'text-gray-800' },
  { id: 'Beige & Wood', label: '베이지/우드', color: '#E8DCC4', checkColor: 'text-gray-800' },
  { id: 'Light Grey', label: '라이트 그레이', color: '#E5E7EB', checkColor: 'text-gray-800' },
  { id: 'Black & Chic', label: '블랙/시크', color: '#565A63', checkColor: 'text-white' }
];

const QUALITY_OPTIONS = [
  { id: 'Standard', label: '표준 생성', desc: '빠르고 안정적 (Free)' },
  { id: 'Ultra', label: '초고화질', desc: '고급 디테일 (Pro)' }
];

export const AIPreview: React.FC<AIPreviewProps> = ({ navigate, goBack }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('Modern');
  const [selectedColor, setSelectedColor] = useState<string>('White & Cream');
  const [selectedQuality, setSelectedQuality] = useState<string>('Standard');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // Ultra 모드거나 키 오류 발생 시 사용자 키 선택 유도
    if (selectedQuality === 'Ultra') {
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      if (!hasKey) {
          await (window as any).aistudio?.openSelectKey();
      }
    }

    setLoading(true);
    setError(null);
    
    try {
      // 보안 가이드 준수: 호출 직전 인스턴스 생성 및 process.env.API_KEY 참조
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const modelName = selectedQuality === 'Ultra' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [{ 
            text: `High-end interior architecture. Style: ${selectedStyle}, Main Tone: ${selectedColor}. Details: ${prompt}. photorealistic, 8k, professional lighting.` 
          }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            ...(selectedQuality === 'Ultra' ? { imageSize: "2K" } : {})
          }
        }
      });

      const parts = response.candidates?.[0]?.content?.parts;
      const part = parts?.find(p => p.inlineData);
      
      if (part?.inlineData) {
        setGeneratedImage(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
      } else {
        setError("이미지를 생성할 수 없습니다. 요청 내용을 변경해 보세요.");
      }
    } catch (err: any) {
      console.error(err);
      // API Key Expired(400) 또는 권한 오류 시 키 선택창 오픈
      if (err.message?.includes("API key expired") || err.message?.includes("INVALID_ARGUMENT")) {
        setError("API 키가 만료되었습니다. 새로운 키를 선택해 주세요.");
        await (window as any).aistudio?.openSelectKey();
      } else {
        setError("AI 서비스 연결 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen text-text-dark flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center p-4 max-w-md mx-auto w-full">
          <button onClick={goBack} className="p-2 -ml-2 text-gray-800">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center justify-center gap-2 pr-8">
            <Sparkles className="w-5 h-5 text-purple-500 fill-purple-500" />
            <h2 className="text-lg font-bold tracking-tight text-gray-900">AI 인테리어 미리보기</h2>
          </div>
        </div>
      </header>

      <main className="flex-1 p-5 max-w-md mx-auto w-full space-y-8 overflow-y-auto no-scrollbar pb-32">
        
        {/* INTERIOR STYLE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Layout className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-black uppercase tracking-wider">Interior Style</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {INTERIOR_STYLES.map(s => (
              <button 
                key={s.id} 
                onClick={() => setSelectedStyle(s.id)}
                className={`relative aspect-[16/10] rounded-2xl overflow-hidden border-2 transition-all ${selectedStyle === s.id ? 'border-purple-500 ring-2 ring-purple-100' : 'border-transparent'}`}
              >
                <img src={s.image} className="w-full h-full object-cover" alt={s.label} />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{s.label}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* COLOR TONE */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Palette className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-black uppercase tracking-wider">Color Tone</h3>
          </div>
          <div className="flex justify-between items-center px-2">
            {COLOR_TONES.map(t => (
              <button key={t.id} onClick={() => setSelectedColor(t.id)} className="flex flex-col items-center gap-2">
                <div 
                  className={`size-14 rounded-full border border-gray-100 shadow-sm flex items-center justify-center transition-all ${selectedColor === t.id ? 'ring-2 ring-purple-500 ring-offset-2 scale-105' : ''}`} 
                  style={{ backgroundColor: t.color }}
                >
                  {selectedColor === t.id && <Check className={`w-6 h-6 ${t.checkColor}`} />}
                </div>
                <span className={`text-[11px] font-bold ${selectedColor === t.id ? 'text-gray-900' : 'text-gray-400'}`}>{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* GENERATION QUALITY */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Layers className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-black uppercase tracking-wider">Generation Quality</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {QUALITY_OPTIONS.map(q => (
              <button 
                key={q.id} 
                onClick={() => setSelectedQuality(q.id)}
                className={`p-5 rounded-2xl text-left transition-all border-2 ${selectedQuality === q.id ? 'bg-[#9147FF] border-[#9147FF] text-white shadow-lg translate-y-[-2px]' : 'bg-white border-transparent text-gray-400 shadow-sm'}`}
              >
                <p className="text-sm font-bold">{q.label}</p>
                <p className={`text-[10px] mt-1 ${selectedQuality === q.id ? 'text-white/80' : 'text-gray-400'}`}>{q.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* DETAILS & REQUEST */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Wand2 className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-black uppercase tracking-wider">Details & Request</h3>
          </div>
          <div className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm relative">
            <textarea 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)} 
              placeholder="예: 채광이 좋은 넓은 거실, 우드 아트월과 대형 TV가 매립된 형태"
              className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm min-h-[120px] placeholder:text-gray-300 leading-relaxed" 
            />
            <div className="flex justify-end mt-2">
              <button 
                onClick={handleGenerate} 
                disabled={loading || !prompt.trim()}
                className={`px-6 py-3 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center gap-2 ${loading ? 'bg-gray-300' : 'bg-[#9147FF] active:scale-95 hover:opacity-90'}`}
              >
                {loading ? <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span className="text-sm">{loading ? '시공 중...' : '생성하기'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Result Area */}
        <div ref={resultRef} className={`relative rounded-[2.5rem] overflow-hidden min-h-[350px] flex items-center justify-center bg-white border-4 border-white shadow-2xl transition-all ${generatedImage ? 'opacity-100' : 'opacity-40 border-dashed border-gray-100 bg-gray-50'}`}>
          {error ? (
            <div className="text-center p-8">
              <p className="text-red-500 font-bold mb-3 text-sm">{error}</p>
              <button onClick={handleGenerate} className="text-xs text-gray-400 underline font-bold uppercase tracking-widest">Retry</button>
            </div>
          ) : generatedImage ? (
            <div className="relative group w-full h-full">
              <img src={generatedImage} alt="Generated" className="w-full h-auto animate-in fade-in duration-1000" />
              <button onClick={() => {
                const link = document.createElement('a');
                link.href = generatedImage!;
                link.download = `ucraft-ai-${Date.now()}.png`;
                link.click();
              }} className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-full shadow-xl text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <Download className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="text-center p-10 space-y-3">
              <ImageIcon className="w-12 h-12 text-gray-100 mx-auto" />
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Ready to design</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
