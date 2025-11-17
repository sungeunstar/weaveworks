'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Table, Input, Select } from '@/components/common';
import { IoAdd, IoCreateOutline, IoDownloadOutline } from 'react-icons/io5';
import type { Order, OrderStatus } from '@/lib/types';

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-0001',
    customerId: '1',
    customerName: '한양섬유',
    items: [
      {
        id: '1',
        fabricId: '1',
        fabricName: '폴리에스터 원단',
        fabricColor: '블랙',
        styleCode: 'PE-BLK-001',
        quantity: 500,
        unit: 'YD',
        unitPrice: 15000,
        totalPrice: 7500000,
      }
    ],
    subtotal: 7500000,
    vat: 750000,
    total: 8250000,
    status: '주문접수',
    orderDate: '2024-11-15',
    deliveryDate: '2024-11-20',
    shippingInfo: '본사 직배송',
    warehouseContact: '010-1234-5678',
    instructions: '포장 주의',
    createdBy: 'admin',
    createdAt: '2024-11-15T09:00:00Z',
    updatedAt: '2024-11-15T09:00:00Z',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-0002',
    customerId: '2',
    customerName: '동원섬유',
    items: [
      {
        id: '2',
        fabricId: '2',
        fabricName: '면 원단',
        fabricColor: '화이트',
        styleCode: 'CT-WHT-001',
        quantity: 300,
        unit: 'YD',
        unitPrice: 18000,
        totalPrice: 5400000,
      }
    ],
    subtotal: 5400000,
    vat: 540000,
    total: 5940000,
    status: '생산중',
    orderDate: '2024-11-16',
    deliveryDate: '2024-11-22',
    shippingInfo: '안산창고',
    warehouseContact: '010-2345-6789',
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
    searchTerm: '',
    dateRange: '',
  });

  const handleEditOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  const handleExport = () => {
    // CSV 다운로드 구현
    const csvData = orders.map(order => ({
      주문번호: order.orderNumber,
      주문일: order.orderDate,
      판매처: order.customerName,
      상태: order.status,
      품목수: order.items.length,
      납기일: order.deliveryDate || '',
      합계금액: order.subtotal,
      VAT: order.vat,
      누계금액: order.total,
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `주문목록_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
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

  const setQuickDateRange = (range: string) => {
    const today = new Date();
    let startDate = '';

    switch (range) {
      case 'today':
        startDate = today.toISOString().split('T')[0];
        break;
      case '1week':
        startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
        break;
      case '1month':
        startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
        break;
      case '3months':
        startDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
        break;
    }

    setFilters({ ...filters, startDate, endDate: new Date().toISOString().split('T')[0], dateRange: range });
  };

  const columns = [
    {
      key: 'edit',
      header: '수정',
      width: '5%',
      render: (order: Order) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditOrder(order.id);
          }}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <IoCreateOutline className="w-5 h-5 text-primary" />
        </button>
      ),
    },
    { key: 'orderDate', header: '주문일', width: '7%' },
    { key: 'orderNumber', header: '주문번호', width: '10%' },
    { key: 'customerName', header: '판매처', width: '10%' },
    {
      key: 'status',
      header: '상태',
      width: '8%',
      render: (order: Order) => (
        <span className={`px-2 py-1 rounded text-caption ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      ),
    },
    {
      key: 'items',
      header: '원단명/색상',
      width: '12%',
      render: (order: Order) => (
        <div>
          {order.items.slice(0, 2).map((item, idx) => (
            <div key={idx} className="text-caption">
              {item.fabricName} - {item.fabricColor}
            </div>
          ))}
          {order.items.length > 2 && <span className="text-caption text-gray-500">외 {order.items.length - 2}건</span>}
        </div>
      ),
    },
    {
      key: 'styleCode',
      header: 'Style No.',
      width: '8%',
      render: (order: Order) => order.items[0]?.styleCode || '-',
    },
    { key: 'deliveryDate', header: '납기일', width: '7%' },
    { key: 'shippingInfo', header: '출고INFO', width: '8%' },
    { key: 'warehouseContact', header: '창고연락', width: '8%' },
    {
      key: 'subtotal',
      header: '합계금액',
      width: '9%',
      render: (order: Order) => `₩${order.subtotal.toLocaleString()}`,
    },
    {
      key: 'vat',
      header: 'VAT',
      width: '7%',
      render: (order: Order) => `₩${order.vat.toLocaleString()}`,
    },
    {
      key: 'total',
      header: '누계금액',
      width: '10%',
      render: (order: Order) => (
        <span className="font-bold text-primary">₩{order.total.toLocaleString()}</span>
      ),
    },
  ];

  // 집계 계산
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, order) => sum + order.subtotal, 0);
  const totalVAT = orders.reduce((sum, order) => sum + order.vat, 0);
  const grandTotal = orders.reduce((sum, order) => sum + order.total, 0);

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

      {/* 빠른 기간 선택 */}
      <div className="card p-4 mb-4">
        <div className="flex gap-2 mb-4">
          <Button
            variant={filters.dateRange === 'today' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setQuickDateRange('today')}
          >
            오늘
          </Button>
          <Button
            variant={filters.dateRange === '1week' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setQuickDateRange('1week')}
          >
            1주일
          </Button>
          <Button
            variant={filters.dateRange === '1month' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setQuickDateRange('1month')}
          >
            1개월
          </Button>
          <Button
            variant={filters.dateRange === '3months' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setQuickDateRange('3months')}
          >
            3개월
          </Button>
        </div>
        <div className="grid grid-cols-5 gap-3">
          <Input
            label="시작일"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value, dateRange: '' })}
            fullWidth
          />
          <Input
            label="종료일"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value, dateRange: '' })}
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
          <Input
            label="검색"
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            placeholder="주문번호, 원단명 등"
            fullWidth
          />
        </div>
      </div>

      <div className="card mb-4">
        <Table
          columns={columns}
          data={orders}
          keyExtractor={(order) => order.id}
          onRowClick={(order) => router.push(`/orders/${order.id}`)}
        />
      </div>

      {/* 집계 정보 */}
      <div className="card p-6">
        <h3 className="text-heading-md text-black mb-4">주문 집계</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-caption text-gray-600 mb-1">총 주문</p>
            <p className="text-heading-md font-bold text-black">{totalOrders}건</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-caption text-gray-600 mb-1">합계 금액</p>
            <p className="text-heading-md font-bold text-black">₩{totalSales.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-caption text-gray-600 mb-1">총 부가세</p>
            <p className="text-heading-md font-bold text-black">₩{totalVAT.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-primary rounded-lg">
            <p className="text-caption text-white mb-1">누계 금액</p>
            <p className="text-heading-md font-bold text-white">₩{grandTotal.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
