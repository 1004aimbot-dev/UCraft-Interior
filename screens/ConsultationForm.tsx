import React, { useState } from 'react';
import { View, ConsultationRequest } from '../types';
import { ArrowLeft, CloudUpload, Check, X, Image as ImageIcon, FileText, Building2, Home, Store, Briefcase, MoreHorizontal, Building, Factory } from 'lucide-react';

interface ConsultationFormProps {
  navigate: (view: View) => void;
  goBack: () => void;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ goBack }) => {
    // Form State
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    
    // Updated Space Types with Icons
    const [spaceType, setSpaceType] = useState('아파트');
    const SPACE_TYPE_OPTIONS = [
        { id: '아파트', icon: Building2 },
        { id: '빌라/연립', icon: Home },
        { id: '단독주택', icon: Home },
        { id: '오피스텔', icon: Building },
        { id: '상가/매장', icon: Store },
        { id: '사무실', icon: Briefcase },
        { id: '기타', icon: MoreHorizontal }
    ];

    // Updated Scopes
    const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
    const SCOPE_OPTIONS = [
        '목공 (가벽/천장/몰딩)',
        '도어/문틀/중문',
        '맞춤가구 제작',
        '타일 (바닥/아트월)',
        '욕실 전체 공사',
        '주방/현관 타일',
        '전체 리모델링',
        '기타 상담 필요'
    ];

    const [region, setRegion] = useState('');
    const [size, setSize] = useState('');
    const [schedule, setSchedule] = useState('가능한 빨리');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [details, setDetails] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create new request object
        const newRequest: ConsultationRequest = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            name,
            contact,
            spaceType,
            scopes: selectedScopes,
            region,
            size,
            schedule,
            fileName: file ? file.name : null,
            details,
            isRead: false
        };

        // Load existing requests or initialize empty array
        const existingData = localStorage.getItem('u_craft_consultations');
        const consultations = existingData ? JSON.parse(existingData) : [];

        // Add new request and save
        localStorage.setItem('u_craft_consultations', JSON.stringify([newRequest, ...consultations]));

        alert("상담 신청이 정상적으로 접수되었습니다.\n담당자가 확인 후 24시간 이내에 연락드리겠습니다.");
        goBack();
    };

    const handleScopeSelect = (scope: string) => {
        let newScopes = [...selectedScopes];
        
        if (newScopes.includes(scope)) {
            newScopes = newScopes.filter(s => s !== scope);
        } else {
            newScopes.push(scope);
        }
        setSelectedScopes(newScopes);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            
            // Create preview if image
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrl(reader.result as string);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setPreviewUrl(null);
            }
        }
    };
    
    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setFile(null);
        setPreviewUrl(null);
    };

  return (
    <div className="bg-background-light min-h-screen text-text-dark pb-10">
      <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md">
        <div className="flex items-center p-4 border-b border-[#cfd7e7]/30">
          <button onClick={goBack} className="flex size-10 shrink-0 items-center justify-center cursor-pointer rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">U Craft 상담 신청</h2>
        </div>
      </header>

      <main className="max-w-[480px] mx-auto pb-10">
        <div className="px-4 pt-6 pb-4">
          <h3 className="text-2xl font-bold leading-tight tracking-tight">
            상담은 무료입니다. <br/>
            <span className="text-primary">U Craft 형제들</span>이 직접 확인하고 답변해 드립니다.
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <div className="px-4 py-2 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold leading-tight tracking-tight text-gray-800">1. 기본 정보</h3>
            </div>
            <div className="px-4 space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-600 pb-2">신청자 성함</label>
                <input 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white h-12 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium" 
                    placeholder="홍길동" 
                    type="text" 
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-600 pb-2">연락처</label>
                <input 
                    required 
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white h-12 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium" 
                    placeholder="010-0000-0000" 
                    type="tel" 
                />
              </div>
            </div>
          </section>

          <section>
            <div className="px-4 py-2 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold leading-tight tracking-tight text-gray-800">2. 공간 유형</h3>
            </div>
            <div className="px-4 grid grid-cols-3 gap-2">
              {SPACE_TYPE_OPTIONS.map((type) => (
                <label key={type.id} className="relative cursor-pointer group">
                    <input 
                        className="peer sr-only" 
                        name="space_type" 
                        type="radio" 
                        value={type.id}
                        checked={spaceType === type.id}
                        onChange={(e) => setSpaceType(e.target.value)}
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5 h-20 border rounded-xl transition-all
                        peer-checked:bg-primary/5 peer-checked:text-primary peer-checked:border-primary peer-checked:ring-1 peer-checked:ring-primary
                        border-gray-200 text-gray-500 bg-white hover:border-gray-300 group-hover:bg-gray-50">
                        <type.icon className={`w-6 h-6 ${spaceType === type.id ? 'text-primary' : 'text-gray-400'}`} />
                        <span className="text-xs font-bold">{type.id}</span>
                    </div>
                </label>
              ))}
            </div>
          </section>

          <section>
            <div className="px-4 py-2 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold leading-tight tracking-tight text-gray-800">3. 시공 범위 (중복 선택)</h3>
            </div>
            <div className="px-4 grid grid-cols-2 gap-2">
                {SCOPE_OPTIONS.map((label, idx) => {
                    const isChecked = selectedScopes.includes(label);
                    return (
                        <label key={idx} className="relative cursor-pointer group">
                            <input 
                                className="peer sr-only" 
                                name="scope" 
                                type="checkbox" 
                                checked={isChecked}
                                onChange={() => handleScopeSelect(label)}
                            />
                            <div className={`flex items-center p-3 border rounded-xl transition-all h-full
                                ${isChecked 
                                    ? 'bg-primary/5 border-primary shadow-sm' 
                                    : 'border-gray-200 bg-white hover:border-gray-300 group-hover:bg-gray-50'
                                }`}>
                                <div className={`size-5 rounded flex items-center justify-center mr-3 transition-colors shrink-0
                                    ${isChecked ? 'bg-primary text-white' : 'bg-gray-100 text-gray-300'}`}>
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-xs font-bold ${isChecked ? 'text-primary' : 'text-gray-600'}`}>{label}</span>
                            </div>
                        </label>
                    );
                })}
            </div>
          </section>

          <section>
            <div className="px-4 py-2 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-bold leading-tight tracking-tight text-gray-800">4. 현장 상세 정보</h3>
            </div>
            <div className="px-4 space-y-4">
              <div className="flex flex-col">
                <p className="text-sm font-bold text-gray-600 pb-2">지역 및 크기</p>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white h-12 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium" 
                    placeholder="예: 서울 강남구" 
                    type="text" 
                  />
                  <input 
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white h-12 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium" 
                    placeholder="예: 32평" 
                    type="text" 
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-gray-600 pb-2">시공 희망 시기</p>
                <select 
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white h-12 px-4 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium appearance-none"
                    style={{backgroundImage: 'none'}}
                >
                  <option>가능한 빨리</option>
                  <option>1개월 이내</option>
                  <option>3개월 이내</option>
                  <option>일정 조율 가능 / 계획 단계</option>
                </select>
              </div>
            </div>
          </section>

          <section className="px-4">
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-gray-600">사진 및 도면 첨부 (선택)</p>
                {file && (
                    <button onClick={clearFile} className="text-xs text-red-500 font-bold flex items-center gap-1 hover:underline">
                        <X className="w-3 h-3" /> 삭제
                    </button>
                )}
            </div>
            
            <label className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden min-h-[160px] group
                ${file 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'}`}>
              
              {previewUrl ? (
                  // Image Preview
                  <div className="absolute inset-0 w-full h-full">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
                  </div>
              ) : file ? (
                  // File Icon (Non-image)
                  <div className="flex flex-col items-center z-10">
                      <FileText className="w-10 h-10 text-primary mb-2" />
                      <p className="text-sm font-bold text-primary truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-primary/70 mt-1">파일이 선택되었습니다</p>
                  </div>
              ) : (
                  // Empty State
                  <>
                    <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <CloudUpload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-bold text-gray-500">터치하여 파일 업로드</p>
                    <p className="text-xs text-gray-400 mt-1">현장 사진이나 도면이 있다면 첨부해주세요</p>
                  </>
              )}
              
              <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
            </label>
          </section>

          <section className="px-4">
            <p className="text-sm font-bold text-gray-600 pb-2">추가 요청 사항</p>
            <textarea 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white placeholder:text-gray-400 p-4 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none text-sm leading-relaxed" 
                placeholder="구체적인 디자인이나 자재 등 원하시는 내용을 자유롭게 적어주세요..." 
                rows={4}
            ></textarea>
          </section>

          <div className="px-4 pt-4">
            <button className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit">
              <Check className="w-5 h-5" />
              시공 상담 요청하기
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-4 px-6 leading-relaxed">
              상담 신청 시 개인정보 처리방침에 동의하게 됩니다. <br/>
              보내주신 정보는 상담 목적으로만 활용되며 안전하게 보호됩니다.
            </p>
          </div>
        </form>
        <div className="h-10"></div>
      </main>
    </div>
  );
};