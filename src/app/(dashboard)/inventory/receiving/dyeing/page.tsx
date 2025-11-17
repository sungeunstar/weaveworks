'use client';

import React, { useState } from 'react';
import { Button, Table, Modal, Input, Select } from '@/components/common';
import { IoAdd, IoDownloadOutline } from 'react-icons/io5';

interface DyeingReceiving {
  id: string;
  date: string;
  supplier: string;
  fabricName: string;
  color: string;
  status: '입고' | '재염';
  rolls: number;
  weight: number;
  yardage: number;
  unitPrice: number;
  amount: number;
  memo: string;
}

export default function DyeingReceivingPage() {
  const [receivings, setReceivings] = useState<DyeingReceiving[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    fabricName: '',
    color: '',
    status: '입고' as '입고' | '재염',
    rolls: '',
    weight: '',
    yardage: '',
    unitPrice: '',
    memo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReceiving: DyeingReceiving = {
      id: String(Date.now()),
      ...formData,
      rolls: Number(formData.rolls),
      weight: Number(formData.weight),
      yardage: Number(formData.yardage),
      unitPrice: Number(formData.unitPrice),
      amount: Number(formData.yardage) * Number(formData.unitPrice),
    };
    setReceivings([...receivings, newReceiving]);
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'date', header: '날짜', width: '10%' },
    { key: 'supplier', header: '염색업체', width: '12%' },
    { key: 'fabricName', header: '원단명', width: '12%' },
    { key: 'color', header: '색상', width: '10%' },
    {
      key: 'status',
      header: '상태',
      width: '8%',
      render: (item: DyeingReceiving) => (
        <span className={`px-2 py-1 rounded text-caption ${item.status === '입고' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {item.status}
        </span>
      ),
    },
    { key: 'rolls', header: '절', width: '6%' },
    {
      key: 'weight',
      header: '중량',
      width: '8%',
      render: (item: DyeingReceiving) => `${item.weight} KG`,
    },
    {
      key: 'yardage',
      header: '야드',
      width: '8%',
      render: (item: DyeingReceiving) => `${item.yardage} YD`,
    },
    {
      key: 'unitPrice',
      header: '단가',
      width: '10%',
      render: (item: DyeingReceiving) => `₩${item.unitPrice.toLocaleString()}`,
    },
    {
      key: 'amount',
      header: '금액',
      width: '10%',
      render: (item: DyeingReceiving) => `₩${item.amount.toLocaleString()}`,
    },
    { key: 'memo', header: '비고', width: '10%' },
  ];

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h1 className="text-heading-lg text-black">염색 입고</h1>
          <p className="text-body text-gray-500 mt-2">염색 완료 원단 입고 내역을 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => alert('엑셀 다운로드')}>
            <IoDownloadOutline className="w-5 h-5 mr-2" />
            엑셀 다운로드
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <IoAdd className="w-5 h-5 mr-2" />
            입고 등록
          </Button>
        </div>
      </div>

      <div className="card mb-4">
        <Table columns={columns} data={receivings} keyExtractor={(item) => item.id} emptyMessage="입고 내역이 없습니다" />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="염색 입고 등록" size="lg">
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
              label="염색업체"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              options={[
                { value: '한국염색', label: '한국염색' },
                { value: '대한염색', label: '대한염색' },
              ]}
              required
              fullWidth
            />
            <Input
              label="원단명"
              value={formData.fabricName}
              onChange={(e) => setFormData({ ...formData, fabricName: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, status: e.target.value as '입고' | '재염' })}
              options={[
                { value: '입고', label: '입고' },
                { value: '재염', label: '재염' },
              ]}
              required
              fullWidth
            />
            <Input
              label="절"
              type="number"
              value={formData.rolls}
              onChange={(e) => setFormData({ ...formData, rolls: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="중량 (KG)"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="야드 (YD)"
              type="number"
              value={formData.yardage}
              onChange={(e) => setFormData({ ...formData, yardage: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="단가 (원/YD)"
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
