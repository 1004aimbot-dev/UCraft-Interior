import React from 'react';
import { View } from '../types';
import { ArrowLeft, MessageSquare, Briefcase, Hammer, CheckCircle, Users, RefreshCw, Calendar } from 'lucide-react';

interface ProcessScopeProps {
  navigate: (view: View) => void;
  goBack: () => void;
}

export const ProcessScope: React.FC<ProcessScopeProps> = ({ navigate, goBack }) => {
  return (
    <div className="pb-32 bg-background-light">
      <div className="sticky top-0 z-50 flex items-center bg-background-light/90 backdrop-blur-md p-4 pb-2 justify-between">
        <button onClick={goBack} className="text-text-dark flex size-12 shrink-0 items-center cursor-pointer">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">U Craft 시공방식 및 범위</h2>
      </div>

      <div className="@container">
        <div className="px-4 py-3">
          <div className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-zinc-200 rounded-lg min-h-[240px] relative" style={{backgroundImage: 'linear-gradient(0deg, rgba(19, 91, 236, 0.7) 0%, rgba(0, 0, 0, 0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBSpz1kv0uxOgo933cztDYl1IZ9d4f-xDi-V8Pu1jmECM9kPHQGMwWYxF0my7f6FxXC-sWYV31hGXWNwCrEt0aI4NRdZpLuv7HjbiIvWWNKYVJCgpJxcdTl2F4FebsOjMkFNacddg813LxBE_jkS3jT2XORkU_p_yl-t_w5YcYVksBipH9XEH8jf1DgGgGPFj3uH-W0gqVYLS4zbrZ7U1dFze2q6hc9DQdzRcZq9ZbBEBxGkQpCA8QLeQSfc5iluZLjK4kTq72O-BuS")'}}>
            <div className="flex p-6 flex-col">
              <span className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wider">U Craft 인테리어 전문가</span>
              <p className="text-white tracking-tight text-[28px] font-bold leading-tight">UC 형제 직접 시공 시스템</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <h3 className="text-text-dark tracking-tight text-2xl font-bold leading-tight text-center pb-2 pt-8">4단계 책임 시공 프로세스</h3>
        <p className="text-text-muted text-center text-sm px-6">UC 형제가 직접 상담부터 마감까지 전 과정을 책임지고 진행합니다.</p>
      </div>

      <div className="mt-8 px-4">
        <div className="grid grid-cols-[48px_1fr] gap-x-3 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
                    <MessageSquare className="w-5 h-5" />
                </div>
                <div className="w-[2px] bg-primary/20 h-full min-h-[40px] grow"></div>
            </div>
            <div className="flex flex-1 flex-col pb-8">
                <p className="text-text-dark text-lg font-bold leading-normal">01. 현장 상담</p>
                <p className="text-text-muted text-base font-normal leading-normal">공간의 구조와 특성을 분석하여 U Craft만의 최적화된 레이아웃을 제안합니다.</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
                    <Briefcase className="w-5 h-5" />
                </div>
                <div className="w-[2px] bg-primary/20 h-full min-h-[40px] grow"></div>
            </div>
            <div className="flex flex-1 flex-col pb-8">
                <p className="text-text-dark text-lg font-bold leading-normal">02. 도면 검토 및 확정</p>
                <p className="text-text-muted text-base font-normal leading-normal">상세 도면 확인 및 프리미엄 자재 선정 과정을 통해 오차 없는 계획을 수립합니다.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center size-10 rounded-full bg-primary text-white ring-4 ring-primary/20">
                    <Hammer className="w-5 h-5" />
                </div>
                <div className="w-[2px] bg-primary/20 h-full min-h-[40px] grow"></div>
            </div>
            <div className="flex flex-1 flex-col pb-8">
                <p className="text-primary text-lg font-bold leading-normal">03. UC 형제 직접 시공</p>
                <p className="text-text-muted text-base font-normal leading-normal font-medium">외부 인력 없이 UC 형제가 목공 및 타일 공정을 현장에서 직접 총괄합니다.</p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
                    <CheckCircle className="w-5 h-5" />
                </div>
            </div>
            <div className="flex flex-1 flex-col">
                <p className="text-text-dark text-lg font-bold leading-normal">04. 마감 검수 및 인도</p>
                <p className="text-text-muted text-base font-normal leading-normal">U Craft만의 꼼꼼한 마감 체크리스트를 통해 완벽한 품질을 검증한 후 인도합니다.</p>
            </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-text-dark text-xl font-bold leading-tight tracking-tight px-4 pb-2">U Craft 핵심 시공 원칙</h3>
        <p className="px-4 text-sm text-text-muted">품질 타협 없는 UC 형제만의 고집입니다.</p>
      </div>

      <div className="px-4 space-y-3 mt-4">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="p-3 bg-blue-50 rounded-lg text-primary">
                <Users className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
                <h4 className="font-bold text-lg text-text-dark">공정 중 인원 변경 없음</h4>
                <p className="text-sm text-text-muted">상담한 전문가가 직접 시공합니다. 인력 교체로 인한 소통 오류나 시공 품질 저하를 원천 차단합니다.</p>
            </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                <RefreshCw className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
                <h4 className="font-bold text-lg text-text-dark">목공·타일 즉시 조율</h4>
                <p className="text-sm text-text-muted">목공과 타일 공정 간 유기적인 협업이 즉각적으로 이루어져 완벽한 마감 라인과 정교한 디테일을 보장합니다.</p>
            </div>
        </div>
      </div>

      <div className="mt-8 px-4 pb-12">
        <h3 className="text-text-dark text-lg font-bold mb-3">전문 시공 범위</h3>
        <div className="flex flex-wrap gap-2">
            {["U Craft 목공", "U Craft 프리미엄 타일", "고성능 방수", "바닥 평탄화", "맞춤 가구 제작", "욕실 리모델링"].map(tag => (
                <span key={tag} className="px-4 py-2 bg-slate-100 rounded-full text-sm font-medium">{tag}</span>
            ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-[100] max-w-md mx-auto">
        <button 
            onClick={() => navigate(View.CONSULTATION)}
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            U Craft 시공 상담하기
        </button>
        <div className="h-4"></div>
      </div>
    </div>
  );
};