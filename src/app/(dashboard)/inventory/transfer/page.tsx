'use client';

import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/common';
import { useRouter } from 'next/navigation';

export default function InventoryTransferPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    itemId: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    quantity: '',
    transferDate: new Date().toISOString().split('T')[0],
    memo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('재고 이동이 완료되었습니다.');
    router.push('/inventory/stocks');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-lg text-black">재고 이동</h1>
        <p className="text-body text-gray-500 mt-2">창고 간 재고를 이동합니다</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card p-6 mb-6">
          <h2 className="text-heading-md text-black mb-4">이동 정보</h2>

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
              label="이동일"
              type="date"
              value={formData.transferDate}
              onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
              required
              fullWidth
            />
            <Select
              label="출발 창고"
              value={formData.fromWarehouseId}
              onChange={(e) => setFormData({ ...formData, fromWarehouseId: e.target.value })}
              options={[
                { value: '1', label: '본사 창고' },
                { value: '2', label: '안산 창고' },
                { value: '3', label: '광주 창고' },
              ]}
              required
              fullWidth
            />
            <Select
              label="도착 창고"
              value={formData.toWarehouseId}
              onChange={(e) => setFormData({ ...formData, toWarehouseId: e.target.value })}
              options={[
                { value: '1', label: '본사 창고' },
                { value: '2', label: '안산 창고' },
                { value: '3', label: '광주 창고' },
              ]}
              required
              fullWidth
            />
          </div>

          <Input
            label="이동 수량"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
            fullWidth
            helperText="이동할 수량을 입력하세요"
          />

          <div className="form-group">
            <label className="form-label">메모</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-200 rounded-input focus-ring"
              rows={3}
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              placeholder="이동 사유나 특이사항을 입력하세요"
            />
          </div>
        </div>

        <div className="card p-6 mb-6 bg-blue-50">
          <h3 className="text-heading-sm text-black mb-3">주의사항</h3>
          <ul className="list-disc list-inside space-y-2 text-body text-gray-700">
            <li>출발 창고에 충분한 재고가 있는지 확인하세요</li>
            <li>출발 창고와 도착 창고는 달라야 합니다</li>
            <li>이동 후에는 각 창고의 재고가 자동으로 조정됩니다</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" size="lg">
            이동 완료
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
