import React, { useState, useEffect } from 'react';
import { View, Project, ConsultationRequest } from './types';
import { Home } from './screens/Home';
import { ProjectList } from './screens/ProjectList';
import { ProjectDetail } from './screens/ProjectDetail';
import { ProcessScope } from './screens/ProcessScope';
import { ConsultationForm } from './screens/ConsultationForm';
import { AboutFaq } from './screens/AboutFaq';
import { AIPreview } from './screens/AIPreview';
import { AIChatOverlay } from './screens/AIChatOverlay';
import { AdminLogin } from './screens/AdminLogin';
import { AdminDashboard } from './screens/AdminDashboard';
import { EstimateDetail } from './screens/EstimateDetail';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [history, setHistory] = useState<View[]>([View.HOME]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);

  // Handle browser back button simulation if needed, but for this SPA we use internal state
  const navigate = (view: View) => {
    window.scrollTo(0, 0);
    setHistory((prev) => [...prev, view]);
    setCurrentView(view);
  };

  const goBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const previousView = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentView(previousView);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <Home navigate={navigate} />;
      case View.PROJECT_LIST:
        return <ProjectList navigate={navigate} goBack={goBack} onSelectProject={setSelectedProject} />;
      case View.PROJECT_DETAIL:
        return <ProjectDetail navigate={navigate} goBack={goBack} project={selectedProject} />;
      case View.PROCESS:
        return <ProcessScope navigate={navigate} goBack={goBack} />;
      case View.CONSULTATION:
        return <ConsultationForm navigate={navigate} goBack={goBack} />;
      case View.ABOUT:
        return <AboutFaq navigate={navigate} goBack={goBack} />;
      case View.AI_PREVIEW:
        return <AIPreview navigate={navigate} goBack={goBack} />;
      case View.ADMIN_LOGIN:
        return <AdminLogin navigate={navigate} goBack={goBack} />;
      case View.ADMIN_DASHBOARD:
        return <AdminDashboard navigate={navigate} goBack={goBack} onSelectConsultation={setSelectedConsultation} />;
      case View.ESTIMATE_DETAIL:
        return <EstimateDetail navigate={navigate} goBack={goBack} consultation={selectedConsultation} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background-light text-text-dark font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative print:max-w-none print:shadow-none print:overflow-visible">
      {renderView()}
      {/* Hide Chat Overlay on Admin Screens and Estimate View */}
      {currentView !== View.ADMIN_LOGIN && currentView !== View.ADMIN_DASHBOARD && currentView !== View.ESTIMATE_DETAIL && (
        <AIChatOverlay />
      )}
    </div>
  );
};

export default App;