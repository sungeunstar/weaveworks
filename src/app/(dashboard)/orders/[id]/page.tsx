'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, Select } from '@/components/common';
import { IoArrowBack, IoTrashOutline, IoAdd, IoPrintOutline } from 'react-icons/io5';
import type { Order, OrderItem, UnitType, OrderStatus } from '@/lib/types';

const MOCK_CUSTOMERS = [
  { id: '1', name: '한양섬유' },
  { id: '2', name: '동원섬유' },
  { id: '3', name: '서울텍스타일' },
];

const MOCK_FABRICS = [
  { id: '1', name: '폴리에스터 원단', color: '블랙', styleCode: 'PE-BLK-001', unit: 'YD' as UnitType, price: 15000 },
  { id: '2', name: '면 원단', color: '화이트', styleCode: 'CT-WHT-001', unit: 'YD' as UnitType, price: 18000 },
  { id: '3', name: '나일론 원단', color: '네이비', styleCode: 'NY-NVY-001', unit: 'YD' as UnitType, price: 20000 },
];

const MOCK_ORDER: Order = {
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
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order>(MOCK_ORDER);
  const [isEditing, setIsEditing] = useState(false);

  const addItem = () => {
    const newItem: OrderItem = {
      id: String(Date.now()),
      fabricId: '',
      fabricName: '',
      fabricColor: '',
      styleCode: '',
      quantity: 0,
      unit: 'YD',
      unitPrice: 0,
      totalPrice: 0,
    };
    setOrder({ ...order, items: [...order.items, newItem] });
  };

  const removeItem = (id: string) => {
    setOrder({ ...order, items: order.items.filter(item => item.id !== id) });
  };

  const updateItem = (id: string, field: string, value: any) => {
    setOrder({
      ...order,
      items: order.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };

          if (field === 'fabricId' && value) {
            const fabric = MOCK_FABRICS.find(f => f.id === value);
            if (fabric) {
              updated.fabricName = fabric.name;
              updated.fabricColor = fabric.color;
              updated.styleCode = fabric.styleCode;
              updated.unit = fabric.unit;
              updated.unitPrice = fabric.price;
            }
          }

          if (field === 'quantity' || field === 'unitPrice') {
            updated.totalPrice = updated.quantity * updated.unitPrice;
          }

          return updated;
        }
        return item;
      }),
    });
  };

  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateVAT = () => {
    return Math.round(calculateSubtotal() * 0.1);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const handleSave = () => {
    const updatedOrder = {
      ...order,
      subtotal: calculateSubtotal(),
      vat: calculateVAT(),
      total: calculateTotal(),
    };
    // API call to save
    alert('주문이 수정되었습니다.');
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('정말 이 주문을 삭제하시겠습니까?')) {
      // API call to delete
      alert('주문이 삭제되었습니다.');
      router.push('/orders');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReturn = () => {
    router.push(`/orders/return?orderId=${orderId}`);
  };

  return (
    <div>
      <div className="flex-between mb-6 print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <IoArrowBack className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-heading-lg text-black">주문 상세</h1>
            <p className="text-body text-gray-500 mt-1">주문번호: {order.orderNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handlePrint}>
            <IoPrintOutline className="w-5 h-5 mr-2" />
            주문전표 출력
          </Button>
          <Button variant="ghost" onClick={handleReturn}>
            반품 등록
          </Button>
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)}>수정</Button>
              <Button variant="danger" onClick={handleDelete}>삭제</Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave}>저장</Button>
              <Button variant="ghost" onClick={() => setIsEditing(false)}>취소</Button>
            </>
          )}
        </div>
      </div>

      {/* 주문 정보 */}
      <div className="card p-6 mb-6">
        <h2 className="text-heading-md text-black mb-4">기본 정보</h2>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="판매처"
            value={order.customerId}
            onChange={(e) => setOrder({ ...order, customerId: e.target.value, customerName: MOCK_CUSTOMERS.find(c => c.id === e.target.value)?.name || '' })}
            options={MOCK_CUSTOMERS.map(c => ({ value: c.id, label: c.name }))}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="주문일"
            type="date"
            value={order.orderDate}
            onChange={(e) => setOrder({ ...order, orderDate: e.target.value })}
            disabled={!isEditing}
            fullWidth
          />
          <Input
            label="납기일"
            type="date"
            value={order.deliveryDate || ''}
            onChange={(e) => setOrder({ ...order, deliveryDate: e.target.value })}
            disabled={!isEditing}
            fullWidth
          />
          <Select
            label="주문 상태"
            value={order.status}
            onChange={(e) => setOrder({ ...order, status: e.target.value as OrderStatus })}
            options={[
              { value: '주문접수', label: '주문접수' },
              { value: '생산중', label: '생산중' },
              { value: '생산완료', label: '생산완료' },
              { value: '출고대기', label: '출고대기' },
              { value: '출고완료', label: '출고완료' },
              { value: '취소', label: '취소' },
            ]}
            disabled={!isEditing}
            fullWidth
          />
        </div>
        <Input
          label="출고 INFO"
          value={order.shippingInfo || ''}
          onChange={(e) => setOrder({ ...order, shippingInfo: e.target.value })}
          disabled={!isEditing}
          fullWidth
        />
        <Input
          label="창고 연락"
          value={order.warehouseContact || ''}
          onChange={(e) => setOrder({ ...order, warehouseContact: e.target.value })}
          disabled={!isEditing}
          fullWidth
        />
        <div className="form-group">
          <label className="form-label">지시사항</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-200 rounded-input focus-ring"
            rows={3}
            value={order.instructions || ''}
            onChange={(e) => setOrder({ ...order, instructions: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* 주문 품목 */}
      <div className="card p-6 mb-6">
        <div className="flex-between mb-4">
          <h2 className="text-heading-md text-black">주문 품목</h2>
          {isEditing && (
            <Button type="button" onClick={addItem} size="sm">
              <IoAdd className="w-4 h-4 mr-1" />
              품목 추가
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex-between mb-3">
                <span className="text-body font-medium">품목 {index + 1}</span>
                {isEditing && (
                  <button type="button" onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-700">
                    <IoTrashOutline className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-3">
                <Select
                  label="원단"
                  value={item.fabricId}
                  onChange={(e) => updateItem(item.id, 'fabricId', e.target.value)}
                  options={MOCK_FABRICS.map(f => ({ value: f.id, label: `${f.name} - ${f.color}` }))}
                  disabled={!isEditing}
                  fullWidth
                />
                <Input
                  label="스타일코드"
                  value={item.styleCode}
                  disabled
                  fullWidth
                />
                <Input
                  label="수량"
                  type="number"
                  value={item.quantity || ''}
                  onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                  disabled={!isEditing}
                  fullWidth
                />
                <Input
                  label="단가 (원)"
                  type="number"
                  value={item.unitPrice || ''}
                  onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                  disabled={!isEditing}
                  fullWidth
                />
              </div>
              <div className="mt-2 text-right">
                <span className="text-body text-gray-600">합계: </span>
                <span className="text-heading-sm text-black font-bold">
                  ₩{item.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="card p-6 mb-6">
        <h2 className="text-heading-md text-black mb-4">결제 정보</h2>
        <div className="space-y-2">
          <div className="flex-between py-2 border-b border-gray-200">
            <span className="text-body text-gray-600">소계</span>
            <span className="text-body text-black">₩{calculateSubtotal().toLocaleString()}</span>
          </div>
          <div className="flex-between py-2 border-b border-gray-200">
            <span className="text-body text-gray-600">VAT (10%)</span>
            <span className="text-body text-black">₩{calculateVAT().toLocaleString()}</span>
          </div>
          <div className="flex-between py-3">
            <span className="text-heading-md text-black font-bold">총 합계</span>
            <span className="text-heading-md text-primary font-bold">₩{calculateTotal().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
