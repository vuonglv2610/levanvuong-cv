import { faCartShopping, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { useAuthProvider } from 'contexts/AuthContext';
import { getCookie } from 'libs/getCookie';
import React, { useEffect, useRef, useState } from 'react';
import { get } from 'services/api';

function Header() {
  const isLogin = getCookie("userId");
  const userId = getCookie("userId");
  const { userInfo, logout, userRole } = useAuthProvider();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tạo avatar URL với fallback đẹp hơn
  const getAvatarUrl = () => {
    try {
      // Sử dụng đúng path từ API response
      const profileData = userInfo?.result?.data;
      if (profileData?.avatar && profileData.avatar.trim() !== '') {
        return profileData.avatar;
      }

      // Fallback paths cũ (nếu có)
      if (userInfo?.avatar && userInfo.avatar.trim() !== '') return userInfo.avatar;
      if (userInfo?.img && userInfo.img.trim() !== '') return userInfo.img;

      // Sử dụng avatar dummy đẹp từ UI Avatars
      const userName = profileData?.name || userInfo?.fullname || userInfo?.name || 'User';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=ffffff&size=128&bold=true&format=png`;
    } catch (error) {
      console.error('Error getting avatar URL:', error);
      return `https://ui-avatars.com/api/?name=User&background=3b82f6&color=ffffff&size=128&bold=true&format=png`;
    }
  };

  // Lấy tên hiển thị
  const getDisplayName = () => {
    const profileData = userInfo?.result?.data;
    return profileData?.name || userInfo?.fullname || userInfo?.name || 'User';
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

  // Lấy dữ liệu giỏ hàng để hiển thị số lượng sản phẩm
  const { data: cartData } = useQuery({
    queryKey: ['/shoppingcart/customer', userId],
    queryFn: () => get(`/shoppingcart/customer/${userId}`),
    enabled: !!userId, // Chỉ gọi API khi user đã đăng nhập
    staleTime: 30000, // Cache trong 30 giây
    refetchOnWindowFocus: false
  });

  const categories = data?.data?.result?.data || [];

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const cartItemCount = cartData?.data?.result?.data?.reduce((total: number, item: any) => {
    return total + (item.quantity || 0);
  }, 0) || 0;
  const categoryOptions = categories.map((cat: any) => ({
    value: cat.id,
    label: cat.name
  }));

  return (<>
    {/* Top Header Bar */}
    <div className="header-top bg-gradient-to-r from-[#1435c3] to-[#2563eb] text-white py-2 text-xs hidden md:block">
      <div className="container">
        <div className='flex justify-between items-center'>
          <div className="flex space-x-6">
            <span className="hover:text-blue-200 cursor-pointer transition-colors">📍 Hệ thống showroom</span>
            <span className="hover:text-blue-200 cursor-pointer transition-colors">🏢 Dành cho doanh nghiệp</span>
            <span className="hover:text-blue-200 cursor-pointer transition-colors">🎓 Apple education</span>
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-blue-200 cursor-pointer transition-colors">📞 Hotline: 1800 6768</span>
            <span className="hover:text-blue-200 cursor-pointer transition-colors">📰 Tin công nghệ</span>
            <span className="hover:text-blue-200 cursor-pointer transition-colors">🎁 Khuyến mãi</span>
          </div>
        </div>
      </div>
    </div>

    {/* Main Header */}
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container">
        <div className='flex items-center justify-between py-4'>
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <a href="/" className="flex items-center space-x-2">
              <img
                src="https://res.cloudinary.com/dkiw9eaeh/image/upload/v1750743969/nucnvksajdlftfpytprl.png"
                width={40}
                height={40}
                alt="Logo"
                className="rounded-lg"
              />
            </a>
          </div>

          {/* Navigation Menu - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group">
              Trang chủ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/product" className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group">
              Sản phẩm
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form className="w-full relative" onSubmit={(e) => {
              e.preventDefault();
              const searchTerm = (e.target as HTMLFormElement).search.value;
              if (searchTerm.trim()) {
                window.location.href = `/search?name=${encodeURIComponent(searchTerm)}`;
              }
            }}>
              <input
                name="search"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-2.5 pl-10 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>



            {/* Cart */}
            <a href="/cart" className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative group">
              <FontAwesomeIcon icon={faCartShopping} className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </a>

            {/* User Account */}
            {!isLogin ? (
              <div className="flex items-center space-x-2">
                <a href="/login" className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Đăng nhập
                </a>
                <a href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Đăng ký
                </a>
              </div>
            ) : isLoadingUser ? (
              <div className='flex items-center gap-2'>
                <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                <span className="text-sm text-gray-500 hidden sm:block">Loading...</span>
              </div>
            ) : (
              <div className='relative' ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-300 bg-blue-500">
                    <img
                      src={getAvatarUrl()}
                      alt={userInfo?.fullname || userInfo?.name || 'User Avatar'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const userName = getDisplayName();
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=ffffff&size=32&bold=true&format=png`;
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:block font-medium">
                    {getDisplayName()}
                  </span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Enhanced Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-900">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userInfo?.result?.data?.email || userInfo?.email || ''}
                        </p>
                      </div>
                      <a
                        href="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Thông tin cá nhân
                      </a>

                      {/* Chỉ hiển thị "Đổi mật khẩu" cho tài khoản không phải Google và phân biệt admin/customer */}
                      {(() => {
                        const profileData = userInfo?.result?.data;
                        const hasGoogleId = profileData?.google_id || profileData?.googleId;

                        // Ẩn nếu có Google ID
                        if (hasGoogleId) {
                          console.log('Hide change password - Google account detected');
                          return false;
                        }

                        return true;
                      })() && (
                        <a
                          href={(() => {
                            const profileData = userInfo?.result?.data;
                            const accountType = profileData?.accountType;

                            // Admin redirect đến /admin/change-password
                            if (accountType === 'user') {
                              return '/admin/change-password';
                            }

                            // Customer redirect đến /change-password
                            return '/change-password';
                          })()}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Đổi mật khẩu
                      </a>
                      )}
                      {/* Chỉ hiển thị "Đơn hàng của tôi" cho customer, không hiển thị cho user (admin) */}
                      {(() => {
                        const accountType = userInfo?.result?.data?.accountType;
                        console.log('Header accountType check:', accountType);
                        return accountType !== 'user';
                      })() && (
                        <a
                          href="/orders"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Đơn hàng của tôi
                        </a>
                      )}

                      {/* Chỉ hiển thị link admin cho admin */}
                      {(userRole === "admin" || userRole === "user") && (
                        <a
                          href="/admin"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className='pr-4'>
                            <FontAwesomeIcon icon={faUserTie} />
                          </div>
                          Quản lý admin
                        </a>
                      )}
                      <div className="border-t border-gray-100 mt-2">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form className="relative" onSubmit={(e) => {
            e.preventDefault();
            const searchTerm = (e.target as HTMLFormElement).search.value;
            if (searchTerm.trim()) {
              window.location.href = `/search?name=${encodeURIComponent(searchTerm)}`;
            }
          }}>
            <input
              name="search"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full px-4 py-2.5 pl-10 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Trang chủ
              </a>
              <a href="/product" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Sản phẩm
              </a>
              <a href="/search" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Tìm kiếm
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  </>
  )
}

export default Header;

