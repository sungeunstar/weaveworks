'use client';

import React, { useState } from 'react';
import { Button, Input, Select } from '@/components/common';
import { IoDownloadOutline, IoPrintOutline, IoCalendarOutline, IoTrendingUpOutline, IoStatsChartOutline } from 'react-icons/io5';

type ViewType = 'daily' | 'monthly' | 'cumulative';

export default function SettlementPage() {
  const [viewType, setViewType] = useState<ViewType>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 7));

  const mockDailyData = [
    { date: '2024-11-01', orders: 5, sales: 5000000, payments: 4000000, vat: 500000, receivables: 1000000 },
    { date: '2024-11-02', orders: 3, sales: 3000000, payments: 3000000, vat: 300000, receivables: 1000000 },
    { date: '2024-11-03', orders: 7, sales: 7000000, payments: 5000000, vat: 700000, receivables: 3000000 },
    { date: '2024-11-04', orders: 4, sales: 4000000, payments: 4000000, vat: 400000, receivables: 3000000 },
    { date: '2024-11-05', orders: 6, sales: 6000000, payments: 5500000, vat: 600000, receivables: 3500000 },
  ];

  const monthlyTotal = {
    orders: 45,
    sales: 45000000,
    payments: 38000000,
    vat: 4500000,
    receivables: 7000000,
  };

  const cumulativeData = [
    { month: '2024-01', orders: 35, sales: 35000000, payments: 30000000, vat: 3500000, receivables: 5000000 },
    { month: '2024-02', orders: 40, sales: 40000000, payments: 35000000, vat: 4000000, receivables: 5000000 },
    { month: '2024-03', orders: 42, sales: 42000000, payments: 38000000, vat: 4200000, receivables: 4000000 },
    { month: '2024-04', orders: 38, sales: 38000000, payments: 36000000, vat: 3800000, receivables: 2000000 },
    { month: '2024-05', orders: 45, sales: 45000000, payments: 42000000, vat: 4500000, receivables: 3000000 },
    { month: '2024-06', orders: 48, sales: 48000000, payments: 45000000, vat: 4800000, receivables: 3000000 },
    { month: '2024-07', orders: 50, sales: 50000000, payments: 48000000, vat: 5000000, receivables: 2000000 },
    { month: '2024-08', orders: 52, sales: 52000000, payments: 50000000, vat: 5200000, receivables: 2000000 },
    { month: '2024-09', orders: 47, sales: 47000000, payments: 45000000, vat: 4700000, receivables: 2000000 },
    { month: '2024-10', orders: 43, sales: 43000000, payments: 40000000, vat: 4300000, receivables: 3000000 },
    { month: '2024-11', orders: 45, sales: 45000000, payments: 38000000, vat: 4500000, receivables: 7000000 },
  ];

  // 누적 합계 계산
  const cumulativeTotal = cumulativeData.reduce((acc, month) => ({
    orders: acc.orders + month.orders,
    sales: acc.sales + month.sales,
    payments: acc.payments + month.payments,
    vat: acc.vat + month.vat,
    receivables: month.receivables, // 최종 미수금
  }), { orders: 0, sales: 0, payments: 0, vat: 0, receivables: 0 });

  // PDF 결산서 출력
  const handlePDFExport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const currentData = viewType === 'daily' ? mockDailyData :
                        viewType === 'monthly' ? [monthlyTotal] :
                        cumulativeData;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>결산서 - ${viewType === 'daily' ? '일일' : viewType === 'monthly' ? '월간' : '누적'}</title>
          <style>
            body {
              font-family: 'Malgun Gothic', sans-serif;
              padding: 30px;
              color: #000;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #1694FF;
              padding-bottom: 15px;
            }
            .header h1 {
              font-size: 32px;
              margin: 0 0 10px 0;
              font-weight: bold;
              color: #1694FF;
            }
            .header .subtitle {
              font-size: 16px;
              color: #666;
              margin: 5px 0;
            }
            .summary {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            .summary-item {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              text-align: center;
              border: 1px solid #e0e0e0;
            }
            .summary-item .label {
              font-size: 12px;
              color: #666;
              margin-bottom: 8px;
            }
            .summary-item .value {
              font-size: 18px;
              font-weight: bold;
              color: #000;
            }
            .summary-item.highlight {
              background: #fff3e0;
              border-color: #ff9800;
            }
            .summary-item.highlight .value {
              color: #ff6f00;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #000;
              padding: 10px;
              text-align: right;
              font-size: 13px;
            }
            th {
              background-color: #1694FF;
              color: white;
              font-weight: bold;
              text-align: center;
            }
            td:first-child, th:first-child {
              text-align: center;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e0e0e0;
              text-align: right;
              font-size: 11px;
              color: #666;
            }
            .company-info {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
            @media print {
              body { padding: 10px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 결산서</h1>
            <p class="subtitle">${viewType === 'daily' ? '일일 결산' : viewType === 'monthly' ? '월간 결산' : '누적 결산'}</p>
            <p class="subtitle">출력일시: ${new Date().toLocaleString('ko-KR')}</p>
          </div>

          <div class="summary">
            <div class="summary-item">
              <div class="label">총 주문</div>
              <div class="value">${viewType === 'cumulative' ? cumulativeTotal.orders : monthlyTotal.orders}건</div>
            </div>
            <div class="summary-item">
              <div class="label">총 매출</div>
              <div class="value">₩${(viewType === 'cumulative' ? cumulativeTotal.sales : monthlyTotal.sales).toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="label">총 입금</div>
              <div class="value">₩${(viewType === 'cumulative' ? cumulativeTotal.payments : monthlyTotal.payments).toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="label">총 부가세</div>
              <div class="value">₩${(viewType === 'cumulative' ? cumulativeTotal.vat : monthlyTotal.vat).toLocaleString()}</div>
            </div>
            <div class="summary-item highlight">
              <div class="label">미수금</div>
              <div class="value">₩${(viewType === 'cumulative' ? cumulativeTotal.receivables : monthlyTotal.receivables).toLocaleString()}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>${viewType === 'daily' ? '날짜' : '기간'}</th>
                <th>주문건수</th>
                <th>매출액</th>
                <th>입금액</th>
                <th>부가세</th>
                <th>미수금</th>
              </tr>
            </thead>
            <tbody>
              ${viewType === 'daily' ? mockDailyData.map(day => `
                <tr>
                  <td>${day.date}</td>
                  <td>${day.orders}건</td>
                  <td>₩${day.sales.toLocaleString()}</td>
                  <td>₩${day.payments.toLocaleString()}</td>
                  <td>₩${day.vat.toLocaleString()}</td>
                  <td>₩${day.receivables.toLocaleString()}</td>
                </tr>
              `).join('') : viewType === 'cumulative' ? cumulativeData.map(month => `
                <tr>
                  <td>${month.month}</td>
                  <td>${month.orders}건</td>
                  <td>₩${month.sales.toLocaleString()}</td>
                  <td>₩${month.payments.toLocaleString()}</td>
                  <td>₩${month.vat.toLocaleString()}</td>
                  <td>₩${month.receivables.toLocaleString()}</td>
                </tr>
              `).join('') : `
                <tr>
                  <td>2024-11</td>
                  <td>${monthlyTotal.orders}건</td>
                  <td>₩${monthlyTotal.sales.toLocaleString()}</td>
                  <td>₩${monthlyTotal.payments.toLocaleString()}</td>
                  <td>₩${monthlyTotal.vat.toLocaleString()}</td>
                  <td>₩${monthlyTotal.receivables.toLocaleString()}</td>
                </tr>
              `}
            </tbody>
          </table>

          <div class="footer">
            <p>이 문서는 WeaveWorks ERP 시스템에서 자동 생성되었습니다.</p>
          </div>

          <div class="company-info">
            <p>WeaveWorks ERP System | 섬유/직물 제조 통합 관리 시스템</p>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <button onclick="window.print()" style="padding: 12px 30px; background: #1694FF; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin-right: 10px;">
              📄 PDF로 저장 / 인쇄
            </button>
            <button onclick="window.close()" style="padding: 12px 30px; background: #666; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
              닫기
            </button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // CSV 다운로드
  const handleCSVExport = () => {
    const data = viewType === 'daily' ? mockDailyData :
                 viewType === 'cumulative' ? cumulativeData :
                 [{ date: '2024-11', ...monthlyTotal }];

    const csvData = data.map(item => ({
      기간: viewType === 'daily' ? (item as any).date : (item as any).month || (item as any).date,
      주문건수: (item as any).orders,
      매출액: (item as any).sales,
      입금액: (item as any).payments,
      부가세: (item as any).vat,
      미수금: (item as any).receivables,
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `결산서_${viewType}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h1 className="text-heading-lg text-black">결산 조회</h1>
          <p className="text-body text-gray-500 mt-2">일일/월간/누적 결산 정보를 조회하고 출력합니다</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleCSVExport}>
            <IoDownloadOutline className="w-5 h-5 mr-2" />
            CSV 다운로드
          </Button>
          <Button variant="secondary" onClick={handlePDFExport}>
            <IoPrintOutline className="w-5 h-5 mr-2" />
            결산서 PDF 출력
          </Button>
        </div>
      </div>

      {/* 조회 구분 탭 */}
      <div className="card p-1 mb-6">
        <div className="flex gap-1">
          <button
            onClick={() => setViewType('daily')}
            className={`flex-1 px-4 py-3 rounded-lg transition-default ${
              viewType === 'daily'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <IoCalendarOutline className="w-5 h-5" />
              <span className="font-medium">일일 결산</span>
            </div>
          </button>
          <button
            onClick={() => setViewType('monthly')}
            className={`flex-1 px-4 py-3 rounded-lg transition-default ${
              viewType === 'monthly'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <IoTrendingUpOutline className="w-5 h-5" />
              <span className="font-medium">월간 결산</span>
            </div>
          </button>
          <button
            onClick={() => setViewType('cumulative')}
            className={`flex-1 px-4 py-3 rounded-lg transition-default ${
              viewType === 'cumulative'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <IoStatsChartOutline className="w-5 h-5" />
              <span className="font-medium">누적 결산</span>
            </div>
          </button>
        </div>
      </div>

      {/* 필터 */}
      {viewType !== 'cumulative' && (
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <Input
              label={viewType === 'daily' ? '조회일' : '조회월'}
              type={viewType === 'daily' ? 'date' : 'month'}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              fullWidth
            />
          </div>
        </div>
      )}

      {/* 요약 카드 */}
      <div className="card p-6 mb-6">
        <div className="flex-between mb-4">
          <h2 className="text-heading-md text-black">
            {viewType === 'daily' && '일일 결산 요약'}
            {viewType === 'monthly' && '2024년 11월 월간 결산 요약'}
            {viewType === 'cumulative' && '2024년 누적 결산 요약'}
          </h2>
          <span className="text-caption text-gray-500">
            {viewType === 'cumulative' ? '2024-01 ~ 2024-11' : selectedDate}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-caption text-gray-600 mb-2">총 주문</p>
            <p className="text-heading-md font-bold text-black">
              {viewType === 'cumulative' ? cumulativeTotal.orders : monthlyTotal.orders}건
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-caption text-gray-600 mb-2">총 매출</p>
            <p className="text-heading-md font-bold text-black">
              ₩{(viewType === 'cumulative' ? cumulativeTotal.sales : monthlyTotal.sales).toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-caption text-gray-600 mb-2">총 입금</p>
            <p className="text-heading-md font-bold text-black">
              ₩{(viewType === 'cumulative' ? cumulativeTotal.payments : monthlyTotal.payments).toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-caption text-gray-600 mb-2">총 부가세</p>
            <p className="text-heading-md font-bold text-black">
              ₩{(viewType === 'cumulative' ? cumulativeTotal.vat : monthlyTotal.vat).toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-caption text-gray-600 mb-2">미수금</p>
            <p className="text-heading-md font-bold text-red-600">
              ₩{(viewType === 'cumulative' ? cumulativeTotal.receivables : monthlyTotal.receivables).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 상세 테이블 */}
      <div className="card p-6">
        <h2 className="text-heading-md text-black mb-4">
          {viewType === 'daily' && '일별 상세'}
          {viewType === 'monthly' && '월간 상세'}
          {viewType === 'cumulative' && '월별 상세'}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-caption font-bold text-gray-700 uppercase">
                  {viewType === 'daily' ? '날짜' : '기간'}
                </th>
                <th className="px-6 py-3 text-right text-caption font-bold text-gray-700 uppercase">주문</th>
                <th className="px-6 py-3 text-right text-caption font-bold text-gray-700 uppercase">매출</th>
                <th className="px-6 py-3 text-right text-caption font-bold text-gray-700 uppercase">입금</th>
                <th className="px-6 py-3 text-right text-caption font-bold text-gray-700 uppercase">VAT</th>
                <th className="px-6 py-3 text-right text-caption font-bold text-gray-700 uppercase">미수금</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {viewType === 'daily' && mockDailyData.map((day, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-body text-gray-700">{day.date}</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">{day.orders}건</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">₩{day.sales.toLocaleString()}</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">₩{day.payments.toLocaleString()}</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">₩{day.vat.toLocaleString()}</td>
                  <td className="px-6 py-4 text-body text-red-600 font-medium text-right">₩{day.receivables.toLocaleString()}</td>
                </tr>
              ))}
              {viewType === 'monthly' && (
                <tr className="bg-white">
                  <td className="px-6 py-4 text-body text-gray-700">2024-11</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">{monthlyTotal.orders}건</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">₩{monthlyTotal.sales.toLocaleString()}</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">₩{monthlyTotal.payments.toLocaleString()}</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">₩{monthlyTotal.vat.toLocaleString()}</td>
                  <td className="px-6 py-4 text-body text-red-600 font-medium text-right">₩{monthlyTotal.receivables.toLocaleString()}</td>
                </tr>
              )}
              {viewType === 'cumulative' && cumulativeData.map((month, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-body text-gray-700">{month.month}</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">{month.orders}건</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">₩{month.sales.toLocaleString()}</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">₩{month.payments.toLocaleString()}</td>
                  <td className="px-6 py-4 text-body text-gray-700 text-right">₩{month.vat.toLocaleString()}</td>
                  <td className="px-6 py-4 text-body text-red-600 font-medium text-right">₩{month.receivables.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
