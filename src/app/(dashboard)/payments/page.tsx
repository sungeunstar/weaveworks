'use client';

import React, { useState } from 'react';
import { Button, Table, Modal, Input, Select } from '@/components/common';
import { IoAdd, IoCardOutline } from 'react-icons/io5';
import type { PaymentMethod, PaymentStatus } from '@/lib/types';

export default function PaymentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockPayments = [
    {
      id: '1',
      orderNumber: 'ORD-2024-0001',
      customerName: '한양섬유',
      totalAmount: 1650000,
      paidAmount: 1650000,
      remainingAmount: 0,
      status: '완납' as PaymentStatus,
      paymentDate: '2024-11-16',
      paymentMethod: '이체' as PaymentMethod,
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-0002',
      customerName: '동원섬유',
      totalAmount: 2200000,
      paidAmount: 1000000,
      remainingAmount: 1200000,
      status: '부분납부' as PaymentStatus,
      paymentDate: '2024-11-17',
      paymentMethod: '분납' as PaymentMethod,
    },
  ];

  const getStatusColor = (status: PaymentStatus) => {
    const colors = {
      '완납': 'bg-green-100 text-green-700',
      '미수': 'bg-red-100 text-red-700',
      '부분납부': 'bg-yellow-100 text-yellow-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const columns = [
    { key: 'orderNumber', header: '주문번호', width: '12%' },
    { key: 'customerName', header: '판매처', width: '15%' },
    {
      key: 'totalAmount',
      header: '총 금액',
      width: '12%',
      render: (payment: any) => `₩${payment.totalAmount.toLocaleString()}`,
    },
    {
      key: 'paidAmount',
      header: '입금액',
      width: '12%',
      render: (payment: any) => `₩${payment.paidAmount.toLocaleString()}`,
    },
    {
      key: 'remainingAmount',
      header: '미수금',
      width: '12%',
      render: (payment: any) => (
        <span className={payment.remainingAmount > 0 ? 'text-red-600 font-medium' : 'text-gray-500'}>
          ₩{payment.remainingAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: '상태',
      width: '10%',
      render: (payment: any) => (
        <span className={`px-2 py-1 rounded text-caption ${getStatusColor(payment.status)}`}>
          {payment.status}
        </span>
      ),
    },
    { key: 'paymentDate', header: '결제일', width: '10%' },
    { key: 'paymentMethod', header: '결제방법', width: '10%' },
  ];

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h1 className="text-heading-lg text-black">매출/결제 관리</h1>
          <p className="text-body text-gray-500 mt-2">매출 및 결제 내역을 관리합니다</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <IoAdd className="w-5 h-5 mr-2" />
          결제 입력
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="text-caption text-gray-500 uppercase mb-2">총 매출</h3>
          <p className="text-heading-md font-bold text-black">₩3,850,000</p>
        </div>
        <div className="card p-6">
          <h3 className="text-caption text-gray-500 uppercase mb-2">입금 완료</h3>
          <p className="text-heading-md font-bold text-green-600">₩2,650,000</p>
        </div>
        <div className="card p-6">
          <h3 className="text-caption text-gray-500 uppercase mb-2">미수금</h3>
          <p className="text-heading-md font-bold text-red-600">₩1,200,000</p>
        </div>
      </div>

      <div className="card">
        <Table columns={columns} data={mockPayments} keyExtractor={(payment) => payment.id} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="결제 입력"
      >
        <form onSubmit={(e) => { e.preventDefault(); alert('결제가 입력되었습니다.'); setIsModalOpen(false); }}>
          <Select
            label="주문번호"
            options={[
              { value: '1', label: 'ORD-2024-0001 - 한양섬유' },
              { value: '2', label: 'ORD-2024-0002 - 동원섬유' },
            ]}
            required
            fullWidth
          />
          <Input
            label="입금액 (원)"
            type="number"
            placeholder="입금액을 입력하세요"
            required
            fullWidth
          />
          <Select
            label="결제방법"
            options={[
              { value: '현금', label: '현금' },
              { value: '이체', label: '이체' },
              { value: '분납', label: '분납' },
            ]}
            required
            fullWidth
          />
          <Input
            label="결제일"
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
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
              저장
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
