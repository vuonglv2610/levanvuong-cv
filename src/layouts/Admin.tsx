import {
  faBars,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import navbarAdminConfig from "configs/navbarAdminConfig";
import usePermissionCheck from "hooks/usePermissionCheck";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import AdminHeader from './AdminHeader';

// Import useTheme hook
const useTheme = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));

    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return { darkMode, toggleDarkMode };
};

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Use theme context for dark mode
  const { darkMode, toggleDarkMode } = useTheme();

  // Use permission checking
  const { hasPermission } = usePermissionCheck();

  const location = useLocation();


  // Lấy tiêu đề trang từ đường dẫn hiện tại
  const getPageTitle = () => {
    const currentPath = location.pathname;

    // Kiểm tra exact match trước
    const currentPage = navbarAdminConfig.find(item => item.href === currentPath);
    if (currentPage) {
      return currentPage.title;
    }

    // Xử lý các trang con (add, edit, etc.)
    if (currentPath.includes('/admin/product/add')) {
      return 'Thêm sản phẩm mới';
    }
    if (currentPath.includes('/admin/product/edit/')) {
      return 'Chỉnh sửa sản phẩm';
    }
    if (currentPath.includes('/admin/category/add')) {
      return 'Thêm danh mục mới';
    }
    if (currentPath.includes('/admin/category/edit/')) {
      return 'Chỉnh sửa danh mục';
    }
    if (currentPath.includes('/admin/brand/add')) {
      return 'Thêm thương hiệu mới';
    }
    if (currentPath.includes('/admin/brand/edit/')) {
      return 'Chỉnh sửa thương hiệu';
    }
    if (currentPath.includes('/admin/user/add')) {
      return 'Thêm người dùng mới';
    }
    if (currentPath.includes('/admin/user/edit/')) {
      return 'Chỉnh sửa người dùng';
    }
    if (currentPath.includes('/admin/inventory/add')) {
      return 'Thêm phiếu nhập kho';
    }
    if (currentPath.includes('/admin/inventory/edit/')) {
      return 'Chỉnh sửa phiếu nhập kho';
    }
    if (currentPath.includes('/admin/profile')) {
      return 'Thông tin cá nhân';
    }

    // Xử lý các trang chính dựa trên path segment
    if (currentPath.startsWith('/admin/product')) {
      return 'Quản lý sản phẩm';
    }
    if (currentPath.startsWith('/admin/category')) {
      return 'Quản lý danh mục';
    }
    if (currentPath.startsWith('/admin/brand')) {
      return 'Quản lý thương hiệu';
    }
    if (currentPath.startsWith('/admin/user')) {
      return 'Quản lý người dùng';
    }
    if (currentPath.startsWith('/admin/orders')) {
      return 'Quản lý đơn hàng';
    }
    if (currentPath.startsWith('/admin/inventory')) {
      return 'Quản lý kho hàng';
    }

    // Default cho trang admin chính
    if (currentPath === '/admin' || currentPath === '/admin/') {
      return 'Trang chủ Admin';
    }

    return "Dashboard";
  };

  // Sidebar menu items với icons và permissions
  const allSidebarItems = [
    { href: "/admin", title: "Trang chủ", icon: "faHome" },
    { href: "/admin/statistics", title: "Thống kê", icon: "faChartBar", permission: "dashboard:view" },
    { href: "/admin/product", title: "Quản lý sản phẩm", icon: "faBox", permission: "product:view" },
    { href: "/admin/category", title: "Quản lý danh mục", icon: "faList", permission: "category:view" },
    { href: "/admin/brand", title: "Quản lý thương hiệu", icon: "faTags", permission: "brand:view" },
    { href: "/admin/articles", title: "Quản lý bài viết", icon: "faNewspaper", permission: "article:view" },
    { href: "/admin/user", title: "Quản lý người dùng", icon: "faUsers", permission: "user:view" },
    { href: "/admin/orders", title: "Quản lý đơn hàng", icon: "faShoppingCart", permission: "order:view" },
    { href: "/admin/inventory", title: "Quản lý kho hàng", icon: "faWarehouse", permission: "serial:view" },
    { href: "/admin/permissions", title: "Quản lý phân quyền", icon: "faShield", permission: "role:manage" },
    { href: "/", title: "Trang khách hàng", icon: "faHome" },
  ];

  // Filter sidebar items dựa trên permissions
  const sidebarItems = allSidebarItems.filter(item => {
    // Nếu không có permission requirement, cho phép hiển thị
    if (!item.permission) return true;
    // Kiểm tra permission
    return hasPermission(item.permission);
  });

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} ${darkMode
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900'
      } transition-all duration-300 ease-in-out fixed h-full z-30 shadow-2xl`}>
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-slate-700/50">
          <Link to="/admin" className="flex items-center space-x-3">
            <img
              className="h-8 w-auto"
              src="https://res-console.cloudinary.com/dkiw9eaeh/media_explorer_thumbnails/1d21c353bc001bcaec606c1da043dbb2/detailed"
              alt="Admin Dashboard"
            />
            {!sidebarCollapsed && (
              <span className="text-white font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Panel
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`${
                  location.pathname === item.href
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                } group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105`}
              >
                <div className="flex items-center justify-center w-6 h-6 mr-3">
                  {/* Icon placeholder - sẽ thêm FontAwesome icons sau */}
                  <div className="w-5 h-5 bg-current rounded opacity-70"></div>
                </div>
                {!sidebarCollapsed && (
                  <span className="truncate">{item.title}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Collapse button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
          >
            <FontAwesomeIcon
              icon={sidebarCollapsed ? faBars : faXmark}
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>

              {/* Main Content Area */}
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        {/* Admin Header */}
        <AdminHeader
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          pageTitle={getPageTitle()}
        />

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 shadow-xl">
              {/* Mobile Logo */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700/50">
                <Link to="/admin" className="flex items-center space-x-3">
                  <img
                    className="h-8 w-auto"
                    src="https://res-console.cloudinary.com/dkiw9eaeh/media_explorer_thumbnails/1d21c353bc001bcaec606c1da043dbb2/detailed"
                    alt="Admin Dashboard"
                  />
                  <span className="text-white font-bold text-xl">Admin Panel</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-300 hover:text-white"
                >
                  <FontAwesomeIcon icon={faXmark} className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="mt-8 px-4">
                <div className="space-y-2">
                  {sidebarItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`${
                        location.pathname === item.href
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                      } group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200`}
                    >
                      <div className="flex items-center justify-center w-6 h-6 mr-3">
                        <div className="w-5 h-5 bg-current rounded opacity-70"></div>
                      </div>
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 min-h-screen transition-colors duration-200 ${darkMode
          ? 'bg-gradient-to-br from-gray-900 to-gray-800'
          : 'bg-gradient-to-br from-slate-50 to-blue-50'
        }`}>
          <div className="p-6">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <nav className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Link to="/admin" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  Trang chủ
                </Link>
                {location.pathname !== '/admin' && (
                  <>
                    <svg className="w-3 h-3 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {getPageTitle()}
                    </span>
                  </>
                )}
              </nav>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;







