'use client';

import React from 'react';
import {
  IoDocumentTextOutline,
  IoCarOutline,
  IoFileTrayStackedOutline,
  IoCardOutline,
} from 'react-icons/io5';

interface StatCard {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const stats: StatCard[] = [
  {
    title: '금일 주문',
    value: '12건',
    icon: <IoDocumentTextOutline className="w-8 h-8" />,
    color: 'text-blue-600',
  },
  {
    title: '대기 출고',
    value: '8건',
    icon: <IoCarOutline className="w-8 h-8" />,
    color: 'text-green-600',
  },
  {
    title: '재고 부족',
    value: '3품목',
    icon: <IoFileTrayStackedOutline className="w-8 h-8" />,
    color: 'text-orange-600',
  },
  {
    title: '미수금',
    value: '₩12,500,000',
    icon: <IoCardOutline className="w-8 h-8" />,
    color: 'text-red-600',
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-heading-lg text-black">대시보드</h1>
        <p className="text-body text-gray-500 mt-2">WeaveWorks ERP 시스템 현황</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="card p-6">
            <div className="flex-between mb-4">
              <h3 className="text-caption text-gray-500 uppercase">{stat.title}</h3>
              <div className={stat.color}>{stat.icon}</div>
            </div>
            <p className="text-heading-md font-bold text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card p-6">
          <h2 className="text-heading-md text-black mb-4">최근 주문</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-body text-black font-medium">주문번호 #ORD-2024-{String(item).padStart(4, '0')}</p>
                  <p className="text-caption text-gray-500 mt-1">2024-11-17</p>
                </div>
                <div className="text-right">
                  <p className="text-body text-black font-medium">₩1,500,000</p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-caption rounded-md mt-1">
                    주문접수
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card p-6">
          <h2 className="text-heading-md text-black mb-4">재고 부족 알림</h2>
          <div className="space-y-3">
            {[
              { name: '폴리에스터 원사 - 블랙', qty: '15 KG' },
              { name: '면 생지 - 화이트', qty: '8 절' },
              { name: '나일론 원단 - 네이비', qty: '120 YD' },
            ].map((item, index) => (
              <div key={index} className="flex-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-body text-black font-medium">{item.name}</p>
                  <p className="text-caption text-gray-500 mt-1">재고: {item.qty}</p>
                </div>
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-caption rounded-md">
                  부족
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
