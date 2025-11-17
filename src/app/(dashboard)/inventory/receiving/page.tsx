'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/common';
import { IoArrowForward } from 'react-icons/io5';

export default function InventoryReceivingPage() {
  const router = useRouter();

  const receivingTypes = [
    {
      title: '원사 입고',
      description: '원사 구매 입고 및 반품 처리',
      path: '/inventory/receiving/yarn',
      icon: '🧵',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    },
    {
      title: '생지 입고',
      description: '생지 입고 및 절/중량 관리',
      path: '/inventory/receiving/grey-fabric',
      icon: '📦',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
    },
    {
      title: '염색 입고',
      description: '염색 완료 원단 입고 및 재염 처리',
      path: '/inventory/receiving/dyeing',
      icon: '🎨',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    },
    {
      title: '가공 입고',
      description: '가공 완료 원단 입고 및 재가공 처리',
      path: '/inventory/receiving/finishing',
      icon: '✨',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-lg text-black">재고 입고</h1>
        <p className="text-body text-gray-500 mt-2">입고 유형을 선택하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {receivingTypes.map((type) => (
          <div
            key={type.path}
            className={`card p-6 border-2 transition-default cursor-pointer ${type.color}`}
            onClick={() => router.push(type.path)}
          >
            <div className="flex-between mb-4">
              <span className="text-5xl">{type.icon}</span>
            </div>
            <h3 className="text-heading-md text-black mb-2">{type.title}</h3>
            <p className="text-body text-gray-600 mb-4">{type.description}</p>
            <Button variant="ghost" fullWidth onClick={() => router.push(type.path)}>
              입고 관리
              <IoArrowForward className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ))}
      </div>

      <div className="card p-6 mt-6 bg-gray-50">
        <h3 className="text-heading-sm text-black mb-3">📋 입고 처리 안내</h3>
        <ul className="list-disc list-inside space-y-2 text-body text-gray-700">
          <li><strong>원사 입고:</strong> 원사 구매처별 입고 내역 관리</li>
          <li><strong>생지 입고:</strong> 생지 절수 및 중량 관리</li>
          <li><strong>염색 입고:</strong> 염색 완료 원단의 절/중량/야드 관리, 재염 처리</li>
          <li><strong>가공 입고:</strong> 가공 완료 원단의 원중량/가공중량/야드 관리, 재가공 처리</li>
        </ul>
      </div>
    </div>
  );
}
