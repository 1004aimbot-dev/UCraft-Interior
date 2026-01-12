import React, { useState } from 'react';
import { View } from '../types';
import { ArrowLeft, Lock, Shield } from 'lucide-react';

interface AdminLoginProps {
  navigate: (view: View) => void;
  goBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ navigate, goBack }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded password for demonstration.
    // In a real app, this should be validated against a backend secure service.
    if (password === 'ucraft1234') {
      navigate(View.ADMIN_DASHBOARD);
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="bg-background-dark min-h-screen text-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-4 left-4">
        <button onClick={goBack} className="p-2 text-gray-400 hover:text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>
      
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
            <div className="bg-primary/20 p-4 rounded-full mb-2">
                <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">관리자 접근 권한</h1>
            <p className="text-gray-400 text-sm text-center">U Craft 상담 내역 관리를 위한<br/>보안 인증이 필요합니다.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 bg-[#1a2332] p-6 rounded-2xl border border-gray-800 shadow-xl">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#0d121b] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
                        placeholder="관리자 비밀번호 입력"
                        autoFocus
                    />
                </div>
            </div>
            
            {error && <p className="text-red-500 text-xs text-center font-bold animate-pulse">{error}</p>}

            <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20 mt-2"
            >
                인증하기
            </button>
        </form>
        
        <p className="text-[10px] text-center text-gray-600">
            * 초기 비밀번호: ucraft1234<br/>
            (데모 버전입니다)
        </p>
      </div>
    </div>
  );
};