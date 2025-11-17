'use client';

import React, { useState } from 'react';
import { Button, Table, Modal, Input, Select } from '@/components/common';
import { IoAdd, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import type { User, UserRole } from '@/lib/types';

const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@weaveworks.com',
    password: '',
    role: 'master',
    name: '관리자',
    phone: '010-1234-5678',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@weaveworks.com',
    password: '',
    role: 'official',
    name: '김담당',
    phone: '010-2345-6789',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];

export default function AccountsPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'user' as UserRole,
  });

  const handleAdd = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      name: '',
      phone: '',
      role: 'user',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      name: user.name,
      phone: user.phone || '',
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    if (selectedUser) {
      // Update
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
    } else {
      // Create
      const newUser: User = {
        id: String(Date.now()),
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const columns = [
    { key: 'username', header: '아이디', width: '15%' },
    { key: 'name', header: '이름', width: '15%' },
    { key: 'email', header: '이메일', width: '20%' },
    {
      key: 'role',
      header: '권한',
      width: '10%',
      render: (user: User) => {
        const roleMap = { master: '마스터', official: '담당자', user: '사용자' };
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-caption">{roleMap[user.role]}</span>;
      },
    },
    { key: 'phone', header: '연락처', width: '15%' },
    {
      key: 'isActive',
      header: '상태',
      width: '10%',
      render: (user: User) => (
        <span className={`px-2 py-1 rounded text-caption ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {user.isActive ? '활성' : '비활성'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '작업',
      width: '15%',
      render: (user: User) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(user)} className="p-1 hover:bg-gray-100 rounded">
            <IoCreateOutline className="w-5 h-5 text-primary" />
          </button>
          <button onClick={() => handleDelete(user.id)} className="p-1 hover:bg-gray-100 rounded">
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
          <h1 className="text-heading-lg text-black">계정 관리</h1>
          <p className="text-body text-gray-500 mt-2">시스템 사용자 계정을 관리합니다</p>
        </div>
        <Button onClick={handleAdd}>
          <IoAdd className="w-5 h-5 mr-2" />
          계정 추가
        </Button>
      </div>

      <div className="card">
        <Table columns={columns} data={users} keyExtractor={(user) => user.id} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? '계정 수정' : '계정 추가'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="아이디"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            fullWidth
            disabled={!!selectedUser}
          />
          <Input
            label="이름"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            fullWidth
          />
          <Input
            label="이메일"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            fullWidth
          />
          <Input
            label="비밀번호"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!selectedUser}
            fullWidth
            helperText={selectedUser ? '변경하지 않으려면 비워두세요' : ''}
          />
          <Input
            label="연락처"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            fullWidth
          />
          <Select
            label="권한"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            options={[
              { value: 'master', label: '마스터' },
              { value: 'official', label: '담당자' },
              { value: 'user', label: '사용자' },
            ]}
            required
            fullWidth
          />
          <div className="flex gap-2 mt-6">
            <Button type="submit" variant="primary" fullWidth>
              {selectedUser ? '수정' : '추가'}
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
