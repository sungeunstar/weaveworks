'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { IoPersonCircleOutline, IoLogOutOutline, IoSettingsOutline } from 'react-icons/io5';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex-between">
        <div>
          {title && <h1 className="text-heading-lg text-black">{title}</h1>}
        </div>

        <div className="flex items-center gap-4">
          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-default"
            >
              <IoPersonCircleOutline className="w-6 h-6 text-gray-600" />
              <span className="text-body text-gray-700">관리자</span>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('/accounts');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-default"
                  >
                    <IoSettingsOutline className="w-5 h-5 text-gray-600" />
                    <span className="text-body text-gray-700">계정 설정</span>
                  </button>
                  <div className="border-t border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-default text-red-600"
                  >
                    <IoLogOutOutline className="w-5 h-5" />
                    <span className="text-body">로그아웃</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
