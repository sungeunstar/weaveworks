'use client';

import React, { useState } from 'react';
import { Table, Select, Input } from '@/components/common';
import type { InventoryType } from '@/lib/types';

export default function InventoryStocksPage() {
  const [filterType, setFilterType] = useState<InventoryType | ''>('');

  const mockStocks = [
    {
      id: '1',
      type: '원사' as InventoryType,
      itemName: '폴리에스터 원사',
      itemColor: '블랙',
      warehouseName: '본사 창고',
      quantity: 1500,
      weight: 1500,
      unit: 'KG',
    },
    {
      id: '2',
      type: '생지' as InventoryType,
      itemName: '면 생지',
      itemColor: '화이트',
      warehouseName: '안산 창고',
      quantity: 80,
      rolls: 80,
      unit: '절',
    },
    {
      id: '3',
      type: '염색' as InventoryType,
      itemName: '나일론 원단',
      itemColor: '네이비',
      warehouseName: '본사 창고',
      quantity: 2500,
      yardage: 2500,
      unit: 'YD',
    },
  ];

  const filteredStocks = filterType
    ? mockStocks.filter(s => s.type === filterType)
    : mockStocks;

  const columns = [
    {
      key: 'type',
      header: '분류',
      width: '10%',
      render: (stock: any) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-caption">{stock.type}</span>
      ),
    },
    { key: 'itemName', header: '품목명', width: '20%' },
    { key: 'itemColor', header: '색상', width: '12%' },
    { key: 'warehouseName', header: '창고', width: '15%' },
    {
      key: 'quantity',
      header: '재고량',
      width: '15%',
      render: (stock: any) => (
        <span className={stock.quantity < 100 ? 'text-orange-600 font-medium' : ''}>
          {stock.quantity} {stock.unit}
        </span>
      ),
    },
    {
      key: 'details',
      header: '상세',
      width: '18%',
      render: (stock: any) => {
        const details = [];
        if (stock.weight) details.push(`${stock.weight} KG`);
        if (stock.rolls) details.push(`${stock.rolls} 절`);
        if (stock.yardage) details.push(`${stock.yardage} YD`);
        return details.join(' / ') || '-';
      },
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-lg text-black">재고 조회</h1>
        <p className="text-body text-gray-500 mt-2">현재 재고 현황을 조회합니다</p>
      </div>

      <div className="card p-4 mb-4">
        <div className="grid grid-cols-4 gap-3">
          <Select
            label="분류"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as InventoryType | '')}
            options={[
              { value: '', label: '전체' },
              { value: '원사', label: '원사' },
              { value: '생지', label: '생지' },
              { value: '염색', label: '염색' },
              { value: '가공', label: '가공' },
            ]}
            fullWidth
          />
          <Input label="품목명" placeholder="검색..." fullWidth />
          <Select
            label="창고"
            options={[
              { value: '1', label: '본사 창고' },
              { value: '2', label: '안산 창고' },
            ]}
            fullWidth
          />
        </div>
      </div>

      <div className="card">
        <Table columns={columns} data={filteredStocks} keyExtractor={(stock) => stock.id} />
      </div>
    </div>
  );
}
