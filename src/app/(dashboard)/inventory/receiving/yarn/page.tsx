'use client';

import React, { useState } from 'react';
import { Button, Table, Modal, Input, Select } from '@/components/common';
import { IoAdd, IoTrashOutline, IoDownloadOutline } from 'react-icons/io5';

interface YarnReceiving {
  id: string;
  date: string;
  supplier: string;
  yarnName: string;
  color: string;
  status: '입고' | '반품';
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  memo: string;
}

const MOCK_DATA: YarnReceiving[] = [
  {
    id: '1',
    date: '2024-11-17',
    supplier: '동원원사',
    yarnName: '폴리에스터 원사',
    color: '블랙',
    status: '입고',
    quantity: 500,
    unit: 'KG',
    unitPrice: 10000,
    amount: 5000000,
    memo: '',
  },
];

export default function YarnReceivingPage() {
  const [receivings, setReceivings] = useState<YarnReceiving[]>(MOCK_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    yarnName: '',
    color: '',
    status: '입고' as '입고' | '반품',
    quantity: '',
    unit: 'KG',
    unitPrice: '',
    memo: '',
  });

  const handleAdd = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      supplier: '',
      yarnName: '',
      color: '',
      status: '입고',
      quantity: '',
      unit: 'KG',
      unitPrice: '',
      memo: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReceiving: YarnReceiving = {
      id: String(Date.now()),
      ...formData,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.unitPrice),
      amount: Number(formData.quantity) * Number(formData.unitPrice),
    };
    setReceivings([...receivings, newReceiving]);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setReceivings(receivings.filter(r => r.id !== id));
    }
  };

  const handleExport = () => {
    alert('엑셀 다운로드 기능 (구현 예정)');
  };

  const columns = [
    { key: 'date', header: '날짜', width: '10%' },
    { key: 'supplier', header: '구매처', width: '12%' },
    { key: 'yarnName', header: '원사명', width: '15%' },
    { key: 'color', header: '색상', width: '10%' },
    {
      key: 'status',
      header: '상태',
      width: '8%',
      render: (item: YarnReceiving) => (
        <span className={`px-2 py-1 rounded text-caption ${item.status === '입고' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'quantity',
      header: '수량',
      width: '10%',
      render: (item: YarnReceiving) => `${item.quantity} ${item.unit}`,
    },
    {
      key: 'unitPrice',
      header: '단가',
      width: '10%',
      render: (item: YarnReceiving) => `₩${item.unitPrice.toLocaleString()}`,
    },
    {
      key: 'amount',
      header: '금액',
      width: '12%',
      render: (item: YarnReceiving) => `₩${item.amount.toLocaleString()}`,
    },
    { key: 'memo', header: '비고', width: '10%' },
    {
      key: 'actions',
      header: '작업',
      width: '8%',
      render: (item: YarnReceiving) => (
        <button onClick={() => handleDelete(item.id)} className="p-1 hover:bg-gray-100 rounded">
          <IoTrashOutline className="w-5 h-5 text-red-600" />
        </button>
      ),
    },
  ];

  const totalAmount = receivings.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h1 className="text-heading-lg text-black">원사 입고</h1>
          <p className="text-body text-gray-500 mt-2">원사 입고 내역을 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleExport}>
            <IoDownloadOutline className="w-5 h-5 mr-2" />
            엑셀 다운로드
          </Button>
          <Button onClick={handleAdd}>
            <IoAdd className="w-5 h-5 mr-2" />
            입고 등록
          </Button>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <div className="grid grid-cols-4 gap-3">
          <Input label="시작일" type="date" fullWidth />
          <Input label="종료일" type="date" fullWidth />
          <Select
            label="구매처"
            options={[
              { value: '1', label: '동원원사' },
              { value: '2', label: '한국원사' },
            ]}
            fullWidth
          />
          <Select
            label="상태"
            options={[
              { value: '', label: '전체' },
              { value: '입고', label: '입고' },
              { value: '반품', label: '반품' },
            ]}
            fullWidth
          />
        </div>
      </div>

      <div className="card mb-4">
        <Table columns={columns} data={receivings} keyExtractor={(item) => item.id} />
      </div>

      <div className="card p-4">
        <div className="flex-between">
          <span className="text-heading-md text-black font-bold">총 입고 금액</span>
          <span className="text-heading-md text-primary font-bold">₩{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="원사 입고 등록">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="입고일"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              fullWidth
            />
            <Select
              label="구매처"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              options={[
                { value: '동원원사', label: '동원원사' },
                { value: '한국원사', label: '한국원사' },
              ]}
              required
              fullWidth
            />
            <Input
              label="원사명"
              value={formData.yarnName}
              onChange={(e) => setFormData({ ...formData, yarnName: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="색상"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              required
              fullWidth
            />
            <Select
              label="상태"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as '입고' | '반품' })}
              options={[
                { value: '입고', label: '입고' },
                { value: '반품', label: '반품' },
              ]}
              required
              fullWidth
            />
            <Input
              label="수량 (KG)"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="단가 (원)"
              type="number"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
              required
              fullWidth
            />
          </div>
          <div className="form-group">
            <label className="form-label">비고</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-200 rounded-input focus-ring"
              rows={3}
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            />
          </div>
          {formData.quantity && formData.unitPrice && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex-between">
                <span className="text-body text-gray-700">입고 금액</span>
                <span className="text-heading-sm text-primary font-bold">
                  ₩{(Number(formData.quantity) * Number(formData.unitPrice)).toLocaleString()}
                </span>
              </div>
            </div>
          )}
          <div className="flex gap-2 mt-6">
            <Button type="submit" variant="primary" fullWidth>
              등록
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
