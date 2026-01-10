import React, { useState } from 'react';
import { View, ConsultationRequest } from '../types';
import { ArrowLeft, Printer, FileText, CheckCircle, Plus, Trash } from 'lucide-react';

interface EstimateDetailProps {
  navigate: (view: View) => void;
  goBack: () => void;
  consultation: ConsultationRequest | null;
}

interface EstimateItem {
    id: number;
    description: string;
    unit: string;
    qty: number;
    unitPrice: number;
}

export const EstimateDetail: React.FC<EstimateDetailProps> = ({ navigate, goBack, consultation }) => {
  const today = new Date().toISOString().split('T')[0];
  const [items, setItems] = useState<EstimateItem[]>([
      { id: 1, description: '목공 가설 및 철거 공사', unit: '식', qty: 1, unitPrice: 1500000 },
      { id: 2, description: '기본 목공 자재 (E0 등급)', unit: '식', qty: 1, unitPrice: 2000000 },
      { id: 3, description: '전문 목공 인건비 (UC 형제)', unit: '인', qty: 3, unitPrice: 350000 },
      { id: 4, description: '타일 및 부자재 (600각 포세린)', unit: '평', qty: 10, unitPrice: 120000 },
      { id: 5, description: '타일 시공비 (졸리컷 포함)', unit: '평', qty: 10, unitPrice: 80000 },
  ]);

  // Pre-fill items based on consultation scope if available (simple mock logic)
  React.useEffect(() => {
      if (consultation && consultation.scopes.length > 0) {
          const newItems = consultation.scopes.map((scope, idx) => ({
              id: 10 + idx,
              description: scope,
              unit: '식',
              qty: 1,
              unitPrice: 0 // To be filled by admin
          }));
          // Combine or replace default items. Here we just append.
          setItems(prev => [...prev, ...newItems]);
      }
  }, [consultation]);

  const calculateTotal = () => {
      return items.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
  };

  const calculateVAT = () => {
      return calculateTotal() * 0.1;
  };

  const handlePrint = () => {
      window.print();
  };

  const updateItem = (id: number, field: keyof EstimateItem, value: any) => {
      setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteItem = (id: number) => {
      setItems(items.filter(item => item.id !== id));
  };

  const addItem = () => {
      setItems([...items, { id: Date.now(), description: '추가 항목', unit: '식', qty: 1, unitPrice: 0 }]);
  };

  if (!consultation) {
      return (
          <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
              <div className="text-center">
                  <p className="text-gray-500 mb-4">선택된 상담 내역이 없습니다.</p>
                  <button onClick={goBack} className="bg-primary text-white px-4 py-2 rounded-lg">돌아가기</button>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-text-dark print:bg-white print:m-0 print:p-0">
      {/* Navigation Header - Hidden on Print */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm print:hidden">
        <div className="flex items-center p-4 justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h2 className="text-lg font-bold leading-tight">견적서 작성</h2>
          </div>
          <button 
            onClick={handlePrint} 
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition-colors"
          >
            <Printer className="w-4 h-4" />
            PDF 저장 / 인쇄
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-8 print:p-0">
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden print:shadow-none print:rounded-none print:max-w-none print:w-full">
            
            {/* Estimate Paper Container */}
            <div className="p-8 md:p-12 print:p-8 min-h-[800px] flex flex-col relative">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-8 print:border-black">
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1 print:text-black">견 적 서</h1>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest print:text-gray-600">ESTIMATE SHEET</span>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-xl text-primary mb-1 print:text-black">U CRAFT INTERIOR</div>
                        <div className="text-xs text-gray-500 leading-tight print:text-gray-600">
                            경기도 성남시 분당구 판교로<br/>
                            Tel: 010-1234-5678<br/>
                            Biz No: 123-45-67890
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Recipient Info */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 print:bg-transparent print:border-none print:p-0">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 print:text-black">Customer Info</h3>
                        <div className="space-y-1">
                            <div className="flex justify-between border-b border-gray-200 pb-1 mb-1 print:border-gray-300">
                                <span className="text-sm font-bold text-gray-600 print:text-black">성 함</span>
                                <span className="text-sm font-bold text-gray-900 print:text-black">{consultation.name} 님</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1 mb-1 print:border-gray-300">
                                <span className="text-sm font-bold text-gray-600 print:text-black">연락처</span>
                                <span className="text-sm text-gray-900 print:text-black">{consultation.contact}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1 mb-1 print:border-gray-300">
                                <span className="text-sm font-bold text-gray-600 print:text-black">현장</span>
                                <span className="text-sm text-gray-900 print:text-black">{consultation.spaceType} ({consultation.size || '미정'})</span>
                            </div>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 print:bg-transparent print:border-none print:p-0">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 print:text-black">Estimate Info</h3>
                        <div className="space-y-1">
                            <div className="flex justify-between border-b border-gray-200 pb-1 mb-1 print:border-gray-300">
                                <span className="text-sm font-bold text-gray-600 print:text-black">견적일</span>
                                <span className="text-sm text-gray-900 print:text-black">{today}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1 mb-1 print:border-gray-300">
                                <span className="text-sm font-bold text-gray-600 print:text-black">유효기간</span>
                                <span className="text-sm text-gray-900 print:text-black">발행일로부터 14일</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200 pb-1 mb-1 print:border-gray-300">
                                <span className="text-sm font-bold text-gray-600 print:text-black">담당자</span>
                                <span className="text-sm text-gray-900 print:text-black">유크래프트 형제</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600 border-t border-b border-gray-200 print:bg-transparent print:text-black print:border-black">
                            <tr>
                                <th className="py-2 text-left pl-2 w-[40%]">품명 / 내역</th>
                                <th className="py-2 text-center w-[10%]">단위</th>
                                <th className="py-2 text-center w-[10%]">수량</th>
                                <th className="py-2 text-right w-[15%]">단가</th>
                                <th className="py-2 text-right pr-2 w-[20%]">금액</th>
                                <th className="py-2 w-[5%] print:hidden"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 print:divide-gray-300">
                            {items.map((item) => (
                                <tr key={item.id} className="group">
                                    <td className="py-3 pl-2">
                                        <input 
                                            value={item.description}
                                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                            className="w-full bg-transparent outline-none font-medium text-gray-900 print:text-black placeholder:text-gray-300"
                                            placeholder="항목 입력"
                                        />
                                    </td>
                                    <td className="py-3 text-center">
                                        <input 
                                            value={item.unit}
                                            onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                                            className="w-full text-center bg-transparent outline-none text-gray-600 print:text-black"
                                        />
                                    </td>
                                    <td className="py-3 text-center">
                                        <input 
                                            type="number"
                                            value={item.qty}
                                            onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                                            className="w-full text-center bg-transparent outline-none text-gray-600 print:text-black"
                                        />
                                    </td>
                                    <td className="py-3 text-right">
                                        <input 
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                                            className="w-full text-right bg-transparent outline-none text-gray-600 print:text-black"
                                        />
                                    </td>
                                    <td className="py-3 text-right pr-2 font-medium text-gray-900 print:text-black">
                                        {(item.qty * item.unitPrice).toLocaleString()}
                                    </td>
                                    <td className="py-3 text-center print:hidden">
                                        <button 
                                            onClick={() => deleteItem(item.id)}
                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    <button 
                        onClick={addItem}
                        className="mt-2 w-full py-2 border-2 border-dashed border-gray-200 text-gray-400 rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm font-bold print:hidden"
                    >
                        <Plus className="w-4 h-4" />
                        항목 추가하기
                    </button>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-1/2 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600 print:text-black">
                            <span>공급가액</span>
                            <span>{calculateTotal().toLocaleString()} 원</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 print:text-black">
                            <span>부가세 (VAT)</span>
                            <span>{calculateVAT().toLocaleString()} 원</span>
                        </div>
                        <div className="flex justify-between text-lg font-black text-gray-900 border-t-2 border-gray-900 pt-2 mt-2 print:text-black print:border-black">
                            <span>합계 (Total)</span>
                            <span className="text-primary print:text-black">{ (calculateTotal() + calculateVAT()).toLocaleString() } 원</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="mt-auto border-t border-gray-200 pt-6 print:border-gray-400">
                    <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase print:text-black">Note</h4>
                    <p className="text-xs text-gray-500 leading-relaxed print:text-black">
                        1. 본 견적서는 발행일로부터 14일간 유효합니다.<br/>
                        2. 공사 진행 시 계약금 40%, 중도금 40%, 잔금 20% 조건입니다.<br/>
                        3. 현장 상황에 따라 실측 후 견적이 일부 조정될 수 있습니다.
                    </p>
                </div>

                {/* Stamp */}
                <div className="absolute bottom-12 right-12 opacity-80 print:opacity-100">
                    <div className="border-4 border-red-600 rounded-full w-24 h-24 flex items-center justify-center transform -rotate-12 print:border-red-600">
                        <span className="text-red-600 font-black text-xs text-center leading-tight print:text-red-600">
                            U CRAFT<br/>
                            OFFICIAL<br/>
                            SEAL
                        </span>
                    </div>
                </div>

            </div>
        </div>
      </main>

      {/* Styles for print specifics requested by user */}
      <style>{`
        @media print {
            body {
                background-color: white !important;
                margin: 0 !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            /* Explicitly ensure backgrounds are transparent/white as requested */
            * {
                background-color: transparent !important;
                box-shadow: none !important;
            }
            /* Specific text color for print contrast */
            .text-gray-50, .text-gray-100, .text-gray-200, .text-gray-300, .text-gray-400, .text-gray-500, .text-gray-600, .text-gray-700, .text-gray-800, .text-gray-900 {
                color: #000 !important;
            }
            .bg-gray-50, .bg-gray-100, .bg-gray-200 {
                background-color: transparent !important;
                border: 1px solid #ddd !important; /* Add thin borders for structure since bg is gone */
            }
            .text-primary {
                color: #000 !important; /* Force black for primary brand color text in print */
            }
        }
      `}</style>
    </div>
  );
};