'use client';

import React, { useState } from 'react';
import { Button, Table, Modal, Input, Select } from '@/components/common';
import { IoAdd, IoCreateOutline, IoTrashOutline, IoCalculatorOutline } from 'react-icons/io5';
import type { Fabric, UnitType } from '@/lib/types';

const MOCK_FABRICS: Fabric[] = [
  {
    id: '1',
    name: '폴리에스터 원단',
    color: '블랙',
    styleCode: 'PE-BLK-001',
    unit: 'YD',
    price: 15000,
    lossPercentage: 3,
    weightPerYard: 0.35,
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
    lossPercentage: 5,
    weightPerYard: 0.42,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
];

export default function FabricsPage() {
  const [fabrics, setFabrics] = useState<Fabric[]>(MOCK_FABRICS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    styleCode: '',
    unit: 'YD' as UnitType,
    price: '',
    lossPercentage: '',
    weightPerYard: '',
    memo: '',
  });

  // 단위 변환 계산기 상태
  const [calculatorData, setCalculatorData] = useState({
    fabricId: '',
    inputValue: '',
    inputUnit: 'YD' as 'YD' | 'KG',
    outputValue: 0,
    outputUnit: 'KG' as 'YD' | 'KG',
  });

  const handleAdd = () => {
    setSelectedFabric(null);
    setFormData({ name: '', color: '', styleCode: '', unit: 'YD', price: '', lossPercentage: '', weightPerYard: '', memo: '' });
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
      lossPercentage: fabric.lossPercentage?.toString() || '',
      weightPerYard: fabric.weightPerYard?.toString() || '',
      memo: fabric.memo || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fabricData = {
      ...formData,
      price: formData.price ? Number(formData.price) : undefined,
      lossPercentage: formData.lossPercentage ? Number(formData.lossPercentage) : undefined,
      weightPerYard: formData.weightPerYard ? Number(formData.weightPerYard) : undefined,
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

  // 단위 변환 계산
  const handleUnitConversion = () => {
    const fabric = fabrics.find(f => f.id === calculatorData.fabricId);
    if (!fabric || !fabric.weightPerYard || !calculatorData.inputValue) {
      alert('원단과 변환할 값을 선택해주세요.');
      return;
    }

    const inputVal = Number(calculatorData.inputValue);
    let result = 0;

    if (calculatorData.inputUnit === 'YD') {
      // YD -> KG 변환
      result = inputVal * fabric.weightPerYard;
      setCalculatorData({ ...calculatorData, outputValue: result, outputUnit: 'KG' });
    } else {
      // KG -> YD 변환
      result = inputVal / fabric.weightPerYard;
      setCalculatorData({ ...calculatorData, outputValue: result, outputUnit: 'YD' });
    }
  };

  // 로스 적용 계산
  const calculateWithLoss = (quantity: number, lossPercentage: number) => {
    const lossAmount = quantity * (lossPercentage / 100);
    const netQuantity = quantity - lossAmount;
    return { netQuantity, lossAmount };
  };

  const columns = [
    { key: 'styleCode', header: '스타일코드', width: '12%' },
    { key: 'name', header: '원단명', width: '15%' },
    { key: 'color', header: '색상', width: '10%' },
    { key: 'unit', header: '단위', width: '7%' },
    {
      key: 'price',
      header: '단가',
      width: '12%',
      render: (fabric: Fabric) => fabric.price ? `₩${fabric.price.toLocaleString()}` : '-',
    },
    {
      key: 'lossPercentage',
      header: 'LOSS %',
      width: '8%',
      render: (fabric: Fabric) => (
        <span className={fabric.lossPercentage ? 'text-orange-600 font-medium' : 'text-gray-400'}>
          {fabric.lossPercentage ? `${fabric.lossPercentage}%` : '-'}
        </span>
      ),
    },
    {
      key: 'weightPerYard',
      header: 'KG/YD',
      width: '10%',
      render: (fabric: Fabric) => (
        <span className={fabric.weightPerYard ? 'text-blue-600 font-medium' : 'text-gray-400'}>
          {fabric.weightPerYard ? `${fabric.weightPerYard} KG/YD` : '-'}
        </span>
      ),
    },
    {
      key: 'calculated',
      header: '100YD 중량',
      width: '10%',
      render: (fabric: Fabric) => (
        <span className="text-caption text-gray-600">
          {fabric.weightPerYard ? `${(fabric.weightPerYard * 100).toFixed(2)} KG` : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '작업',
      width: '16%',
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
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsCalculatorOpen(true)}>
            <IoCalculatorOutline className="w-5 h-5 mr-2" />
            단위 변환 계산기
          </Button>
          <Button onClick={handleAdd}>
            <IoAdd className="w-5 h-5 mr-2" />
            원단 추가
          </Button>
        </div>
      </div>

      {/* LOSS % 안내 */}
      <div className="card p-4 mb-4 bg-orange-50 border-orange-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📊</div>
          <div>
            <h3 className="text-heading-sm text-black mb-2">LOSS % 관리</h3>
            <p className="text-caption text-gray-700">
              원단별 로스율을 설정하여 실제 생산 가능 수량을 자동 계산합니다.
              예: 100YD 주문 시 LOSS 3% 적용 → 순생산량 97YD, 로스량 3YD
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <Table columns={columns} data={fabrics} keyExtractor={(fabric) => fabric.id} />
      </div>

      {/* 원단 추가/수정 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedFabric ? '원단 수정' : '원단 추가'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
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
            <Input
              label="LOSS % (로스율)"
              type="number"
              step="0.1"
              value={formData.lossPercentage}
              onChange={(e) => setFormData({ ...formData, lossPercentage: e.target.value })}
              fullWidth
              helperText="예: 3 (3% 로스)"
            />
            <Input
              label="YD당 중량 (KG/YD)"
              type="number"
              step="0.01"
              value={formData.weightPerYard}
              onChange={(e) => setFormData({ ...formData, weightPerYard: e.target.value })}
              fullWidth
              helperText="단위 변환 계산에 사용"
            />
          </div>

          {/* 실시간 계산 미리보기 */}
          {formData.lossPercentage && (
            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <h4 className="text-heading-sm text-black mb-2">LOSS 계산 미리보기</h4>
              <div className="grid grid-cols-3 gap-3 text-caption">
                <div className="bg-white p-3 rounded">
                  <p className="text-gray-600 mb-1">주문 100YD 시</p>
                  <p className="text-heading-sm font-bold text-black">
                    {(100 - (100 * Number(formData.lossPercentage) / 100)).toFixed(2)} YD
                  </p>
                  <p className="text-gray-500 text-xs">순생산량</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-gray-600 mb-1">로스량</p>
                  <p className="text-heading-sm font-bold text-orange-600">
                    {(100 * Number(formData.lossPercentage) / 100).toFixed(2)} YD
                  </p>
                  <p className="text-gray-500 text-xs">손실 수량</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-gray-600 mb-1">LOSS 비율</p>
                  <p className="text-heading-sm font-bold text-gray-700">
                    {formData.lossPercentage}%
                  </p>
                  <p className="text-gray-500 text-xs">손실률</p>
                </div>
              </div>
            </div>
          )}

          {formData.weightPerYard && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-heading-sm text-black mb-2">단위 변환 미리보기</h4>
              <div className="grid grid-cols-2 gap-3 text-caption">
                <div className="bg-white p-3 rounded">
                  <p className="text-gray-600 mb-1">100 YD =</p>
                  <p className="text-heading-sm font-bold text-blue-600">
                    {(Number(formData.weightPerYard) * 100).toFixed(2)} KG
                  </p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-gray-600 mb-1">10 KG =</p>
                  <p className="text-heading-sm font-bold text-blue-600">
                    {(10 / Number(formData.weightPerYard)).toFixed(2)} YD
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="form-group mt-4">
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

      {/* 단위 변환 계산기 모달 */}
      <Modal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        title="단위 변환 계산기"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="원단 선택"
            value={calculatorData.fabricId}
            onChange={(e) => setCalculatorData({ ...calculatorData, fabricId: e.target.value })}
            options={fabrics.filter(f => f.weightPerYard).map(f => ({
              value: f.id,
              label: `${f.name} - ${f.color} (${f.weightPerYard} KG/YD)`,
            }))}
            required
            fullWidth
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="변환할 값"
              type="number"
              step="0.01"
              value={calculatorData.inputValue}
              onChange={(e) => setCalculatorData({ ...calculatorData, inputValue: e.target.value })}
              required
              fullWidth
            />
            <Select
              label="입력 단위"
              value={calculatorData.inputUnit}
              onChange={(e) => setCalculatorData({ ...calculatorData, inputUnit: e.target.value as 'YD' | 'KG' })}
              options={[
                { value: 'YD', label: 'YD (야드)' },
                { value: 'KG', label: 'KG (킬로그램)' },
              ]}
              fullWidth
            />
          </div>

          <Button onClick={handleUnitConversion} fullWidth>
            <IoCalculatorOutline className="w-5 h-5 mr-2" />
            계산하기
          </Button>

          {calculatorData.outputValue > 0 && (
            <div className="p-6 bg-primary rounded-lg text-center">
              <p className="text-white text-caption mb-2">변환 결과</p>
              <p className="text-white text-heading-lg font-bold">
                {calculatorData.outputValue.toFixed(2)} {calculatorData.outputUnit}
              </p>
              <p className="text-white text-caption mt-2 opacity-90">
                {calculatorData.inputValue} {calculatorData.inputUnit} → {calculatorData.outputValue.toFixed(2)} {calculatorData.outputUnit}
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-heading-sm text-black mb-2">💡 사용 팁</h4>
            <ul className="list-disc list-inside space-y-1 text-caption text-gray-700">
              <li>YD당 중량이 설정된 원단만 변환 가능합니다</li>
              <li>YD → KG: 야드 수량을 중량으로 변환</li>
              <li>KG → YD: 중량을 야드 수량으로 변환</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
