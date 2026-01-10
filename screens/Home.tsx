import React, { useState } from 'react';
import { View } from '../types';
import { Menu, User, Briefcase, Ruler, Building, ShieldCheck, ArrowRight, Sparkles, X, Home as HomeIcon, Grid, Hammer, MessageSquare, Info, Lock } from 'lucide-react';

interface HomeProps {
  navigate: (view: View) => void;
}

export const Home: React.FC<HomeProps> = ({ navigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { icon: HomeIcon, label: '홈', view: View.HOME },
    { icon: Grid, label: '시공 사례 (포트폴리오)', view: View.PROJECT_LIST },
    { icon: Hammer, label: '시공 방식 및 범위', view: View.PROCESS },
    { icon: Sparkles, label: 'AI 인테리어 미리보기', view: View.AI_PREVIEW },
    { icon: Info, label: '회사 소개 및 FAQ', view: View.ABOUT },
    { icon: MessageSquare, label: '시공 상담 신청', view: View.CONSULTATION },
  ];

  const handleNavigate = (view: View) => {
    navigate(view);
    setIsMenuOpen(false);
  };

  return (
    <div className="pb-32 bg-background-light relative">
      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
             onClick={() => setIsMenuOpen(false)}
           />
           
           {/* Sidebar Drawer */}
           <div className="relative w-[75%] max-w-[300px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 z-10">
              {/* Sidebar Header */}
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                 <h2 className="text-lg font-bold font-display tracking-widest text-text-dark uppercase">U Craft</h2>
                 <button 
                    onClick={() => setIsMenuOpen(false)} 
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                 >
                    <X className="w-6 h-6" />
                 </button>
              </div>
              
              {/* Navigation List */}
              <div className="flex-1 overflow-y-auto py-3">
                 <div className="flex flex-col px-3 gap-1">
                    {menuItems.map((item) => (
                       <button 
                         key={item.label}
                         onClick={() => handleNavigate(item.view)}
                         className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-50 text-left transition-all active:scale-[0.98] group"
                       >
                          <div className={`p-2 rounded-lg transition-colors ${item.view === View.CONSULTATION ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 group-hover:text-primary group-hover:bg-primary/10'}`}>
                             <item.icon className="w-5 h-5" />
                          </div>
                          <span className={`font-bold text-sm ${item.view === View.CONSULTATION ? 'text-primary' : 'text-text-dark'}`}>
                            {item.label}
                          </span>
                       </button>
                    ))}
                 </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                 <div className="flex flex-col gap-1 items-center text-center relative">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">U Craft Interior</p>
                    <p className="text-[10px] text-gray-400">Copyright © 2025 U Craft Brothers.<br/>All rights reserved.</p>
                    
                    {/* Admin Access Button */}
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate(View.ADMIN_LOGIN);
                      }}
                      className="absolute -bottom-4 right-0 p-2 text-gray-300 hover:text-gray-500 transition-colors"
                      title="관리자 로그인"
                    >
                      <Lock className="w-3 h-3" />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center p-4 justify-between">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="text-text-dark flex size-10 shrink-0 items-center justify-start hover:opacity-70 transition-opacity"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-text-dark text-lg font-bold leading-tight tracking-widest flex-1 text-center font-display uppercase">
            U Craft Interior
          </h2>
          <div className="flex w-10 items-center justify-end">
            <button 
                onClick={() => navigate(View.ABOUT)}
                className="flex cursor-pointer items-center justify-center rounded-lg h-10 bg-transparent text-text-dark">
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="@container">
        <div className="p-0">
          <div 
            className="flex min-h-[560px] flex-col gap-0 bg-cover bg-center bg-no-repeat items-center justify-center p-6 relative" 
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1pXqVLt6DIVBQ4a6iP-703npfLOob1Yedh1yvcLrlwdy124JIA09gzgqiZqxMD9ADZK3gfXIhqxd93z1WsPBN31VBJLO_6DSkAX6mApTJM_3kEn7EQQVFzup7Qjoamhr0xCKpPYcGVg7wLBRxyR4hN5MzNJpuauoFQrwWzdkxbpxR46NfcgGaXztxCycQKpt4GwTeIQOPAIyNJnKF3jknP8aqy7iOgebe8lyfuLzuvop70Z1xhct4wKXxiP72kTXGE8KceBD4tmbs")'
            }}
          >
            <div className="flex flex-col text-center z-10 w-full items-center">
              <div className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full mb-12 shadow-lg shadow-black/20">
                전문가 직접 시공
              </div>
              <h1 className="text-white text-3xl font-black leading-tight tracking-tight break-keep max-w-[280px]">
                도면을 이해하고 현장에 맞게 시공합니다
              </h1>
              <p className="text-white/90 text-sm font-normal leading-relaxed max-w-[300px] mx-auto break-keep mt-28">
                U Craft 인테리어는 목공과 타일을 각각 전문으로 하는 UC 형제가 직접 시공하는 브랜드입니다
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Feature Banner - New Addition */}
      <div className="px-4 -mt-8 relative z-20">
        <button 
          onClick={() => navigate(View.AI_PREVIEW)}
          className="w-full bg-white rounded-xl shadow-lg border border-primary/20 p-4 flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start justify-center min-h-[40px]">
              <span className="text-text-dark font-bold text-base">AI 인테리어 미리보기</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Standards Section */}
      <div className="pt-8 pb-2">
        <h4 className="text-primary text-xs font-bold leading-normal tracking-[0.2em] px-4 text-center uppercase">U Craft 시공 원칙</h4>
        <div className="h-1 w-8 bg-primary mx-auto mt-2 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        {[
          { icon: Briefcase, title: "대표 직접 시공", desc: "U Craft 설립자가 모든 현장을 직접 책임집니다" },
          { icon: Ruler, title: "도면·치수 기준", desc: "정확한 수치에 기반한 정밀한 시공을 약속합니다" },
          { icon: Building, title: "주거·상가 균형", desc: "주거 공간의 편안함과 상업 공간의 전문성을 모두 갖췄습니다" },
          { icon: ShieldCheck, title: "마감·하자 기준", desc: "타협하지 않는 디테일로 완성도 높은 마감을 구현합니다" }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm active:scale-[0.98] transition-transform" onClick={() => navigate(View.PROCESS)}>
            <div className="text-primary bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-text-dark text-sm font-bold leading-tight">{item.title}</h2>
              <p className="text-gray-500 text-[11px] font-normal leading-snug break-keep">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Why Section */}
      <div className="px-4 py-2">
        <div className="flex flex-col gap-6 rounded-2xl bg-white border border-gray-200 p-6 shadow-sm overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-text-dark text-xl font-bold leading-tight">왜 U Craft 인테리어인가요?</p>
              <p className="text-gray-500 text-sm font-normal leading-relaxed break-keep">
                단순한 장식이 아닌 견고한 구조를 만듭니다. 구조적 목공 기술과 장인 정신이 깃든 타일 시공을 기반으로, 설계자의 비전과 현장의 실제를 완벽하게 연결합니다.
              </p>
            </div>
            <button 
              onClick={() => navigate(View.ABOUT)}
              className="flex items-center justify-center rounded-lg h-10 px-4 bg-gray-100 text-text-dark gap-2 text-sm font-bold w-fit hover:bg-gray-200 transition-colors">
              <span>더 알아보기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div 
            className="w-full h-48 bg-center bg-no-repeat bg-cover rounded-xl" 
            style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDozKQ4B8_8zbZL259eZ2sWenFJfxbYoQyU61JT-8ZO1npAr71F6anhGBZ1Y1yrBQOMHh3I3oV-egxptVniiS-U1YMyKlbYbrmHN3pKBEdprw9yYBV1vcHC7N4s4gialseOEE5vkFy7KJEN6mJ2oLsoGSHm_bnmJLOFuBrvEe3gRvE0PxhUBG55qDhrCpEQZx161Bywx9JpCYs0SVyZ-p-p12ZP6ahmO0PNMrRSrNix86DSju0pVAbd8vZ6Q_LHa8ES9kVfhSEUIAbq")'}}
          ></div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="p-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-dark text-lg font-bold">최근 시공 사례</h3>
          <button onClick={() => navigate(View.PROJECT_LIST)} className="text-primary text-xs font-bold uppercase hover:text-blue-700">전체보기</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          <div className="min-w-[240px] flex flex-col gap-2 cursor-pointer group" onClick={() => navigate(View.PROJECT_DETAIL)}>
            <div 
              className="h-32 w-full rounded-xl bg-cover bg-center shadow-sm group-hover:shadow-md transition-all" 
              style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAPLcBIyNW2r1lhN2wSvMI_b4SO6vSdOz_Z9nknFwzY7yeikvQqP-zeKHRDRNHLCOoJs3G7uCYwVBuF8gnDW3GBfBwvyIduoUZq83SZJHf3DPWdqSqO_Ko9ZioqBRlFlntg-gkXLOHKTNJWlEAs2Z8Jho1gdH8v2-C9ICi3-x5LHbP5es_-oIwCSTlk5PC7YwK6V-7RTxBrCIflYJ9FRGcASurYz6NsxeSjoKB0Zc6qpPaiNWZiJ0VgvRkOelKQ0YxV9b9ODgFZ-dE6')"}}
            ></div>
            <p className="text-sm font-bold px-1 group-hover:text-primary transition-colors">프리미엄 타일 프로젝트</p>
          </div>
          <div className="min-w-[240px] flex flex-col gap-2 cursor-pointer group" onClick={() => navigate(View.PROJECT_DETAIL)}>
            <div 
              className="h-32 w-full rounded-xl bg-cover bg-center shadow-sm group-hover:shadow-md transition-all" 
              style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNSZsDrvZPcaAcmGcBX6Wcl1H_9x1rOmz62d259N9aibHZ4FShIUotEs0iwpesAi9aC5xbEC0WvT0LNy0sIgojZL9u1gfzZjV80yYC2URFCUbYocKrITllhhijjqJn5nX1dPkihUQ920JyXIJhOWSoUdJV72wKsZXb2qvA_e5N07Zkii6KS-P11sUcIRzG1MGgCXVS9c1xjzNj_bcMgpmdf1QYERhxQM4Xsf_S-wQhg7__vkZVoBATfsPRmMgJaN6MEPU5y6YXKilj')"}}
            ></div>
            <p className="text-sm font-bold px-1 group-hover:text-primary transition-colors">커스텀 목공 수납 가구</p>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 backdrop-blur-lg border-t border-gray-200 z-[60] shadow-sticky max-w-md mx-auto">
        <button 
          onClick={() => navigate(View.CONSULTATION)}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-primary/20">
          <Briefcase className="w-5 h-5" />
          <span className="text-base tracking-wide">시공 상담하기</span>
        </button>
        <div className="h-4"></div>
      </div>
    </div>
  );
};