'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Table, Input, Select } from '@/components/common';
import { IoAdd, IoEyeOutline, IoDownloadOutline } from 'react-icons/io5';
import type { Order, OrderStatus } from '@/lib/types';

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-0001',
    customerId: '1',
    customerName: '한양섬유',
    items: [],
    subtotal: 1500000,
    vat: 150000,
    total: 1650000,
    status: '주문접수',
    orderDate: '2024-11-15',
    deliveryDate: '2024-11-20',
    createdBy: 'admin',
    createdAt: '2024-11-15T09:00:00Z',
    updatedAt: '2024-11-15T09:00:00Z',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-0002',
    customerId: '2',
    customerName: '동원섬유',
    items: [],
    subtotal: 2000000,
    vat: 200000,
    total: 2200000,
    status: '생산중',
    orderDate: '2024-11-16',
    deliveryDate: '2024-11-22',
    createdBy: 'admin',
    createdAt: '2024-11-16T10:00:00Z',
    updatedAt: '2024-11-16T10:00:00Z',
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    customerId: '',
    status: '',
  });

  const handleViewOrder = (order: Order) => {
    router.push(`/orders/${order.id}`);
  };

  const handleExport = () => {
    alert('엑셀 다운로드 기능 (구현 예정)');
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors = {
      '주문접수': 'bg-blue-100 text-blue-700',
      '생산중': 'bg-yellow-100 text-yellow-700',
      '생산완료': 'bg-green-100 text-green-700',
      '출고대기': 'bg-purple-100 text-purple-700',
      '출고완료': 'bg-gray-100 text-gray-700',
      '취소': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const columns = [
    { key: 'orderNumber', header: '주문번호', width: '12%' },
    { key: 'customerName', header: '판매처', width: '15%' },
    { key: 'orderDate', header: '주문일', width: '10%' },
    { key: 'deliveryDate', header: '납기일', width: '10%' },
    {
      key: 'total',
      header: '주문금액',
      width: '12%',
      render: (order: Order) => `₩${order.total.toLocaleString()}`,
    },
    {
      key: 'status',
      header: '상태',
      width: '10%',
      render: (order: Order) => (
        <span className={`px-2 py-1 rounded text-caption ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '작업',
      width: '10%',
      render: (order: Order) => (
        <button
          onClick={() => handleViewOrder(order)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <IoEyeOutline className="w-5 h-5 text-primary" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h1 className="text-heading-lg text-black">주문 조회</h1>
          <p className="text-body text-gray-500 mt-2">주문 내역을 조회하고 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExport} variant="ghost">
            <IoDownloadOutline className="w-5 h-5 mr-2" />
            엑셀 다운로드
          </Button>
          <Button onClick={() => router.push('/orders/new')}>
            <IoAdd className="w-5 h-5 mr-2" />
            주문 등록
          </Button>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <div className="grid grid-cols-4 gap-3">
          <Input
            label="시작일"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            fullWidth
          />
          <Input
            label="종료일"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            fullWidth
          />
          <Select
            label="판매처"
            value={filters.customerId}
            onChange={(e) => setFilters({ ...filters, customerId: e.target.value })}
            options={[
              { value: '1', label: '한양섬유' },
              { value: '2', label: '동원섬유' },
            ]}
            fullWidth
          />
          <Select
            label="상태"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: '주문접수', label: '주문접수' },
              { value: '생산중', label: '생산중' },
              { value: '생산완료', label: '생산완료' },
              { value: '출고대기', label: '출고대기' },
              { value: '출고완료', label: '출고완료' },
              { value: '취소', label: '취소' },
            ]}
            fullWidth
          />
        </div>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={orders}
          keyExtractor={(order) => order.id}
          onRowClick={handleViewOrder}
        />
      </div>
    </div>
  );
}
