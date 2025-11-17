'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/common';
import { useAuthStore } from '@/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Mock login - Replace with actual API call
      if (formData.username === 'admin' && formData.password === 'admin') {
        const mockUser = {
          id: '1',
          username: 'admin',
          email: 'admin@weaveworks.com',
          password: '',
          role: 'master' as const,
          name: '관리자',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const mockToken = 'mock-jwt-token';

        login(mockUser, mockToken);
        router.push('/dashboard');
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-heading-lg font-bold text-black">WeaveWorks</h1>
            <p className="text-body text-gray-500 mt-2">ERP System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Input
              label="아이디"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              placeholder="아이디를 입력하세요"
            />

            <Input
              label="비밀번호"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              placeholder="비밀번호를 입력하세요"
            />

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-caption text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              로그인
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-caption text-blue-800 font-bold mb-1">데모 계정</p>
            <p className="text-caption text-blue-600">아이디: admin</p>
            <p className="text-caption text-blue-600">비밀번호: admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
