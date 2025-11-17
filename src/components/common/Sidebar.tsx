'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IoHome,
  IoPeople,
  IoBusinessOutline,
  IoShirtOutline,
  IoDocumentTextOutline,
  IoListOutline,
  IoCarOutline,
  IoFileTrayStackedOutline,
  IoCardOutline,
  IoStatsChartOutline,
} from 'react-icons/io5';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: '대시보드',
    path: '/dashboard',
    icon: <IoHome className="w-5 h-5" />,
  },
  {
    label: '계정 관리',
    path: '/accounts',
    icon: <IoPeople className="w-5 h-5" />,
  },
  {
    label: '업체 관리',
    path: '/companies',
    icon: <IoBusinessOutline className="w-5 h-5" />,
  },
  {
    label: '원단/자재 관리',
    path: '/materials',
    icon: <IoShirtOutline className="w-5 h-5" />,
    children: [
      { label: '원사 관리', path: '/materials/yarns', icon: null },
      { label: '생지 관리', path: '/materials/grey-fabrics', icon: null },
      { label: '원단 관리', path: '/materials/fabrics', icon: null },
    ],
  },
  {
    label: '주문 관리',
    path: '/orders',
    icon: <IoDocumentTextOutline className="w-5 h-5" />,
    children: [
      { label: '주문 등록', path: '/orders/new', icon: null },
      { label: '주문 조회', path: '/orders', icon: null },
    ],
  },
  {
    label: '출고 관리',
    path: '/shipping',
    icon: <IoCarOutline className="w-5 h-5" />,
  },
  {
    label: '재고 관리',
    path: '/inventory',
    icon: <IoFileTrayStackedOutline className="w-5 h-5" />,
    children: [
      { label: '재고 입고', path: '/inventory/receiving', icon: null },
      { label: '재고 조회', path: '/inventory/stocks', icon: null },
      { label: '재고 이동', path: '/inventory/transfer', icon: null },
    ],
  },
  {
    label: '매출/결제',
    path: '/payments',
    icon: <IoCardOutline className="w-5 h-5" />,
  },
  {
    label: '결산',
    path: '/settlement',
    icon: <IoStatsChartOutline className="w-5 h-5" />,
  },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  return (
    <aside className="w-64 bg-black text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-700">
        <Link href="/dashboard">
          <h1 className="text-heading-md font-bold">WeaveWorks</h1>
          <p className="text-caption text-gray-400 mt-1">ERP System</p>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.path}>
            {/* Parent Item */}
            <div>
              {item.children ? (
                <button
                  onClick={() => toggleExpand(item.path)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition-default
                    ${isActive(item.path) ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-body">{item.label}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedItems.includes(item.path) ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <Link
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-default
                    ${isActive(item.path) ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'}
                  `}
                >
                  {item.icon}
                  <span className="text-body">{item.label}</span>
                </Link>
              )}
            </div>

            {/* Children Items */}
            {item.children && expandedItems.includes(item.path) && (
              <div className="ml-8 mb-2">
                {item.children.map((child) => (
                  <Link
                    key={child.path}
                    href={child.path}
                    className={`
                      block px-3 py-2 rounded-lg mb-1 text-caption transition-default
                      ${pathname === child.path ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}
                    `}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
