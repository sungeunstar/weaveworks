'use client';

import React, { useState } from 'react';
import { Button, Table, Modal, Input, Select } from '@/components/common';
import { IoAdd, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import type { Fabric, UnitType } from '@/lib/types';

const MOCK_FABRICS: Fabric[] = [
  {
    id: '1',
    name: '폴리에스터 원단',
    color: '블랙',
    styleCode: 'PE-BLK-001',
    unit: 'YD',
    price: 15000,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: '면 원단',
    color: '화이트',
    styleCode: 'CT-WHT-001',
    unit: 'YD',
    price: 18000,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
];

export default function FabricsPage() {
  const [fabrics, setFabrics] = useState<Fabric[]>(MOCK_FABRICS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    styleCode: '',
    unit: 'YD' as UnitType,
    price: '',
    memo: '',
  });

  const handleAdd = () => {
    setSelectedFabric(null);
    setFormData({ name: '', color: '', styleCode: '', unit: 'YD', price: '', memo: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (fabric: Fabric) => {
    setSelectedFabric(fabric);
    setFormData({
      name: fabric.name,
      color: fabric.color,
      styleCode: fabric.styleCode,
      unit: fabric.unit,
      price: fabric.price?.toString() || '',
      memo: fabric.memo || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fabricData = {
      ...formData,
      price: formData.price ? Number(formData.price) : undefined,
    };

    if (selectedFabric) {
      setFabrics(fabrics.map(f => f.id === selectedFabric.id ? { ...f, ...fabricData } : f));
    } else {
      const newFabric: Fabric = {
        id: String(Date.now()),
        ...fabricData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setFabrics([...fabrics, newFabric]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setFabrics(fabrics.filter(f => f.id !== id));
    }
  };

  const columns = [
    { key: 'styleCode', header: '스타일코드', width: '15%' },
    { key: 'name', header: '원단명', width: '20%' },
    { key: 'color', header: '색상', width: '15%' },
    { key: 'unit', header: '단위', width: '10%' },
    {
      key: 'price',
      header: '단가',
      width: '15%',
      render: (fabric: Fabric) => fabric.price ? `₩${fabric.price.toLocaleString()}` : '-',
    },
    {
      key: 'actions',
      header: '작업',
      width: '15%',
      render: (fabric: Fabric) => (
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
          <h1 className="text-heading-lg text-black">원단 관리</h1>
          <p className="text-body text-gray-500 mt-2">완제 원단 정보를 관리합니다</p>
        </div>
        <Button onClick={handleAdd}>
          <IoAdd className="w-5 h-5 mr-2" />
          원단 추가
        </Button>
      </div>

      <div className="card">
        <Table columns={columns} data={fabrics} keyExtractor={(fabric) => fabric.id} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedFabric ? '원단 수정' : '원단 추가'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="원단명"
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
            label="스타일코드"
            value={formData.styleCode}
            onChange={(e) => setFormData({ ...formData, styleCode: e.target.value })}
            required
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
          <Input
            label="단가 (원)"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
