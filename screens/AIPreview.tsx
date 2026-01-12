import React, { useState, useRef, useEffect } from 'react';
import { View } from '../types';
import { ArrowLeft, Sparkles, Image as ImageIcon, RotateCcw, MessageSquare, Check, Palette, Download, Eye, Clock, History, Layout, Lightbulb, Plus, Grid, Wand2, X, Info, ChevronDown, ChevronUp, Hash, Hammer, Link as LinkIcon, Layers } from 'lucide-react';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

interface AIPreviewProps {
  navigate: (view: View) => void;
  goBack: () => void;
}

const INTERIOR_STYLES = [
  { 
    id: 'Modern', 
    label: '모던',
    previews: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=400&q=80'
    ],
    description: '간결한 라인과 미니멀한 가구, 개방감 있는 공간을 특징으로 하는 세련된 스타일입니다. 유리, 스틸, 대리석 등의 매끄러운 소재와 중립적인 컬러 팔레트를 사용하여 현대적이고 차분한 분위기를 연출합니다.'
  },
  { 
    id: 'Minimalist', 
    label: '미니멀',
    previews: [
        'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80'
    ],
    description: "'Less is more' 철학을 따르는 절제된 디자인입니다. 모노톤 색상, 숨겨진 수납공간, 기하학적 형태를 강조하며, 불필요한 장식을 배제하여 선(Zen)과 같은 여백의 미를 살립니다."
  },
  { 
    id: 'Wood & Cozy', 
    label: '우드/코지',
    previews: [
        'https://images.unsplash.com/photo-1597072689227-8882273e8f6d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1616047006789-b7af5afb8c01?auto=format&fit=crop&w=400&q=80'
    ],
    description: "천연 목재와 부드러운 질감이 어우러진 따뜻한 스타일입니다. 편안한 가구와 3000K 대의 은은한 조명을 활용하여, 휴식에 최적화된 '휘게(Hygge)' 감성의 아늑한 공간을 만듭니다."
  },
  { 
    id: 'Classic Luxury', 
    label: '클래식/럭셔리',
    previews: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1505693416388-b0346809d0bf?auto=format&fit=crop&w=400&q=80'
    ],
    description: '웨인스코팅, 크라운 몰딩 등 우아한 디테일이 돋보이는 고급 스타일입니다. 벨벳이나 실크 같은 풍성한 패브릭, 샹들리에, 골드/브라스 포인트를 더해 시대를 초월하는 웅장함을 연출합니다.'
  },
  { 
    id: 'Vintage Retro', 
    label: '빈티지',
    previews: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1522771753035-10a637d5d4a1?auto=format&fit=crop&w=400&q=80'
    ],
    description: '미드센추리 모던 가구와 대담한 패턴이 조화를 이루는 감각적인 스타일입니다. 짙은 원목, 가죽, 채도가 높은 따뜻한 컬러를 사용하여 개성 있고 향수를 불러일으키는 공간을 완성합니다.'
  },
  { 
    id: 'Nordic', 
    label: '북유럽',
    previews: [
        'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=400&q=80'
    ],
    description: '화이트 베이스에 밝은 오크 우드를 매치한 실용적인 북유럽 스타일입니다. 자연광을 중요시하며, 울이나 린넨 같은 포근한 패브릭과 파스텔 톤 포인트로 생기를 더합니다.'
  },
  { 
    id: 'Industrial', 
    label: '인더스트리얼',
    previews: [
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519643381401-22c77e60520e?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80'
    ],
    description: '노출 콘크리트, 벽돌, 배관 등을 그대로 드러낸 거친 매력의 스타일입니다. 블랙 메탈, 고재, 가죽 등 원초적인 소재를 활용하여 빈티지한 공장(Loft) 분위기를 세련되게 재해석합니다.'
  },
  { 
    id: 'Planterior', 
    label: '플랜테리어',
    previews: [
        'https://images.unsplash.com/photo-1592138722949-16086f443b87?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1463797221720-6b07e6426c24?auto=format&fit=crop&w=400&q=80'
    ],
    description: '실내 곳곳에 식물을 배치하여 자연과 하나 되는 플랜테리어 스타일입니다. 내추럴한 우드와 스톤 소재를 베이스로 하여, 숲속에 있는 듯한 싱그러움과 활력을 불어넣습니다.'
  },
  { 
    id: 'Moroccan', 
    label: '모로칸',
    previews: [
        'https://images.unsplash.com/photo-1534349762913-96c225597733?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&w=400&q=80'
    ],
    description: '이국적인 패턴 타일과 아치형 구조가 특징인 모로칸 스타일입니다. 다채로운 색감의 패브릭, 라탄, 낮은 좌식 가구를 활용하여 자유롭고 따뜻한 휴양지 감성을 연출합니다.'
  },
];

const COLOR_TONES = [
  { id: 'White & Cream', label: '화이트/크림', color: '#FDFBF7', checkColor: 'text-gray-800' },
  { id: 'Beige & Wood', label: '베이지/우드', color: '#E8DCC4', checkColor: 'text-gray-800' },
  { id: 'Light Grey', label: '라이트 그레이', color: '#E5E7EB', checkColor: 'text-gray-800' },
  { id: 'Dark Grey', label: '다크 그레이', color: '#4B5563', checkColor: 'text-white' },
  { id: 'Black & Chic', label: '블랙/시크', color: '#111827', checkColor: 'text-white' },
  { id: 'Sage Green', label: '세이지 그린', color: '#C1CFA0', checkColor: 'text-gray-800' },
  { id: 'Navy Blue', label: '네이비', color: '#1E3A8A', checkColor: 'text-white' },
  { id: 'Terracotta', label: '테라코타', color: '#E07A5F', checkColor: 'text-white' },
];

const VIEW_ANGLES = [
  { id: 'Front View', label: '정면' },
  { id: '45-degree Side View', label: '측면 (45°)' },
  { id: 'Top Down Plan View', label: '탑뷰 (평면도)' },
  { id: 'Low Angle', label: '로우 앵글' },
  { id: 'High Angle', label: '하이 앵글' },
];

// Quality Options
const QUALITY_OPTIONS = [
  { id: 'Standard', label: '표준', desc: '빠른 생성' },
  { id: 'High', label: '고품질', desc: '디테일 향상' },
  { id: 'Ultra', label: '초고화질', desc: '최고 해상도 (Pro)' }
];

const ROOM_TEMPLATES = [
  { 
    id: 'living', 
    label: '거실', 
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80',
    prompt: '채광이 좋은 넓은 거실, 텍스처가 살아있는 베이지톤 패브릭 소파, 대형 TV가 매립된 우드 아트월, 천장 라인 조명과 따뜻한 색감의 플로어 스탠드, 헤링본 패턴의 원목 마루 바닥, 미니멀하고 고급스러운 분위기' 
  },
  { 
    id: 'kitchen', 
    label: '주방', 
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    prompt: '현대적인 개방형 주방, 비앙코 카라라 대리석 아일랜드 식탁, 매트 화이트 빌트인 수납장, 골드 포인트 펜던트 조명, 은은한 간접 조명, 세련된 포세린 타일 바닥' 
  },
  { 
    id: 'bedroom', 
    label: '침실', 
    image: 'https://images.unsplash.com/photo-1616594039964-40891a909d99?auto=format&fit=crop&w=400&q=80',
    prompt: '호텔 스위트룸 스타일의 침실, 프리미엄 린넨 침구와 킹사이즈 침대, 템바보드 침대 헤드월, 따뜻한 3000K 무드등, 이중 암막 커튼, 아늑한 우드 플로어링' 
  },
  { 
    id: 'bathroom', 
    label: '욕실', 
    image: 'https://images.unsplash.com/photo-1620626012053-8465242f306c?auto=format&fit=crop&w=400&q=80',
    prompt: '5성급 호텔 스타일 욕실, 베이지 톤의 600각 무광 포세린 타일 졸리컷 시공, 조적 욕조와 매립형 수전, 타원형 LED 거울, 니켈 소재 수전, 천장 간접 조명' 
  },
  { 
    id: 'dressroom', 
    label: '드레스룸', 
    image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=400&q=80',
    prompt: '럭셔리 부티크 스타일 드레스룸, 시스템 행거와 유리 도어 수납장, 중앙 아일랜드 악세사리 장, 선반 내장 LED 라인 조명, 대형 전신 거울, 화사한 다운라이트' 
  },
  { 
    id: 'cafe', 
    label: '상업(카페)', 
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80',
    prompt: '인스타그래머블한 카페, 층고가 높은 노출 콘크리트 천장, 라탄 의자와 원목 테이블, 대형 관엽 식물 플랜테리어, 통유리창으로 들어오는 자연광, 테라조 바닥 타일' 
  },
];

const PROMPT_GUIDES = [
  {
    id: 'lighting',
    label: '조명 & 분위기',
    items: ['따뜻한 3000K 조명', '은은한 간접 조명', '화려한 샹들리에', '자연 채광 가득', '호텔 같은 아늑함']
  },
  {
    id: 'material',
    label: '바닥 & 벽 마감',
    items: ['600각 포세린 타일', '헤링본 원목 마루', '비앙코 카라라 대리석', '템바보드 아트월', '거친 질감의 콘크리트']
  },
  {
    id: 'furniture',
    label: '가구 & 디테일',
    items: ['패브릭 모듈 소파', '원목 식탁 세트', '골드 포인트 수전', '대형 전신 거울', '플랜테리어 식물']
  }
];

const SUGGESTION_KEYWORDS = [
  "따뜻한 3000K 조명", "은은한 간접 조명", "화려한 샹들리에", "자연 채광 가득", "호텔 같은 아늑함",
  "러그 질감", "패브릭 질감", "천연 나무 소재", "세라믹 소재", "메탈릭 마감"
];

const REFINE_SUGGESTIONS = [
    "더 밝은 조명으로 변경", "식물 추가하여 생기있게", "바닥을 헤링본으로 변경",
    "모던한 액자 추가", "커튼을 블라인드로 변경", "전체적인 톤을 따뜻하게",
    "가구 디테일 더 선명하게", "창밖 풍경 추가"
];

// Cycling Loading Messages
const LOADING_MESSAGES = [
  "현장 구조 분석 및 설계 중...",
  "목공 프레임 레이아웃 잡는 중...",
  "프리미엄 타일 텍스처 매칭 중...",
  "공간 조명 및 톤 앤 매너 조정...",
  "U Craft 디테일 마감 처리 중..."
];

interface HistoryItem {
  id: string;
  sequenceNumber: number; 
  imageUrl: string;
  style: string;
  color: string;
  angle: string;
  prompt: string;
  quality: string; 
  timestamp: number;
}

// Helper to extract key features from prompt for display
const extractKeyFeatures = (prompt: string): string[] => {
  const parts = prompt.split(/,|\+/).map(s => s.trim()).filter(s => s.length > 0);
  const keywords = parts.filter(part => 
    SUGGESTION_KEYWORDS.some(k => part.includes(k)) || 
    part.includes('조명') || part.includes('타일') || part.includes('마루') || part.includes('우드') || part.includes('분위기') ||
    part.includes('패브릭') || part.includes('콘크리트') || part.includes('대리석') || part.includes('질감') || part.includes('소재')
  );
  if (keywords.length === 0) {
     return parts.slice(0, 3);
  }
  return keywords.slice(0, 4);
};

export const AIPreview: React.FC<AIPreviewProps> = ({ navigate, goBack }) => {
  const [prompt, setPrompt] = useState('');
  const [refImageUrl, setRefImageUrl] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('Modern');
  const [selectedColor, setSelectedColor] = useState<string>('White & Cream');
  const [selectedAngle, setSelectedAngle] = useState<string>('Front View');
  const [selectedQuality, setSelectedQuality] = useState<string>('Standard');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sequenceCounter, setSequenceCounter] = useState(1);

  // Refinement State
  const [isRefining, setIsRefining] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');
  
  // Prompt Guide State
  const [showPromptGuide, setShowPromptGuide] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  // Cycle loading messages
  useEffect(() => {
    if (!loading) {
      setLoadingMsgIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500); 
    return () => clearInterval(interval);
  }, [loading]);

  const handleRoomSelect = (room: typeof ROOM_TEMPLATES[0]) => {
    setSelectedRoom(room.id);
    setPrompt(room.prompt);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setSelectedRoom(null);
  };

  const handleRandomRefImage = () => {
     const images = [
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
      ];
      const random = images[Math.floor(Math.random() * images.length)];
      setRefImageUrl(random);
  };

  const urlToBase64 = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url, {
             mode: 'cors',
             credentials: 'omit'
        });
        if (!response.ok) throw new Error('이미지를 불러오는데 실패했습니다.');
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Image fetch error:", e);
        throw new Error("참고 이미지를 불러올 수 없습니다. 보안 정책으로 인해 차단되었을 수 있습니다.");
    }
  };

  const addKeyword = (keyword: string) => {
    if (isRefining) {
        setRefinePrompt((prev) => {
            if (prev.includes(keyword)) return prev;
            const trimmed = prev.trim();
            if (trimmed === '') return keyword;
            return `${trimmed}, ${keyword}`;
        });
    } else {
        setPrompt((prev) => {
            if (prev.includes(keyword)) return prev;
            const trimmed = prev.trim();
            if (trimmed === '') return keyword;
            if (trimmed.endsWith(',')) return `${trimmed} ${keyword}`;
            return `${trimmed}, ${keyword}`;
        });
    }
  };

  const handleGenerate = async () => {
    const activePrompt = isRefining ? refinePrompt : prompt;
    if (!activePrompt.trim()) return;

    // Check API Key
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.API_KEY;

    if (!apiKey) {
        setError("API Key가 설정되지 않았습니다. .env 파일을 확인해주세요.");
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      let contents: any[] = [];
      let refBase64: string | null = null;
      
      // Determine Model
      let model = 'gemini-2.5-flash-image';
      let qualityPromptSuffix = '';
      
      // 1. Safety Settings
      const safetySettings = [
         { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
         { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
         { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
         { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      ];

      // 2. Configuration
      let imageConfig: any = { aspectRatio: '1:1' };
      if (selectedQuality === 'High') {
        qualityPromptSuffix = ', high quality, detailed textures, 4k resolution, highly detailed';
      } else if (selectedQuality === 'Ultra') {
        model = 'gemini-3-pro-image-preview';
        qualityPromptSuffix = ', masterpiece, best quality, 8k resolution, photorealistic, professional architectural photography';
        imageConfig = { imageSize: '2K', aspectRatio: '1:1' };
      } else {
        qualityPromptSuffix = ', good quality, sharp focus';
      }

      // Merge into final config object where safetySettings MUST reside for new SDK
      const generationConfig = {
          imageConfig: imageConfig,
          safetySettings: safetySettings 
      };
      
      const styleDesc = INTERIOR_STYLES.find(s => s.id === selectedStyle)?.description || selectedStyle;
      const colorDesc = COLOR_TONES.find(c => c.id === selectedColor)?.label || selectedColor;

      // Safe prompt injection to avoid triggers
      const safetySuffix = " no people, empty room, architectural photography, safe content, interior design only";

      // 3. Prepare Contents
      if (isRefining && generatedImage) {
        // Img2Img (Refinement)
        const base64Data = generatedImage.split(',')[1];
        contents = [{
            parts: [
                { text: `Modify the interior design. ${refinePrompt}. 
                         Color: ${selectedColor}. Style: ${selectedStyle}. 
                         View: ${selectedAngle}. ${qualityPromptSuffix} ${safetySuffix}` },
                { inlineData: { mimeType: 'image/png', data: base64Data } }
            ]
        }];
      } else {
        // Handle Reference Image with Fallback
        if (refImageUrl && !isRefining) {
             try {
                refBase64 = await urlToBase64(refImageUrl);
             } catch (imgErr) {
                console.warn("Reference image load failed, proceeding with text only", imgErr);
                // Don't error out, just continue without image and warn user implicitly by result
             }
        }

        if (refBase64 && !isRefining) {
             // Text + Image
             contents = [{
                 parts: [
                    { text: `Redesign this interior. Style: ${selectedStyle} (${styleDesc}). 
                             Color: ${selectedColor} (${colorDesc}).
                             ${prompt}. ${qualityPromptSuffix} ${safetySuffix}` },
                    { inlineData: { mimeType: 'image/jpeg', data: refBase64 } }
                 ]
            }];
        } else {
             // Text Only
             contents = [{
                parts: [ { text: `Generate a photorealistic interior design. 
                                  Style: ${selectedStyle} (${styleDesc}).
                                  Color: ${selectedColor} (${colorDesc}).
                                  View: ${selectedAngle}.
                                  Details: ${prompt}.
                                  ${qualityPromptSuffix} ${safetySuffix}` } ]
            }];
        }
      }

      // 4. API Call
      const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: generationConfig, // safetySettings is inside here
      });

      const parts = response.candidates?.[0]?.content?.parts;
      let imageFound = false;

      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            const imageUrl = `data:${mimeType};base64,${base64Data}`;
            
            setGeneratedImage(imageUrl);
            
            const newItem: HistoryItem = {
              id: Date.now().toString(),
              sequenceNumber: sequenceCounter,
              imageUrl: imageUrl,
              style: selectedStyle,
              color: selectedColor,
              angle: selectedAngle,
              quality: selectedQuality,
              prompt: isRefining ? `(수정) ${refinePrompt}` : prompt,
              timestamp: Date.now()
            };
            
            setHistory(prev => [newItem, ...prev]);
            setSequenceCounter(prev => prev + 1);
            imageFound = true;
            
            if (isRefining) {
                setIsRefining(false);
                setRefinePrompt('');
            }
            break;
          }
        }
      }

      if (!imageFound) {
         const finishReason = response.candidates?.[0]?.finishReason;
         console.log("Finish Reason:", finishReason);
         if (finishReason === 'SAFETY') {
             setError("안전 정책에 의해 이미지가 생성되지 않았습니다. (침실/욕실 등 민감한 키워드 주의)");
         } else {
             setError("이미지를 생성할 수 없습니다. 잠시 후 다시 시도해주세요.");
         }
      }

    } catch (err: any) {
      console.error(err);
      let errorMsg = "AI 서비스 연결 중 오류가 발생했습니다.";
      if (err.message) {
          if (err.message.includes('400')) errorMsg = "요청 형식이 올바르지 않습니다.";
          if (err.message.includes('503')) errorMsg = "서버가 혼잡합니다. 잠시 후 다시 시도해주세요.";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `u-craft-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const restoreHistory = (item: HistoryItem) => {
    setGeneratedImage(item.imageUrl);
    setSelectedStyle(item.style);
    setSelectedColor(item.color || 'White & Cream');
    setSelectedAngle(item.angle);
    setPrompt(item.prompt);
    if (item.quality) setSelectedQuality(item.quality);
    setError(null);
    setIsRefining(false);
    setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="bg-background-light min-h-screen text-text-dark flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center p-4 justify-between">
          <button onClick={goBack} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
            <ArrowLeft className="w-6 h-6 text-text-dark" />
          </button>
          <div className="flex items-center gap-2 flex-1 justify-center pr-10">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold leading-tight tracking-tight">AI 인테리어 미리보기</h2>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-8">
          
          {/* Configuration Area - ALWAYS VISIBLE */}
          <div className="space-y-5">
            {/* Room Type Selection */}
            <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 px-1 flex items-center gap-1">
                <Layout className="w-4 h-4 text-gray-500" />
                공간 유형 선택
            </label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 overflow-visible h-[52px] items-center">
                {ROOM_TEMPLATES.map((room) => (
                <div key={room.id} className="relative group shrink-0">
                    <button
                    onMouseEnter={() => setHoveredRoom(room.id)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    onClick={() => handleRoomSelect(room)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border
                        ${selectedRoom === room.id
                        ? 'bg-gray-800 text-white border-gray-800 shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                    {room.label}
                    </button>
                    
                    {hoveredRoom === room.id && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 h-28 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-[60] animate-in fade-in zoom-in duration-200 origin-bottom">
                            <img src={room.image} alt={room.label} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-2">
                                <span className="text-white text-[10px] font-bold tracking-wide">{room.label} 예시</span>
                            </div>
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100"></div>
                        </div>
                    )}
                </div>
                ))}
            </div>
            </div>

            {/* NEW FEATURE: Reference Image Input */}
            <div className="space-y-2 pt-1">
                <label className="text-sm font-bold text-gray-700 px-1 flex items-center gap-1">
                    <LinkIcon className="w-4 h-4 text-gray-500" />
                    참고 이미지 URL (선택)
                </label>
                <div className="flex gap-2">
                    <input 
                        type="text"
                        placeholder="URL 입력 또는 랜덤 생성 버튼 활용" 
                        className="flex-1 p-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-400"
                        value={refImageUrl}
                        onChange={(e) => setRefImageUrl(e.target.value)}
                        disabled={loading}
                    />
                    <button 
                        type="button"
                        onClick={handleRandomRefImage}
                        disabled={loading}
                        className="px-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition-colors"
                        title="랜덤 이미지 생성"
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>
                </div>
                {refImageUrl && (
                    <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mt-2">
                        <img src={refImageUrl} alt="Reference" className="w-full h-full object-cover opacity-80" />
                         <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded">참고 이미지 적용됨</span>
                         </div>
                        <button 
                            onClick={() => setRefImageUrl('')}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </div>

            {/* Style Selection - UPDATED COLLAGE GRID */}
            <div className="space-y-3 pt-2">
                <label className="text-sm font-bold text-gray-800 px-1 flex items-center justify-between">
                    <span>인테리어 스타일 및 질감</span>
                    <span className="text-[10px] font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">1개 선택</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INTERIOR_STYLES.map((style) => (
                    <div 
                        key={style.id} 
                        className="relative group/style-container"
                        onMouseEnter={() => setHoveredStyle(style.id)}
                        onMouseLeave={() => setHoveredStyle(null)}
                    >
                        <button
                            onClick={() => setSelectedStyle(style.id)}
                            className={`relative w-full h-40 rounded-xl overflow-hidden transition-all group flex flex-col justify-end border border-gray-100
                            ${selectedStyle === style.id
                                ? 'ring-2 ring-offset-2 ring-purple-500 shadow-lg z-10'
                                : 'hover:ring-2 hover:ring-purple-200'
                            }`}
                        >
                            {/* Collage of 3 images */}
                            <div className="absolute inset-0 grid grid-cols-3 gap-0.5 bg-gray-100">
                                <div className="col-span-2 relative h-full">
                                    <img src={style.previews[0]} alt="" loading="lazy" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                                </div>
                                <div className="col-span-1 flex flex-col gap-0.5 h-full">
                                    <div className="relative flex-1 overflow-hidden">
                                        <img src={style.previews[1]} alt="" loading="lazy" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                    <div className="relative flex-1 overflow-hidden">
                                        <img src={style.previews[2]} alt="" loading="lazy" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Overlay Gradient */}
                            <div className={`absolute inset-0 transition-colors ${selectedStyle === style.id ? 'bg-black/30' : 'bg-black/40 group-hover:bg-black/30'}`}></div>

                            {/* Selection Checkmark */}
                            {selectedStyle === style.id && (
                                <div className="absolute top-2 right-2 bg-purple-600 rounded-full p-1 shadow-sm z-20 animate-in zoom-in duration-200">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}

                            {/* Label */}
                            <div className="relative z-10 p-2 text-center w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-8">
                                <span className={`text-sm font-bold text-white shadow-sm leading-tight drop-shadow-md`}>
                                    {style.label}
                                </span>
                            </div>
                        </button>

                        {/* HOVER TOOLTIP */}
                        {hoveredStyle === style.id && (
                            <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[105%] min-w-[240px] bg-gray-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl z-[60] animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none text-left border border-white/10">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3" />
                                        {style.label} 스타일 특징
                                    </span>
                                    <p className="text-[11px] leading-relaxed text-gray-200 break-keep font-medium opacity-90">
                                        {style.description}
                                    </p>
                                </div>
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-gray-900/95"></div>
                            </div>
                        )}
                    </div>
                    ))}
                </div>
            </div>

            {/* Color Tone Selection */}
            <div className="space-y-3 pt-1">
                <label className="text-sm font-bold text-gray-800 px-1 flex items-center gap-1">
                    <Palette className="w-4 h-4 text-gray-500" />
                    메인 컬러 톤
                </label>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
                    {COLOR_TONES.map((tone) => (
                        <button
                            key={tone.id}
                            onClick={() => setSelectedColor(tone.id)}
                            className={`group flex flex-col items-center gap-2 min-w-[60px] cursor-pointer transition-all ${selectedColor === tone.id ? 'scale-110' : 'hover:scale-105'}`}
                        >
                            <div 
                                className={`size-12 rounded-full shadow-sm flex items-center justify-center transition-all ${selectedColor === tone.id ? 'ring-2 ring-offset-2 ring-purple-500' : 'ring-1 ring-gray-200'}`}
                                style={{ backgroundColor: tone.color }}
                            >
                                {selectedColor === tone.id && (
                                    <Check className={`w-5 h-5 ${tone.checkColor}`} />
                                )}
                            </div>
                            <span className={`text-[10px] font-medium ${selectedColor === tone.id ? 'text-purple-700 font-bold' : 'text-gray-500'}`}>
                                {tone.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* View Angle Selection (Tag Cloud Layout) */}
            <div className="space-y-3 pt-1">
                <label className="text-sm font-bold text-gray-800 px-1 flex items-center gap-1">
                    <Eye className="w-4 h-4 text-gray-500" />
                    시선 각도
                </label>
                <div className="flex flex-wrap gap-2">
                    {VIEW_ANGLES.map((angle) => (
                    <button
                        key={angle.id}
                        onClick={() => setSelectedAngle(angle.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all border
                        ${selectedAngle === angle.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-200 hover:text-indigo-600'
                        }`}
                    >
                        {selectedAngle === angle.id && <Check className="w-3 h-3" />}
                        {angle.label}
                    </button>
                    ))}
                </div>
            </div>

            {/* Quality Selection - NEW */}
            <div className="space-y-3 pt-1">
                <label className="text-sm font-bold text-gray-800 px-1 flex items-center gap-1">
                    <Layers className="w-4 h-4 text-gray-500" />
                    이미지 품질 선택
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {QUALITY_OPTIONS.map((quality) => (
                    <button
                        key={quality.id}
                        onClick={() => setSelectedQuality(quality.id)}
                        className={`flex flex-col items-center justify-center gap-0.5 py-3 rounded-xl transition-all border
                        ${selectedQuality === quality.id
                            ? 'bg-gray-800 text-white border-gray-800 shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                    >
                        <span className="text-xs font-bold">{quality.label}</span>
                        <span className={`text-[9px] ${selectedQuality === quality.id ? 'text-gray-300' : 'text-gray-400'}`}>{quality.desc}</span>
                    </button>
                    ))}
                </div>
            </div>
          </div>

          {/* Main Input Area - ALWAYS VISIBLE */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    상세 요청 사항
                        <button 
                        onClick={() => setShowPromptGuide(!showPromptGuide)}
                        className="flex items-center gap-0.5 text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors px-2 py-0.5 rounded-full bg-purple-50 hover:bg-purple-100 border border-purple-100"
                    >
                        <Info className="w-3 h-3" />
                        {showPromptGuide ? '가이드 닫기' : '작성 팁 보기'}
                        {showPromptGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                </label>
            </div>

            {/* PROMPT GUIDE SECTION */}
            {showPromptGuide && (
                <div className="bg-white border border-purple-100 rounded-xl p-3 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200 mb-2">
                    <div className="space-y-3">
                        {PROMPT_GUIDES.map((guide) => (
                            <div key={guide.id} className="space-y-1.5">
                                <h4 className="text-[11px] font-bold text-gray-800 flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-purple-500"></div>
                                    {guide.label}
                                </h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {guide.items.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => addKeyword(item)}
                                            className="text-[10px] px-2 py-1 bg-gray-50 border border-gray-200 rounded text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
                                        >
                                            + {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <textarea 
                value={prompt}
                onChange={handlePromptChange}
                placeholder="예: [조명] 천장에 간접 조명을 넣고, [바닥] 밝은 포세린 타일로 마감해주세요. [가구] 소파 뒤에는 액자를 걸고 싶어요."
                className="w-full p-4 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none min-h-[100px] resize-none text-base bg-white shadow-sm placeholder:text-gray-400 leading-relaxed"
                disabled={loading}
            />
            
            {/* Suggestion Keywords Chips - Updated to rounded-full */}
            <div className="flex flex-wrap gap-2 pt-2 pb-1">
                {SUGGESTION_KEYWORDS.map((keyword) => (
                    <button
                        key={keyword}
                        onClick={() => addKeyword(keyword)}
                        className="flex items-center gap-1 text-[11px] font-medium px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-full hover:border-purple-300 hover:text-purple-700 hover:bg-purple-50 transition-all active:scale-95 shadow-sm"
                    >
                        <Plus className="w-3 h-3" />
                        {keyword}
                    </button>
                ))}
            </div>
            
            {/* Generate Button (Always Visible) */}
            <button 
                onClick={handleGenerate}
                disabled={loading || (!prompt.trim() && !refImageUrl)}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-2
                ${loading || (!prompt.trim() && !refImageUrl)
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.01] active:scale-[0.99] shadow-purple-500/30'
                }`}
            >
                {loading ? (
                <>
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="font-bold">
                        {isRefining ? 'U Craft AI 수정 중...' : 'U Craft AI 시공 중...'}
                    </span>
                </>
                ) : (
                <>
                    <Sparkles className="w-5 h-5" />
                    <span>{generatedImage ? '새로운 설정으로 다시 생성' : '이미지 생성하기'}</span>
                </>
                )}
            </button>
          </div>

          {/* Result Area */}
          <div ref={resultRef} 
               className={`relative rounded-2xl border overflow-hidden shadow-inner flex items-center justify-center group transition-all duration-500
               ${generatedImage || loading ? 'min-h-[300px] border-purple-100 shadow-purple-50 bg-white' : 'min-h-[100px] border-dashed border-gray-300'}`}
               style={{ 
                   backgroundColor: (!generatedImage && !loading) ? `${COLOR_TONES.find(c => c.id === selectedColor)?.color}15` : undefined 
               }}
          >
             
             {error ? (
               <div className="text-center p-6">
                 <div className="mx-auto size-12 bg-red-50 rounded-full flex items-center justify-center mb-3">
                   <RotateCcw className="w-6 h-6 text-red-500" />
                 </div>
                 <p className="text-gray-800 font-bold mb-1">오류가 발생했습니다</p>
                 <p className="text-sm text-gray-500 max-w-[250px] mx-auto break-keep">{error}</p>
               </div>
             ) : (
                <>
                    {generatedImage && (
                        <div className="relative w-full h-full animate-in fade-in duration-700">
                            <img src={generatedImage} alt="AI Generated Interior" className="w-full h-auto object-cover" />
                            
                            {/* Metadata Overlay Tags - Hide when loading refinement to clean up view */}
                            {!loading && (
                                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 items-start max-w-[80%]">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 shadow-sm flex items-center gap-1">
                                        <Palette className="w-3 h-3 text-purple-300" />
                                        {INTERIOR_STYLES.find(s => s.id === selectedStyle)?.label}
                                    </span>
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 shadow-sm flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full border border-white/30" style={{ backgroundColor: COLOR_TONES.find(c => c.id === selectedColor)?.color }}></div>
                                        {COLOR_TONES.find(c => c.id === selectedColor)?.label}
                                    </span>
                                    <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 shadow-sm flex items-center gap-1">
                                        <Eye className="w-3 h-3 text-indigo-300" />
                                        {VIEW_ANGLES.find(a => a.id === selectedAngle)?.label}
                                    </span>
                                    {selectedRoom && (
                                        <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
                                            {ROOM_TEMPLATES.find(r => r.id === selectedRoom)?.label}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* U Craft Watermark */}
                            {!loading && (
                                <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 opacity-70 pointer-events-none">
                                    <div className="bg-black/40 backdrop-blur-sm p-1.5 rounded-lg border border-white/10 shadow-sm">
                                        <Hammer className="w-3 h-3 text-white/90" />
                                    </div>
                                    <div className="flex flex-col items-start drop-shadow-md">
                                        <span className="text-[8px] text-white/80 font-medium uppercase tracking-widest leading-none">Designed by</span>
                                        <span className="text-[11px] text-white font-black tracking-widest uppercase leading-none mt-0.5 font-display">U CRAFT</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Empty State - Only show when not generating and no image */}
                    {!generatedImage && !loading && (
                        <div className="text-center p-6 text-gray-400 py-10">
                            <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-20" />
                            <p className="text-xs">상단 옵션을 선택하고 생성 버튼을 눌러주세요</p>
                            <p className="text-[10px] text-gray-400 mt-1 opacity-60">선택하신 컬러 톤이 배경에 미리 적용되었습니다</p>
                        </div>
                    )}

                    {/* CUSTOM U CRAFT LOADING ANIMATION OVERLAY */}
                    {loading && (
                        <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center">
                            
                            {/* Inject Keyframes for the animation */}
                            <style>{`
                                @keyframes drawPath {
                                    0% { stroke-dashoffset: 180; }
                                    50% { stroke-dashoffset: 0; }
                                    100% { stroke-dashoffset: -180; }
                                }
                                @keyframes tapHammer {
                                    0%, 100% { transform: rotate(0deg); }
                                    50% { transform: rotate(-15deg); }
                                }
                            `}</style>
                            
                            {/* Brand Logo Animation */}
                            <div className="relative size-32 mb-8">
                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
                                    <defs>
                                        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#135bec" />
                                            <stop offset="100%" stopColor="#6366f1" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Track */}
                                    <path 
                                        d="M 25 20 V 60 A 25 25 0 0 0 75 60 V 20" 
                                        fill="none" 
                                        stroke="#f3f4f6" 
                                        strokeWidth="12" 
                                        strokeLinecap="round" 
                                    />
                                    
                                    {/* Animated Fill */}
                                    <path 
                                        d="M 25 20 V 60 A 25 25 0 0 0 75 60 V 20" 
                                        fill="none" 
                                        stroke="url(#brandGradient)" 
                                        strokeWidth="12" 
                                        strokeLinecap="round"
                                        style={{
                                            strokeDasharray: 180,
                                            animation: 'drawPath 2s ease-in-out infinite'
                                        }}
                                    />
                                </svg>
                                
                                {/* Animated Hammer Icon */}
                                <div className="absolute -top-2 -right-2 bg-white p-2.5 rounded-full shadow-lg border border-gray-100"
                                     style={{ animation: 'tapHammer 0.5s ease-in-out infinite' }}>
                                    <Hammer className="w-6 h-6 text-gray-800" fill="currentColor" />
                                </div>
                            </div>

                            {/* Brand Text */}
                            <h3 className="text-2xl font-black tracking-[0.3em] text-gray-900 mb-2 font-display">U CRAFT</h3>
                            
                            {/* Cycling Status Message */}
                            <div className="bg-white/50 px-6 py-3 rounded-xl border border-gray-200/50 shadow-sm backdrop-blur-sm">
                                <p className="text-sm font-bold text-gray-600 animate-pulse min-w-[200px] text-center flex items-center justify-center gap-2">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                    {LOADING_MESSAGES[loadingMsgIndex]}
                                </p>
                            </div>
                        </div>
                    )}
                </>
             )}
          </div>

          {/* REFINEMENT UI: Shown when refinement mode is active */}
          {generatedImage && isRefining && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-purple-800 flex items-center gap-2">
                        <Wand2 className="w-4 h-4" />
                        부분 수정 (현재 이미지 기반)
                    </h3>
                    <button onClick={() => setIsRefining(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                
                <textarea 
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    placeholder="예: 조명을 더 밝게 해줘, 식물을 추가해줘 (스타일은 유지됩니다)"
                    className="w-full p-3 rounded-lg border border-purple-200 bg-purple-50/30 focus:border-purple-500 focus:bg-white outline-none min-h-[80px] resize-none text-sm"
                    disabled={loading}
                    autoFocus
                />
                
                 <div className="flex flex-wrap gap-2">
                    {REFINE_SUGGESTIONS.map((keyword) => (
                        <button
                            key={keyword}
                            onClick={() => addKeyword(keyword)}
                            className="text-[10px] px-2 py-1 bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 transition-colors"
                        >
                            + {keyword}
                        </button>
                    ))}
                </div>

                <div className="pt-1">
                    <p className="text-[10px] font-bold text-gray-400 mb-1.5 flex items-center gap-1">
                        <Palette className="w-3 h-3" /> 색상 톤 변경
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {COLOR_TONES.map((tone) => (
                            <button
                                key={tone.id}
                                onClick={() => {
                                    setSelectedColor(tone.id);
                                    addKeyword(`${tone.label} 톤으로 변경`);
                                }}
                                className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 border rounded-lg transition-all
                                    ${selectedColor === tone.id 
                                    ? 'bg-purple-100 border-purple-300 text-purple-800 font-bold ring-1 ring-purple-300 shadow-sm' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200'}`}
                            >
                                <div className="size-2.5 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: tone.color }}></div>
                                {tone.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <button 
                        onClick={() => setIsRefining(false)}
                        className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button 
                        onClick={handleGenerate}
                        disabled={loading || !refinePrompt.trim()}
                        className="flex-[2] py-3 bg-purple-600 text-white rounded-lg font-bold text-sm shadow-md shadow-purple-200 flex items-center justify-center gap-2 hover:bg-purple-700 disabled:bg-gray-300"
                    >
                        <Wand2 className="w-4 h-4" />
                        수정하기
                    </button>
                </div>
            </div>
          )}

          {/* Action Buttons for Result */}
          {generatedImage && !isRefining && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex gap-2">
                 {/* Refine Button */}
                 <button 
                  onClick={() => setIsRefining(true)}
                  className="flex-1 py-3 bg-white border border-purple-200 text-purple-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors shadow-sm">
                   <Wand2 className="w-4 h-4" />
                   이 이미지 수정하기
                 </button>

                 <button 
                  onClick={handleDownload}
                  className="flex-none w-14 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                  aria-label="Download"
                 >
                   <Download className="w-5 h-5" />
                 </button>
               </div>
               <button 
                onClick={() => navigate(View.CONSULTATION)}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                 <MessageSquare className="w-4 h-4" />
                 이대로 시공 상담하기
               </button>
            </div>
          )}

          {/* Gallery History Section */}
          {history.length > 0 && (
            <div className="pt-8 border-t border-gray-200 animate-in fade-in duration-700">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Grid className="w-5 h-5 text-gray-500" />
                        나의 디자인 갤러리 (비교)
                    </h3>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                        {history.length} 작품
                    </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    {history.map((item) => {
                        const extractedFeatures = extractKeyFeatures(item.prompt);
                        return (
                        <button 
                            key={item.id}
                            onClick={() => restoreHistory(item)}
                            className={`relative flex flex-col gap-2.5 p-3 rounded-xl border transition-all text-left group bg-white shadow-sm hover:shadow-md hover:z-10
                                ${generatedImage === item.imageUrl 
                                    ? 'border-purple-500 ring-2 ring-purple-500 bg-purple-50/10' 
                                    : 'border-gray-100 hover:border-purple-200'}`}
                        >
                             {/* Tooltip - Modified to show Sequence # and Keywords */}
                            <div className="absolute bottom-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-[90%] min-w-[160px] bg-gray-900/95 backdrop-blur text-white text-[10px] p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 invisible group-hover:visible translate-y-2 group-hover:translate-y-0">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center border-b border-gray-700/50 pb-1.5">
                                        <span className="font-bold text-white flex items-center gap-1.5">
                                            <Hash className="w-3 h-3 text-purple-400" />
                                            No. {item.sequenceNumber}
                                        </span>
                                        <span className="text-gray-400 text-[9px] font-normal">
                                            옵션 정보
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col gap-1.5">
                                        <div>
                                            <span className="block text-gray-500 font-bold mb-1.5 text-[9px]">선택한 질감 및 분위기</span>
                                            <div className="flex flex-wrap gap-1">
                                                {extractedFeatures.length > 0 ? (
                                                    extractedFeatures.map((feat, i) => (
                                                        <span key={i} className="text-[9px] bg-gray-800 border border-gray-700 text-gray-200 px-2 py-1 rounded-md">
                                                            {feat}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-600 text-[9px]">추가 옵션 없음</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Arrow */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-gray-900/95"></div>
                            </div>

                            {/* Image Container */}
                            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
                                <img src={item.imageUrl} alt="History" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                
                                {/* Sequence Badge */}
                                <div className="absolute top-2 left-2">
                                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-white font-medium">
                                        <Hash className="w-3 h-3" />
                                        <span>
                                            {item.sequenceNumber}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Metadata Info - Texture & Mood Keywords */}
                            <div className="flex flex-col gap-1.5 px-0.5">
                                <div className="flex items-center justify-between">
                                     <span className="text-xs font-bold text-gray-800 truncate bg-gray-100 px-1.5 py-0.5 rounded">
                                        {INTERIOR_STYLES.find(s => s.id === item.style)?.label}
                                     </span>
                                     <div className="size-2.5 rounded-full border border-gray-200" style={{ backgroundColor: COLOR_TONES.find(c => c.id === item.color)?.color }}></div>
                                </div>
                                
                                {/* Extracted Keywords Display */}
                                <div className="flex flex-wrap gap-1">
                                    {extractedFeatures.length > 0 ? (
                                        extractedFeatures.slice(0, 2).map((feat, idx) => (
                                            <span key={idx} className="text-[10px] text-gray-500 border border-gray-100 px-1.5 py-0.5 rounded bg-gray-50 truncate max-w-full">
                                                {feat}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 text-[10px]">키워드 없음</span>
                                    )}
                                </div>
                            </div>
                        </button>
                    )})}
                </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};