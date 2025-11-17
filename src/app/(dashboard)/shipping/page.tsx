'use client';

import React, { useState } from 'react';
import { Button, Table, Modal, Input, Select } from '@/components/common';
import { IoCarOutline } from 'react-icons/io5';

export default function ShippingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockOrders = [
    {
      id: '1',
      orderNumber: 'ORD-2024-0001',
      customerName: '한양섬유',
      fabricName: '폴리에스터 원단',
      orderedQty: 500,
      shippedQty: 0,
      remainingQty: 500,
      unit: 'YD',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-0002',
      customerName: '동원섬유',
      fabricName: '면 원단',
      orderedQty: 300,
      shippedQty: 150,
      remainingQty: 150,
      unit: 'YD',
    },
  ];

  const columns = [
    { key: 'orderNumber', header: '주문번호', width: '15%' },
    { key: 'customerName', header: '판매처', width: '15%' },
    { key: 'fabricName', header: '원단명', width: '20%' },
    {
      key: 'orderedQty',
      header: '주문수량',
      width: '12%',
      render: (item: any) => `${item.orderedQty} ${item.unit}`,
    },
    {
      key: 'shippedQty',
      header: '출고수량',
      width: '12%',
      render: (item: any) => `${item.shippedQty} ${item.unit}`,
    },
    {
      key: 'remainingQty',
      header: '미출고수량',
      width: '12%',
      render: (item: any) => (
        <span className={item.remainingQty > 0 ? 'text-orange-600 font-medium' : 'text-gray-500'}>
          {item.remainingQty} {item.unit}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '작업',
      width: '14%',
      render: (item: any) => (
        <Button size="sm" onClick={() => setIsModalOpen(true)} disabled={item.remainingQty === 0}>
          출고 처리
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-lg text-black">출고 관리</h1>
        <p className="text-body text-gray-500 mt-2">주문 출고를 처리합니다</p>
      </div>

      <div className="card">
        <Table columns={columns} data={mockOrders} keyExtractor={(item) => item.id} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="출고 처리"
      >
        <form onSubmit={(e) => { e.preventDefault(); alert('출고 처리되었습니다.'); setIsModalOpen(false); }}>
          <Input label="주문번호" value="ORD-2024-0001" disabled fullWidth />
          <Input label="원단명" value="폴리에스터 원단 - 블랙" disabled fullWidth />
          <Input label="주문수량" value="500 YD" disabled fullWidth />
          <Input
            label="출고수량"
            type="number"
            placeholder="출고할 수량을 입력하세요"
            required
            fullWidth
          />
          <Select
            label="창고"
            options={[
              { value: '1', label: '본사 창고' },
              { value: '2', label: '안산 창고' },
            ]}
            required
            fullWidth
          />
          <div className="form-group">
            <label className="form-label">메모</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-200 rounded-input focus-ring"
              rows={3}
            />
          </div>
          <div className="flex gap-2 mt-6">
            <Button type="submit" variant="primary" fullWidth>
              출고 완료
            </Button>
            <Button type="button" variant="ghost" fullWidth onClick={() => setIsModalOpen(false)}>
              취소
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
