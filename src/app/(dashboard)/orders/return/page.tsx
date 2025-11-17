'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Select } from '@/components/common';
import { IoArrowBack } from 'react-icons/io5';

export default function ReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [formData, setFormData] = useState({
    orderId: orderId || '',
    orderNumber: 'ORD-2024-0001',
    customerName: '한양섬유',
    fabricName: '폴리에스터 원단 - 블랙',
    returnQuantity: '',
    returnReason: '',
    returnType: '전체반품',
    returnDate: new Date().toISOString().split('T')[0],
    refundAmount: '',
    memo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('반품이 등록되었습니다.');
    router.push('/orders');
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <IoArrowBack className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-heading-lg text-black">반품 등록</h1>
          <p className="text-body text-gray-500 mt-1">주문 반품을 처리합니다</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card p-6 mb-6">
          <h2 className="text-heading-md text-black mb-4">주문 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="주문번호"
              value={formData.orderNumber}
              disabled
              fullWidth
            />
            <Input
              label="판매처"
              value={formData.customerName}
              disabled
              fullWidth
            />
            <Input
              label="원단명"
              value={formData.fabricName}
              disabled
              fullWidth
            />
            <Input
              label="반품일"
              type="date"
              value={formData.returnDate}
              onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
              required
              fullWidth
            />
          </div>
        </div>

        <div className="card p-6 mb-6">
          <h2 className="text-heading-md text-black mb-4">반품 상세</h2>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="반품 유형"
              value={formData.returnType}
              onChange={(e) => setFormData({ ...formData, returnType: e.target.value })}
              options={[
                { value: '전체반품', label: '전체 반품' },
                { value: '부분반품', label: '부분 반품' },
                { value: '불량반품', label: '불량 반품' },
                { value: '오배송', label: '오배송' },
              ]}
              required
              fullWidth
            />
            <Input
              label="반품 수량"
              type="number"
              value={formData.returnQuantity}
              onChange={(e) => setFormData({ ...formData, returnQuantity: e.target.value })}
              required
              fullWidth
              helperText="반품할 수량을 입력하세요"
            />
            <Input
              label="환불 금액 (원)"
              type="number"
              value={formData.refundAmount}
              onChange={(e) => setFormData({ ...formData, refundAmount: e.target.value })}
              fullWidth
            />
          </div>
          <div className="form-group">
            <label className="form-label">반품 사유 *</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-200 rounded-input focus-ring"
              rows={4}
              value={formData.returnReason}
              onChange={(e) => setFormData({ ...formData, returnReason: e.target.value })}
              required
              placeholder="반품 사유를 상세히 입력하세요"
            />
          </div>
          <div className="form-group">
            <label className="form-label">메모</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-200 rounded-input focus-ring"
              rows={3}
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              placeholder="추가 메모사항"
            />
          </div>
        </div>

        <div className="card p-6 mb-6 bg-orange-50 border-orange-200">
          <h3 className="text-heading-sm text-black mb-3">⚠️ 반품 처리 안내</h3>
          <ul className="list-disc list-inside space-y-2 text-body text-gray-700">
            <li>반품 등록 시 재고가 자동으로 복구됩니다</li>
            <li>환불 금액은 별도로 결제 관리에서 처리해야 합니다</li>
            <li>반품 승인 후에는 취소가 불가능합니다</li>
            <li>불량 반품의 경우 검수 후 처리됩니다</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" size="lg">
            반품 등록
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
