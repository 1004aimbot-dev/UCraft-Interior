import React from 'react';
import { View, Project } from '../types';
import { ArrowLeft, Share, MoreHorizontal, AlertTriangle, Ruler, CheckCircle, HandMetal, Grid as GridIcon, MessageSquare } from 'lucide-react';

interface ProjectDetailProps {
  navigate: (view: View) => void;
  goBack: () => void;
  project: Project | null;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ navigate, goBack, project }) => {
  // Fallback data if no project is selected (e.g., direct reload, although unlikely in SPA)
  const displayProject = project || {
    id: 'default',
    title: "강남 펜트하우스 목공·타일 리노베이션",
    type: "RESIDENTIAL",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVa2oTwih2RKD_n89CIxbDPlWW_G6xNOCXdW5hEs-V_lKYsbWWYT_Kzcht78RPCpkiIcqG4V2clPTIgZjwGXsDuU4Kvi8qVZFWusm2X6_iBpWzp30TKZRiwE8_wYSc56KY_dJwVAbKEmyc1YQg7LQbrjHJHVK-bzs6mhKsPokvYXLCJwb0whWUMsmQoBDJHtjFgaOFnQv6cRmiOs9UivSdabP9LC1qDLpRou9pqRSeYsqlYqfv6dPcYFE5L0LsPGelTwmFcLnbuhDM",
    scope: "목공 & 타일 통합 시공",
    description: "고급 오크 원목 TV 콘솔 및 전면 라이브러리 벽면 맞춤 제작.",
    iconType: 'briefcase'
  };

  return (
    <div className="pb-32 bg-background-light">
      <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center p-4 justify-between">
          <div className="flex items-center gap-3">
            <button onClick={goBack}>
              <ArrowLeft className="w-6 h-6 text-text-dark" />
            </button>
            <h2 className="text-lg font-bold leading-tight tracking-tight">작업 상세 정보</h2>
          </div>
          <div className="flex gap-2">
            <button className="p-2"><Share className="w-5 h-5" /></button>
            <button className="p-2"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
        </div>
      </header>

      <div className="p-4">
        <div className="relative h-64 w-full rounded-xl overflow-hidden bg-gray-200 shadow-lg">
          <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%), url("${displayProject.image}")`}}></div>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              {displayProject.type === 'RESIDENTIAL' ? '주거 공간' : '상업 공간'}
            </span>
            <h1 className="text-white text-2xl font-bold mt-1 leading-snug">{displayProject.title}</h1>
            <p className="text-white/80 text-xs mt-1 font-medium">유크래프트(U Craft) 형제가 직접 시공한 공간입니다.</p>
          </div>
        </div>
      </div>

      <section className="px-4">
        <div className="grid grid-cols-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col gap-1 border-b border-r border-gray-100 p-4">
            <p className="text-gray-500 text-xs font-medium uppercase">유형</p>
            <p className="text-sm font-semibold">{displayProject.type === 'RESIDENTIAL' ? '주거' : '상가'}</p>
          </div>
          <div className="flex flex-col gap-1 border-b border-gray-100 p-4">
            <p className="text-gray-500 text-xs font-medium uppercase">범위</p>
            <p className="text-sm font-semibold truncate">{displayProject.scope}</p>
          </div>
          <div className="flex flex-col gap-1 border-r border-gray-100 p-4">
            <p className="text-gray-500 text-xs font-medium uppercase">기간</p>
            <p className="text-sm font-semibold">최적화 공정</p>
          </div>
          <div className="flex flex-col gap-1 p-4">
            <p className="text-gray-500 text-xs font-medium uppercase">직영 시공</p>
            <p className="text-primary text-sm font-bold">U Craft 형제</p>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="mt-6 px-4">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          프로젝트 개요
        </h2>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                {displayProject.description}
            </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold px-4 mb-3 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-primary" />
          시공 사전 설계 기준
        </h2>
        <div className="mx-4 bg-[#101622] text-white p-5 rounded-xl">
          <div className="grid grid-cols-2 gap-4">
            {[
                { label: '수평 기준점', val: '1,200mm' },
                { label: '타일 두께', val: '12.5mm' },
                { label: '목재 등급', val: '18mm E0' },
                { label: '허용 오차', val: '±0.5mm' },
            ].map((item, i) => (
                <div key={i} className="border-l-2 border-primary pl-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{item.label}</p>
                <p className="text-lg font-mono font-bold">{item.val}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-lg font-bold">시공 과정 및 타임라인</h2>
          <div className="flex bg-gray-200 p-1 rounded-lg text-[10px] font-bold">
            <span className="px-2 py-1 bg-white rounded shadow-sm">표준 공정</span>
          </div>
        </div>

        {/* Generic Timeline Items for Dynamic Projects */}
        <div className="relative px-4 pb-8">
            <div className="absolute left-7 top-10 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="flex gap-4">
                <div className="z-10 size-6 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-background-light">
                    <span className="text-[10px] font-bold">01</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-sm">현장 보양 및 목공 골조 작업</h3>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                            <HandMetal className="w-4 h-4 text-primary" />
                            <p className="text-[11px] font-bold mt-1">목공 담당 (동생)</p>
                            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">주요 벽면 프레임 구성 및 수평 라인 확인.</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                            <GridIcon className="w-4 h-4 text-primary" />
                            <p className="text-[11px] font-bold mt-1">타일 담당 (형)</p>
                            <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">바닥면 바탕 정리 및 타일 레이아웃 설계.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="relative px-4 pb-8">
            <div className="absolute left-7 top-10 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="flex gap-4">
                <div className="z-10 size-6 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-background-light">
                    <span className="text-[10px] font-bold">02</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-sm">정밀 시공 및 마감</h3>
                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                        <div className="h-32 bg-cover bg-center" style={{backgroundImage: `url('${displayProject.image}')`}}></div>
                        <div className="p-2 bg-white">
                            <p className="text-[10px] text-gray-500 leading-tight">레이저 레벨기를 활용한 오차 없는 정밀 시공.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="relative px-4">
            <div className="flex gap-4">
                <div className="z-10 size-6 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-background-light">
                    <span className="text-[10px] font-bold">03</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-sm">최종 마감 및 품질 검수</h3>
                    <div className="mt-2 space-y-2">
                        {[
                            "타일 줄눈 시공 및 잔여 실리콘 마감 완료",
                            "목공 몰딩 및 도어 하드웨어 체결 상태 확인",
                        ].map((txt, i) => (
                            <div key={i} className="flex items-center gap-2 py-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-xs">{txt}</span>
                            </div>
                        ))}
                         <div className="flex items-center gap-2 py-1">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-xs font-bold text-primary">U Craft 형제 직접 최종 하자 전수 검사 완료</span>
                            </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section className="mt-10 px-4">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          마감·하자 보증 기준
        </h2>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 text-xs mt-1">•</span>
              <p className="text-xs leading-relaxed text-gray-700"><b>시공 보증:</b> 구조 결함 2년, 미세 마감 1년 무상 보증</p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 text-xs mt-1">•</span>
              <p className="text-xs leading-relaxed text-gray-700"><b>타일 탈락:</b> 온도차에 의한 들뜸 현상 발생 시 24시간 내 긴급 출동</p>
            </li>
          </ul>
        </div>
      </section>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50 max-w-md mx-auto">
        <button 
            onClick={() => navigate(View.CONSULTATION)}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <MessageSquare className="w-5 h-5" />
            U Craft에게 시공 상담하기
        </button>
        <p className="text-[10px] text-center text-gray-400 mt-2 tracking-tight">유크래프트 형제가 직접 실시간으로 답변해 드립니다.</p>
      </footer>
    </div>
  );
};