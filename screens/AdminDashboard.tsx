import React, { useState, useEffect } from 'react';
import { View, ConsultationRequest, Project } from '../types';
import { LogOut, RefreshCw, ChevronDown, ChevronUp, User, MapPin, Calendar, FileText, Phone, PlusCircle, Grid, MessageSquare, Briefcase, Hammer, Image as ImageIcon, Trash2, Edit, XCircle, Printer } from 'lucide-react';

interface AdminDashboardProps {
  navigate: (view: View) => void;
  goBack: () => void;
  onSelectConsultation?: (consultation: ConsultationRequest) => void;
}

type TabType = 'CONSULTATIONS' | 'PROJECTS';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate, onSelectConsultation }) => {
  const [activeTab, setActiveTab] = useState<TabType>('CONSULTATIONS');
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Edit Mode State
  const [editingId, setEditingId] = useState<string | null>(null);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    type: 'RESIDENTIAL',
    image: '',
    scope: '',
    description: '',
    iconType: 'briefcase'
  });

  const loadData = () => {
    // Load Consultations
    const reqData = localStorage.getItem('u_craft_consultations');
    if (reqData) setRequests(JSON.parse(reqData));

    // Load Projects
    const projData = localStorage.getItem('u_craft_projects');
    if (projData) setProjects(JSON.parse(projData));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    navigate(View.HOME);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCreateEstimate = (req: ConsultationRequest) => {
    if (onSelectConsultation) {
        onSelectConsultation(req);
        navigate(View.ESTIMATE_DETAIL);
    }
  };

  // --- Project Management Functions ---

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) return;

    if (editingId) {
        // Update Existing Project
        const updatedProjects = projects.map(p => {
            if (p.id === editingId) {
                return {
                    ...p,
                    title: newProject.title,
                    type: newProject.type as 'RESIDENTIAL' | 'COMMERCIAL',
                    image: newProject.image || p.image,
                    scope: newProject.scope,
                    description: newProject.description,
                    iconType: newProject.iconType as 'briefcase' | 'grid' | 'hammer'
                };
            }
            return p;
        });
        localStorage.setItem('u_craft_projects', JSON.stringify(updatedProjects));
        setProjects(updatedProjects);
        setEditingId(null);
        alert('프로젝트가 성공적으로 수정되었습니다.');
    } else {
        // Create New Project
        const project: Project = {
            id: Date.now().toString(),
            title: newProject.title,
            type: newProject.type as 'RESIDENTIAL' | 'COMMERCIAL',
            image: newProject.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', // Default image
            scope: newProject.scope,
            description: newProject.description,
            iconType: newProject.iconType as 'briefcase' | 'grid' | 'hammer'
        };

        const updatedProjects = [project, ...projects];
        localStorage.setItem('u_craft_projects', JSON.stringify(updatedProjects));
        setProjects(updatedProjects);
        alert('새로운 시공 사례가 추가되었습니다.');
    }
    
    // Reset Form
    setNewProject({
        title: '',
        type: 'RESIDENTIAL',
        image: '',
        scope: '',
        description: '',
        iconType: 'briefcase'
    });
  };

  const handleEditClick = (project: Project) => {
      setEditingId(project.id);
      setNewProject({
          title: project.title,
          type: project.type,
          image: project.image,
          scope: project.scope,
          description: project.description,
          iconType: project.iconType
      });
      // Scroll to top to see the form
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
      setEditingId(null);
      setNewProject({
        title: '',
        type: 'RESIDENTIAL',
        image: '',
        scope: '',
        description: '',
        iconType: 'briefcase'
      });
  };

  const handleDeleteProject = (id: string) => {
      if(window.confirm('정말 삭제하시겠습니까?')) {
          const updatedProjects = projects.filter(p => p.id !== id);
          localStorage.setItem('u_craft_projects', JSON.stringify(updatedProjects));
          setProjects(updatedProjects);
          
          // If we deleted the item being edited, reset edit mode
          if (editingId === id) {
              handleCancelEdit();
          }
      }
  };

  const setRandomImage = () => {
      const images = [
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
      ];
      const random = images[Math.floor(Math.random() * images.length)];
      setNewProject({...newProject, image: random});
  };

  return (
    <div className="bg-background-light min-h-screen text-text-dark pb-10">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center p-4 justify-between">
            <h2 className="text-lg font-bold leading-tight text-gray-900">관리자 대시보드</h2>
            <div className="flex items-center gap-2">
                <button onClick={loadData} className="p-2 text-gray-500 hover:text-primary transition-colors bg-gray-50 rounded-lg">
                    <RefreshCw className="w-5 h-5" />
                </button>
                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 transition-colors bg-gray-50 rounded-lg">
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex px-4 border-b border-gray-100 bg-gray-50/50">
            <button 
                onClick={() => setActiveTab('CONSULTATIONS')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'CONSULTATIONS' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
                <MessageSquare className="w-4 h-4" />
                상담 요청 ({requests.length})
            </button>
            <button 
                onClick={() => setActiveTab('PROJECTS')}
                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'PROJECTS' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
                <Grid className="w-4 h-4" />
                시공 사례 ({projects.length})
            </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {activeTab === 'CONSULTATIONS' ? (
            // --- CONSULTATION LIST VIEW ---
            <>
                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <FileText className="w-12 h-12 mb-3 opacity-20" />
                        <p>아직 접수된 상담 내역이 없습니다.</p>
                    </div>
                ) : (
                    requests.map((req) => (
                        <div key={req.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all">
                            {/* Header */}
                            <div 
                                onClick={() => toggleExpand(req.id)}
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                        {req.name.slice(0, 1)}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                            {req.name}
                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-normal">
                                                {req.spaceType}
                                            </span>
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {new Date(req.timestamp).toLocaleString('ko-KR', { 
                                                month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                                            })}
                                        </p>
                                    </div>
                                </div>
                                {expandedId === req.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </div>

                            {/* Details Body */}
                            {expandedId === req.id && (
                                <div className="px-4 pb-4 pt-0 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                                    <div className="grid gap-3 pt-4 text-sm">
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <span className="block text-xs font-bold text-gray-500">연락처</span>
                                                <a href={`tel:${req.contact}`} className="text-primary hover:underline font-medium">{req.contact}</a>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <span className="block text-xs font-bold text-gray-500">시공 범위</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {req.scopes.map((scope, idx) => (
                                                        <span key={idx} className="bg-white border border-gray-200 px-2 py-0.5 rounded text-xs text-gray-700">
                                                            {scope}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <span className="block text-xs font-bold text-gray-500">지역 및 크기</span>
                                                <span className="text-gray-700">{req.region || '-'} / {req.size || '-'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div>
                                                <span className="block text-xs font-bold text-gray-500">희망 시기</span>
                                                <span className="text-gray-700">{req.schedule}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-2 bg-white p-3 rounded-lg border border-gray-200">
                                            <span className="block text-xs font-bold text-gray-500 mb-1">상세 요청사항</span>
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {req.details || "내용 없음"}
                                            </p>
                                            {req.fileName && (
                                                <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
                                                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold">첨부파일</span>
                                                    {req.fileName}
                                                </div>
                                            )}
                                        </div>

                                        <button 
                                            onClick={() => handleCreateEstimate(req)}
                                            className="mt-2 w-full bg-gray-900 text-white py-3 rounded-lg font-bold text-sm hover:bg-black transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Printer className="w-4 h-4" />
                                            견적서 발행 (Draft Estimate)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </>
        ) : (
            // --- PROJECT MANAGEMENT VIEW ---
            <>
                {/* Project Form (Add/Edit) */}
                <div className={`bg-white rounded-xl border shadow-sm p-4 mb-6 transition-colors ${editingId ? 'border-primary ring-1 ring-primary' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`font-bold flex items-center gap-2 ${editingId ? 'text-primary' : 'text-gray-900'}`}>
                            {editingId ? (
                                <>
                                    <Edit className="w-5 h-5" />
                                    시공 사례 수정
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="w-5 h-5 text-primary" />
                                    새 시공 사례 등록
                                </>
                            )}
                        </h3>
                        {editingId && (
                            <button 
                                onClick={handleCancelEdit}
                                className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-red-500 bg-gray-100 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                            >
                                <XCircle className="w-3 h-3" />
                                편집 취소
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={handleProjectSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <input 
                                placeholder="프로젝트 제목 (예: 반포 자이 리모델링)" 
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none"
                                value={newProject.title}
                                onChange={e => setNewProject({...newProject, title: e.target.value})}
                                required
                            />
                            <select 
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                                value={newProject.type}
                                onChange={e => setNewProject({...newProject, type: e.target.value})}
                            >
                                <option value="RESIDENTIAL">주거 공간</option>
                                <option value="COMMERCIAL">상업 공간</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <input 
                                placeholder="URL 입력 또는 랜덤 생성 버튼 활용" 
                                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none"
                                value={newProject.image}
                                onChange={e => setNewProject({...newProject, image: e.target.value})}
                            />
                            <button 
                                type="button"
                                onClick={setRandomImage}
                                className="px-3 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 text-xs font-bold"
                            >
                                <ImageIcon className="w-4 h-4" />
                            </button>
                        </div>
                        {newProject.image && (
                            <div className="h-32 w-full rounded-lg bg-cover bg-center" style={{backgroundImage: `url(${newProject.image})`}}></div>
                        )}

                        <div className="grid grid-cols-[2fr_1fr] gap-3">
                            <input 
                                placeholder="시공 범위 (예: 목공 • 타일 • 욕실)" 
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none"
                                value={newProject.scope}
                                onChange={e => setNewProject({...newProject, scope: e.target.value})}
                                required
                            />
                            <select 
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                                value={newProject.iconType}
                                onChange={e => setNewProject({...newProject, iconType: e.target.value})}
                            >
                                <option value="briefcase">가방 아이콘</option>
                                <option value="grid">타일 아이콘</option>
                                <option value="hammer">망치 아이콘</option>
                            </select>
                        </div>

                        <textarea 
                            placeholder="프로젝트 상세 설명..." 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none resize-none"
                            rows={3}
                            value={newProject.description}
                            onChange={e => setNewProject({...newProject, description: e.target.value})}
                            required
                        />

                        <button 
                            type="submit" 
                            className={`w-full text-white font-bold py-3 rounded-lg shadow-lg transition-all ${editingId ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-primary hover:bg-primary/90 shadow-primary/20'}`}
                        >
                            {editingId ? '수정사항 저장하기' : '등록하기'}
                        </button>
                    </form>
                </div>

                {/* Added Projects List */}
                <h3 className="font-bold text-gray-900 px-1 text-sm mb-2">등록된 추가 프로젝트 ({projects.length})</h3>
                {projects.length === 0 ? (
                    <p className="text-gray-400 text-xs text-center py-4">관리자가 추가한 프로젝트가 없습니다.</p>
                ) : (
                    <div className="space-y-3">
                        {projects.map((proj) => (
                            <div key={proj.id} className={`flex gap-3 bg-white p-3 rounded-xl border shadow-sm items-center transition-colors ${editingId === proj.id ? 'border-primary bg-blue-50/30' : 'border-gray-200'}`}>
                                <div className="size-16 rounded-lg bg-cover bg-center shrink-0" style={{backgroundImage: `url(${proj.image})`}}></div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-gray-900 truncate">{proj.title}</h4>
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded mr-2">{proj.type}</span>
                                    <span className="text-[10px] text-gray-400">{proj.scope}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => handleEditClick(proj)}
                                        className={`p-2 transition-colors rounded-lg ${editingId === proj.id ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary hover:bg-gray-100'}`}
                                        title="수정"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteProject(proj.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="삭제"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </>
        )}
      </main>
    </div>
  );
};