import React, { useState } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { PermissionLevel, UserRole } from '../configs/permissions';
import ProductCardWithPermissions from '../components/ProductCardWithPermissions';
import NavigationWithPermissions from '../components/NavigationWithPermissions';

const PermissionDemoPage: React.FC = () => {
  const { 
    isAuthenticated, 
    isAdmin, 
    hasPermissionLevel,
    hasRole,
    hasApiPermission,
    currentUserRole,
    getUserInfo
  } = usePermissions();

  const [apiTestResult, setApiTestResult] = useState<string>('');

  const userInfo = getUserInfo();

  // Sample product data
  const sampleProduct = {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 29990000,
    img: 'https://via.placeholder.com/300x200?text=iPhone+15+Pro+Max',
    description: 'Điện thoại thông minh cao cấp với chip A17 Pro',
    categoryName: 'Điện thoại',
    brandName: 'Apple'
  };

  // Test API permissions
  const testApiPermissions = () => {
    const tests = [
      { endpoint: '/products', method: 'GET', description: 'Xem sản phẩm (PUBLIC)' },
      { endpoint: '/products', method: 'POST', description: 'Tạo sản phẩm (ADMIN)' },
      { endpoint: '/products/edit/:id', method: 'PUT', description: 'Sửa sản phẩm (ADMIN)' },
      { endpoint: '/products/:id', method: 'DELETE', description: 'Xóa sản phẩm (ADMIN)' },
      { endpoint: '/profile', method: 'GET', description: 'Xem profile (AUTH)' },
      { endpoint: '/profile', method: 'PUT', description: 'Sửa profile (AUTH)' },
      { endpoint: '/shopping-cart', method: 'GET', description: 'Xem giỏ hàng (AUTH)' },
      { endpoint: '/statistics/dashboard', method: 'GET', description: 'Xem thống kê (ADMIN)' },
    ];

    const results = tests.map(test => ({
      ...test,
      hasPermission: hasApiPermission(test.endpoint, test.method)
    }));

    setApiTestResult(JSON.stringify(results, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Demo */}
      <NavigationWithPermissions />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🔐 Permission System Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Trang này demo các tính năng của hệ thống phân quyền. Nội dung hiển thị sẽ thay đổi dựa trên role của bạn.
          </p>
        </div>

        {/* User Info Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">👤 Thông tin người dùng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Role hiện tại</h3>
              <p className="text-blue-600">{currentUserRole}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Đã đăng nhập</h3>
              <p className="text-green-600">{isAuthenticated() ? '✅ Có' : '❌ Không'}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800">Là Admin</h3>
              <p className="text-red-600">{isAdmin() ? '✅ Có' : '❌ Không'}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Tên hiển thị</h3>
              <p className="text-purple-600">{userInfo.userInfo?.fullname || 'Guest'}</p>
            </div>
          </div>
        </div>

        {/* Permission Level Tests */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔑 Kiểm tra Permission Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border-2 ${
              hasPermissionLevel(PermissionLevel.PUBLIC) 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'
            }`}>
              <h3 className="font-semibold">🌐 PUBLIC Level</h3>
              <p className="text-sm text-gray-600">Ai cũng truy cập được</p>
              <p className={hasPermissionLevel(PermissionLevel.PUBLIC) ? 'text-green-600' : 'text-red-600'}>
                {hasPermissionLevel(PermissionLevel.PUBLIC) ? '✅ Có quyền' : '❌ Không có quyền'}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${
              hasPermissionLevel(PermissionLevel.AUTH) 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'
            }`}>
              <h3 className="font-semibold">🔐 AUTH Level</h3>
              <p className="text-sm text-gray-600">Cần đăng nhập</p>
              <p className={hasPermissionLevel(PermissionLevel.AUTH) ? 'text-green-600' : 'text-red-600'}>
                {hasPermissionLevel(PermissionLevel.AUTH) ? '✅ Có quyền' : '❌ Không có quyền'}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${
              hasPermissionLevel(PermissionLevel.ADMIN) 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'
            }`}>
              <h3 className="font-semibold">👑 ADMIN Level</h3>
              <p className="text-sm text-gray-600">Chỉ admin</p>
              <p className={hasPermissionLevel(PermissionLevel.ADMIN) ? 'text-green-600' : 'text-red-600'}>
                {hasPermissionLevel(PermissionLevel.ADMIN) ? '✅ Có quyền' : '❌ Không có quyền'}
              </p>
            </div>
          </div>
        </div>

        {/* Role-based Content */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎭 Nội dung theo Role</h2>
          
          {/* Public Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">🌐 Nội dung Public (ai cũng thấy)</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>Đây là nội dung mà tất cả mọi người đều có thể xem được, kể cả khách vãng lai.</p>
            </div>
          </div>

          {/* Auth Required Content */}
          {hasPermissionLevel(PermissionLevel.AUTH) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">🔐 Nội dung cho User đã đăng nhập</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p>Chỉ những user đã đăng nhập mới thấy được nội dung này.</p>
                <div className="mt-2 flex gap-2">
                  <a href="/profile" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Hồ sơ</a>
                  <a href="/orders" className="px-3 py-1 bg-green-600 text-white rounded text-sm">Đơn hàng</a>
                </div>
              </div>
            </div>
          )}

          {/* Customer Specific Content */}
          {hasRole(UserRole.CUSTOMER) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-700 mb-2">👤 Nội dung cho Customer</h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <p>Nội dung đặc biệt dành cho khách hàng.</p>
                <a href="/wishlist" className="inline-block mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm">
                  Danh sách yêu thích
                </a>
              </div>
            </div>
          )}

          {/* Admin Only Content */}
          {hasPermissionLevel(PermissionLevel.ADMIN) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-700 mb-2">👑 Nội dung cho Admin</h3>
              <div className="bg-red-50 p-4 rounded-lg">
                <p>Chỉ admin mới thấy được phần này. Đây là nơi quản lý hệ thống.</p>
                <div className="mt-2 flex gap-2">
                  <a href="/admin" className="px-3 py-1 bg-red-600 text-white rounded text-sm">Dashboard</a>
                  <a href="/admin/products" className="px-3 py-1 bg-red-600 text-white rounded text-sm">Quản lý sản phẩm</a>
                  <a href="/admin/users" className="px-3 py-1 bg-red-600 text-white rounded text-sm">Quản lý user</a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Card Demo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🛍️ Product Card với Permissions</h2>
          <p className="text-gray-600 mb-4">
            Card sản phẩm này sẽ hiển thị các nút khác nhau dựa trên quyền của bạn:
          </p>
          <div className="max-w-sm mx-auto">
            <ProductCardWithPermissions 
              product={sampleProduct}
              onEdit={(id) => alert(`Edit product ${id}`)}
              onDelete={(id) => alert(`Delete product ${id}`)}
            />
          </div>
        </div>

        {/* API Permission Test */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔌 Kiểm tra API Permissions</h2>
          <button
            onClick={testApiPermissions}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test API Permissions
          </button>
          
          {apiTestResult && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Kết quả test:</h3>
              <pre className="text-sm overflow-x-auto">{apiTestResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionDemoPage;
