'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/common';
import { IoAdd, IoTrashOutline } from 'react-icons/io5';
import type { OrderItem, UnitType } from '@/lib/types';

interface OrderForm {
  customerId: string;
  customerName: string;
  orderDate: string;
  deliveryDate: string;
  shippingInfo: string;
  warehouseContact: string;
  instructions: string;
  items: OrderItem[];
}

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

export default function NewOrderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<OrderForm>({
    customerId: '',
    customerName: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    shippingInfo: '',
    warehouseContact: '',
    instructions: '',
    items: [],
  });

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
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const removeItem = (id: string) => {
    setFormData({ ...formData, items: formData.items.filter(item => item.id !== id) });
  };

  const updateItem = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      items: formData.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };

          // Auto-fill fabric details when fabricId changes
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

          // Calculate total price
          if (field === 'quantity' || field === 'unitPrice') {
            updated.totalPrice = updated.quantity * updated.unitPrice;
          }

          return updated;
        }
        return item;
      }),
    });
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = MOCK_CUSTOMERS.find(c => c.id === customerId);
    setFormData({
      ...formData,
      customerId,
      customerName: customer?.name || '',
    });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateVAT = () => {
    return Math.round(calculateSubtotal() * 0.1);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    alert('주문이 등록되었습니다.');
    router.push('/orders');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-heading-lg text-black">주문 등록</h1>
        <p className="text-body text-gray-500 mt-2">새로운 주문을 등록합니다</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card p-6 mb-6">
          <h2 className="text-heading-md text-black mb-4">기본 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="판매처"
              value={formData.customerId}
              onChange={(e) => handleCustomerChange(e.target.value)}
              options={MOCK_CUSTOMERS.map(c => ({ value: c.id, label: c.name }))}
              required
              fullWidth
            />
            <Input
              label="주문일"
              type="date"
              value={formData.orderDate}
              onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="납기일"
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              fullWidth
            />
            <Input
              label="창고 연락"
              value={formData.warehouseContact}
              onChange={(e) => setFormData({ ...formData, warehouseContact: e.target.value })}
              fullWidth
            />
          </div>
          <Input
            label="출고 INFO"
            value={formData.shippingInfo}
            onChange={(e) => setFormData({ ...formData, shippingInfo: e.target.value })}
            fullWidth
          />
          <div className="form-group">
            <label className="form-label">지시사항</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-200 rounded-input focus-ring"
              rows={3}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>
        </div>

        <div className="card p-6 mb-6">
          <div className="flex-between mb-4">
            <h2 className="text-heading-md text-black">주문 품목</h2>
            <Button type="button" onClick={addItem} size="sm">
              <IoAdd className="w-4 h-4 mr-1" />
              품목 추가
            </Button>
          </div>

          {formData.items.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              품목을 추가해주세요
            </div>
          ) : (
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex-between mb-3">
                    <span className="text-body font-medium">품목 {index + 1}</span>
                    <button type="button" onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-700">
                      <IoTrashOutline className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <Select
                      label="원단"
                      value={item.fabricId}
                      onChange={(e) => updateItem(item.id, 'fabricId', e.target.value)}
                      options={MOCK_FABRICS.map(f => ({ value: f.id, label: `${f.name} - ${f.color}` }))}
                      required
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
                      required
                      fullWidth
                    />
                    <Input
                      label="단가 (원)"
                      type="number"
                      value={item.unitPrice || ''}
                      onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                      required
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
          )}
        </div>

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

        <div className="flex gap-2">
          <Button type="submit" variant="primary" size="lg">
            주문 등록
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
