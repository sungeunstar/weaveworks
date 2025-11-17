'use client';

import React, { useState, useRef } from 'react';
import { Button, Table, Modal, Input, Select } from '@/components/common';
import {
  IoCarOutline,
  IoPrintOutline,
  IoCheckmarkCircle,
  IoAlertCircle,
  IoCloseCircle,
  IoAdd,
  IoDownloadOutline
} from 'react-icons/io5';

type ShippingStatus = '미출고' | '부분출고' | '출고완료';

interface ShippingRecord {
  id: string;
  date: string;
  quantity: number;
  warehouseName: string;
  memo?: string;
}

interface OrderShipping {
  id: string;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  fabricName: string;
  fabricColor: string;
  styleCode: string;
  orderedQty: number;
  shippedQty: number;
  remainingQty: number;
  unit: string;
  status: ShippingStatus;
  shippingHistory: ShippingRecord[];
}

export default function ShippingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderShipping | null>(null);
  const [shippingQty, setShippingQty] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [memo, setMemo] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  // Mock data with shipping history
  const [orders, setOrders] = useState<OrderShipping[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-0001',
      orderDate: '2024-11-15',
      customerName: '한양섬유',
      fabricName: '폴리에스터 원단',
      fabricColor: '블랙',
      styleCode: 'PE-BLK-001',
      orderedQty: 500,
      shippedQty: 0,
      remainingQty: 500,
      unit: 'YD',
      status: '미출고',
      shippingHistory: [],
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-0002',
      orderDate: '2024-11-16',
      customerName: '동원섬유',
      fabricName: '면 원단',
      fabricColor: '화이트',
      styleCode: 'CT-WHT-001',
      orderedQty: 300,
      shippedQty: 150,
      remainingQty: 150,
      unit: 'YD',
      status: '부분출고',
      shippingHistory: [
        {
          id: 'sh1',
          date: '2024-11-17',
          quantity: 150,
          warehouseName: '본사 창고',
          memo: '1차 출고',
        },
      ],
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-0003',
      orderDate: '2024-11-14',
      customerName: '삼성섬유',
      fabricName: '나일론 원단',
      fabricColor: '네이비',
      styleCode: 'NY-NVY-001',
      orderedQty: 200,
      shippedQty: 200,
      remainingQty: 0,
      unit: 'YD',
      status: '출고완료',
      shippingHistory: [
        {
          id: 'sh2',
          date: '2024-11-15',
          quantity: 200,
          warehouseName: '안산 창고',
        },
      ],
    },
  ]);

  // 출고 상태별 아이콘 렌더링
  const getStatusIcon = (status: ShippingStatus) => {
    switch (status) {
      case '미출고':
        return <IoCloseCircle className="w-5 h-5 text-red-500" />;
      case '부분출고':
        return <IoAlertCircle className="w-5 h-5 text-orange-500" />;
      case '출고완료':
        return <IoCheckmarkCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusColor = (status: ShippingStatus) => {
    switch (status) {
      case '미출고':
        return 'bg-red-100 text-red-700';
      case '부분출고':
        return 'bg-orange-100 text-orange-700';
      case '출고완료':
        return 'bg-green-100 text-green-700';
    }
  };

  // 출고 처리 (자동 계산)
  const handleShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const qty = Number(shippingQty);
    if (qty <= 0 || qty > selectedOrder.remainingQty) {
      alert('유효한 출고 수량을 입력하세요.');
      return;
    }

    // 출고량 자동 계산
    const newShippedQty = selectedOrder.shippedQty + qty;
    const newRemainingQty = selectedOrder.orderedQty - newShippedQty;
    const newStatus: ShippingStatus =
      newRemainingQty === 0 ? '출고완료' : '부분출고';

    const newRecord: ShippingRecord = {
      id: `sh${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      quantity: qty,
      warehouseName: warehouse === '1' ? '본사 창고' : '안산 창고',
      memo: memo || undefined,
    };

    setOrders(orders.map(order =>
      order.id === selectedOrder.id
        ? {
            ...order,
            shippedQty: newShippedQty,
            remainingQty: newRemainingQty,
            status: newStatus,
            shippingHistory: [...order.shippingHistory, newRecord],
          }
        : order
    ));

    setIsModalOpen(false);
    setShippingQty('');
    setWarehouse('');
    setMemo('');
    setSelectedOrder(null);
  };

  // 출고원장 출력
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>출고원장</title>
          <style>
            body {
              font-family: 'Malgun Gothic', sans-serif;
              padding: 20px;
              color: #000;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #000;
              padding-bottom: 10px;
            }
            .header h1 {
              font-size: 28px;
              margin: 0;
              font-weight: bold;
            }
            .header p {
              margin: 5px 0 0 0;
              color: #666;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: center;
              font-size: 12px;
            }
            th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            .status-badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: bold;
            }
            .status-complete { background-color: #d1fae5; color: #065f46; }
            .status-partial { background-color: #fed7aa; color: #9a3412; }
            .status-pending { background-color: #fee2e2; color: #991b1b; }
            .footer {
              margin-top: 30px;
              text-align: right;
              font-size: 11px;
              color: #666;
            }
            @media print {
              body { padding: 10px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📋 출고원장</h1>
            <p>출력일: ${new Date().toLocaleString('ko-KR')}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>주문번호</th>
                <th>주문일</th>
                <th>판매처</th>
                <th>원단명</th>
                <th>색상</th>
                <th>Style No.</th>
                <th>주문수량</th>
                <th>출고수량</th>
                <th>미출고</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(order => `
                <tr>
                  <td>${order.orderNumber}</td>
                  <td>${order.orderDate}</td>
                  <td>${order.customerName}</td>
                  <td>${order.fabricName}</td>
                  <td>${order.fabricColor}</td>
                  <td>${order.styleCode}</td>
                  <td>${order.orderedQty} ${order.unit}</td>
                  <td>${order.shippedQty} ${order.unit}</td>
                  <td>${order.remainingQty} ${order.unit}</td>
                  <td>
                    <span class="status-badge ${
                      order.status === '출고완료' ? 'status-complete' :
                      order.status === '부분출고' ? 'status-partial' : 'status-pending'
                    }">
                      ${order.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>총 ${orders.length}건 | WeaveWorks ERP System</p>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #1694FF; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
              인쇄하기
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-left: 10px;">
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
  const handleExportCSV = () => {
    const csvData = orders.map(order => ({
      주문번호: order.orderNumber,
      주문일: order.orderDate,
      판매처: order.customerName,
      원단명: order.fabricName,
      색상: order.fabricColor,
      'Style No.': order.styleCode,
      주문수량: `${order.orderedQty} ${order.unit}`,
      출고수량: `${order.shippedQty} ${order.unit}`,
      미출고수량: `${order.remainingQty} ${order.unit}`,
      상태: order.status,
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `출고원장_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const columns = [
    {
      key: 'status',
      header: '상태',
      width: '5%',
      render: (item: OrderShipping) => (
        <div className="flex justify-center">
          {getStatusIcon(item.status)}
        </div>
      ),
    },
    { key: 'orderNumber', header: '주문번호', width: '10%' },
    { key: 'orderDate', header: '주문일', width: '8%' },
    { key: 'customerName', header: '판매처', width: '10%' },
    {
      key: 'fabric',
      header: '원단정보',
      width: '15%',
      render: (item: OrderShipping) => (
        <div className="text-left">
          <div className="font-medium">{item.fabricName}</div>
          <div className="text-caption text-gray-500">{item.fabricColor} / {item.styleCode}</div>
        </div>
      ),
    },
    {
      key: 'orderedQty',
      header: '주문수량',
      width: '8%',
      render: (item: OrderShipping) => `${item.orderedQty} ${item.unit}`,
    },
    {
      key: 'shippedQty',
      header: '출고수량',
      width: '8%',
      render: (item: OrderShipping) => (
        <span className={item.shippedQty > 0 ? 'text-green-600 font-medium' : ''}>
          {item.shippedQty} {item.unit}
        </span>
      ),
    },
    {
      key: 'remainingQty',
      header: '미출고수량',
      width: '9%',
      render: (item: OrderShipping) => (
        <span className={item.remainingQty > 0 ? 'text-orange-600 font-medium' : 'text-gray-500'}>
          {item.remainingQty} {item.unit}
        </span>
      ),
    },
    {
      key: 'statusBadge',
      header: '출고상태',
      width: '8%',
      render: (item: OrderShipping) => (
        <span className={`px-2 py-1 rounded text-caption ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: 'history',
      header: '출고내역',
      width: '8%',
      render: (item: OrderShipping) => (
        <span className="text-caption text-gray-600">
          {item.shippingHistory.length}건
        </span>
      ),
    },
    {
      key: 'actions',
      header: '작업',
      width: '11%',
      render: (item: OrderShipping) => (
        <Button
          size="sm"
          onClick={() => {
            setSelectedOrder(item);
            setIsModalOpen(true);
          }}
          disabled={item.remainingQty === 0}
        >
          <IoCarOutline className="w-4 h-4 mr-1" />
          출고 처리
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex-between mb-6">
        <div>
          <h1 className="text-heading-lg text-black">출고 관리</h1>
          <p className="text-body text-gray-500 mt-2">주문 출고를 처리하고 출고원장을 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleExportCSV}>
            <IoDownloadOutline className="w-5 h-5 mr-2" />
            엑셀 다운로드
          </Button>
          <Button variant="secondary" onClick={handlePrint}>
            <IoPrintOutline className="w-5 h-5 mr-2" />
            출고원장 출력
          </Button>
        </div>
      </div>

      {/* 집계 정보 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card p-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <IoCloseCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-caption text-gray-600">미출고</p>
              <p className="text-heading-md font-bold">
                {orders.filter(o => o.status === '미출고').length}건
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <IoAlertCircle className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-caption text-gray-600">부분출고</p>
              <p className="text-heading-md font-bold">
                {orders.filter(o => o.status === '부분출고').length}건
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4 bg-gray-50">
          <div className="flex items-center gap-3">
            <IoCheckmarkCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-caption text-gray-600">출고완료</p>
              <p className="text-heading-md font-bold">
                {orders.filter(o => o.status === '출고완료').length}건
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4 bg-primary">
          <div className="flex items-center gap-3">
            <IoCarOutline className="w-8 h-8 text-white" />
            <div>
              <p className="text-caption text-white">총 주문</p>
              <p className="text-heading-md font-bold text-white">{orders.length}건</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <Table columns={columns} data={orders} keyExtractor={(item) => item.id} />
      </div>

      {/* 출고 처리 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
          setShippingQty('');
          setWarehouse('');
          setMemo('');
        }}
        title="출고 처리"
        size="lg"
      >
        {selectedOrder && (
          <form onSubmit={handleShipping}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="주문번호"
                value={selectedOrder.orderNumber}
                disabled
                fullWidth
              />
              <Input
                label="판매처"
                value={selectedOrder.customerName}
                disabled
                fullWidth
              />
              <Input
                label="원단명"
                value={`${selectedOrder.fabricName} - ${selectedOrder.fabricColor}`}
                disabled
                fullWidth
              />
              <Input
                label="Style No."
                value={selectedOrder.styleCode}
                disabled
                fullWidth
              />
              <Input
                label="주문수량"
                value={`${selectedOrder.orderedQty} ${selectedOrder.unit}`}
                disabled
                fullWidth
              />
              <Input
                label="기출고수량"
                value={`${selectedOrder.shippedQty} ${selectedOrder.unit}`}
                disabled
                fullWidth
              />
              <Input
                label="미출고수량"
                value={`${selectedOrder.remainingQty} ${selectedOrder.unit}`}
                disabled
                fullWidth
              />
              <Input
                label="출고수량 *"
                type="number"
                placeholder="출고할 수량을 입력하세요"
                value={shippingQty}
                onChange={(e) => setShippingQty(e.target.value)}
                required
                fullWidth
                helperText={`최대 ${selectedOrder.remainingQty} ${selectedOrder.unit}`}
              />
              <Select
                label="출고 창고 *"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                options={[
                  { value: '1', label: '본사 창고' },
                  { value: '2', label: '안산 창고' },
                ]}
                required
                fullWidth
              />
            </div>

            {/* 출고 내역 */}
            {selectedOrder.shippingHistory.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-heading-sm text-black mb-3">기존 출고 내역</h4>
                <div className="space-y-2">
                  {selectedOrder.shippingHistory.map((record) => (
                    <div key={record.id} className="flex justify-between text-caption">
                      <span className="text-gray-600">{record.date}</span>
                      <span className="font-medium">{record.quantity} {selectedOrder.unit}</span>
                      <span className="text-gray-500">{record.warehouseName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group mt-4">
              <label className="form-label">메모</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-200 rounded-input focus-ring"
                rows={3}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="출고 관련 메모를 입력하세요"
              />
            </div>

            <div className="flex gap-2 mt-6">
              <Button type="submit" variant="primary" fullWidth>
                출고 완료
              </Button>
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedOrder(null);
                  setShippingQty('');
                  setWarehouse('');
                  setMemo('');
                }}
              >
                취소
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
