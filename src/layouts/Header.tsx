import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { useAuthProvider } from 'contexts/AuthContext';
import { getCookie } from 'libs/getCookie';
import React, { useEffect, useRef, useState } from 'react';
import { get } from 'services/api';

function Header() {
  const isLogin = getCookie("userId");
  const { userInfo, logout } = useAuthProvider();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debug log để xem dữ liệu user
  console.log('Header - isLogin:', isLogin);
  console.log('Header - userInfo:', userInfo);

  // Tạo avatar URL với fallback đẹp hơn
  const getAvatarUrl = () => {
    if (userInfo?.avatar) return userInfo.avatar;
    if (userInfo?.img) return userInfo.img;

    // Sử dụng avatar dummy đẹp từ UI Avatars
    const userName = userInfo?.fullname || userInfo?.name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=ffffff&size=128&bold=true&format=png`;
  };

  // Lấy tên hiển thị
  const getDisplayName = () => {
    return userInfo?.fullname || userInfo?.name || 'User';
  };

  // Nếu đã login nhưng userInfo chưa load, hiển thị loading avatar
  const isLoadingUser = isLogin && !userInfo;

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Lấy danh sách categories cho dropdown
  const { data } = useQuery({ 
    queryKey: ['/categories'], 
    queryFn: () => get('/categories'),
    staleTime: 60000
  });
  
  const categories = data?.data?.result?.data || [];
  const categoryOptions = categories.map((cat: any) => ({
    value: cat.id,
    label: cat.name
  }));

  return (<>
    <div className="header-top bg-[#1435c3] text-white p-2 text-[12px]">
      <div className="container">
        <ul className='flex justify-between'>
          <li><a href="#">Hệ thống showroom</a></li>
          <li><a href="#">Dành cho doanh nghiệp</a></li>
          <li><a href="#">Apple education</a></li>
          <li><a href="#">Hotline: 1800 6768</a></li>
          <li><a href="#">Tin công nghệ</a></li>
          <li><a href="#">Xây dựng cấu hình</a></li>
          <li><a href="#">Khuyến mãi</a></li>
        </ul>
      </div>
    </div>
    <div className="bg-white">
      <div className='header-container grid grid-cols-2 gap-[40px] items-center p-4 container'>
        <div className="logo max-w-[200px]">
          <img src="https://res-console.cloudinary.com/dkiw9eaeh/media_explorer_thumbnails/1d21c353bc001bcaec606c1da043dbb2/detailed" width={50} height={50} alt="#" />
        </div>
        {/* <form className="form-header-category max-w-sm h-[45px]">
          <select className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-full">
            <option value="US">Tất cả</option>
            <option value="CA">Canada</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
          </select>
        </form>
        <div className="header-search-container">
          <SearchForm 
            placeholder="Search for products..." 
            showCategories={true}
            categories={categoryOptions}
            className="max-w-md mx-auto h-[45px]"
          />
        </div> */}
        <div className="container-icon flex gap-[40px] justify-end items-center">
          {
            !isLogin ? (
              <div className='user text-[18px]'>
                <a href="/login" >
                  <FontAwesomeIcon icon={faUser} />
                </a>
              </div>
            ) : isLoadingUser ? (
              <div className='user-loading flex items-center gap-2'>
                <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                <span className="text-sm text-gray-500 hidden sm:block">Loading...</span>
              </div>
            ) : (
              <div className='user-avatar relative' ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-300 bg-blue-500">
                    <img
                      src={getAvatarUrl()}
                      alt={userInfo?.fullname || userInfo?.name || 'User Avatar'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to a simple colored avatar with initials
                        const userName = userInfo?.fullname || userInfo?.name || 'User';
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=ffffff&size=32&bold=true&format=png`;
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {getDisplayName()}
                  </span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {getDisplayName()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {userInfo?.email || ''}
                        </p>
                      </div>
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Thông tin cá nhân
                      </a>
                      <a
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Đơn hàng của tôi
                      </a>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          }
          <div className='cart font-[18px]'>
            <a href="/cart">
              <FontAwesomeIcon icon={faCartShopping} />
            </a>
          </div>
        </div>
      </div>
    </div >
  </>
  )
}

export default Header;

