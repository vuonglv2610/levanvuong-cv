import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { PermissionLevel, UserRole } from '../configs/permissions';

const NavigationWithPermissions: React.FC = () => {
  const { 
    isAuthenticated, 
    isAdmin, 
    hasPermissionLevel,
    hasRole,
    currentUserRole,
    getUserInfo
  } = usePermissions();

  const userInfo = getUserInfo();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="https://res.cloudinary.com/dkiw9eaeh/image/upload/v1750743969/nucnvksajdlftfpytprl.png"
              width={40}
              height={40}
              alt="Logo"
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-gray-800">TechStore</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Public Links - Ai cũng thấy được */}
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              🏠 Trang chủ
            </a>
            <a href="/product" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              📱 Sản phẩm
            </a>
            <a href="/articles" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              📰 Bài viết
            </a>

            {/* Auth Required Links - Cần đăng nhập */}
            {hasPermissionLevel(PermissionLevel.AUTH) && (
              <>
                <a href="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  👤 Hồ sơ
                </a>
                <a href="/orders" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  📦 Đơn hàng
                </a>
                <a href="/cart" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  🛒 Giỏ hàng
                </a>
              </>
            )}

            {/* Customer Specific Links */}
            {hasRole(UserRole.CUSTOMER) && (
              <a href="/wishlist" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                ❤️ Yêu thích
              </a>
            )}

            {/* Admin Only Links */}
            {hasPermissionLevel(PermissionLevel.ADMIN) && (
              <a href="/admin" className="text-red-600 hover:text-red-700 font-medium transition-colors">
                ⚙️ Quản lý
              </a>
            )}
          </div>

          {/* User Status & Actions */}
          <div className="flex items-center space-x-4">
            {/* User Role Badge */}
            <div className="hidden md:block">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentUserRole === UserRole.ADMIN 
                  ? 'bg-red-100 text-red-800'
                  : currentUserRole === UserRole.CUSTOMER
                  ? 'bg-blue-100 text-blue-800'
                  : currentUserRole === UserRole.USER
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {currentUserRole === UserRole.ADMIN && '👑 Admin'}
                {currentUserRole === UserRole.CUSTOMER && '👤 Customer'}
                {currentUserRole === UserRole.USER && '👤 User'}
                {currentUserRole === UserRole.PUBLIC && '🌐 Guest'}
              </span>
            </div>

            {/* Login/Logout */}
            {!isAuthenticated() ? (
              <div className="flex space-x-2">
                <a
                  href="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Đăng nhập
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đăng ký
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Xin chào, <span className="font-medium">{userInfo.userInfo?.fullname || 'User'}</span>
                </span>
                <button
                  onClick={() => {
                    // Logout logic here
                    window.location.href = '/login';
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden border-t border-gray-200 py-4">
          <div className="flex flex-col space-y-3">
            {/* Public Links */}
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">🏠 Trang chủ</a>
            <a href="/product" className="text-gray-700 hover:text-blue-600 font-medium">📱 Sản phẩm</a>
            <a href="/articles" className="text-gray-700 hover:text-blue-600 font-medium">📰 Bài viết</a>

            {/* Auth Required Links */}
            {hasPermissionLevel(PermissionLevel.AUTH) && (
              <>
                <a href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">👤 Hồ sơ</a>
                <a href="/orders" className="text-gray-700 hover:text-blue-600 font-medium">📦 Đơn hàng</a>
                <a href="/cart" className="text-gray-700 hover:text-blue-600 font-medium">🛒 Giỏ hàng</a>
              </>
            )}

            {/* Admin Links */}
            {hasPermissionLevel(PermissionLevel.ADMIN) && (
              <a href="/admin" className="text-red-600 hover:text-red-700 font-medium">⚙️ Quản lý Admin</a>
            )}
          </div>
        </div>

        {/* Permission Debug Info (chỉ hiển thị khi dev) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="border-t border-gray-200 py-2 text-xs text-gray-500">
            <div className="flex flex-wrap gap-4">
              <span>Role: {currentUserRole}</span>
              <span>Authenticated: {isAuthenticated() ? '✓' : '✗'}</span>
              <span>Admin: {isAdmin() ? '✓' : '✗'}</span>
              <span>Can access AUTH: {hasPermissionLevel(PermissionLevel.AUTH) ? '✓' : '✗'}</span>
              <span>Can access ADMIN: {hasPermissionLevel(PermissionLevel.ADMIN) ? '✓' : '✗'}</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationWithPermissions;
