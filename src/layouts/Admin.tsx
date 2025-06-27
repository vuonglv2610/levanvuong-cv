import {
  faBars,
  faBell,
  faChevronDown,
  faCog,
  faCompress,
  faExpand,
  faMoon,
  faSignOutAlt,
  faSun,
  faUser,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import navbarAdminConfig from "configs/navbarAdminConfig";
import { useAuthProvider } from "contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

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
  const [toggle, setToggle] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  // Use theme context for dark mode
  const { darkMode, toggleDarkMode } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuthProvider();
  const userInfo = auth.userInfo;
  const logout = auth.logout;

  // Xử lý hiệu ứng scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback manual logout
      import('libs/getCookie').then(({ removeCookie }) => {
        removeCookie("accessToken");
        removeCookie("userId");
      });
    }
    navigate('/login');
  };

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

  // Sidebar menu items với icons
  const sidebarItems = [
    { href: "/admin", title: "Trang chủ", icon: "faHome" },
    { href: "/admin/product", title: "Quản lý sản phẩm", icon: "faBox" },
    { href: "/admin/category", title: "Quản lý danh mục", icon: "faList" },
    { href: "/admin/brand", title: "Quản lý thương hiệu", icon: "faTags" },
    { href: "/admin/user", title: "Quản lý người dùng", icon: "faUsers" },
    { href: "/admin/orders", title: "Quản lý đơn hàng", icon: "faShoppingCart" },
    { href: "/admin/inventory", title: "Quản lý kho hàng", icon: "faWarehouse" },
    { href: "/", title: "Trang khách hàng", icon: "faHome" },
  ];

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
        {/* Top Header */}
        <header className={`${darkMode
          ? 'bg-gray-800/80 border-gray-700'
          : 'bg-white/80 border-slate-200'
        } backdrop-blur-sm border-b sticky top-0 z-20 shadow-sm transition-colors duration-200`}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Page Title & Breadcrumb */}
              <div className="flex items-center space-x-4">
                <h1 className={`text-2xl font-bold ${darkMode
                  ? 'text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'
                  : 'text-slate-800 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'
                }`}>
                  {getPageTitle()}
                </h1>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-4">
                {/* Enhanced Search */}
                <div className="relative hidden md:block">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm, đơn hàng, người dùng..."
                    className={`w-80 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                    }`}
                    onFocus={(e) => {
                      e.target.parentElement?.classList.add('ring-2', 'ring-blue-500');
                    }}
                    onBlur={(e) => {
                      e.target.parentElement?.classList.remove('ring-2', 'ring-blue-500');
                    }}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <kbd className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-slate-100 text-slate-500'}`}>
                      Ctrl K
                    </kbd>
                  </div>
                </div>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200"
                >
                  <FontAwesomeIcon
                    icon={darkMode ? faSun : faMoon}
                    className="h-4 w-4 text-slate-600"
                  />
                </button>

                {/* Fullscreen Toggle */}
                <button
                  onClick={() => setFullscreen(!fullscreen)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
                >
                  <FontAwesomeIcon
                    icon={fullscreen ? faCompress : faExpand}
                    className="h-4 w-4 text-slate-600"
                  />
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-200">
                    <FontAwesomeIcon icon={faBell} className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      3
                    </span>
                  </button>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setToggle(!toggle)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  >
                    <img
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200"
                      src={userInfo?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                      alt={userInfo?.fullname || "Admin User"}
                    />
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-slate-700">{userInfo?.fullname || "Admin User"}</div>
                      <div className="text-xs text-slate-500">{userInfo?.email || "admin@example.com"}</div>
                    </div>
                    <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`${toggle ? "hidden" : ""} absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-200`}
                  >
                    <div className="py-1">
                      <Link
                        to="/admin/profile"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faUser} className="mr-3 text-slate-400" />
                        Thông tin cá nhân
                      </Link>
                      <Link
                        to="/admin/change-password"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faCog} className="mr-3 text-slate-400" />
                        Đổi mật khẩu
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-red-400" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors duration-200"
                >
                  <FontAwesomeIcon
                    icon={mobileMenuOpen ? faXmark : faBars}
                    className="h-4 w-4 text-slate-600"
                  />
                </button>
              </div>
            </div>
          </div>
        </header>

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







