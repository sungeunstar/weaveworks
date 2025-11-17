'use client';

import React, { useState } from 'react';
import { Button, Table, Modal, Input, Select } from '@/components/common';
import { IoAdd, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import type { Yarn, UnitType } from '@/lib/types';

const MOCK_YARNS: Yarn[] = [
  {
    id: '1',
    name: '폴리에스터 원사',
    color: '블랙',
    code: 'PE-BLK-001',
    unit: 'KG',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: '면 원사',
    color: '화이트',
    code: 'CT-WHT-001',
    unit: 'KG',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '3',
    name: '나일론 원사',
    color: '네이비',
    code: 'NY-NVY-001',
    unit: 'KG',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

export default function YarnsPage() {
  const [yarns, setYarns] = useState<Yarn[]>(MOCK_YARNS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYarn, setSelectedYarn] = useState<Yarn | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    code: '',
    unit: 'KG' as UnitType,
    memo: '',
  });

  const handleAdd = () => {
    setSelectedYarn(null);
    setFormData({ name: '', color: '', code: '', unit: 'KG', memo: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (yarn: Yarn) => {
    setSelectedYarn(yarn);
    setFormData({
      name: yarn.name,
      color: yarn.color,
      code: yarn.code || '',
      unit: yarn.unit,
      memo: yarn.memo || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedYarn) {
      setYarns(yarns.map(y => y.id === selectedYarn.id ? { ...y, ...formData } : y));
    } else {
      const newYarn: Yarn = {
        id: String(Date.now()),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setYarns([...yarns, newYarn]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setYarns(yarns.filter(y => y.id !== id));
    }
  };

  const columns = [
    { key: 'code', header: '코드', width: '15%' },
    { key: 'name', header: '원사명', width: '25%' },
    { key: 'color', header: '색상', width: '20%' },
    { key: 'unit', header: '단위', width: '15%' },
    {
      key: 'actions',
      header: '작업',
      width: '15%',
      render: (yarn: Yarn) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(yarn)} className="p-1 hover:bg-gray-100 rounded">
            <IoCreateOutline className="w-5 h-5 text-primary" />
          </button>
          <button onClick={() => handleDelete(yarn.id)} className="p-1 hover:bg-gray-100 rounded">
            <IoTrashOutline className="w-5 h-5 text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h1 className="text-heading-lg text-black">원사 관리</h1>
          <p className="text-body text-gray-500 mt-2">원사 정보를 관리합니다</p>
        </div>
        <Button onClick={handleAdd}>
          <IoAdd className="w-5 h-5 mr-2" />
          원사 추가
        </Button>
      </div>

      <div className="card">
        <Table columns={columns} data={yarns} keyExtractor={(yarn) => yarn.id} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedYarn ? '원사 수정' : '원사 추가'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="원사명"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <Input
            label="코드"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            fullWidth
          />
          <Select
            label="단위"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value as UnitType })}
            options={[
              { value: 'KG', label: 'KG' },
              { value: 'YD', label: 'YD' },
              { value: '절', label: '절' },
            ]}
            required
            fullWidth
          />
          <div className="form-group">
            <label className="form-label">메모</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-200 rounded-input focus-ring"
              rows={3}
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-6">
            <Button type="submit" variant="primary" fullWidth>
              {selectedYarn ? '수정' : '추가'}
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
