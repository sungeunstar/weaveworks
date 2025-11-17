'use client';

import React, { useState } from 'react';
import { Button, Table, Modal, Input, Select } from '@/components/common';
import { IoAdd, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import type { Company, CompanyType } from '@/lib/types';

const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: '한양섬유',
    type: '판매처',
    businessNumber: '123-45-67890',
    representative: '홍길동',
    phone: '02-1234-5678',
    email: 'contact@hanyang.com',
    address: '서울시 강남구',
    deliveryAddress: '서울시 강남구 배송센터',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: '동원원사',
    type: '원사',
    phone: '031-1234-5678',
    email: 'sales@dongwon.com',
    address: '경기도 안산시',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [filterType, setFilterType] = useState<CompanyType | ''>('');
  const [formData, setFormData] = useState({
    name: '',
    type: '판매처' as CompanyType,
    businessNumber: '',
    representative: '',
    phone: '',
    email: '',
    address: '',
    deliveryAddress: '',
    memo: '',
  });

  const handleAdd = () => {
    setSelectedCompany(null);
    setFormData({
      name: '',
      type: '판매처',
      businessNumber: '',
      representative: '',
      phone: '',
      email: '',
      address: '',
      deliveryAddress: '',
      memo: '',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      type: company.type,
      businessNumber: company.businessNumber || '',
      representative: company.representative || '',
      phone: company.phone,
      email: company.email || '',
      address: company.address || '',
      deliveryAddress: company.deliveryAddress || '',
      memo: company.memo || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCompany) {
      setCompanies(companies.map(c => c.id === selectedCompany.id ? { ...c, ...formData } : c));
    } else {
      const newCompany: Company = {
        id: String(Date.now()),
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCompanies([...companies, newCompany]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setCompanies(companies.filter(c => c.id !== id));
    }
  };

  const filteredCompanies = filterType
    ? companies.filter(c => c.type === filterType)
    : companies;

  const columns = [
    { key: 'name', header: '업체명', width: '15%' },
    {
      key: 'type',
      header: '분류',
      width: '10%',
      render: (company: Company) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-caption">{company.type}</span>
      ),
    },
    { key: 'representative', header: '대표자', width: '10%' },
    { key: 'phone', header: '연락처', width: '15%' },
    { key: 'email', header: '이메일', width: '15%' },
    { key: 'address', header: '주소', width: '20%' },
    {
      key: 'actions',
      header: '작업',
      width: '15%',
      render: (company: Company) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(company)} className="p-1 hover:bg-gray-100 rounded">
            <IoCreateOutline className="w-5 h-5 text-primary" />
          </button>
          <button onClick={() => handleDelete(company.id)} className="p-1 hover:bg-gray-100 rounded">
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
          <h1 className="text-heading-lg text-black">업체 관리</h1>
          <p className="text-body text-gray-500 mt-2">거래처 정보를 관리합니다</p>
        </div>
        <Button onClick={handleAdd}>
          <IoAdd className="w-5 h-5 mr-2" />
          업체 추가
        </Button>
      </div>

      <div className="card p-4 mb-4">
        <div className="flex gap-2">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as CompanyType | '')}
            options={[
              { value: '', label: '전체' },
              { value: '판매처', label: '판매처' },
              { value: '납품처', label: '납품처' },
              { value: '원사', label: '원사' },
              { value: '생지', label: '생지' },
              { value: '염색', label: '염색' },
              { value: '가공', label: '가공' },
              { value: '창고', label: '창고' },
            ]}
          />
        </div>
      </div>

      <div className="card">
        <Table columns={columns} data={filteredCompanies} keyExtractor={(company) => company.id} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCompany ? '업체 수정' : '업체 추가'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="업체명"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />
            <Select
              label="분류"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as CompanyType })}
              options={[
                { value: '판매처', label: '판매처' },
                { value: '납품처', label: '납품처' },
                { value: '원사', label: '원사' },
                { value: '생지', label: '생지' },
                { value: '염색', label: '염색' },
                { value: '가공', label: '가공' },
                { value: '창고', label: '창고' },
              ]}
              required
              fullWidth
            />
            <Input
              label="사업자번호"
              value={formData.businessNumber}
              onChange={(e) => setFormData({ ...formData, businessNumber: e.target.value })}
              fullWidth
            />
            <Input
              label="대표자"
              value={formData.representative}
              onChange={(e) => setFormData({ ...formData, representative: e.target.value })}
              fullWidth
            />
            <Input
              label="연락처"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="이메일"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
            />
          </div>
          <Input
            label="주소"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            fullWidth
          />
          <Input
            label="배송지"
            value={formData.deliveryAddress}
            onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
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
              {selectedCompany ? '수정' : '추가'}
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
