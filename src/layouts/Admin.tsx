import { faBars, faBell, faCog, faSignOutAlt, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import navbarAdminConfig from "configs/navbarAdminConfig";
import { useAuthProvider } from "contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";

const AdminLayout = () => {
  const [toggle, setToggle] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
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

  return (
    <div className="min-h-full flex flex-col">
      <div className="min-h-[calc(100vh-50px)]">
        {/* Navbar */}
        <nav className={`bg-gray-800 sticky top-0 z-50 transition-all ${scrolled ? 'shadow-md' : ''}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo và menu desktop */}
              <div className="flex items-center flex-1">
                <div className="flex-shrink-0">
                  <Link to="/admin" className="flex items-center">
                    <img
                      className="h-8 w-auto"
                      src="https://res-console.cloudinary.com/dkiw9eaeh/media_explorer_thumbnails/1d21c353bc001bcaec606c1da043dbb2/detailed"
                      alt="Admin Dashboard"
                    />
                  </Link>
                </div>
                <div className="hidden md:block ml-10 overflow-x-auto max-w-[calc(100vw-300px)]">
                  <div className="flex items-baseline space-x-2 text-white">
                    {navbarAdminConfig.map((item, i) => (
                      <Link
                        key={i + 100}
                        to={item.href}
                        className={`${location.pathname === item.href
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                          } rounded-md px-2 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notifications and profile - desktop */}
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Notifications */}
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      3
                    </span>
                  </button>

                  {/* Profile dropdown */}
                  <div className="relative ml-3">
                    <div>
                      <button
                        type="button"
                        className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        id="user-menu-button"
                        aria-expanded="false"
                        aria-haspopup="true"
                        onClick={() => setToggle(!toggle)}
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={userInfo?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                          alt={userInfo?.fullname || "Admin User"}
                        />
                      </button>
                    </div>
                    <div
                      className={`${toggle ? "hidden" : ""
                        } absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200`}
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      <div className="px-4 py-2 text-sm text-gray-900 border-b">
                        <div className="font-medium">{userInfo?.fullname || "Admin User"}</div>
                        <div className="text-gray-500 text-xs">{userInfo?.email || "admin@example.com"}</div>
                      </div>
                      <Link
                        to="/admin/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
                        Your Profile
                      </Link>
                      <Link
                        to="/admin/change-password"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <FontAwesomeIcon icon={faCog} className="mr-2 text-gray-500" />
                        Change Password
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-gray-500" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex md:hidden">
                <button
                  type="button"
                  className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <FontAwesomeIcon
                    icon={mobileMenuOpen ? faXmark : faBars}
                    className="h-6 w-6"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300 ease-in-out`}
            id="mobile-menu"
          >
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navbarAdminConfig.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`${location.pathname === item.href
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    } block rounded-md px-3 py-2 text-base font-medium`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={userInfo?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                    alt={userInfo?.fullname || "Admin User"}
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">
                    {userInfo?.fullname || "Admin User"}
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-400">
                    {userInfo?.email || "admin@example.com"}
                  </div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <FontAwesomeIcon icon={faBell} className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Link
                  to="/admin/profile"
                  className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Your Profile
                </Link>
                <Link
                  to="/admin/change-password"
                  className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faCog} className="mr-2" />
                  Change Password
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Page header - Đã chuyển sang bên trái */}
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                {getPageTitle()}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden sm:inline">
                  {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer isAdminLayout classText="flex-1" />
    </div>
  );
};

export default AdminLayout;







