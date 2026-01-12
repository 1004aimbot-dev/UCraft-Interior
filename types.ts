export enum View {
  HOME = 'HOME',
  PROJECT_LIST = 'PROJECT_LIST',
  PROJECT_DETAIL = 'PROJECT_DETAIL',
  PROCESS = 'PROCESS',
  CONSULTATION = 'CONSULTATION',
  ABOUT = 'ABOUT',
  AI_PREVIEW = 'AI_PREVIEW',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ESTIMATE_DETAIL = 'ESTIMATE_DETAIL'
}

export interface Project {
  id: string;
  title: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL';
  image: string;
  scope: string;
  description: string;
  tags?: string[];
  iconType: 'briefcase' | 'grid' | 'hammer'; // Serialized icon name
}

export interface NavProps {
  currentView: View;
  navigate: (view: View) => void;
  goBack: () => void;
}

export interface ConsultationRequest {
  id: string;
  timestamp: string;
  name: string;
  contact: string;
  spaceType: string;
  scopes: string[];
  region: string;
  size: string;
  schedule: string;
  fileName: string | null;
  details: string;
  isRead: boolean;
}