'use client';

import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/common';
import { IoDownloadOutline } from 'react-icons/io5';

export default function SettlementPage() {
  const [period, setPeriod] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 7));

  const mockDailyData = [
    { date: '2024-11-01', orders: 5, sales: 5000000, payments: 4000000, vat: 500000, receivables: 1000000 },
    { date: '2024-11-02', orders: 3, sales: 3000000, payments: 3000000, vat: 300000, receivables: 1000000 },
    { date: '2024-11-03', orders: 7, sales: 7000000, payments: 5000000, vat: 700000, receivables: 3000000 },
  ];

  const monthlyTotal = {
    orders: 45,
    sales: 45000000,
    payments: 38000000,
    vat: 4500000,
    receivables: 7000000,
  };

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h1 className="text-heading-lg text-black">결산 조회</h1>
          <p className="text-body text-gray-500 mt-2">일일/월간 결산 정보를 조회합니다</p>
        </div>
        <Button variant="ghost">
          <IoDownloadOutline className="w-5 h-5 mr-2" />
          결산서 출력
        </Button>
      </div>

      <div className="card p-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Select
            label="기간 구분"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: 'daily', label: '일일 결산' },
              { value: 'monthly', label: '월간 결산' },
            ]}
            fullWidth
          />
          <Input
            label={period === 'daily' ? '조회일' : '조회월'}
            type={period === 'daily' ? 'date' : 'month'}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            fullWidth
          />
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="card p-6 mb-6">
        <h2 className="text-heading-md text-black mb-4">2024년 11월 결산 요약</h2>
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-caption text-gray-600 mb-2">총 주문</p>
            <p className="text-heading-md font-bold text-black">{monthlyTotal.orders}건</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-caption text-gray-600 mb-2">총 매출</p>
            <p className="text-heading-md font-bold text-black">₩{monthlyTotal.sales.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-caption text-gray-600 mb-2">입금액</p>
            <p className="text-heading-md font-bold text-black">₩{monthlyTotal.payments.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-caption text-gray-600 mb-2">VAT</p>
            <p className="text-heading-md font-bold text-black">₩{monthlyTotal.vat.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-caption text-gray-600 mb-2">미수금</p>
            <p className="text-heading-md font-bold text-red-600">₩{monthlyTotal.receivables.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="card p-6">
        <h2 className="text-heading-md text-black mb-4">일별 상세</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-caption font-bold text-gray-700 uppercase">날짜</th>
                <th className="px-6 py-3 text-right text-caption font-bold text-gray-700 uppercase">주문</th>
                <th className="px-6 py-3 text-right text-caption font-bold text-gray-700 uppercase">매출</th>
                <th className="px-6 py-3 text-right text-caption font-bold text-gray-700 uppercase">입금</th>
                <th className="px-6 py-3 text-right text-caption font-bold text-gray-700 uppercase">VAT</th>
                <th className="px-6 py-3 text-right text-caption font-bold text-gray-700 uppercase">미수금</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockDailyData.map((day, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-body text-gray-700">{day.date}</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">{day.orders}건</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">₩{day.sales.toLocaleString()}</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">₩{day.payments.toLocaleString()}</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">₩{day.vat.toLocaleString()}</td>
                  <td className="px-6 py-4 text-body text-red-600 font-medium text-right">₩{day.receivables.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
