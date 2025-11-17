'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/common';
import { IoShirtOutline, IoArrowForward } from 'react-icons/io5';

export default function MaterialsPage() {
  const router = useRouter();

  const materialTypes = [
    {
      title: '원사 관리',
      description: '원사 정보를 등록하고 관리합니다',
      path: '/materials/yarns',
      icon: '🧵',
      count: 25,
    },
    {
      title: '생지 관리',
      description: '생지 정보를 등록하고 관리합니다',
      path: '/materials/grey-fabrics',
      icon: '📦',
      count: 18,
    },
    {
      title: '원단 관리',
      description: '완제 원단 정보를 등록하고 관리합니다',
      path: '/materials/fabrics',
      icon: '🎨',
      count: 42,
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-lg text-black">원단/자재 관리</h1>
        <p className="text-body text-gray-500 mt-2">원사, 생지, 원단 정보를 관리합니다</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {materialTypes.map((type) => (
          <div key={type.path} className="card p-6 hover:shadow-lg transition-default cursor-pointer" onClick={() => router.push(type.path)}>
            <div className="flex-between mb-4">
              <span className="text-4xl">{type.icon}</span>
              <span className="text-caption text-gray-500">{type.count} 품목</span>
            </div>
            <h3 className="text-heading-md text-black mb-2">{type.title}</h3>
            <p className="text-body text-gray-600 mb-4">{type.description}</p>
            <Button variant="ghost" fullWidth onClick={() => router.push(type.path)}>
              바로가기
              <IoArrowForward className="w-4 h-4 ml-2" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
