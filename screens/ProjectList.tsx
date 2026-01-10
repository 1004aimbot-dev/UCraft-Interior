import React, { useState, useEffect } from 'react';
import { View, Project } from '../types';
import { ArrowLeft, Hammer, Grid, Briefcase, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

interface ProjectListProps {
  navigate: (view: View) => void;
  goBack: () => void;
  onSelectProject: (project: Project) => void;
}

// Helper to map string icon types to Components
const getIconComponent = (iconType: string) => {
    switch (iconType) {
        case 'grid': return Grid;
        case 'hammer': return Hammer;
        case 'briefcase': return Briefcase;
        default: return Briefcase;
    }
};

export const ProjectList: React.FC<ProjectListProps> = ({ navigate, goBack, onSelectProject }) => {
  const [filter, setFilter] = useState<'ALL' | 'RESIDENTIAL' | 'COMMERCIAL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const itemsPerPage = 4;

  const baseProjects: Project[] = [
    {
      id: 'base-1',
      type: 'RESIDENTIAL',
      title: "스카이라인 헤이츠 주거 공간",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUBv01cZZ6T-jGalvv8YZ0L498P5kK3CJjzUvOk8pIjRjH-MyXetiAsEFs9MV_koGhNzKM0k1I8Q2T-BxKq0q9g6FiBflSykYRYPURFE8oQaMav1hK_Q4qDCJ6f6U7JIgb3KkNFBgxu0A_Gbxb7NpbVj4kB9rVXKSUj5E1fujitmx3dMR6l_2mfU7Aw5ouu1ydcfvA8hk0_opUivR6rj_ILt5Gr2ZYCd5bqfBZ9Mh_vUJo7O8zD208R6_zKZyd6R4GNtUJgYAvpdsa",
      scope: "목공 • 맞춤형 선반 시공",
      description: "고급 오크 원목 TV 콘솔 및 전면 라이브러리 벽면 맞춤 제작.",
      iconType: 'briefcase'
    },
    {
      id: 'base-2',
      type: 'COMMERCIAL',
      title: "더 테크 허브 오피스",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWdmARCi68hRhuKEu7ik2uf6VzkHflKW_pr9pZFjAQpZ70M0hYocHUsHw-v1MVrM0uAnLKY-7NZqvtYmuvDVvPY66kMDTfFWZrLnfU1NmolBCuDhZ_6nr9cRvkymrikXuAoQ9ZYwtHBEPyyi9kIx9Q2tGAhlLpMcQEHyywhOGfoSl087Le66VgMhHw3CdRLdjsmh3NlLB8WigjoD7SaS_oGCjziC7uYeaPdW0nF12-Gje8NP1PRrI60IUkcPeX7c5LWeu6rtcUhP-B",
      scope: "타일 • 대형 포세린 타일 시공",
      description: "60평 규모의 개방형 오피스를 위한 전문가용 대형 타일 시공.",
      iconType: 'grid'
    },
    {
      id: 'base-3',
      type: 'RESIDENTIAL',
      title: "빈티지 주방 리모델링",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHnckcFisIqdMRmGb3lDrkHRPwCZxWP_Ad6absVkAfYi1nqqfXPkTXgyUJDX0Rkv23d5m1uEburRrE4_ZNu7b_1m2MMfdioqg1c8RqE9P_etAveSKeDWfqQTDJ3uOnDmc29WPzbN14FqnFnqfpDHNbh2raVfYAJL3h5DFo5KqOzVSNBueSp0eAZumVk-Nrk2gFoJ-_Yf0SD9IveUfwQp0X_SXn_MlxlaIDQ1hA938OBBXNKgEXZdcjejRxLRzXT81Zzwgixo4FsrQL",
      scope: "목공 & 타일 • 전체 리모델링",
      description: "수제 쉐이커 캐비닛과 서브웨이 타일 백스플래시 조합.",
      iconType: 'hammer'
    },
    {
      id: 'base-4',
      type: 'COMMERCIAL',
      title: "럭셔리 부티크 매장 인테리어",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVnKwltKjmtCF8fo61c0ni_smsCCRh3KqK9LWO0aV3ax37j9VMfNkscnRABmU0w70O-lqwahyRU-igdlCHfMj9QA9jjMWHwISUVHTAQ65m3JQyR7gyLzh9VnZCtt5U3L0fMES3nOc5Y7cOZ6mXVSn9DkINymPQbNGhP02SCZtgYFCM8fXGFs741-VWxIVL8_FOm6xk7IzdyG6lzIQ3uN2n237dN9R9yr3GqLNlRAo45p1Bf80IVxUgwHclhwwfdK-IPb0jh3m4VT7u",
      scope: "목공 • 디스플레이 집기 제작",
      description: "커스텀 리테일 디스플레이 및 모듈형 수납 솔루션 시공.",
      iconType: 'briefcase'
    }
  ];

  // Load projects on mount
  useEffect(() => {
    const localData = localStorage.getItem('u_craft_projects');
    const localProjects: Project[] = localData ? JSON.parse(localData) : [];
    
    // Combine base projects with local projects (Local projects first for freshness)
    const allProjects = [...localProjects, ...baseProjects];
    setProjects(allProjects);
  }, []);

  const filteredProjects = filter === 'ALL' ? projects : projects.filter(p => p.type === filter);
  
  // Pagination Calculations
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleProjectClick = (project: Project) => {
    onSelectProject(project);
    navigate(View.PROJECT_DETAIL);
  };

  return (
    <div className="pb-32 bg-background-light min-h-screen">
      <header className="sticky top-0 z-40 bg-background-light/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center p-4 justify-between">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="text-text-dark cursor-pointer">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold leading-tight tracking-tight">U Craft Interior</h2>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="sticky top-[61px] z-30 bg-background-light py-3 px-4 flex gap-3 overflow-x-auto no-scrollbar">
        {[
            { id: 'ALL', label: '전체' }, 
            { id: 'RESIDENTIAL', label: '주거' }, 
            { id: 'COMMERCIAL', label: '상가' }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 transition-colors ${
                    filter === tab.id 
                    ? 'bg-primary text-white font-bold shadow-sm' 
                    : 'bg-white border border-gray-200 text-text-dark text-sm font-medium'
                }`}
            >
                {tab.label}
            </button>
        ))}
      </div>

      <div className="px-4 space-y-6 mt-4 min-h-[500px]">
        {currentProjects.length > 0 ? (
          currentProjects.map((project) => {
            const IconComponent = getIconComponent(project.iconType);
            return (
                <div 
                key={project.id} 
                onClick={() => handleProjectClick(project)}
                className="flex flex-col rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100 cursor-pointer active:scale-[0.99] transition-transform animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                <div className="w-full aspect-video bg-cover bg-center" style={{ backgroundImage: `url("${project.image}")` }}></div>
                <div className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">U Craft Interior</span>
                        <h3 className="text-text-dark text-lg font-bold leading-tight">{project.title}</h3>
                    </div>
                    <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded">
                        {project.type === 'RESIDENTIAL' ? '주거' : '상가'}
                    </span>
                    </div>
                    <div className="flex flex-col gap-1.5 border-t border-gray-50 pt-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">시공 범위</span>
                        <p className="text-[#4c669a] text-sm font-medium flex items-center gap-1">
                        <IconComponent className="w-3 h-3" />
                        {project.scope}
                        </p>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{project.description}</p>
                    </div>
                </div>
                </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            {/* Replaced Search icon with MessageSquare for empty state to avoid import errors, or just text */}
            <p className="text-sm">해당하는 프로젝트가 없습니다.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex items-center justify-center gap-2 p-8 mb-4">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex size-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm transition-colors ${
              currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
            }`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button 
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`flex size-10 items-center justify-center rounded-lg shadow-sm font-medium transition-all ${
                currentPage === pageNum 
                ? 'bg-primary text-white font-bold shadow-primary/30' 
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}>
              {pageNum}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex size-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm transition-colors ${
              currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
            }`}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-gray-100 z-50 max-w-md mx-auto">
        <button 
            onClick={() => navigate(View.CONSULTATION)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
          <MessageSquare className="w-5 h-5" />
          시공 상담하기
        </button>
      </div>
    </div>
  );
};