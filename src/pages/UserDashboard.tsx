import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthProvider } from 'contexts/AuthContext';

const UserDashboard: React.FC = () => {
  const { userInfo } = useAuthProvider();
  const userData = userInfo?.result?.data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Chào mừng, {userData?.name || 'User'}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Chào mừng bạn đến với khu vực quản lý. Bạn có thể quản lý các chức năng được phân quyền.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Vai trò</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {userData?.role?.role_name || 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Product Management */}
          <Link
            to="/admin/product"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Quản lý sản phẩm</h3>
                <p className="text-gray-600 text-sm">Thêm, sửa, xóa sản phẩm</p>
              </div>
            </div>
          </Link>

          {/* Category Management */}
          <Link
            to="/admin/category"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Quản lý danh mục</h3>
                <p className="text-gray-600 text-sm">Quản lý danh mục sản phẩm</p>
              </div>
            </div>
          </Link>

          {/* Brand Management */}
          <Link
            to="/admin/brand"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-purple-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Quản lý thương hiệu</h3>
                <p className="text-gray-600 text-sm">Quản lý thương hiệu sản phẩm</p>
              </div>
            </div>
          </Link>

          {/* Order Management */}
          <Link
            to="/admin/orders"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-orange-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Quản lý đơn hàng</h3>
                <p className="text-gray-600 text-sm">Xem và xử lý đơn hàng</p>
              </div>
            </div>
          </Link>

          {/* User Management */}
          <Link
            to="/admin/user"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-red-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Quản lý người dùng</h3>
                <p className="text-gray-600 text-sm">Quản lý tài khoản người dùng</p>
              </div>
            </div>
          </Link>

          {/* Comments Management */}
          <Link
            to="/admin/comments"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-indigo-500"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Quản lý đánh giá</h3>
                <p className="text-gray-600 text-sm">Quản lý bình luận và đánh giá</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Customer Area Link */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Khu vực khách hàng</h3>
              <p className="text-blue-100">
                Truy cập trang web dành cho khách hàng để xem sản phẩm và mua sắm
              </p>
            </div>
            <Link
              to="/"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Đi đến trang khách hàng →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
