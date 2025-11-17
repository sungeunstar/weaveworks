'use client';

import React, { useState } from 'react';
import { Button, Table, Modal, Input, Select } from '@/components/common';
import { IoAdd, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import type { GreyFabric, UnitType } from '@/lib/types';

const MOCK_GREY_FABRICS: GreyFabric[] = [
  {
    id: '1',
    name: '폴리 면 혼방 생지',
    yarnIds: ['1', '2'],
    code: 'PC-MIX-001',
    unit: '절',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '2',
    name: '순면 생지',
    yarnIds: ['2'],
    code: 'CT-100-001',
    unit: '절',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
];

const MOCK_YARNS = [
  { id: '1', name: '폴리에스터 원사 - 블랙' },
  { id: '2', name: '면 원사 - 화이트' },
  { id: '3', name: '나일론 원사 - 네이비' },
];

export default function GreyFabricsPage() {
  const [greyFabrics, setGreyFabrics] = useState<GreyFabric[]>(MOCK_GREY_FABRICS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState<GreyFabric | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    yarnIds: [] as string[],
    code: '',
    unit: '절' as UnitType,
    memo: '',
  });

  const handleAdd = () => {
    setSelectedFabric(null);
    setFormData({ name: '', yarnIds: [], code: '', unit: '절', memo: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (fabric: GreyFabric) => {
    setSelectedFabric(fabric);
    setFormData({
      name: fabric.name,
      yarnIds: fabric.yarnIds,
      code: fabric.code || '',
      unit: fabric.unit,
      memo: fabric.memo || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFabric) {
      setGreyFabrics(greyFabrics.map(f => f.id === selectedFabric.id ? { ...f, ...formData } : f));
    } else {
      const newFabric: GreyFabric = {
        id: String(Date.now()),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setGreyFabrics([...greyFabrics, newFabric]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setGreyFabrics(greyFabrics.filter(f => f.id !== id));
    }
  };

  const columns = [
    { key: 'code', header: '코드', width: '15%' },
    { key: 'name', header: '생지명', width: '30%' },
    {
      key: 'yarnIds',
      header: '원사 조합',
      width: '25%',
      render: (fabric: GreyFabric) => `${fabric.yarnIds.length}종 혼방`,
    },
    { key: 'unit', header: '단위', width: '15%' },
    {
      key: 'actions',
      header: '작업',
      width: '15%',
      render: (fabric: GreyFabric) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(fabric)} className="p-1 hover:bg-gray-100 rounded">
            <IoCreateOutline className="w-5 h-5 text-primary" />
          </button>
          <button onClick={() => handleDelete(fabric.id)} className="p-1 hover:bg-gray-100 rounded">
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
          <h1 className="text-heading-lg text-black">생지 관리</h1>
          <p className="text-body text-gray-500 mt-2">생지 정보를 관리합니다</p>
        </div>
        <Button onClick={handleAdd}>
          <IoAdd className="w-5 h-5 mr-2" />
          생지 추가
        </Button>
      </div>

      <div className="card">
        <Table columns={columns} data={greyFabrics} keyExtractor={(fabric) => fabric.id} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedFabric ? '생지 수정' : '생지 추가'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="생지명"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            fullWidth
          />
          <Input
            label="코드"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            fullWidth
          />
          <div className="form-group">
            <label className="form-label">원사 조합</label>
            <div className="space-y-2">
              {MOCK_YARNS.map(yarn => (
                <label key={yarn.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.yarnIds.includes(yarn.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, yarnIds: [...formData.yarnIds, yarn.id] });
                      } else {
                        setFormData({ ...formData, yarnIds: formData.yarnIds.filter(id => id !== yarn.id) });
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-body">{yarn.name}</span>
                </label>
              ))}
            </div>
          </div>
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
              {selectedFabric ? '수정' : '추가'}
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
