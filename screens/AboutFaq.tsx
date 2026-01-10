import React, { useState } from 'react';
import { View } from '../types';
import { ArrowLeft, Hammer, Grid, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';

interface AboutFaqProps {
  navigate: (view: View) => void;
  goBack: () => void;
}

export const AboutFaq: React.FC<AboutFaqProps> = ({ navigate, goBack }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
        q: "별도의 도면이 없어도 공사가 가능한가요?",
        a: "네, 가능합니다. 유크래프트는 현장을 아는 기술자 기반의 인테리어 팀으로, 현장 실측 후 직접 구조 계획을 수립하고 시공 가이드를 마련합니다. 고객님과의 충분한 상담을 통해 원하시는 디자인을 현실화해 드립니다."
    },
    {
        q: "목공과 타일 공사를 동시에 진행할 수 있나요?",
        a: "유크래프트의 핵심 전문 분야가 바로 목공과 타일입니다. 두 공정을 내재화하여 운영하기 때문에 목재와 석재가 만나는 까다로운 마감 부분까지 매끄럽게 연결되는 완성도 높은 시공이 가능합니다."
    },
    {
        q: "공사 기간은 보통 얼마나 걸리나요?",
        a: "부분 공사는 3~7일, 전체 리모델링은 평형대에 따라 3~5주 정도 소요됩니다. 저희는 형제가 직접 현장에 상주하며 공정을 조율하기 때문에 불필요한 대기 시간(공정 간 텀) 없이 밀도 있게 진행되어 타 업체 대비 신속합니다."
    },
    {
        q: "거주 중인 상태에서도 공사가 가능한가요?",
        a: "목공과 타일 작업 특성상 먼지와 소음이 많이 발생하여 거주 중 공사는 권장드리지 않습니다. 짐을 보관 이사하시거나, 공실 상태에서 진행하는 것이 마감 품질 확보에 가장 좋습니다."
    },
    {
        q: "서울/경기 외 지역도 시공 가능한가요?",
        a: "품질 유지를 위해 현재는 서울 및 경기 남부(성남, 용인, 수원 등)를 주력으로 진행하고 있습니다. 그 외 지역은 일정과 규모에 따라 협의가 필요하니 상담 신청을 남겨주세요."
    },
    {
        q: "자재를 제가 직접 구매해서 시공만 맡길 수도 있나요?",
        a: "네, 가능합니다. 다만 타일이나 도기, 수전 등은 배관 위치나 시공법에 따라 설치가 불가능한 제품이 있을 수 있으므로, 구매 전 반드시 저희와 규격 상담을 진행해 주시길 권장합니다."
    },
    {
        q: "A/S 보증 기간은 어떻게 되나요?",
        a: "시공 후 1년간 무상 A/S를 보증합니다. 하청을 주지 않고 저희가 직접 시공했기 때문에, 문제가 발생하면 구조를 가장 잘 아는 담당자가 직접 방문하여 책임지고 해결해 드립니다."
    },
    {
        q: "카드 결제나 현금 영수증 발행이 가능한가요?",
        a: "네, 법인 사업자로서 세금계산서, 현금영수증 발행 및 카드 결제가 모두 가능합니다. 모든 견적은 부가세 별도 기준이 아닌, 투명한 세무 처리를 원칙으로 안내해 드립니다."
    },
    {
        q: "주말이나 공휴일에도 공사를 진행하나요?",
        a: "아파트의 경우 소음 민원 규정상 주말/공휴일 공사가 어렵습니다. 상업 공간의 경우 건물 규정에 따라 야간 또는 주말 작업이 가능하며, 이는 사전에 협의하여 진행합니다."
    },
    {
        q: "상담 및 견적 문의 절차가 궁금합니다.",
        a: "하단의 '시공 상담하기' 버튼으로 기본 정보를 남겨주시면 24시간 이내에 1차 유선 상담을 드립니다. 대략적인 견적 확인 후, 현장 방문 실측을 통해 오차 없는 최종 견적서를 제출해 드립니다."
    }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col pb-32 bg-background-light">
      <nav className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center p-4 justify-between">
          <button onClick={goBack} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-6 h-6 text-text-dark" />
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">U Craft 회사소개 및 FAQ</h2>
        </div>
      </nav>

      <main className="w-full">
        <div className="p-4">
          <div className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-xl min-h-80 shadow-lg" style={{backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 40%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuC9UfmnQ_9Jbixrcz3iJzLWjcCzbLDQdZV-OWgT9gJijNwRvmKnwUz6LA-whLMOtCBqeojD0vfFJmXLdrbFAEBmJ6rYKWAYTdYP9WJLjh8vmEEqPzJkg9RMGlgpW-P4CKYC7nRvLApZ_mMt07e_PsltiEZYfgwvlEnVkS1GPc_0qoHIxS-nkW_evPxkEL7Qnz4HcW8UgWSm7APnbt1N3pEdX0WaJilDLDtRy1k7eX6LvRh_dUSM0eQtAnC3B22Xfjvk1Wp3ddDLebT0")'}}>
            <div className="flex p-6">
              <p className="text-white tracking-tight text-[28px] font-bold leading-tight">U Craft Interior</p>
            </div>
          </div>
        </div>

        <section className="px-4 pt-4">
          <h2 className="text-primary text-sm font-bold uppercase tracking-wider mb-1">책임 시공 시스템</h2>
          <h1 className="text-text-dark tracking-tight text-2xl font-bold leading-tight mb-3">UC 형제가 직접 시공하는<br/>현장을 아는 인테리어</h1>
          <p className="text-gray-600 text-base leading-relaxed break-keep">
            유크래프트(U Craft)는 외주 위주의 공사 구조를 지양합니다. 목공과 타일링 전문가인 UC 형제가 현장에서 직접 발로 뛰며, 실측부터 마감까지 책임지고 관리하여 최상의 품질을 보장합니다.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-4 p-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <Hammer className="text-primary mb-2 w-8 h-8" />
            <h4 className="font-bold text-sm">전문 목공 시공</h4>
            <p className="text-xs text-gray-500 mt-1 break-keep">유크래프트만의 정교한 맞춤 가구 및 구조 목공 작업을 제공합니다.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <Grid className="text-primary mb-2 w-8 h-8" />
            <h4 className="font-bold text-sm">하이엔드 타일링</h4>
            <p className="text-xs text-gray-500 mt-1 break-keep">정밀한 레이아웃과 고난도 졸리컷 마감 등 고품격 타일 시공을 선보입니다.</p>
          </div>
        </section>

        <div className="h-4 bg-gray-100 my-4"></div>

        <section className="px-4 pb-8">
          <h3 className="text-xl font-bold leading-tight tracking-tight mb-6">자주 묻는 질문 (FAQ)</h3>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleFaq(idx)}>
                        <span className="font-semibold text-sm pr-4">{faq.q}</span>
                        {openFaq === idx ? <ChevronUp className="w-5 h-5 text-primary shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                    </div>
                    {openFaq === idx && (
                        <div className="px-4 pb-4 bg-gray-50/50">
                            <p className="text-sm text-gray-600 leading-relaxed break-keep border-t border-gray-100 pt-3">
                                {faq.a}
                            </p>
                        </div>
                    )}
                </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 backdrop-blur-lg border-t border-gray-200 z-[60] max-w-md mx-auto">
        <button 
            onClick={() => navigate(View.CONSULTATION)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95">
          <MessageCircle className="w-5 h-5" />
          시공 상담하기
        </button>
      </div>
    </div>
  );
};