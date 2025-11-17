'use client';

import React, { useState } from 'react';
import { Button, Table, Modal, Input, Select } from '@/components/common';
import { IoAdd, IoCreateOutline, IoTrashOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import type { GreyFabric, UnitType, YarnComposition } from '@/lib/types';

const MOCK_GREY_FABRICS: GreyFabric[] = [
  {
    id: '1',
    name: '폴리 면 혼방 생지',
    yarnIds: ['1', '2'],
    yarnCompositions: [
      { yarnId: '1', yarnName: '폴리에스터 원사 - 블랙', ratio: 60 },
      { yarnId: '2', yarnName: '면 원사 - 화이트', ratio: 40 },
    ],
    code: 'PC-MIX-001',
    unit: '절',
    lossPercentage: 4,
    weightPerYard: 0.38,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '2',
    name: '순면 생지',
    yarnIds: ['2'],
    yarnCompositions: [
      { yarnId: '2', yarnName: '면 원사 - 화이트', ratio: 100 },
    ],
    code: 'CT-100-001',
    unit: '절',
    lossPercentage: 3,
    weightPerYard: 0.40,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
];

const MOCK_YARNS = [
  { id: '1', name: '폴리에스터 원사', color: '블랙' },
  { id: '2', name: '면 원사', color: '화이트' },
  { id: '3', name: '나일론 원사', color: '네이비' },
];

export default function GreyFabricsPage() {
  const [greyFabrics, setGreyFabrics] = useState<GreyFabric[]>(MOCK_GREY_FABRICS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState<GreyFabric | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    yarnIds: [] as string[],
    yarnCompositions: [] as YarnComposition[],
    code: '',
    unit: '절' as UnitType,
    lossPercentage: '',
    weightPerYard: '',
    memo: '',
  });

  const handleAdd = () => {
    setSelectedFabric(null);
    setFormData({ name: '', yarnIds: [], yarnCompositions: [], code: '', unit: '절', lossPercentage: '', weightPerYard: '', memo: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (fabric: GreyFabric) => {
    setSelectedFabric(fabric);
    setFormData({
      name: fabric.name,
      yarnIds: fabric.yarnIds,
      yarnCompositions: fabric.yarnCompositions || [],
      code: fabric.code || '',
      unit: fabric.unit,
      lossPercentage: fabric.lossPercentage?.toString() || '',
      weightPerYard: fabric.weightPerYard?.toString() || '',
      memo: fabric.memo || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 비율 합계 검증
    if (formData.yarnCompositions.length > 0) {
      const totalRatio = formData.yarnCompositions.reduce((sum, comp) => sum + comp.ratio, 0);
      if (totalRatio !== 100) {
        alert(`원사 조합 비율의 합계가 100%가 아닙니다. (현재: ${totalRatio}%)`);
        return;
      }
    }

    const fabricData = {
      ...formData,
      lossPercentage: formData.lossPercentage ? Number(formData.lossPercentage) : undefined,
      weightPerYard: formData.weightPerYard ? Number(formData.weightPerYard) : undefined,
    };

    if (selectedFabric) {
      setGreyFabrics(greyFabrics.map(f => f.id === selectedFabric.id ? { ...f, ...fabricData } : f));
    } else {
      const newFabric: GreyFabric = {
        id: String(Date.now()),
        ...fabricData,
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

  // 원사 조합 추가
  const addYarnComposition = () => {
    setFormData({
      ...formData,
      yarnCompositions: [
        ...formData.yarnCompositions,
        { yarnId: '', ratio: 0 }
      ]
    });
  };

  // 원사 조합 제거
  const removeYarnComposition = (index: number) => {
    setFormData({
      ...formData,
      yarnCompositions: formData.yarnCompositions.filter((_, i) => i !== index)
    });
  };

  // 원사 조합 업데이트
  const updateYarnComposition = (index: number, field: 'yarnId' | 'ratio', value: string | number) => {
    const updated = [...formData.yarnCompositions];
    if (field === 'yarnId') {
      const yarn = MOCK_YARNS.find(y => y.id === value);
      updated[index] = {
        ...updated[index],
        yarnId: value as string,
        yarnName: yarn ? `${yarn.name} - ${yarn.color}` : undefined
      };
    } else {
      updated[index] = { ...updated[index], ratio: Number(value) };
    }
    setFormData({ ...formData, yarnCompositions: updated });
  };

  // 비율 합계 계산
  const getTotalRatio = () => {
    return formData.yarnCompositions.reduce((sum, comp) => sum + (comp.ratio || 0), 0);
  };

  const columns = [
    { key: 'code', header: '코드', width: '12%' },
    { key: 'name', header: '생지명', width: '18%' },
    {
      key: 'yarnCompositions',
      header: '원사 조합 비율',
      width: '25%',
      render: (fabric: GreyFabric) => (
        <div className="text-caption">
          {fabric.yarnCompositions && fabric.yarnCompositions.length > 0 ? (
            fabric.yarnCompositions.map((comp, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1">
                <span className="text-gray-700">{comp.yarnName}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                  {comp.ratio}%
                </span>
              </div>
            ))
          ) : (
            <span className="text-gray-400">{fabric.yarnIds.length}종 혼방</span>
          )}
        </div>
      ),
    },
    {
      key: 'lossPercentage',
      header: 'LOSS %',
      width: '8%',
      render: (fabric: GreyFabric) => (
        <span className={fabric.lossPercentage ? 'text-orange-600 font-medium' : 'text-gray-400'}>
          {fabric.lossPercentage ? `${fabric.lossPercentage}%` : '-'}
        </span>
      ),
    },
    {
      key: 'weightPerYard',
      header: 'KG/YD',
      width: '10%',
      render: (fabric: GreyFabric) => (
        <span className={fabric.weightPerYard ? 'text-blue-600 font-medium' : 'text-gray-400'}>
          {fabric.weightPerYard ? `${fabric.weightPerYard}` : '-'}
        </span>
      ),
    },
    { key: 'unit', header: '단위', width: '8%' },
    {
      key: 'actions',
      header: '작업',
      width: '12%',
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
          <p className="text-body text-gray-500 mt-2">생지 정보와 원사 조합 비율을 관리합니다</p>
        </div>
        <Button onClick={handleAdd}>
          <IoAdd className="w-5 h-5 mr-2" />
          생지 추가
        </Button>
      </div>

      {/* 원사 조합 비율 안내 */}
      <div className="card p-4 mb-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🧵</div>
          <div>
            <h3 className="text-heading-sm text-black mb-2">원사 조합 비율 관리</h3>
            <p className="text-caption text-gray-700">
              생지에 사용되는 원사의 혼방 비율을 설정합니다.
              예: 폴리 60% + 면 40% = 100% (비율 합계는 반드시 100%여야 합니다)
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <Table columns={columns} data={greyFabrics} keyExtractor={(fabric) => fabric.id} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedFabric ? '생지 수정' : '생지 추가'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
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

          {/* 원사 조합 비율 설정 */}
          <div className="form-group mt-4">
            <div className="flex-between mb-2">
              <label className="form-label">원사 조합 비율</label>
              <Button type="button" size="sm" variant="secondary" onClick={addYarnComposition}>
                <IoAdd className="w-4 h-4 mr-1" />
                원사 추가
              </Button>
            </div>

            {formData.yarnCompositions.length === 0 ? (
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-500 text-caption">
                원사를 추가하여 조합 비율을 설정하세요
              </div>
            ) : (
              <div className="space-y-3">
                {formData.yarnCompositions.map((comp, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Select
                        label={`원사 ${index + 1}`}
                        value={comp.yarnId}
                        onChange={(e) => updateYarnComposition(index, 'yarnId', e.target.value)}
                        options={MOCK_YARNS.map(yarn => ({
                          value: yarn.id,
                          label: `${yarn.name} - ${yarn.color}`,
                        }))}
                        required
                        fullWidth
                      />
                    </div>
                    <div className="w-32">
                      <Input
                        label="비율 (%)"
                        type="number"
                        min="0"
                        max="100"
                        value={comp.ratio || ''}
                        onChange={(e) => updateYarnComposition(index, 'ratio', e.target.value)}
                        required
                        fullWidth
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeYarnComposition(index)}
                      className="mt-8 p-2 hover:bg-gray-100 rounded"
                    >
                      <IoRemoveCircleOutline className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ))}

                {/* 비율 합계 표시 */}
                <div className={`p-3 rounded-lg ${getTotalRatio() === 100 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                  <div className="flex-between">
                    <span className="text-caption font-medium text-gray-700">비율 합계</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-heading-sm font-bold ${getTotalRatio() === 100 ? 'text-green-700' : 'text-orange-700'}`}>
                        {getTotalRatio()}%
                      </span>
                      {getTotalRatio() === 100 ? (
                        <span className="text-green-600 text-xs">✓ 정상</span>
                      ) : (
                        <span className="text-orange-600 text-xs">⚠ 100%로 맞춰주세요</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 원사 조합 미리보기 */}
          {formData.yarnCompositions.length > 0 && getTotalRatio() === 100 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-heading-sm text-black mb-3">조합 미리보기</h4>
              <div className="space-y-2">
                {formData.yarnCompositions.map((comp, idx) => {
                  const yarn = MOCK_YARNS.find(y => y.id === comp.yarnId);
                  return yarn ? (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1 bg-white p-2 rounded">
                        <span className="text-caption text-gray-700">{yarn.name} - {yarn.color}</span>
                      </div>
                      <div className="w-20 text-center">
                        <span className="text-heading-sm font-bold text-blue-600">{comp.ratio}%</span>
                      </div>
                    </div>
                  ) : null;
                })}
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
    </div>
  );
}
