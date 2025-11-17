'use client';

import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/common';
import { useRouter } from 'next/navigation';
import type { InventoryType, UnitType } from '@/lib/types';

export default function InventoryReceivingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: '원사' as InventoryType,
    itemId: '',
    quantity: '',
    weight: '',
    yardage: '',
    rolls: '',
    unitPrice: '',
    supplierId: '',
    warehouseId: '',
    transactionDate: new Date().toISOString().split('T')[0],
    memo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('입고 처리되었습니다.');
    router.push('/inventory/stocks');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-lg text-black">재고 입고</h1>
        <p className="text-body text-gray-500 mt-2">신규 재고를 입고 처리합니다</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card p-6 mb-6">
          <h2 className="text-heading-md text-black mb-4">입고 정보</h2>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="분류"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as InventoryType })}
              options={[
                { value: '원사', label: '원사' },
                { value: '생지', label: '생지' },
                { value: '염색', label: '염색' },
                { value: '가공', label: '가공' },
              ]}
              required
              fullWidth
            />
            <Input
              label="입고일"
              type="date"
              value={formData.transactionDate}
              onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
              required
              fullWidth
            />
            <Select
              label="공급업체"
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              options={[
                { value: '1', label: '동원원사' },
                { value: '2', label: '한국염색' },
              ]}
              required
              fullWidth
            />
            <Select
              label="입고 창고"
              value={formData.warehouseId}
              onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
              options={[
                { value: '1', label: '본사 창고' },
                { value: '2', label: '안산 창고' },
              ]}
              required
              fullWidth
            />
          </div>
        </div>

        <div className="card p-6 mb-6">
          <h2 className="text-heading-md text-black mb-4">품목 정보</h2>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="품목"
              value={formData.itemId}
              onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
              options={[
                { value: '1', label: '폴리에스터 원사 - 블랙' },
                { value: '2', label: '면 생지 - 화이트' },
                { value: '3', label: '나일론 원단 - 네이비' },
              ]}
              required
              fullWidth
            />
            <Input
              label="단가 (원)"
              type="number"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              fullWidth
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <Input
              label="중량 (KG)"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              fullWidth
            />
            <Input
              label="야드 (YD)"
              type="number"
              value={formData.yardage}
              onChange={(e) => setFormData({ ...formData, yardage: e.target.value })}
              fullWidth
            />
            <Input
              label="절"
              type="number"
              value={formData.rolls}
              onChange={(e) => setFormData({ ...formData, rolls: e.target.value })}
              fullWidth
            />
          </div>

          <div className="form-group">
            <label className="form-label">메모</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-200 rounded-input focus-ring"
              rows={3}
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" size="lg">
            입고 완료
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
